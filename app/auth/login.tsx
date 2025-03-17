import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AuthContext } from '../providers/AuthProvider'; // Import AuthContext

const Login: React.FC = () => {
  const { login } = React.useContext(AuthContext);
  const router = useRouter(); // Initialize router

  const handleLogin = () => {
    login(); // Set user ID to 1
    router.replace('/(tabs)'); // Navigate to main app
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => login()} // Also call login for Google
      >
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkButton} onPress={() => console.log('Navigate to Register')}>
        <Text style={styles.linkButtonText}>Don't have an account?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#fff',
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#00FF88',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#0A0A0A',
    fontSize: 16,
  },
  googleButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  linkButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;