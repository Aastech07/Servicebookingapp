import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon, BookmarkIcon } from "react-native-heroicons/outline";

import LoginScreen from '../screens/LoginScreen';
import ServicesListScreen from '../screens/ServicesListScreen';
import BookingsListScreen from '../screens/BookingsListScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import BookingFormScreen from '../screens/BookingFormScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#777',
      }}
    >
      <Tab.Screen
        name="Services"
        component={ServicesListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Bookings"
        component={BookingsListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <BookmarkIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigation() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="BookingForm" component={BookingFormScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
