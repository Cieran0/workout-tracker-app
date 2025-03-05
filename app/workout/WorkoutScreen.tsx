import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'expo-router'; // Replace useNavigation with useRouter
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { globalStyles } from './globalStyles';
import WorkoutHeader from './components/WorkoutHeader';
import ExerciseCard, { WorkoutExercise } from './components/ExerciseCard';
import ExerciseModal, { Exercise } from './components/ExerciseModal';

const WorkoutScreen: React.FC = () => {
  const router = useRouter(); // Use useRouter instead of useNavigation
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    // No need to set headerShown: false with Expo Router
  }, []);

  const [seconds, setSeconds] = useState(0);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('All');
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('http://90.194.168.250:25561/exercises?userid=1');
        const data = await response.json();
        setAvailableExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, []);

  const bodyParts = ['All', ...new Set(availableExercises.map((ex) => ex.body_part))];

  useEffect(() => {
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const addSetToExercise = (exerciseId: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: Date.now(),
                  reps: '',
                  weight: '',
                  completed: false,
                },
              ],
            }
          : ex
      )
    );
  };

  const updateSetField = (
    exerciseId: number,
    setId: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const newSets = ex.sets.map((set) =>
            set.id === setId ? { ...set, [field]: value } : set
          );
          return { ...ex, sets: newSets };
        }
        return ex;
      })
    );
  };

  const toggleSetComplete = (exerciseId: number, setId: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const newSets = ex.sets.map((set) =>
            set.id === setId ? { ...set, completed: !set.completed } : set
          );
          return { ...ex, sets: newSets };
        }
        return ex;
      })
    );
  };

  const deleteSetFromExercise = (exerciseId: number, setId: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const newSets = ex.sets.filter((set) => set.id !== setId);
          return { ...ex, sets: newSets };
        }
        return ex;
      })
    );
  };

  const deleteExercise = (exerciseId: number) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      ...exercise,
      sets: [
        {
          id: Date.now(),
          reps: '',
          weight: '',
          completed: false,
        },
      ],
    };
    setExercises((prev) => [...prev, newExercise]);
    setShowExerciseModal(false);
  };

  const handleCancelWorkout = () => {
    setExercises([]);
    router.push('/(tabs)');
  };

  const handleFinishWorkout = () => {
    const hasIncompleteSets = exercises.some((ex) =>
      ex.sets.some((set) => !set.completed)
    );
  
    if (hasIncompleteSets) {
      Alert.alert(
        'Are you sure?',
        'Only completed sets will be recorded.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: saveWorkout, // Save workout if user confirms
          },
        ]
      );
    } else {
      saveWorkout(); // Save workout directly if all sets are completed
    }
  };
  
  const saveWorkout = async () => {
    // Prepare workout data
    const workoutData = {
      user_id: 1, // Hardcoded user ID for now
      exercises: exercises.map((exercise) => ({
        exercise_id: exercise.id,
        sets: exercise.sets
          .filter((set) => set.completed) // Only include completed sets
          .map((set) => ({
            reps: parseInt(set.reps) || 0, // Convert reps to a number
            weight: parseFloat(set.weight) || 0, // Convert weight to a number
          })),
      })),
    };
  
    try {
      // Send POST request to the backend
      const response = await fetch('http://90.194.168.250:25561/workout?userid=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });
  
      // Check if the request was successful
      if (response.ok) {
        console.log('Workout saved successfully:', await response.json());
        // Navigate back to the home screen
        router.push('/(tabs)'); // Use the correct route for your app
      } else {
        console.error('Failed to save workout:', response.statusText);
        Alert.alert('Error', 'Failed to save workout. Please try again.');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'An error occurred while saving the workout.');
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#1A1A1A' }]} edges={['top']}>
      <WorkoutHeader seconds={seconds} handleFinishWorkout={handleFinishWorkout} />
      <View style={globalStyles.container}>
        <ScrollView contentContainerStyle={localStyles.scrollContent}>
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
          <TouchableOpacity
            style={localStyles.fullWidthButton}
            onPress={() => setShowExerciseModal(true)}
          >
            <Text style={globalStyles.addButtonText}>+ Add Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={localStyles.fullWidthButtonCancel}
            onPress={handleCancelWorkout}
          >
            <Text style={globalStyles.cancelButtonText}>Cancel Workout</Text>
          </TouchableOpacity>
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
      <View style={{ height: insets.bottom, backgroundColor: '#0A0A0A' }} />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 20,
  },
  fullWidthButton: {
    width: '90%',
    backgroundColor: '#2A2A2A',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  fullWidthButtonCancel: {
    width: '90%',
    backgroundColor: 'red',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default WorkoutScreen;