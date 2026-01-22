import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { HomeScreen } from '../../features/home/home.screen';

const Tab = createBottomTabNavigator();

// Placeholder Search screen (to be implemented)
function SearchScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
            <Text style={{ color: '#FFFFFF' }}>Search Screen</Text>
        </View>
    );
}

export function TabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
        </Tab.Navigator>
    );
}
