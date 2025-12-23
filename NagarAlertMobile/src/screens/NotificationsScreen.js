import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationsScreen({ navigation }) {
  const data = [
    { id: "1", text: "New Traffic Alert near Sector 6", time: "2 min ago", icon: "alert-circle", color: "#ef4444" },
    { id: "2", text: "Water issue resolved in your area", time: "1 hour ago", icon: "checkmark-circle", color: "#22c55e" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={styles.content}>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {item.id === "1" && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { padding: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  list: { padding: 20 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#334155" },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", marginRight: 14 },
  content: { flex: 1 },
  text: { color: "#f1f5f9", fontSize: 14, fontWeight: "500", lineHeight: 20 },
  time: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ef4444", marginLeft: 8 }
});