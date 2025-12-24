/**
 * Background Location Tracking Service
 * Handles periodic location updates even when app is in background
 */

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import Constants from 'expo-constants';
import { updateUserLocation } from './api';

// Task name for background location updates
const LOCATION_TASK_NAME = 'nagar-alert-background-location';

/**
 * Register background location task
 */
export async function registerBackgroundLocationTask() {
  try {
    // Check if task is already defined
    const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    
    if (!isTaskDefined) {
      console.log('📍 Defining background location task...');
      
      TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
        if (error) {
          console.error('Background location error:', error);
          return;
        }

        if (data && data.locations && data.locations.length > 0) {
          const location = data.locations[data.locations.length - 1];
          const { latitude, longitude } = location.coords;

          console.log(`📍 Background location update: ${latitude}, ${longitude}`);

          // Send to backend
          try {
            const userId = await getUserIdFromStorage();
            if (userId) {
              await updateUserLocation(userId, latitude, longitude);
            }
          } catch (err) {
            console.error('Error sending background location:', err);
          }
        }
      });
      
      console.log('✅ Background location task defined');
    }

    return true;
  } catch (error) {
    console.error('Error registering background location task:', error);
    return false;
  }
}

/**
 * Start background location tracking
 * 
 * Updates location:
 * - Every 30 seconds (timeInterval)
 * - Or every 100 meters (distanceInterval)
 * 
 * App must be in foreground for the user to be aware of it
 */
export async function startBackgroundLocationTracking() {
  try {
    const isExpoGo = Constants?.appOwnership === 'expo';
    if (isExpoGo) {
      console.warn('Background location updates are limited in Expo Go. Use a development build for full functionality.');
      // Still request foreground/background to ensure permissions prompt in dev
    }
    // Request permissions
    const { status } = await Location.requestBackgroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.warn('Background location permission not granted');
      return false;
    }

    console.log('📍 Starting background location tracking...');

    // Start watching location in background
    // Skip starting background service in Expo Go to avoid failures
    if (isExpoGo) {
      console.log('Skipping startLocationUpdatesAsync in Expo Go');
      return false;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 30000, // Update every 30 seconds
      distanceInterval: 100, // Or every 100 meters
      foregroundService: {
        notificationTitle: 'Nagar Alert',
        notificationBody: 'Tracking your location for emergency alerts',
        notificationColor: '#3b82f6',
      },
    });

    console.log('✅ Background location tracking started');
    return true;
  } catch (error) {
    console.error('Error starting background location tracking:', error);
    return false;
  }
}

/**
 * Stop background location tracking
 */
export async function stopBackgroundLocationTracking() {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('✅ Background location tracking stopped');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error stopping background location tracking:', error);
    return false;
  }
}

/**
 * Check if background location tracking is active
 */
export async function isBackgroundLocationActive() {
  try {
    return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  } catch (error) {
    console.error('Error checking background location status:', error);
    return false;
  }
}

/**
 * Get user ID from AsyncStorage
 */
async function getUserIdFromStorage() {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const userId = await AsyncStorage.getItem('userId');
    return userId;
  } catch (error) {
    console.error('Error getting user ID from storage:', error);
    return null;
  }
}

/**
 * Request location permissions
 */
export async function requestLocationPermissions() {
  try {
    const foreground = await Location.requestForegroundPermissionsAsync();
    const background = await Location.requestBackgroundPermissionsAsync();

    return {
      foreground: foreground.status === 'granted',
      background: background.status === 'granted',
    };
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return {
      foreground: false,
      background: false,
    };
  }
}

/**
 * Get current location
 */
export async function getCurrentLocation() {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
}

export default {
  registerBackgroundLocationTask,
  startBackgroundLocationTracking,
  stopBackgroundLocationTracking,
  isBackgroundLocationActive,
  requestLocationPermissions,
  getCurrentLocation,
};
