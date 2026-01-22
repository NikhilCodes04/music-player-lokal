import 'react-native-gesture-handler'; // Required for react-navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './providers/QueryProvider';
import { PlayerProvider } from './providers/PlayerProvider';
import { RootNavigator } from './navigation/RootNavigator';

import { PlayerEventsListener } from '../features/player/PlayerEventsListener';

import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Or a Loading Splash
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <PlayerProvider>
          <PlayerEventsListener />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PlayerProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
