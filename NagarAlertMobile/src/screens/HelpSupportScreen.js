import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HelpSupportScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                <FAQItem
                    question="How do I report an incident?"
                    answer="Go to the 'Report' tab in the bottom navigation, select the type of incident, add details, and click submit."
                />
                <FAQItem
                    question="How do I change my password?"
                    answer="Go to Profile > Details > Security to update your password."
                />

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Contact Us</Text>
                <View style={styles.contactCard}>
                    <Text style={styles.contactText}>Email: support@nagaralert.com</Text>
                    <Text style={styles.contactText}>Phone: +1 800 123 4567</Text>
                </View>
            </ScrollView>
        </View>
    );
}

function FAQItem({ question, answer }) {
    return (
        <View style={styles.faqItem}>
            <Text style={styles.question}>{question}</Text>
            <Text style={styles.answer}>{answer}</Text>
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
    content: {
        padding: 16,
    },
    sectionTitle: {
        color: "#9ca3af",
        marginBottom: 12,
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    faqItem: {
        backgroundColor: "#0f172a",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#1e293b",
    },
    question: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    answer: {
        color: "#9ca3af",
        lineHeight: 20,
    },
    contactCard: {
        backgroundColor: "#1e293b",
        padding: 20,
        borderRadius: 12,
    },
    contactText: {
        color: "#e5e7eb",
        fontSize: 15,
        marginBottom: 6,
    },
});
