import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface StartWorkoutButtonProps {
  onPress: () => void;
}

const StartWorkoutButton: React.FC<StartWorkoutButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Start An Empty Workout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00FF88',
    paddingVertical: 15,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 20,
  },
  text: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StartWorkoutButton;