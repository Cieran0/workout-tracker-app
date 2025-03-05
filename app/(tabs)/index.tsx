import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from '../style';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Quick Start</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/workout/WorkoutScreen')}>
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );
}