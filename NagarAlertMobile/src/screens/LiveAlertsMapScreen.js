import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export default function LiveAlertsMapScreen({ navigation }) {
  const alerts = [
    {
      id: "1",
      type: "Traffic",
      title: "Traffic Congestion on Main St.",
      time: "15 minutes ago",
      color: "#ef4444",
      icon: "car",
      latitude: 21.252,
      longitude: 81.63,
    },
    {
      id: "2",
      type: "Power",
      title: "Power Outage in Sector 4",
      time: "34 minutes ago",
      color: "#eab308",
      icon: "flash",
      latitude: 21.248,
      longitude: 81.628,
    },
    {
      id: "3",
      type: "Water",
      title: "Water Leakage in Sector 5",
      time: "24 minutes ago",
      color: "#3b82f6",
      icon: "water",
      latitude: 21.246,
      longitude: 81.632,
    },
    {
      id: "4",
      type: "Traffic",
      title: "Traffic Congestion on Main St.",
      time: "18 minutes ago",
      color: "#ef4444",
      icon: "car",
      latitude: 21.25,
      longitude: 81.635,
    },
    {
      id: "5",
      type: "Power",
      title: "Power Outage in Sector 4",
      time: "34 minutes ago",
      color: "#eab308",
      icon: "flash",
      latitude: 21.254,
      longitude: 81.634,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Alerts Map</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={darkMapStyle}
          initialRegion={{
            latitude: 21.2514,
            longitude: 81.6296,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {alerts.map((alert) => (
            <Marker
              key={alert.id}
              coordinate={{
                latitude: alert.latitude,
                longitude: alert.longitude,
              }}
              pinColor={alert.color}
              onPress={() =>
                navigation.navigate("AlertDetails", { alert })
              }
            />
          ))}
        </MapView>

        {/* Floating Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search for colors..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
        </View>

        {/* Floating Controls (Optional based on image usually bottom right) */}
        {/* Simplified for now to match main structure */}
      </View>

      {/* Draggable/Bottom Sheet styled List */}
      <View style={styles.listContainer}>
        <View style={styles.dragHandle} />

        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.alertCard}
              onPress={() =>
                navigation.navigate("AlertDetails", { alert: item })
              }
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: item.color + "20" },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.color}
                />
              </View>

              <View style={styles.alertContent}>
                <Text style={styles.alertTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.alertTime}>{item.time}</Text>
              </View>

              {/* Red dot indicator */}
              <View style={styles.redDot} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1221", // Very dark blue/black
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#0b1221",
    zIndex: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backBtn: {
    padding: 4,
  },

  /* Map Container */
  mapContainer: {
    height: height * 0.45, // Top 45% of screen
    width: "100%",
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  /* Floating Search */
  searchBox: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.9)", // Semi-transparent dark slate
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  searchInput: {
    color: "#fff",
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },

  /* List Container */
  listContainer: {
    flex: 1,
    backgroundColor: "#0b1221",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20, // Overlap slightly with map
    paddingTop: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#334155",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  /* Alert Card */
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#162032", // Slightly lighter than background
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  // Highlight style example (not active logic yet, but visually consistent)
  // activeCard: { borderColor: '#ef4444' } 

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  alertContent: {
    flex: 1,
    justifyContent: 'center',
  },

  alertTitle: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },

  alertTime: {
    color: "#94a3b8",
    fontSize: 12,
  },

  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444", // Red notification dot
    marginLeft: 8,
  },
});
