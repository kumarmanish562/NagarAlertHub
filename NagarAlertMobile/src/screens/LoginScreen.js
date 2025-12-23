import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter mobile number and password");
      return;
    }

    setLoading(true);
    try {
      // Identify is mobile number
      const response = await loginUser({ mobile: identifier, password: password });

      if (response && response.userId) {
        await AsyncStorage.setItem('userId', response.userId);
        await AsyncStorage.setItem('userRole', response.role || 'user');
        await AsyncStorage.setItem('userName', response.name || 'User');

        navigation.replace("Home");
      } else {
        Alert.alert("Error", "Login failed");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Invalid credentials or network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="shield-checkmark" size={48} color="#3b82f6" />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#64748b"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", justifyContent: "center" },
  content: { padding: 30 },
  logoContainer: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: 30,
    borderWidth: 1, borderColor: "rgba(59, 130, 246, 0.2)"
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#94a3b8", textAlign: "center", marginBottom: 40 },
  inputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b",
    borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: "#334155",
    paddingHorizontal: 16
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, color: "#fff", fontSize: 16 },
  forgot: { color: "#3b82f6", textAlign: "right", marginBottom: 30, fontWeight: "500" },
  button: {
    backgroundColor: "#3b82f6", padding: 18, borderRadius: 16, alignItems: "center",
    shadowColor: "#3b82f6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  footerText: { color: "#94a3b8" },
  link: { color: "#3b82f6", fontWeight: "bold" },
});