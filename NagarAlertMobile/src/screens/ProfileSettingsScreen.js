import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserProfile } from "../services/api";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileSettingsScreen({ navigation }) {
  const [user, setUser] = useState({
    firstName: "Loading...",
    lastName: "",
    email: "loading@example.com"
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const storedId = await AsyncStorage.getItem('userId');
      if (!storedId) return; // Or redirect to login

      const data = await getUserProfile(storedId);
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
    setRefreshing(false);
  };

  // Fetch when screen comes into focus (so it updates after editing details)
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate("UserProfile")}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.firstName ? user.firstName[0] : "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#64748b" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon="person-outline" label="Personal Details" onPress={() => navigation.navigate("UserDetails")} />
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => navigation.navigate("Notifications")} />
          <MenuItem icon="language-outline" label="Language" onPress={() => navigation.navigate("Language")} />
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => navigation.navigate("HelpSupport")} />
          <MenuItem icon="log-out-outline" label="Log Out" color="#ef4444" onPress={() => navigation.replace("Login")} />
        </View>
      </ScrollView>
    </View>
  );
}

function MenuItem({ icon, label, onPress, color = "#fff" }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={20} color={color === "#ef4444" ? color : "#94a3b8"} />
      </View>
      <Text style={[styles.menuLabel, { color: color === "#ef4444" ? color : "#f1f5f9" }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#334155" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 50, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  settingsBtn: { padding: 8, backgroundColor: '#1e293b', borderRadius: 12 },
  scroll: { padding: 24 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 20, borderRadius: 20, marginBottom: 30, borderWidth: 1, borderColor: '#334155' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  email: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  sectionTitle: { color: '#94a3b8', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12, marginLeft: 8 },
  menuGroup: { backgroundColor: '#1e293b', borderRadius: 20, padding: 8, marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIcon: { width: 32, alignItems: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' }
});