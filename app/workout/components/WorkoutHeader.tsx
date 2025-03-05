import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../globalStyles';

interface WorkoutHeaderProps {
  seconds: number;
  handleFinishWorkout: () => void;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ seconds, handleFinishWorkout }) => {
  const HEADER_HEIGHT = 50;

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ backgroundColor: '#1A1A1A' }}>
      <View style={[headerStyles.header, { height: HEADER_HEIGHT }]}>
        <Text style={globalStyles.timer}>{formatTime(seconds)}</Text>
        <TouchableOpacity style={globalStyles.finishButton} onPress={handleFinishWorkout}>
          <Text style={globalStyles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default WorkoutHeader;
