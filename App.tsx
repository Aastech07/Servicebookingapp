import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from './app/navigation';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
}
