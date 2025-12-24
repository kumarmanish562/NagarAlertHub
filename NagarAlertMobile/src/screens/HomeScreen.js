import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { updateUserLocation, getReports } from '../services/api';
import realtimeService from '../services/realtimeService';
import { startBackgroundLocationTracking, stopBackgroundLocationTracking, isBackgroundLocationActive } from '../services/backgroundLocationService';
import { initializePushNotifications, sendAlertNotification, cleanupNotifications } from '../services/notificationService';
import Constants from 'expo-constants';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Hardcoded ID fallback
const DEFAULT_USER_ID = "9876543210";

export default function HomeScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 21.2514, longitude: 81.6296, latitudeDelta: 0.05, longitudeDelta: 0.05,
  });
  const [reports, setReports] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(DEFAULT_USER_ID);
  const [userArea, setUserArea] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [notificationSubscriptions, setNotificationSubscriptions] = useState(null);

  // Get User ID and Area
  useEffect(() => {
    const getUserData = async () => {
      const id = await AsyncStorage.getItem('userId');
      const area = await AsyncStorage.getItem('userArea') || 'Sector 4';
      if (id) setCurrentUserId(id);
      setUserArea(area);
    };
    getUserData();
  }, []);

  // Initialize Push Notifications and WebSocket
  useEffect(() => {
    const initializeServices = async () => {
      console.log('🚀 Initializing real-time services...');
      
      // Initialize push notifications (skip remote in Expo Go)
      const isExpoGo = Constants?.appOwnership === 'expo';
      if (!isExpoGo) {
        const notifSubs = await initializePushNotifications();
        if (notifSubs) {
          setNotificationSubscriptions(notifSubs);
        }
      } else {
        console.log('Skipping remote push initialization in Expo Go');
      }

      // Start background location tracking
      const bgStarted = await startBackgroundLocationTracking();
      console.log(`Background location tracking: ${bgStarted ? '✅' : '❌'}`);

      // Connect to WebSocket
      await connectWebSocket();
    };

    initializeServices();

    return () => {
      // Cleanup
      if (notificationSubscriptions) {
        cleanupNotifications(notificationSubscriptions);
      }
      realtimeService.disconnect();
    };
  }, [currentUserId, userArea]);

  // Connect to WebSocket
  const connectWebSocket = async () => {
    if (!currentUserId || currentUserId === DEFAULT_USER_ID) {
      console.warn('⚠️ Invalid user ID, skipping WebSocket connection');
      return;
    }

    try {
      // Connect with user's areas
      await realtimeService.connect(currentUserId, [userArea]);
      setIsOnline(true);

      // Listen for real-time alerts
      realtimeService.onAlert(async (alert) => {
        console.log('🚨 Real-time alert received:', alert);
        
        // Update reports list
        const newReport = {
          id: alert.alertId || `alert-${Date.now()}`,
          category: alert.issue_type,
          description: alert.message,
          area: alert.area,
          status: 'Verified',
          location: alert.location || { lat: region.latitude, lng: region.longitude },
        };
        
        setReports(prev => [newReport, ...prev]);

        // Send local notification
        await sendAlertNotification(alert);
      });

      // Listen for notifications
      realtimeService.onNotification((notification) => {
        console.log('📬 Notification:', notification);
        Alert.alert('Notification', notification.message || 'You have a new notification');
      });

      console.log('✅ WebSocket connected and listeners registered');
    } catch (error) {
      console.error('❌ WebSocket connection error:', error);
      setIsOnline(false);
    }
  };

  // Fetch Reports periodically
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        if (data) {
          const reportsArray = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
          setReports(reportsArray);
        }
      } catch (err) {
        console.log("Error fetching reports:", err);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- REAL TIME LOCATION TRACKING ---
  useEffect(() => {
    let subscription;
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          "Location Permission Needed",
          "Please enable location services to see real-time alerts in your area.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings()
            }
          ]
        );
        return;
      }

      // 1. Get Immediate Position (Snap to user)
      let currentLoc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: currentLoc.coords.latitude,
        longitude: currentLoc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // 2. Start Watching for Movement
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setRegion(prev => ({ ...prev, latitude, longitude }));

          console.log("📍 Sending Location:", latitude, longitude);
          updateUserLocation(currentUserId, latitude, longitude)
            .catch(err => console.log("Loc Update Fail", err));
        }
      );
    };

    startTracking();
    return () => { if (subscription) subscription.remove(); };
  }, [currentUserId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>{isOnline ? '🟢 Connected' : '🔴 Offline'}</Text>
          <Text style={styles.headerTitle}>Nagar Alert Hub</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Chat')}>
            <FontAwesome5 name="whatsapp" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { marginLeft: 12 }]} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          customMapStyle={darkMapStyle}
        >
          {reports.map((report) => (
            report.location && (
              <Marker
                key={report.id}
                coordinate={{ latitude: report.location.lat, longitude: report.location.lng }}
                title={report.category || 'Incident'}
                description={report.description}
                pinColor={report.status === 'Verified' ? 'red' : 'orange'}
              />
            )
          ))}
        </MapView>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput placeholder="Find location..." placeholderTextColor="#94a3b8" style={styles.searchInput} />
          </View>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <NavItem icon="grid-outline" label="Home" active onPress={() => navigation.navigate('Home')} />
        <NavItem icon="add-circle-outline" label="Report" onPress={() => navigation.navigate('Report')} />
        <NavItem icon="map-outline" label="Live Map" onPress={() => navigation.navigate('LiveAlertsMap')} />
        <NavItem icon="person-outline" label="Profile" onPress={() => navigation.navigate('ProfileSettings')} />
      </View>
    </View>
  );
}

const NavItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.navItem}>
    <Ionicons name={icon} size={24} color={active ? '#3b82f6' : '#64748b'} />
    <Text style={[styles.navText, active && { color: '#3b82f6' }]}>{label}</Text>
  </TouchableOpacity>
);

// Map Styles
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "elementType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "elementType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "elementType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "elementType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "elementType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "elementType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "elementType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "elementType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "elementType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "elementType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0f172a' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#94a3b8', fontSize: 12 },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  mapContainer: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  map: { ...StyleSheet.absoluteFillObject },
  searchContainer: { position: 'absolute', top: 20, left: 20, right: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 16, padding: 12 },
  searchInput: { flex: 1, color: '#fff', marginLeft: 10 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, backgroundColor: '#0f172a' },
  navItem: { alignItems: 'center' },
  navText: { color: '#64748b', fontSize: 10, marginTop: 4 }
});