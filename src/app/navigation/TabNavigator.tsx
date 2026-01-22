import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../../features/home/home.screen';
import { FavoritesScreen } from '../../features/favorites/favorites.screen';
import { PlaylistsScreen } from '../../features/playlists/playlists.screen';
import { SettingsScreen } from '../../features/settings/settings.screen';
import { SearchScreen } from '../../features/search/search.screen';
import { HomeIcon, HeartIcon, PlaylistIcon, SettingsIcon } from '../../shared/components';
import { colors, spacing } from '../../shared/theme';

const Tab = createBottomTabNavigator();

/**
 * Custom Tab Bar Component
 * Matches Figma design with orange accent on light background
 */
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const color = isFocused ? colors.tabActive : colors.tabInactive;

                // Render the appropriate icon
                const renderIcon = () => {
                    switch (route.name) {
                        case 'Home':
                            return <HomeIcon size={24} color={color} filled={isFocused} />;
                        case 'Favorites':
                            return <HeartIcon size={24} color={color} filled={isFocused} />;
                        case 'Playlists':
                            return <PlaylistIcon size={24} color={color} filled={isFocused} />;
                        case 'Settings':
                            return <SettingsIcon size={24} color={color} filled={isFocused} />;
                        default:
                            return null;
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabItem}
                        activeOpacity={0.7}
                    >
                        {renderIcon()}
                        <Text style={[styles.tabLabel, { color }]}>
                            {typeof label === 'string' ? label : route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

/**
 * Tab Navigator with custom styling
 */
export function TabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} />
            <Tab.Screen name="Playlists" component={PlaylistsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.tabBarBackground,
        borderTopWidth: 1,
        borderTopColor: colors.tabBarBorder,
        paddingTop: spacing.sm,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xs,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        marginTop: 4,
    },
});
