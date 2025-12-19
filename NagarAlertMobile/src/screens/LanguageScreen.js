import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LanguageScreen({ navigation }) {
    const [selected, setSelected] = useState("English");

    const languages = [
        "English",
        "Spanish",
        "French",
        "German",
        "Hindi",
        "Chinese",
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Language</Text>
                <View style={{ width: 22 }} />
            </View>

            <FlatList
                data={languages}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.item,
                            selected === item && styles.selectedItem
                        ]}
                        onPress={() => setSelected(item)}
                    >
                        <Text style={[
                            styles.text,
                            selected === item && styles.selectedText
                        ]}>{item}</Text>
                        {selected === item && (
                            <Ionicons name="checkmark" size={20} color="#2563eb" />
                        )}
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
    list: {
        padding: 16,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0f172a",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#1e293b",
    },
    selectedItem: {
        borderColor: "#2563eb",
    },
    text: {
        color: "#e5e7eb",
        fontSize: 16,
    },
    selectedText: {
        color: "#2563eb",
        fontWeight: "500",
    },
});
