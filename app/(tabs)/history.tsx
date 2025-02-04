import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; 
import { styles } from '../style';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
    </View>
  );
}