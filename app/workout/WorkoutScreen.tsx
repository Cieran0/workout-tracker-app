import React from 'react';
import { useRouter } from 'expo-router';
import { View, Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkout } from '../hooks/useWorkout';
import PrimaryButton from '../components/PrimaryButton';
import WorkoutHeader from './components/WorkoutHeader';
import ExerciseCard from './components/ExerciseCard';
import ExerciseModal from './components/ExerciseModal';
import LoadingOverlay from '../components/LoadingOverlay';
import { buttons, colors, layout } from '../shared/theme';

const WorkoutScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    seconds,
    exercises,
    showExerciseModal,
    searchQuery,
    selectedBodyPart,
    availableExercises,
    bodyParts,
    addSetToExercise,
    updateSetField,
    toggleSetComplete,
    deleteSetFromExercise,
    deleteExercise,
    handleAddExercise,
    saveWorkout,
    hasIncompleteSets,
    resetWorkout,
    setShowExerciseModal,
    setSearchQuery,
    setSelectedBodyPart,
    isLoadingExercises,
    isSaving
  } = useWorkout();

  const handleCancelWorkout = () => {
    resetWorkout();
    router.push('/(tabs)');
  };

  const handleFinishWorkout = async () => {
    if (hasIncompleteSets) {
      Alert.alert(
        'Are you sure?',
        'Only completed sets will be recorded.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: async () => {
              const success = await saveWorkout();
              if (success) router.push('/(tabs)');
            },
          },
        ]
      );
    } else {
      const success = await saveWorkout();
      if (success) router.push('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={[layout.page]} edges={['top']}>
      <WorkoutHeader seconds={seconds} handleFinishWorkout={handleFinishWorkout} />
      <LoadingOverlay visible={isSaving || isLoadingExercises} />
      <View style={layout.page}>
        <ScrollView contentContainerStyle={layout.scrollContent}>
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onAddSet={() => addSetToExercise(ex.id)}
              onUpdateSetField={(setId, field, value) =>
                updateSetField(ex.id, setId, field, value)
              }
              onToggleSetComplete={(setId) => toggleSetComplete(ex.id, setId)}
              onDeleteSet={(setId) => deleteSetFromExercise(ex.id, setId)}
              onDeleteExercise={() => deleteExercise(ex.id)}
            />
          ))}
        <PrimaryButton
          variant="secondary"
          onPress={() => setShowExerciseModal(true)}
          buttonStyle={[buttons.fullWidth]}
        >
          + Add Exercise
        </PrimaryButton>

        <PrimaryButton
          variant="cancel"
          onPress={handleCancelWorkout}
          buttonStyle={[buttons.fullWidth, styles.cancelButton]}
        >
          Cancel Workout
        </PrimaryButton>
        </ScrollView>
        <ExerciseModal
          visible={showExerciseModal}
          onClose={() => setShowExerciseModal(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBodyPart={selectedBodyPart}
          setSelectedBodyPart={setSelectedBodyPart}
          availableExercises={availableExercises}
          bodyParts={bodyParts}
          onSelectExercise={handleAddExercise}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#2A2A2A',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: 'red',
    marginTop: 8,
  },
});

export default WorkoutScreen;