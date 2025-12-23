import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AlertDetailsScreen({ navigation, route }) {
  const { alert } = route.params || { alert: { title: "Sample Alert", color: "red", latitude: 0, longitude: 0 } };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="share-social-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageCard}>
          <View style={[styles.statusBadge, { backgroundColor: alert.color }]}>
            <Text style={styles.statusText}>In Progress</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{alert.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color="#94a3b8" />
            <Text style={styles.location}>Sector 4, Main Street, Bhilai</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Status Timeline</Text>
          <TimelineItem title="Report Verified" time="10:30 AM" active />
          <TimelineItem title="Team Assigned" time="11:15 AM" active />
          <TimelineItem title="Resolution in Progress" time="11:45 AM" active isLast />
        </View>
      </ScrollView>
    </View>
  );
}

function TimelineItem({ title, time, active, isLast }) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.dot, active ? { backgroundColor: '#3b82f6', borderColor: '#1d4ed8' } : { backgroundColor: '#334155' }]} />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={styles.timelineRight}>
        <Text style={[styles.tTitle, active ? { color: '#fff' } : { color: '#64748b' }]}>{title}</Text>
        <Text style={styles.tTime}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  scroll: { padding: 20 },
  imageCard: { height: 200, backgroundColor: '#1e293b', borderRadius: 20, marginBottom: 20, position: 'relative' },
  statusBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  info: { marginBottom: 30 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  location: { color: '#94a3b8', marginLeft: 6 },
  section: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20 },
  sectionHeader: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 20 },
  timelineItem: { flexDirection: 'row', height: 70 },
  timelineLeft: { alignItems: 'center', width: 30 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, zIndex: 2 },
  line: { width: 2, flex: 1, backgroundColor: '#334155', marginVertical: 4 },
  timelineRight: { marginLeft: 10, justifyContent: 'flex-start', paddingTop: -2 },
  tTitle: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  tTime: { color: '#64748b', fontSize: 12 }
});