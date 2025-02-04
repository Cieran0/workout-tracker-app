import { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { styles } from './style';

// Mock exercise database
const MOCK_EXERCISES = [
  {
    id: 1,
    name: 'Bench Press',
    bodyPart: 'Chest',
    lastDone: new Date('2024-03-15').getTime(),
    exampleSets: [{ reps: '8', weight: '60' }],
  },
  {
    id: 2,
    name: 'Shoulder Press',
    bodyPart: 'Shoulders',
    lastDone: new Date('2024-03-14').getTime(),
    exampleSets: [{ reps: '10', weight: '30' }],
  },
  {
    id: 3,
    name: 'Squat',
    bodyPart: 'Legs',
    lastDone: new Date('2024-03-13').getTime(),
    exampleSets: [{ reps: '12', weight: '100' }],
  },
  {
    id: 4,
    name: 'Deadlift',
    bodyPart: 'Back',
    lastDone: new Date('2024-03-12').getTime(),
    exampleSets: [{ reps: '5', weight: '120' }],
  },
  {
    id: 5,
    name: 'Bicep Curl',
    bodyPart: 'Arms',
    lastDone: new Date('2024-03-11').getTime(),
    exampleSets: [{ reps: '15', weight: '20' }],
  },
  {
    id: 6,
    name: 'Lunges',
    bodyPart: 'Legs',
    lastDone: new Date('2024-03-10').getTime(),
    exampleSets: [{ reps: '10', weight: '40' }],
  },
  {
    id: 7,
    name: 'Lat Pulldown',
    bodyPart: 'Back',
    lastDone: new Date('2024-03-09').getTime(),
    exampleSets: [{ reps: '12', weight: '50' }],
  },
];

export default function WorkoutPage() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [seconds, setSeconds] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('All');
  const [availableExercises, setAvailableExercises] = useState(MOCK_EXERCISES);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const bodyParts = ['All', 'Chest', 'Shoulders', 'Legs', 'Back', 'Arms'];

  // Timer functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((sec) => sec + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Filter and sort exercises
  const filterExercises = () => {
    return availableExercises
      .filter((ex) => {
        const matchesSearch = ex.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesBodyPart =
          selectedBodyPart === 'All' || ex.bodyPart === selectedBodyPart;
        return matchesSearch && matchesBodyPart;
      })
      .sort((a, b) => b.lastDone - a.lastDone);
  };

  // Add a new exercise from the modal
  const handleAddExercise = (exercise) => {
    const newExercise = {
      id: exercises.length + 1,
      name: exercise.name,
      sets: [...exercise.exampleSets],
    };
    setExercises([...exercises, newExercise]);

    // Update last done time
    setAvailableExercises((prev) =>
      prev.map((ex) =>
        ex.id === exercise.id ? { ...ex, lastDone: Date.now() } : ex
      )
    );
    setShowExerciseModal(false);
  };

  // Add a new set to a specific exercise
  const addSetToExercise = (exerciseId: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: [...exercise.sets, { reps: '', weight: '', completed: false }],
          };
        }
        return exercise;
      })
    );
  };

  // Update a specific set field for an exercise
  const updateSetField = (
    exerciseId: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newSets = exercise.sets.map((set, index) => {
            if (index === setIndex) {
              return { ...set, [field]: value };
            }
            return set;
          });
          return { ...exercise, sets: newSets };
        }
        return exercise;
      })
    );
  };

  // Toggle set completion
  const toggleSetComplete = (exerciseId: number, setIndex: number) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const newSets = exercise.sets.map((set, index) => {
            if (index === setIndex) {
              return { ...set, completed: !set.completed };
            }
            return set;
          });
          return { ...exercise, sets: newSets };
        }
        return exercise;
      })
    );
  };

  // Helper function to count exercises per category
  const getExerciseCount = (bodyPart: string) => {
    if (bodyPart === 'All') return availableExercises.length;
    return availableExercises.filter((ex) => ex.bodyPart === bodyPart).length;
  };

  const HEADER_HEIGHT = 50;

  return (
    <SafeAreaView style={localStyles.container}>
      {/* Header with background */}
      <View
        style={[
          localStyles.header,
          {
            paddingTop: insets.top,
            height: insets.top + HEADER_HEIGHT,
            backgroundColor: '#1A1A1A',
          },
        ]}
      >
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          localStyles.scrollContent,
          { paddingTop: insets.top + HEADER_HEIGHT + 10 },
        ]}
      >
        {exercises.map((exercise) => (
          <View
            key={exercise.id}
            style={[localStyles.exerciseContainer, styles.exerciseCard]}
          >
            <Text style={styles.exerciseName}>{exercise.name}</Text>

            <View style={localStyles.setsHeaderRow}>
              <View style={[localStyles.headerColumn, { flex: 0.5 }]}>
                <Text style={localStyles.headerText}>Set</Text>
              </View>
              <View style={[localStyles.headerColumn, { flex: 2 }]}>
                <Text style={localStyles.headerText}>Previous</Text>
              </View>
              <View style={[localStyles.headerColumn, { flex: 1 }]}>
                <Text style={localStyles.headerText}>Kg</Text>
              </View>
              <View style={[localStyles.headerColumn, { flex: 1 }]}>
                <Text style={localStyles.headerText}>Reps</Text>
              </View>
              <View style={[localStyles.headerColumn, { flex: 0.5 }]} />
            </View>

            {exercise.sets.map((set, index) => (
              <View
                key={index}
                style={[
                  localStyles.setRow,
                  set.completed && localStyles.completedSet,
                ]}
              >
                <View style={[localStyles.setColumn, { flex: 0.5 }]}>
                  <Text style={localStyles.setLabel}>{index + 1}</Text>
                </View>
                <View style={[localStyles.setColumn, { flex: 2 }]}>
                  <Text style={localStyles.previousLabel}>
                    {index === 0 ? '50kg x 8' : '55kg x 8'}
                  </Text>
                </View>
                <View style={[localStyles.inputColumn, { flex: 1 }]}>
                  <TextInput
                    style={localStyles.setInput}
                    keyboardType="numeric"
                    placeholder="Kg"
                    placeholderTextColor="#888"
                    value={set.weight}
                    onChangeText={(text) =>
                      updateSetField(exercise.id, index, 'weight', text)
                    }
                  />
                </View>
                <View style={[localStyles.inputColumn, { flex: 1 }]}>
                  <TextInput
                    style={localStyles.setInput}
                    keyboardType="numeric"
                    placeholder="Reps"
                    placeholderTextColor="#888"
                    value={set.reps}
                    onChangeText={(text) =>
                      updateSetField(exercise.id, index, 'reps', text)
                    }
                  />
                </View>
                <View style={localStyles.checkButtonColumn}>
                  <TouchableOpacity
                    style={[
                      localStyles.checkButton,
                      set.completed && localStyles.checkButtonActive,
                    ]}
                    onPress={() => toggleSetComplete(exercise.id, index)}
                  >
                    <Text style={localStyles.checkIcon}>✓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={localStyles.thinAddSetButton}
              onPress={() => addSetToExercise(exercise.id)}
            >
              <Text style={localStyles.thinAddSetButtonText}>+ Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Exercise Button */}
        <TouchableOpacity
          style={localStyles.fullWidthButton}
          onPress={() => setShowExerciseModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Exercise</Text>
        </TouchableOpacity>

        {/* Cancel Workout Button */}
        <Link href="/" asChild>
          <TouchableOpacity style={localStyles.fullWidthButtonCancel}>
            <Text style={styles.cancelButtonText}>Cancel Workout</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>

      {/* Exercise Selection Modal */}
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        transparent={false}
      >
        <View style={localStyles.modalContainer}>
          <TouchableOpacity
            style={localStyles.closeButton}
            onPress={() => setShowExerciseModal(false)}
          >
            <Text style={localStyles.closeIcon}>×</Text>
          </TouchableOpacity>

          <TextInput
            style={localStyles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Custom Dropdown Filter */}
          <View style={localStyles.dropdownContainer}>
            <TouchableOpacity
              style={localStyles.dropdownTrigger}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text style={localStyles.dropdownTriggerText}>
                {selectedBodyPart} ({getExerciseCount(selectedBodyPart)})
              </Text>
              <Text style={localStyles.dropdownArrow}>
                {dropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={localStyles.dropdownList}>
                <ScrollView>
                  {bodyParts.map((part) => (
                    <TouchableOpacity
                      key={part}
                      style={localStyles.dropdownListItem}
                      onPress={() => {
                        setSelectedBodyPart(part);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text style={localStyles.dropdownListItemText}>
                        {part} ({getExerciseCount(part)})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Exercise List */}
          <FlatList
            data={filterExercises()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={localStyles.exerciseItem}
                onPress={() => handleAddExercise(item)}
              >
                <View>
                  <Text style={localStyles.exerciseName}>{item.name}</Text>
                  <Text style={localStyles.exerciseDetails}>
                    {item.bodyPart} • Last done:{' '}
                    {new Date(item.lastDone).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={localStyles.emptyText}>No exercises found</Text>
            }
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  exerciseContainer: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  setsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  headerColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#1A1A1A',
    marginVertical: 2,
  },
  completedSet: {
    backgroundColor: '#2A2A2A',
    opacity: 0.7,
  },
  setColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  headerText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  setLabel: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  previousLabel: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  setInput: {
    backgroundColor: '#2A2A2A',
    color: '#FFF',
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  checkButtonColumn: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
  },
  checkButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#00FF88',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonActive: {
    backgroundColor: '#00FF88',
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thinAddSetButton: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  thinAddSetButtonText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: '600',
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
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeIcon: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#2A2A2A',
    color: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },
  dropdownContainer: {
    position: 'relative',
    marginVertical: 10,
    zIndex: 100,
  },
  dropdownTrigger: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  dropdownTriggerText: {
    color: '#FFF',
    fontSize: 14,
  },
  dropdownArrow: {
    color: '#888',
    fontSize: 14,
    marginLeft: 10,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    marginTop: 5,
    maxHeight: 200,
  },
  dropdownListItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  dropdownListItemText: {
    color: '#FFF',
    fontSize: 14,
  },
  exerciseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  exerciseName: {
    color: '#FFF', // Set text color to white
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseDetails: {
    color: '#888', // Set text color to light gray
    fontSize: 14,
    marginTop: 4,
  },
  emptyText: {
    color: '#888', // Set text color for empty state
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});