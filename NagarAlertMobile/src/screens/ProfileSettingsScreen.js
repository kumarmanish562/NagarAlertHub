import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileSettingsScreen({ navigation }) {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Profile Card */}
      <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate("UserProfile")}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color="#9ca3af" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>User John</Text>
          <Text style={styles.email}>ogaga@ophelia.com</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>

      {/* Settings Section */}
      <View style={styles.section}>
        <SettingItem
          icon="person-outline"
          label="Details"
          onPress={() => navigation.navigate("UserDetails")}
        />
        <SettingItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => navigation.navigate("Notifications")}
        />
      </View>

      {/* Notification Preferences */}
      <Text style={styles.sectionTitle}>Notifications</Text>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Notification Preferences</Text>
        <Switch
          value={notifEnabled}
          onValueChange={setNotifEnabled}
          thumbColor={notifEnabled ? "#2563eb" : "#6b7280"}
          trackColor={{ false: "#374151", true: "#93c5fd" }}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Email Notifications</Text>
        <Switch
          value={emailNotif}
          onValueChange={setEmailNotif}
          thumbColor={emailNotif ? "#2563eb" : "#6b7280"}
          trackColor={{ false: "#374151", true: "#93c5fd" }}
        />
      </View>

      {/* More Options */}
      <View style={styles.section}>
        <SettingItem
          icon="language-outline"
          label="Language"
          rightText="English"
          onPress={() => navigation.navigate("Language")}
        />
        <SettingItem
          icon="settings-outline"
          label="New & Settings"
          onPress={() => navigation.navigate("Settings")}
        />
        <SettingItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => navigation.navigate("HelpSupport")}
        />
      </View>
    </View>
  );
}

/* Reusable Setting Row */
function SettingItem({ icon, label, rightText, onPress }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={18} color="#9ca3af" />
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {rightText && <Text style={styles.rightText}>{rightText}</Text>}
        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingTop: 50,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* Profile */
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    color: "#e5e7eb",
    fontSize: 15,
    fontWeight: "600",
  },
  email: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },

  /* Sections */
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#9ca3af",
    marginLeft: 16,
    marginBottom: 8,
  },

  /* Rows */
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: {
    color: "#e5e7eb",
    marginLeft: 10,
    fontSize: 14,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightText: {
    color: "#9ca3af",
    marginRight: 6,
    fontSize: 13,
  },

  /* Switch rows */
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 14,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  switchText: {
    color: "#e5e7eb",
    fontSize: 14,
  },
});
