import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ForgotPasswordScreen({ navigation }) {
  const [phone, setPhone] = useState("");

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconBox}>
        <Text style={styles.icon}>🔒</Text>
      </View>

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your registered phone number to reset your password.
      </Text>

      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.resetBtn} onPress={() => console.log('Reset link sent')}>
        <Text style={styles.resetText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    padding: 24,
  },
  iconBox: {
    alignSelf: "center",
    backgroundColor: "#0f172a",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 26,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  resetBtn: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
  },
  resetText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  back: {
    color: "#60a5fa",
    textAlign: "center",
    marginTop: 20,
  },
});
