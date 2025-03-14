import { useState, useEffect, useMemo } from 'react';
import { WorkoutExercise, Exercise, WorkoutPayload } from '../types/workoutTypes';
import { saveWorkout as apiSaveWorkout, getExercises as apiGetExercises } from '../services/api';

export const useWorkout = () => {
  const [seconds, setSeconds] = useState(0);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('All');
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadExercises = async () => {
      setIsLoadingExercises(true);
      try {
        const data = await apiGetExercises(1);
        setAvailableExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setIsLoadingExercises(false);
      }
    };
    loadExercises();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const bodyParts = useMemo(() => {
    return ['All', ...new Set(availableExercises.map(ex => ex.body_part))];
  }, [availableExercises]);

  const addSetToExercise = (exerciseId: number) => {
    setExercises(prev => 
      prev.map(ex => 
        ex.id === exerciseId ? {
          ...ex,
          sets: [...ex.sets, { id: Date.now(), reps: '', weight: '', completed: false }]
        } : ex
      )
    );
  };

  const updateSetField = (exerciseId: number, setId: number, field: 'reps' | 'weight', value: string) => {
    setExercises(prev => 
      prev.map(ex => {
        if (ex.id === exerciseId) {
          const updatedSets = ex.sets.map(set => 
            set.id === setId ? { ...set, [field]: value } : set
          );
          return { ...ex, sets: updatedSets };
        }
        return ex;
      })
    );
  };

  const toggleSetComplete = (exerciseId: number, setId: number) => {
    setExercises(prev => 
      prev.map(ex => {
        if (ex.id === exerciseId) {
          const updatedSets = ex.sets.map(set => 
            set.id === setId ? { ...set, completed: !set.completed } : set
          );
          return { ...ex, sets: updatedSets };
        }
        return ex;
      })
    );
  };

  const deleteSetFromExercise = (exerciseId: number, setId: number) => {
    setExercises(prev => 
      prev.map(ex => 
        ex.id === exerciseId ? {
          ...ex,
          sets: ex.sets.filter(set => set.id !== setId)
        } : ex
      )
    );
  };

  const deleteExercise = (exerciseId: number) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      ...exercise,
      sets: [{ id: Date.now(), reps: '', weight: '', completed: false }]
    };
    setExercises(prev => [...prev, newExercise]);
    setShowExerciseModal(false);
  };

  const saveWorkout = async (): Promise<boolean> => {
    setIsSaving(true);
    const workoutData: WorkoutPayload = {
      user_id: 1,
      exercises: exercises.map(ex => ({
        exercise_id: ex.id,
        sets: ex.sets
          .filter(set => set.completed)
          .map(set => ({
            reps: parseInt(set.reps) || 0,
            weight: parseFloat(set.weight) || 0,
          })),
      })),
    };

    try {
      await apiSaveWorkout(workoutData);
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const hasIncompleteSets = useMemo(() => 
    exercises.some(ex => ex.sets.some(set => !set.completed))
  , [exercises]);

  const resetWorkout = () => setExercises([]);

  return {
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
    isLoadingExercises,
    isSaving,
    resetWorkout,
    setShowExerciseModal,
    setSearchQuery,
    setSelectedBodyPart,
  };
};