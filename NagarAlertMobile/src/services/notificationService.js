/**
 * Push Notification Service
 * Handles local and remote push notifications
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { registerBackgroundLocationTask } from './backgroundLocationService';

// Helper to safely get Notifications module
const getNotificationsModule = () => {
  // Expo Go cannot use this module in SDK 53+
  if (Constants.appOwnership === 'expo') {
    return null;
  }
  try {
    return require('expo-notifications');
  } catch (e) {
    console.warn('Failed to require expo-notifications', e);
    return null;
  }
};

// Configure notification handler
// Notification handler setup moved inside initializePushNotifications

/**
 * Initialize push notifications
 */
export async function initializePushNotifications() {
  try {
    console.log('📬 Initializing push notifications...');

    // Expo Go cannot receive remote push (SDK 53+)
    const isExpoGo = Constants?.appOwnership === 'expo';
    if (isExpoGo) {
      console.warn(
        'expo-notifications: Remote push is not supported in Expo Go. Skipping initialization to avoid crash.'
      );
      // Return early to prevent ANY notification code from running
      return false;
    }

    const Notifications = getNotificationsModule();
    if (!Notifications) return false;

    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Configure handler (only if not Expo Go, to be safe, though handler might work locally)
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Register background task for notifications (skip in Expo Go)
    if (!isExpoGo) {
      await registerBackgroundLocationTask();
    }

    // Android requires a notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3b82f6',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    // Handle foreground notifications
    const subscription = Notifications.addNotificationReceivedListener(
      handleNotificationReceived
    );

    // Handle notification taps
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    console.log('✅ Push notifications initialized');

    return {
      notificationSubscription: subscription,
      responseSubscription: responseSubscription,
    };
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
}

/**
 * Handle notification received while app is in foreground
 */
function handleNotificationReceived(notification) {
  console.log('📬 Notification received:', notification);

  const { trigger, request } = notification;

  if (trigger && trigger.type === 'push') {
    // Remote push notification
    console.log('🚨 Remote notification:', request.content);
  }
}

/**
 * Handle notification response (user tapped notification)
 */
function handleNotificationResponse(response) {
  console.log('👆 Notification tapped:', response.notification.request.content);

  const { data } = response.notification.request.content;

  if (data && data.alertId) {
    // Navigate to alert details
    console.log('Navigating to alert:', data.alertId);
  }
}

/**
 * Send local push notification
 */
export async function sendLocalNotification(title, body, data = {}) {
  try {
    // Skip if Expo Go
    if (Constants.appOwnership === 'expo') return;

    const Notifications = getNotificationsModule();
    if (!Notifications) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
        sound: 'default',
        badge: 1,
        color: '#3b82f6',
      },
      trigger: null, // Send immediately
    });

    console.log('✅ Local notification sent:', title);
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
}

/**
 * Send alert notification
 */
export async function sendAlertNotification(alert) {
  try {
    const { area, issue_type, message } = alert;

    await sendLocalNotification(
      `🚨 Alert: ${area}`,
      issue_type,
      {
        alertId: alert.id || Date.now().toString(),
        type: 'alert',
        area: area,
      }
    );
  } catch (error) {
    console.error('Error sending alert notification:', error);
  }
}

/**
 * Cancel all notifications
 */
export async function cancelAllNotifications() {
  try {
    // Skip if Expo Go
    if (Constants.appOwnership === 'expo') return;

    const Notifications = getNotificationsModule();
    if (!Notifications) return;

    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
}

/**
 * Get device push token for remote notifications
 */
export async function getPushToken() {
  try {
    const isExpoGo = Constants?.appOwnership === 'expo';
    if (isExpoGo) {
      console.warn('Skipping getPushToken in Expo Go. Use a dev build for remote push.');
      return null;
    }

    const Notifications = getNotificationsModule();
    if (!Notifications) return null;

    // Try to infer the projectId from the build environment
    const inferredProjectId =
      (Constants?.expoConfig && Constants?.expoConfig?.extra?.eas?.projectId) ||
      (Constants?.easConfig && Constants?.easConfig?.projectId) ||
      undefined;

    const token = await Notifications.getExpoPushTokenAsync(
      inferredProjectId ? { projectId: inferredProjectId } : undefined
    );

    console.log('📱 Push token:', token.data);
    return token.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

/**
 * Clean up notification subscriptions
 */
export function cleanupNotifications(subscriptions) {
  if (subscriptions) {
    if (subscriptions.notificationSubscription) {
      subscriptions.notificationSubscription.remove();
    }
    if (subscriptions.responseSubscription) {
      subscriptions.responseSubscription.remove();
    }
  }
}

export default {
  initializePushNotifications,
  sendLocalNotification,
  sendAlertNotification,
  cancelAllNotifications,
  getPushToken,
  cleanupNotifications,
};
