import { StatusBar } from 'expo-status-bar';
import React from 'react';
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


export default function App() {
  const Tab = createBottomTabNavigator();
  Appearance.getColorScheme();
  const colorScheme = useColorScheme();

  const statusBarStyle = colorScheme === 'dark' ? 'dark' : 'light'; 
  const barStyle = colorScheme === 'dark' ? '#303030' : 'white'; 

  return (
    <AppearanceProvider>
      <StatusBar style={statusBarStyle}/>
      <NavigationContainer>
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
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            style: {
              backgroundColor: barStyle
            }
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="AuthenticateScreen" component={AuthenticateScreen} options={{ tabBarVisible: false }}/>
          <Tab.Screen name="CreateNoteScreen" component={CreateNoteScreen} options={{ tabBarVisible: false }}/>
        </Tab.Navigator>
      </NavigationContainer>

      {/* <HomeScreen /> */}
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
