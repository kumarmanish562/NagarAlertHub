import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPushToken } from "../services/notificationService";

export default function SettingsScreen({ navigation }) {
    const [darkMode, setDarkMode] = useState(true);
    const [pushToken, setPushToken] = useState(null);

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
                <TouchableOpacity style={styles.button} onPress={async () => {
                    const token = await getPushToken();
                    setPushToken(token);
                }}>
                    <Text style={styles.buttonText}>Get Expo Push Token</Text>
                </TouchableOpacity>
                {pushToken ? (
                    <View style={styles.tokenBox}>
                        <Text style={styles.tokenLabel}>Push Token</Text>
                        <Text style={styles.tokenValue}>{pushToken}</Text>
                    </View>
                ) : (
                    <Text style={styles.tokenHint}>Run a Development Build to get a token.</Text>
                )}
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
    rowLabel: { color: '#fff', fontSize: 16 },
    button: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: '600' },
    tokenBox: { backgroundColor: '#0b1220', padding: 12, borderRadius: 10, marginTop: 10 },
    tokenLabel: { color: '#9ca3af', marginBottom: 6 },
    tokenValue: { color: '#cbd5e1', fontSize: 12 },
    tokenHint: { color: '#9ca3af', marginTop: 8 }
});