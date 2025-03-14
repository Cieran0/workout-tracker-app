import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const Register: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput 
        style={styles.input}
        placeholder="Email"
      />
      <TextInput 
        style={styles.input}
        placeholder="Username"
      />
      <TextInput 
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={() => console.log('Sign Up')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={() => console.log('Sign Up with Google')}>
        <Text style={styles.buttonText}>Sign Up with Google</Text>
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
});

export default Register;