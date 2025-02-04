// app/index.js
import { Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'; 
import { styles } from '../style';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Quick Start</Text>
      
      <Link href="/workout" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Workout</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}