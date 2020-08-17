import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomePage from './src/Pages/HomePage';
import { AppearanceProvider } from 'react-native-appearance'


export default function App() {
  return (
    <AppearanceProvider>
      <HomePage />  
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
