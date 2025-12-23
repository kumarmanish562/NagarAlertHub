import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UserProfileScreen({ navigation }) {
    const [name, setName] = useState("John Doe");
    const [bio, setBio] = useState("Community Helper");

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={40} color="#fff" />
                    </View>
                    <TouchableOpacity style={styles.changePhotoBtn}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} />

                    <Text style={styles.label}>Bio</Text>
                    <TextInput style={[styles.input, { height: 80 }]} multiline value={bio} onChangeText={setBio} textAlignVertical="top" />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
    backBtn: { padding: 4 },
    headerTitle: { color: "#fff", fontSize: 17, fontWeight: "600" },
    saveText: { color: "#3b82f6", fontSize: 16, fontWeight: "600" },
    content: { padding: 24, alignItems: 'center' },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    changePhotoBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#1e293b', borderRadius: 20 },
    changePhotoText: { color: '#3b82f6', fontWeight: '600', fontSize: 13 },
    form: { width: '100%' },
    label: { color: '#94a3b8', fontSize: 13, marginBottom: 8, marginLeft: 4 },
    input: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#334155' }
});