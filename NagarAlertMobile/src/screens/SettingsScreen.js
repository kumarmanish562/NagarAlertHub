import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen({ navigation }) {
    const [settings, setSettings] = useState({
        darkMode: true,
        location: true,
        dataSaver: false,
    });

    const toggleSwitch = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={styles.section}>
                <SettingToggle
                    label="Dark Mode"
                    value={settings.darkMode}
                    onValueChange={() => toggleSwitch('darkMode')}
                />
                <SettingToggle
                    label="Location Services"
                    value={settings.location}
                    onValueChange={() => toggleSwitch('location')}
                />
                <SettingToggle
                    label="Data Saver"
                    value={settings.dataSaver}
                    onValueChange={() => toggleSwitch('dataSaver')}
                />
            </View>

            <TouchableOpacity style={styles.row}>
                <Text style={styles.rowText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
                <Text style={styles.rowText}>Terms of Service</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.row, { marginTop: 20 }]}>
                <Text style={[styles.rowText, { color: '#ef4444' }]}>Delete Account</Text>
            </TouchableOpacity>
        </View>
    );
}

function SettingToggle({ label, value, onValueChange }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowText}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                thumbColor={value ? "#2563eb" : "#6b7280"}
                trackColor={{ false: "#374151", true: "#93c5fd" }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    section: {
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0f172a",
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#1e293b",
    },
    rowText: {
        color: "#e5e7eb",
        fontSize: 16,
    },
});
