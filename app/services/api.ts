const API_BASE = 'http://192.168.0.7:25561';

export const getExercises = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE}/exercises?userid=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch exercises');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const saveWorkout = async (workoutData: any) => {
  try {
    const response = await fetch(`${API_BASE}/workout?userid=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workoutData),
    });
    if (!response.ok) throw new Error('Failed to save workout');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};