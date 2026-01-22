import 'react-native-gesture-handler'; // Required for react-navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './providers/QueryProvider';
import { PlayerProvider } from './providers/PlayerProvider';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <PlayerProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PlayerProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
