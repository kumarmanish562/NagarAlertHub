import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { registerUser, getUserProfile, updateUserProfile } from "../services/api"; // Import API service
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDetailsScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const [details, setDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        zipCode: "",
        country: "",
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const storedId = await AsyncStorage.getItem('userId');
                if (!storedId) return;

                const data = await getUserProfile(storedId);
                if (data) {
                    setDetails({
                        fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
                        email: data.email || "",
                        phone: data.mobile || storedId,
                        address: data.address || "",
                        zipCode: data.zipCode || "",
                        country: data.country || "",
                    });
                }
            } catch (err) {
                console.log("Error fetching user details", err);
            }
        };
        fetchDetails();
    }, []);

    const handleChange = (field, value) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // 1. Prepare Data for Backend (UserCreate Schema)
            const nameParts = details.fullName.split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ") || "";

            const payload = {
                firstName: firstName,
                lastName: lastName,
                email: details.email,
                mobile: details.phone,
                // These fields need the backend update below to be saved
                address: details.address,
                zipCode: details.zipCode,
                country: details.country,
                role: "user"
            };

            // 2. Call API
            console.log("Updating user:", payload);
            const response = await updateUserProfile(details.phone, payload);
            console.log("Response:", response);

            Alert.alert("Success", "Profile updated in real-time!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Save Error:", error);
            Alert.alert("Error", "Could not save details. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Details</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#3b82f6" />
                    ) : (
                        <Text style={styles.saveBtn}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.sectionHeader}>Personal Info</Text>

                <InputGroup
                    label="Full Name"
                    value={details.fullName}
                    onChangeText={(text) => handleChange("fullName", text)}
                    icon="person-outline"
                />
                <InputGroup
                    label="Email"
                    value={details.email}
                    onChangeText={(text) => handleChange("email", text)}
                    keyboardType="email-address"
                    icon="mail-outline"
                />
                <InputGroup
                    label="Phone Number (ID)"
                    value={details.phone}
                    onChangeText={(text) => handleChange("phone", text)}
                    keyboardType="phone-pad"
                    icon="call-outline"
                />

                <Text style={styles.sectionHeader}>Location Info</Text>

                <InputGroup
                    label="Address"
                    value={details.address}
                    onChangeText={(text) => handleChange("address", text)}
                    icon="location-outline"
                />
                <View style={styles.row}>
                    <InputGroup
                        label="Zip Code"
                        value={details.zipCode}
                        onChangeText={(text) => handleChange("zipCode", text)}
                        containerStyle={{ flex: 1, marginRight: 12 }}
                    />
                    <InputGroup
                        label="Country"
                        value={details.country}
                        onChangeText={(text) => handleChange("country", text)}
                        containerStyle={{ flex: 1 }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

function InputGroup({ label, value, onChangeText, keyboardType, containerStyle, icon }) {
    return (
        <View style={[styles.inputGroup, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                {icon && <Ionicons name={icon} size={20} color="#64748b" style={{ marginRight: 10 }} />}
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor="#64748b"
                    keyboardType={keyboardType}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a", // Slate-900
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#0f172a",
        zIndex: 10,
    },
    backBtn: {
        padding: 8,
        backgroundColor: '#1e293b',
        borderRadius: 12
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    saveBtn: {
        color: "#3b82f6", // Blue-500
        fontSize: 16,
        fontWeight: "600",
    },
    form: {
        padding: 24,
    },
    sectionHeader: {
        color: "#94a3b8",
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 16,
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        color: "#cbd5e1",
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "500"
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1e293b", // Slate-800
        borderWidth: 1,
        borderColor: "#334155", // Slate-700
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14, // Consistent height
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
        padding: 0, // Reset default Android padding
    },
});