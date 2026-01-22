import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage wrapper using AsyncStorage.
 * Note: AsyncStorage is async, so this wrapper provides both sync-like and async APIs.
 * For performance-critical sync operations, consider using react-native-mmkv 
 * once the native build issues are resolved.
 */
export const storage = {
  /**
   * Get a string value from storage
   */
  getString: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  },

  /**
   * Set a string value in storage
   */
  set: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },

  /**
   * Delete a key from storage
   */
  delete: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },

  /**
   * Check if a key exists in storage
   */
  contains: async (key: string): Promise<boolean> => {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  },

  /**
   * Get all keys in storage
   */
  getAllKeys: async (): Promise<readonly string[]> => {
    return await AsyncStorage.getAllKeys();
  },

  /**
   * Clear all storage
   */
  clearAll: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
};
