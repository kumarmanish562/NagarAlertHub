/**
 * Real-Time Service - WebSocket Client for Live Alerts
 * Handles WebSocket connections and alert subscriptions
 */

import io from 'socket.io-client';

import { WS_BASE_URL } from './api';

const BASE_URL = "https://eleven-drinks-count.loca.lt/api/v1";

class RealtimeService {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.isConnected = false;
    this.alertCallbacks = [];
    this.notificationCallbacks = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Connect to WebSocket server
   */
  async connect(userId, areas = []) {
    this.userId = userId;

    try {
      console.log(`🔌 Connecting to TUNNEL WebSocket (${WS_BASE_URL}) as ${userId}...`);

      // Using native WebSocket for React Native compatibility
      this.socket = new WebSocket(
        `${WS_BASE_URL}/${userId}`
      );

      this.socket.onopen = () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // Subscribe to areas
        if (areas.length > 0) {
          this.subscribeToAreas(areas);
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this._handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnected = false;
      };

      this.socket.onclose = () => {
        console.log('❌ WebSocket disconnected');
        this.isConnected = false;
        this._attemptReconnect(userId, areas);
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this._attemptReconnect(userId, areas);
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  _attemptReconnect(userId, areas) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const backoffTime = Math.pow(2, this.reconnectAttempts) * 1000;
      console.log(`⏳ Reconnecting in ${backoffTime}ms... (Attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(userId, areas);
      }, backoffTime);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  _handleMessage(message) {
    const { type, data } = message;

    switch (type) {
      case 'alert':
        console.log('🚨 Alert received:', data);
        this._triggerAlertCallbacks(data);
        break;

      case 'notification':
        console.log('📬 Notification received:', data);
        this._triggerNotificationCallbacks(data);
        break;

      case 'subscription_confirmed':
        console.log('✅ Subscription confirmed:', data);
        break;

      case 'pong':
        console.log('💓 Keep-alive pong received');
        break;

      case 'location_update':
        console.log('📍 Location update:', data);
        break;

      default:
        console.log('Unknown message type:', type);
    }
  }

  /**
   * Subscribe to alerts in specific areas
   */
  subscribeToAreas(areas) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not ready, queuing subscription');
      return;
    }

    const message = {
      type: 'subscribe',
      areas: areas
    };

    try {
      this.socket.send(JSON.stringify(message));
      console.log(`📍 Subscribed to areas: ${areas.join(', ')}`);
    } catch (error) {
      console.error('Error subscribing to areas:', error);
    }
  }

  /**
   * Send keep-alive ping
   */
  sendPing() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      this.socket.send(JSON.stringify({ type: 'ping' }));
    } catch (error) {
      console.error('Error sending ping:', error);
    }
  }

  /**
   * Register callback for alert events
   */
  onAlert(callback) {
    this.alertCallbacks.push(callback);
  }

  /**
   * Register callback for notification events
   */
  onNotification(callback) {
    this.notificationCallbacks.push(callback);
  }

  /**
   * Trigger all alert callbacks
   */
  _triggerAlertCallbacks(alert) {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in alert callback:', error);
      }
    });
  }

  /**
   * Trigger all notification callbacks
   */
  _triggerNotificationCallbacks(notification) {
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 WebSocket disconnected');
    }
  }

  /**
   * Check if connected
   */
  isWebSocketConnected() {
    return this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
export default realtimeService;
