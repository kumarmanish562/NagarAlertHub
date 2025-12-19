import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function UserProfileScreen({ navigation }) {
    const [isEditing, setIsEditing] = useState(false);

    // User Data State
    const [userData, setUserData] = useState({
        name: "User John",
        email: "ogaga@ophelia.com",
        phone: "+1 234 567 890",
        location: "New York, USA",
        bio: "Software Engineer & City Explorer",
    });
    const [avatar, setAvatar] = useState(null);

    const handleSave = () => {
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (field, value) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    const pickImage = async () => {
        if (!isEditing) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Profile</Text>
                <TouchableOpacity onPress={isEditing ? handleSave : handleEdit}>
                    <Text style={styles.editBtn}>{isEditing ? "Save" : "Edit"}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={pickImage} disabled={!isEditing}>
                        <View style={[styles.avatarContainer, isEditing && styles.avatarEditable]}>
                            {avatar ? (
                                <Image source={{ uri: avatar }} style={styles.avatarImage} />
                            ) : (
                                <Ionicons name="person" size={50} color="#9ca3af" />
                            )}
                            {isEditing && (
                                <View style={styles.editIconBadge}>
                                    <Ionicons name="camera" size={14} color="#fff" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    {isEditing ? (
                        <>
                            <TextInput
                                style={styles.nameInput}
                                value={userData.name}
                                onChangeText={(text) => handleChange("name", text)}
                                placeholder="Name"
                                placeholderTextColor="#64748b"
                            />
                            <TextInput
                                style={styles.emailInput}
                                value={userData.email}
                                onChangeText={(text) => handleChange("email", text)}
                                placeholder="Email"
                                placeholderTextColor="#64748b"
                            />
                            <TextInput
                                style={styles.bioInput}
                                value={userData.bio}
                                onChangeText={(text) => handleChange("bio", text)}
                                placeholder="Add a bio..."
                                placeholderTextColor="#64748b"
                                multiline
                            />
                        </>
                    ) : (
                        <>
                            <Text style={styles.name}>{userData.name}</Text>
                            <Text style={styles.email}>{userData.email}</Text>
                            <Text style={styles.bio}>{userData.bio}</Text>
                        </>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <InfoItem
                        label="Phone"
                        value={userData.phone}
                        isEditing={isEditing}
                        onChangeText={(text) => handleChange("phone", text)}
                    />
                    <InfoItem
                        label="Location"
                        value={userData.location}
                        isEditing={isEditing}
                        onChangeText={(text) => handleChange("location", text)}
                    />
                    {/* Member Since is generally not editable */}
                    <InfoItem label="Member Since" value="Jan 2025" isEditing={false} />
                </View>
            </ScrollView>
        </View>
    );
}

function InfoItem({ label, value, isEditing, onChangeText }) {
    return (
        <View style={styles.infoItem}>
            <Text style={styles.label}>{label}</Text>
            {isEditing && onChangeText ? (
                <TextInput
                    style={styles.inputValue}
                    value={value}
                    onChangeText={onChangeText}
                />
            ) : (
                <Text style={styles.value}>{value}</Text>
            )}
        </View>
    );
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
    editBtn: {
        color: "#2563eb",
        fontSize: 16,
        fontWeight: "500",
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: "center",
        marginBottom: 30,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#1e293b",
        marginBottom: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    avatarEditable: {
        borderColor: '#2563eb',
        borderWidth: 2,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 30,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    nameInput: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderBottomColor: "#2563eb",
        textAlign: "center",
        minWidth: 150,
        marginBottom: 8,
    },
    email: {
        color: "#9ca3af",
        marginTop: 4,
        fontSize: 14,
    },
    emailInput: {
        color: "#9ca3af",
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#334155",
        textAlign: "center",
        minWidth: 200,
        marginBottom: 8,
    },
    bio: {
        color: "#cbd5e1",
        marginTop: 8,
        fontSize: 14,
        fontStyle: 'italic',
    },
    bioInput: {
        color: "#cbd5e1",
        marginTop: 8,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#1e293b',
        backgroundColor: '#0f172a',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: '80%',
        textAlign: 'center',
    },
    infoContainer: {
        paddingHorizontal: 16,
    },
    infoItem: {
        backgroundColor: "#0f172a",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#1e293b",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        color: "#9ca3af",
    },
    value: {
        color: "#fff",
        fontWeight: "500",
    },
    inputValue: {
        color: "#fff",
        fontWeight: "500",
        borderBottomWidth: 1,
        borderBottomColor: "#2563eb",
        minWidth: 150,
        textAlign: "right",
        paddingVertical: 0,
    },
});
