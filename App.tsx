import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/Pages/HomeScreen';
import { AppearanceProvider } from 'react-native-appearance'
import { Ionicons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EditNoteScreen from './src/Pages/EditNoteScreen';

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <AppearanceProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = "";

              if (route.name === 'Home') {
                iconName = focused
                  ? 'ios-information-circle'
                  : 'ios-information-circle-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'ios-list-box' : 'ios-list';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="EditNoteScreen" component={EditNoteScreen} />
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
