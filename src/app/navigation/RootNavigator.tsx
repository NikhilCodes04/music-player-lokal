import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

// Placeholder Player Modal
function PlayerModal() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Text>Player Modal</Text>
            <Button title="Close" onPress={() => navigation.goBack()} />
        </View>
    );
}

export function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
                name="PlayerModal"
                component={PlayerModal}
                options={{
                    presentation: 'modal',
                    // Setup for full screen modal feel
                }}
            />
        </Stack.Navigator>
    );
}
