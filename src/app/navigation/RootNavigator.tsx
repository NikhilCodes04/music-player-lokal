import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SearchScreen } from '../../features/search/search.screen';

import { PlayerScreen } from '../../features/player/PlayerScreen';

import { QueueScreen } from '../../features/queue/QueueScreen';

const Stack = createStackNavigator();

export function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen
                name="PlayerModal"
                component={PlayerScreen}
                options={{
                    presentation: 'modal',
                    gestureEnabled: true,
                    // Setup for full screen modal feel
                }}
            />
            <Stack.Screen
                name="Queue"
                component={QueueScreen}
                options={{
                    presentation: 'modal', // Optional: make it a modal or card
                    gestureEnabled: true,
                }}
            />
        </Stack.Navigator>
    );
}
