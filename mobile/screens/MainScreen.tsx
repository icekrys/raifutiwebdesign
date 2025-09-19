import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { NavigationProp } from '@react-navigation/native';

const MainScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Logout Error', error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during logout');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connection Error</Text>
      
      <View style={styles.button}>
      <Button 
        title="Return to Login" 
        onPress={async () => {
          await handleLogout();
          navigation.navigate('Login');
        }} 
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});

export default MainScreen;