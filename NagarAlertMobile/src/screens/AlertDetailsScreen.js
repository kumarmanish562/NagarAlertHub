import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

// Reusing dark map style for consistency
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

export default function AlertDetailsScreen({ navigation, route }) {
  const { alert } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alert Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a",
            }}
            style={styles.image}
          />
          <View style={styles.photoTag}>
            <Text style={styles.photoTagText}>Photo Art</Text>
          </View>
        </View>

        {/* Title & Location */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={styles.pinIconBox}>
              <Ionicons name="location" size={20} color="#94a3b8" />
            </View>
            <View>
              <Text style={styles.title}>{alert.title}</Text>
              <Text style={styles.locationText}>Main Hill, CA, 95231</Text>
            </View>
          </View>
        </View>

        {/* Location Map Snippet */}
        <Text style={styles.sectionHeader}>Location</Text>
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            customMapStyle={darkMapStyle}
            initialRegion={{
              latitude: alert.latitude,
              longitude: alert.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: alert.latitude,
                longitude: alert.longitude,
              }}
              pinColor={alert.color}
            />
          </MapView>
        </View>

        {/* Status */}
        <Text style={styles.sectionHeader}>Status</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusBox, styles.statusVerified]}>
            <Text style={styles.statusTextVerified}>Verified</Text>
          </View>
          <View style={[styles.statusBox, styles.statusProgress]}>
            <Text style={styles.statusTextProgress}>In Progress</Text>
          </View>
        </View>

        {/* Timeline */}
        <Text style={styles.sectionHeader}>Timeline</Text>
        <View style={styles.timelineContainer}>
          <TimelineItem
            color="#10b981" // Green
            title="Verified"
            time="16m ago"
            desc={`${alert.title} Verified`}
            isLast={false}
          />
          <TimelineItem
            color="#3b82f6" // Blue
            title="In Progress"
            time="3m ago"
            desc="Your report on water leak has been verified"
            isLast={false}
          />
          <TimelineItem
            color="#64748b" // Grey
            title="Timeline"
            time="16m ago"
            desc="Your report the case outage."
            isLast={true}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function TimelineItem({ color, title, time, desc, isLast }) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: color }]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineTitle}>{title}</Text>
          <Text style={styles.timelineTime}>{time}</Text>
        </View>
        <Text style={styles.timelineDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1221", // Matching dark blue/black
  },
  scrollContent: {
    paddingBottom: 40,
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
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backBtn: {
    padding: 4,
  },

  /* Image */
  imageContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#1e293b',
  },
  image: {
    width: "100%",
    height: "100%",
  },
  photoTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  photoTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  /* Info */
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pinIconBox: {
    marginRight: 12,
    marginTop: 2,
    width: 24,
    alignItems: 'center',
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationText: {
    color: "#94a3b8",
    fontSize: 14,
  },

  /* Section Headers */
  sectionHeader: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
  },

  /* Map */
  mapWrapper: {
    marginHorizontal: 16,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  map: {
    flex: 1,
  },

  /* Status */
  statusRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  statusBox: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statusVerified: {
    backgroundColor: "#064e3b", // Dark green bg
    borderWidth: 1,
    borderColor: "#10b981", // Green border
  },
  statusProgress: {
    backgroundColor: "#422006", // Dark yellow/orange bg
    borderWidth: 1,
    borderColor: "#eab308", // Yellow border
  },
  statusTextVerified: {
    color: "#10b981",
    fontWeight: "bold",
    fontSize: 14,
  },
  statusTextProgress: {
    color: "#eab308",
    fontWeight: "bold",
    fontSize: 14,
  },

  /* Timeline */
  timelineContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 2, // Spacing handled by content/minHeight
    minHeight: 70,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 2,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#334155',
    marginTop: -2, // pull up to connect
    marginBottom: -4, // pull down to connect next
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  timelineTime: {
    color: "#94a3b8",
    fontSize: 12,
  },
  timelineDesc: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18,
  },
});
