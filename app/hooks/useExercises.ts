import { useState, useEffect } from 'react';
import { Exercise } from '../types/workoutTypes';
import { getExercises } from '../services/api';

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await getExercises(1);
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExercises();
  }, []);

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    exercises: filteredExercises,
    isLoading,
    searchQuery,
    setSearchQuery,
  };
};