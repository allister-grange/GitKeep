import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/Pages/HomeScreen';
import AuthenticateScreen from './src/Pages/AuthenticateScreen';
import { AppearanceProvider } from 'react-native-appearance'
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateNoteScreen from './src/Pages/CreateNoteScreen';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking'
import RepoSelectScreen from './src/Pages/RepoSelectScreen';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { PreviewMarkdownScreen } from './src/Pages/PreviewMarkdownScreen';

export default function App() {
  const Tab = createBottomTabNavigator();
  Appearance.getColorScheme();
  const colorScheme = useColorScheme();

  const [initialRoute, setInitialRoute] = useState("AuthScreen");

  const statusBarStyle = colorScheme === 'dark' ? 'dark' : 'light';
  const Stack = createStackNavigator();
  const prefix = Linking.makeUrl('/');

  const linking = {
    prefixes: [prefix],
  };

  useEffect(() => {
    async function getGitHubTokenFromStorage() {
      const token = await SecureStore.getItemAsync('github_token');

      if (token) {
        setInitialRoute("Home");
      }
    }

    getGitHubTokenFromStorage();
  }, [])

  return (
    <AppearanceProvider>
      <StatusBar style={statusBarStyle} />
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        {
          <Stack.Navigator
            initialRouteName={initialRoute}>
            <Stack.Screen name="AuthScreen" component={AuthenticateScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RepoSelectScreen" component={RepoSelectScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PreviewMarkdownScreen" component={PreviewMarkdownScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        }
      </NavigationContainer>
    </AppearanceProvider>
  );
}
