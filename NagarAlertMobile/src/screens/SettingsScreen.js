import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen({ navigation }) {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Dark Mode</Text>
                    <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: '#3b82f6', false: '#334155' }} thumbColor="#fff" />
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Location Services</Text>
                    <Switch value={true} trackColor={{ true: '#3b82f6', false: '#334155' }} thumbColor="#fff" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a" },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
    section: { padding: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 12 },
    rowLabel: { color: '#fff', fontSize: 16 }
});