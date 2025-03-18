import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { Link } from 'expo-router'; 
import { styles } from '../style';
import { colors } from '../shared/theme';

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

    <View style={styles.container}>
    </View>
    </SafeAreaView>
  );
}
