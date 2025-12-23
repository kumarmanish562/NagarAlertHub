import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

export default function LiveAlertsMapScreen({ navigation }) {
  const alerts = [
    { id: "1", title: "Traffic Congestion", time: "15m ago", color: "#ef4444", icon: "car", lat: 21.252, lng: 81.63 },
    { id: "2", title: "Water Leakage", time: "34m ago", color: "#3b82f6", icon: "water", lat: 21.248, lng: 81.628 },
    { id: "3", title: "Power Outage", time: "1h ago", color: "#eab308", icon: "flash", lat: 21.250, lng: 81.635 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Alerts</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={{ latitude: 21.2514, longitude: 81.6296, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          customMapStyle={[{ elementType: "geometry", stylers: [{ color: "#242f3e" }] }]}
        >
          {alerts.map(a => (
            <Marker key={a.id} coordinate={{ latitude: a.lat, longitude: a.lng }} pinColor={a.color} />
          ))}
        </MapView>
      </View>

      <View style={styles.listContainer}>
        <View style={styles.handle} />
        <Text style={styles.listTitle}>Recent Incidents</Text>
        <FlatList
          data={alerts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AlertDetails", { alert: item })}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardTime}>{item.time} • 2.5km away</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#475569" />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10, position: 'absolute', top: 0, zIndex: 10, width: '100%' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.8)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600", textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 5 },
  mapContainer: { height: height * 0.55, width: '100%' },
  listContainer: { flex: 1, backgroundColor: "#0f172a", marginTop: -24, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  handle: { width: 40, height: 5, backgroundColor: "#334155", borderRadius: 3, alignSelf: "center", marginBottom: 20 },
  listTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#334155" },
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 14 },
  cardTitle: { color: "#f1f5f9", fontSize: 15, fontWeight: "600" },
  cardTime: { color: "#94a3b8", fontSize: 12, marginTop: 2 }
});