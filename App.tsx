import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/Pages/HomeScreen';
import AuthenticateScreen from './src/Pages/AuthenticateScreen';
import { AppearanceProvider } from 'react-native-appearance'
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EditNoteScreen from './src/Pages/EditNoteScreen';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking'
import RepoSelectScreen from './src/Pages/RepoSelectScreen';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { PreviewMarkdownScreen } from './src/Pages/PreviewMarkdownScreen';
import CreateNoteScreen from './src/Pages/CreateNoteScreen';
import { MenuProvider } from 'react-native-popup-menu';
import LoadingScreen from './src/Pages/LoadingScreen';
import CreateNewRepoScreen from './src/Pages/CreateNewRepoScreen';

export default function App() {
  const Tab = createBottomTabNavigator();
  Appearance.getColorScheme();
  const colorScheme = useColorScheme();

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [repoName, setRepoName] = useState(false);

  const statusBarStyle = colorScheme === 'dark' ? 'light' : 'dark';

  const Stack = createStackNavigator();
  const prefix = Linking.makeUrl('/');

  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const linking = {
    prefixes: [prefix],
  };

  useEffect(() => {
    getGitHubTokenFromStorage();
  }, [])

  async function getGitHubTokenFromStorage() {
    const token = await SecureStore.getItemAsync('github_token');
    const repoName = await SecureStore.getItemAsync('repo_name');

    if (token) {
      setIsSignedIn(true);
      if(repoName){
        setRepoName(true);
      }
      setIsLoaded(true);
    }
    else {
      setIsSignedIn(false);
      setIsLoaded(true);
    }
  }

  return (
    <MenuProvider>
      <AppearanceProvider>
        <StatusBar style={statusBarStyle} />
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
          {
            <Stack.Navigator >

              {
                !isLoaded && 
                <>
                 <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ headerShown: false }} />
                </>
              }

              {
                isLoaded && isSignedIn && !repoName && 

                <>
                  <Stack.Screen name="RepoSelectScreen" component={RepoSelectScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} initialParams={{ setIsSignedIn: setIsSignedIn }} />
                  <Stack.Screen name="PreviewMarkdownScreen" component={PreviewMarkdownScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="EditNoteScreen" component={EditNoteScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="CreateNewRepoScreen" component={CreateNewRepoScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} options={{ headerShown: false }} />
                </>
              }

              {
                isLoaded && isSignedIn && repoName &&

                <>
                  <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} initialParams={{ setIsSignedIn: setIsSignedIn }} />
                  <Stack.Screen name="RepoSelectScreen" component={RepoSelectScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="PreviewMarkdownScreen" component={PreviewMarkdownScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="EditNoteScreen" component={EditNoteScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} options={{ headerShown: false }} />
                </>
              }

              {
                isLoaded && !isSignedIn &&
                <>
                  <Stack.Screen name="AuthScreen" component={AuthenticateScreen} options={{ headerShown: false }} initialParams={{ setIsSignedIn: setIsSignedIn }} />
                </>
              }
            </Stack.Navigator>
          }
        </NavigationContainer>
      </AppearanceProvider>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#202020',
  },
})
