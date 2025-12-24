import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function ChatScreen({ navigation }) {
    const openWhatsApp = () => {
        // Opening chat with the support number (from Green-API dashboard)
        Linking.openURL(`https://wa.me/918872825483?text=Hello%20Nagar%20Alert`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <FontAwesome5 name="whatsapp" size={60} color="#25D366" />
                </View>
                <Text style={styles.title}>Nagar Alert Bot</Text>
                <Text style={styles.desc}>Get instant updates, file reports, and track status directly through our official WhatsApp assistant.</Text>

                <View style={styles.features}>
                    <Feature text="24/7 Automated Support" />
                    <Feature text="Instant Photo Reporting" />
                    <Feature text="Live Status Tracking" />
                </View>

                <TouchableOpacity style={styles.btn} onPress={openWhatsApp}>
                    <Text style={styles.btnText}>Start Chatting</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function Feature({ text }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="checkmark-circle" size={20} color="#25D366" />
            <Text style={{ color: '#94a3b8', marginLeft: 10, fontSize: 15 }}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a" },
    header: { paddingTop: 50, paddingHorizontal: 20 },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
    iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(37, 211, 102, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#25D366' },
    title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
    desc: { fontSize: 15, color: '#94a3b8', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
    features: { width: '100%', marginBottom: 40, paddingLeft: 20 },
    btn: { flexDirection: 'row', backgroundColor: '#25D366', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30, alignItems: 'center', shadowColor: '#25D366', shadowOpacity: 0.4, shadowRadius: 10 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});