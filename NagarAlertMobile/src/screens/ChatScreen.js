import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Linking,
    Alert,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function ChatScreen({ navigation }) {
    const WHATSAPP_NUMBER = "1234567890"; // Replace with actual Business API number
    const PREFILLED_MESSAGE = "Hello, I would like to subscribe to Nagar Alert Hub updates.";

    const openWhatsApp = async () => {
        const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Error", "WhatsApp is not installed on this device.");
            }
        } catch (err) {
            console.error("An error occurred", err);
            Alert.alert("Error", "Could not open WhatsApp.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="whatsapp" size={80} color="#25D366" />
                </View>

                <Text style={styles.title}>Nagar Alert on WhatsApp</Text>
                <Text style={styles.subtitle}>
                    Get verified city updates, traffic alerts, and emergency notifications directly on WhatsApp.
                </Text>

                <View style={styles.featuresCard}>
                    <FeatureItem icon="flash" text="Real-time Critical Alerts" />
                    <FeatureItem icon="checkmark-circle" text="Verified Official Information" />
                    <FeatureItem icon="map" text="Location-based Updates" />
                </View>

                <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
                    <FontAwesome5 name="whatsapp" size={24} color="#fff" style={{ marginRight: 12 }} />
                    <Text style={styles.btnText}>Subscribe on WhatsApp</Text>
                </TouchableOpacity>

                <Text style={styles.disclaimer}>
                    By tapping above, you will be redirected to WhatsApp to start the conversation with our official bot.
                </Text>
            </View>
        </View>
    );
}

function FeatureItem({ icon, text }) {
    return (
        <View style={styles.featureRow}>
            <Ionicons name={icon} size={20} color="#0f172a" />
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 60,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f1f5f9",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        marginTop: -40, // Pull up slightly
    },
    iconContainer: {
        width: 120,
        height: 120,
        backgroundColor: "#dcfce7",
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0f172a",
        marginBottom: 12,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 40,
    },
    featuresCard: {
        width: "100%",
        backgroundColor: "#f8fafc",
        padding: 20,
        borderRadius: 16,
        marginBottom: 40,
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    featureText: {
        fontSize: 15,
        color: "#334155",
        marginLeft: 12,
        fontWeight: "500",
    },
    whatsappBtn: {
        flexDirection: "row",
        backgroundColor: "#25D366",
        width: "100%",
        paddingVertical: 18,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#25D366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    btnText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    disclaimer: {
        marginTop: 20,
        fontSize: 12,
        color: "#94a3b8",
        textAlign: "center",
        paddingHorizontal: 10,
    },
});
