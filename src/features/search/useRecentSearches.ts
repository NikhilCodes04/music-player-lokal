import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'recent_searches';
const MAX_HISTORY = 10;

export function useRecentSearches() {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (json) {
                setHistory(JSON.parse(json));
            }
        } catch (e) {
            console.error('Failed to load search history', e);
        }
    };

    const addToHistory = useCallback(async (query: string) => {
        if (!query.trim()) return;
        
        try {
            setHistory(prev => {
                // Remove duplicates and move to top
                const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
                const newHistory = [query, ...filtered].slice(0, MAX_HISTORY);
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
                return newHistory;
            });
        } catch (e) {
            console.error('Failed to save search history', e);
        }
    }, []);

    const removeFromHistory = useCallback(async (query: string) => {
        try {
            setHistory(prev => {
                const newHistory = prev.filter(q => q !== query);
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
                return newHistory;
            });
        } catch (e) {
            console.error('Failed to remove from history', e);
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setHistory([]);
        } catch (e) {
            console.error('Failed to clear history', e);
        }
    }, []);

    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory
    };
}
