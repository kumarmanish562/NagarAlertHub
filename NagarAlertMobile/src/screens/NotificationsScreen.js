import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationsScreen({ navigation }) {
  const notifications = [
    {
      id: "1",
      title: "New Traffic Alert near your location",
      time: "15 hours ago",
      type: "traffic",
      latitude: 21.252,
      longitude: 81.63,
      color: "#ef4444",
    },
    {
      id: "2",
      title: "Your report on water leak has been verified",
      time: "12 minutes ago",
      type: "verified",
      latitude: 21.248,
      longitude: 81.628,
      color: "#22c55e",
    },
    {
      id: "3",
      title: "Your report on water leak has been verified",
      time: "17 minutes ago",
      type: "verified",
      latitude: 21.246,
      longitude: 81.632,
      color: "#22c55e",
    },
    {
      id: "4",
      title: "New Traffic Alert near your location",
      time: "10 minutes ago",
      type: "traffic",
      latitude: 21.25,
      longitude: 81.635,
      color: "#ef4444",
    },
    {
      id: "5",
      title: "Your report on water leak has been verified",
      time: "12 minutes ago",
      type: "verified",
      latitude: 21.254,
      longitude: 81.634,
      color: "#22c55e",
    },
    {
      id: "6",
      title: "New Traffic Alert near your location",
      time: "25 minutes ago",
      type: "traffic",
      latitude: 21.255,
      longitude: 81.625,
      color: "#ef4444",
    },
  ];

  const getIcon = (type) => {
    if (type === "traffic") return "car";
    if (type === "verified") return "checkmark-circle";
    return "notifications";
  };

  const getColor = (type) => {
    if (type === "traffic") return "#ef4444";
    if (type === "verified") return "#22c55e";
    return "#60a5fa";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AlertDetails", { alert: item })}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: getColor(item.type) + "20" },
              ]}
            >
              <Ionicons
                name={getIcon(item.type)}
                size={18}
                color={getColor(item.type)}
              />
            </View>

            <View style={styles.textBox}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* List */
  list: {
    padding: 16,
    paddingBottom: 80, // space for bottom nav
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  textBox: {
    flex: 1,
  },

  title: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "500",
  },

  time: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
});
