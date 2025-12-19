import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [region, setRegion] = useState({
    latitude: 21.2514, // example location
    longitude: 81.6296, // Bhilai / Raipur side
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    Keyboard.dismiss();

    try {
      // 1. Request status (geocodeAsync usually requires permissions on some platforms or at least it's good practice)
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location is required for search.');
        return;
      }

      // 2. Geocode
      const geocodedLocation = await Location.geocodeAsync(searchText);

      if (geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];

        // 3. Update region
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        Alert.alert('Not Found', 'Location not found. Please try another search.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while searching for the location.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#9ca3af" />
        <TextInput
          placeholder="Search for location..."
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {/* Red Alerts */}
        <Marker
          coordinate={{ latitude: 21.252, longitude: 81.63 }}
          pinColor="red"
          onPress={() => navigation.navigate('AlertDetails', { alert: { title: 'Red Alert', latitude: 21.252, longitude: 81.63, color: 'red' } })}
        />
        <Marker
          coordinate={{ latitude: 21.255, longitude: 81.625 }}
          pinColor="red"
          onPress={() => navigation.navigate('AlertDetails', { alert: { title: 'Red Alert 2', latitude: 21.255, longitude: 81.625, color: 'red' } })}
        />

        {/* Blue Alerts */}
        <Marker
          coordinate={{ latitude: 21.248, longitude: 81.628 }}
          pinColor="blue"
          onPress={() => navigation.navigate('AlertDetails', { alert: { title: 'Blue Alert', latitude: 21.248, longitude: 81.628, color: 'blue' } })}
        />
        <Marker
          coordinate={{ latitude: 21.246, longitude: 81.632 }}
          pinColor="blue"
          onPress={() => navigation.navigate('AlertDetails', { alert: { title: 'Blue Alert 2', latitude: 21.246, longitude: 81.632, color: 'blue' } })}
        />

        {/* Yellow Alerts */}
        <Marker
          coordinate={{ latitude: 21.25, longitude: 81.635 }}
          pinColor="yellow"
          onPress={() => navigation.navigate('AlertDetails', { alert: { title: 'Yellow Alert', latitude: 21.25, longitude: 81.635, color: 'yellow' } })}
        />
        <Marker
          coordinate={{ latitude: 21.254, longitude: 81.634 }}
          pinColor="yellow"
          onPress={() => navigation.navigate('AlertDetails', { alert: { title: 'Yellow Alert 2', latitude: 21.254, longitude: 81.634, color: 'yellow' } })}
        />
      </MapView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem
          icon="home"
          label="Home"
          active
          onPress={() => navigation.navigate('Home')}
        />

        <NavItem
          icon="alert-circle"
          label="Report"
          onPress={() => navigation.navigate('Report')}
        />

        <NavItem
          icon="notifications"
          label="Live Alerts"
          onPress={() => navigation.navigate('LiveAlertsMap')}
        />

        <NavItem
          icon="person"
          label="Profile"
          onPress={() => navigation.navigate('ProfileSettings')}
        />
      </View>

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Chat')}
      >
        <Ionicons name="chatbubbles" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

/* Bottom Nav Item */
function NavItem({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={active ? '#2563eb' : '#9ca3af'} />
      <Text style={[styles.navText, { color: active ? '#2563eb' : '#9ca3af' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  /* Search */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },

  /* Map */
  map: {
    flex: 1,
  },

  /* Bottom Nav */
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#020617',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
  },
});
