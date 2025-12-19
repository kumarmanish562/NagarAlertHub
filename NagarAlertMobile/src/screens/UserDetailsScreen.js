import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UserDetailsScreen({ navigation }) {
    const [details, setDetails] = useState({
        fullName: "User John",
        email: "ogaga@ophelia.com",
        phone: "+1 234 567 890",
        address: "123 Main St, New York",
        zipCode: "10001",
        country: "USA",
    });

    const handleChange = (field, value) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        Alert.alert("Saved", "Your details have been updated successfully.", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Details</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveBtn}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <InputGroup
                    label="Full Name"
                    value={details.fullName}
                    onChangeText={(text) => handleChange("fullName", text)}
                />
                <InputGroup
                    label="Email"
                    value={details.email}
                    onChangeText={(text) => handleChange("email", text)}
                    keyboardType="email-address"
                />
                <InputGroup
                    label="Phone Number"
                    value={details.phone}
                    onChangeText={(text) => handleChange("phone", text)}
                    keyboardType="phone-pad"
                />
                <InputGroup
                    label="Address"
                    value={details.address}
                    onChangeText={(text) => handleChange("address", text)}
                />
                <View style={styles.row}>
                    <InputGroup
                        label="Zip Code"
                        value={details.zipCode}
                        onChangeText={(text) => handleChange("zipCode", text)}
                        containerStyle={{ flex: 1, marginRight: 10 }}
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

function InputGroup({ label, value, onChangeText, keyboardType, containerStyle }) {
    return (
        <View style={[styles.inputGroup, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#64748b"
                keyboardType={keyboardType}
            />
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
    saveBtn: {
        color: "#2563eb",
        fontSize: 16,
        fontWeight: "600",
    },
    form: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        color: "#9ca3af",
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: "#0f172a",
        borderWidth: 1,
        borderColor: "#1e293b",
        borderRadius: 10,
        padding: 14,
        color: "#fff",
        fontSize: 16,
    },
});
