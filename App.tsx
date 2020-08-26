import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/Pages/HomeScreen';
import AuthenticateScreen from './src/Pages/AuthenticateScreen';
import { AppearanceProvider } from 'react-native-appearance'
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EditNoteScreen from './src/Pages/EditNoteScreen';
import CreateNoteScreen from './src/Pages/CreateNoteScreen';
import { Appearance, useColorScheme } from 'react-native-appearance';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking'
import RepoSelectScreen from './src/Pages/RepoSelectScreen';
import * as SecureStore from 'expo-secure-store';

export default function App() {
  const Tab = createBottomTabNavigator();
  Appearance.getColorScheme();
  const colorScheme = useColorScheme();

  const [isRegistered, setIsRegistered] = useState(false);

  const statusBarStyle = colorScheme === 'dark' ? 'dark' : 'light';
  const activeTintTheme = colorScheme === 'dark' ? 'white' : '#303030';
  const barStyle = colorScheme === 'dark' ? 'rgba(48, 48, 48, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const Stack = createStackNavigator();
  const prefix = Linking.makeUrl('/');

  const linking = {
    prefixes: [prefix],
  };

  useEffect(() => {
    async function getGitHubTokenFromStorage() {
      const token = await SecureStore.getItemAsync('github_token');

      if (token) {
        setIsRegistered(true);
      }
    }

    getGitHubTokenFromStorage();
  }, [])

  return (
    <AppearanceProvider>
      <StatusBar style={statusBarStyle} />
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        {
          isRegistered ?
            (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName = "";

                    if (route.name === 'Home') {
                      iconName = focused
                        ? 'hourglass'
                        : 'hourglass';
                    } else if (route.name === 'EditNoteScreen') {
                      iconName = focused ? 'hourglass' : 'hourglass';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={'md-tablet-portrait'} size={size} color={color} />;
                  },
                })}
                tabBarOptions={{
                  activeTintColor: activeTintTheme,
                  style: {
                    backgroundColor: barStyle,
                    elevation: 0,
                    position: 'absolute',
                  }
                }}
              >
                <Tab.Screen name="Home" component={HomeScreen} />
                {/* <Tab.Screen name="AuthenticateScreen" component={AuthenticateScreen} options={{ tabBarVisible: false }} /> */}
                <Tab.Screen name="CreateNoteScreen" component={CreateNoteScreen} options={{ tabBarVisible: false }} />
                <Tab.Screen name="EditNoteScreen" component={EditNoteScreen} options={{ tabBarVisible: false }} />
                <Tab.Screen name="RepoSelectScreen" component={RepoSelectScreen} options={{ tabBarVisible: false }} />
              </Tab.Navigator>
            ) :
            <Stack.Navigator>
              <Stack.Screen name="AuthScreen" component={AuthenticateScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        }
      </NavigationContainer>
    </AppearanceProvider>
  );
}
