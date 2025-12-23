import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { registerUser } from "../services/api";
import { Alert, ActivityIndicator } from "react-native";

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    // Basic Validation
    if (!formData.firstName || !formData.email || !formData.mobile || !formData.password) {
      Alert.alert("Validation Error", "Please fill all required fields (First Name, Email, Mobile, Password)");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: "user"
      };

      console.log("Sending Signup Payload:", payload);
      const response = await registerUser(payload);
      console.log("Signup Success:", response);

      Alert.alert("Success", "Account created successfully! Please Login.", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (error) {
      console.error("Signup Error:", error);

      let errorMessage = "Registration failed. Please check your internet connection.";
      if (error.response) {
        // Server responded with a status code outside 2xx
        errorMessage = error.response.data?.detail || error.response.data?.message || `Server Error (${error.response.status})`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Check your API URL or Network.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the community today</Text>

        <View style={styles.row}>
          <Input
            placeholder="First Name"
            flex={1}
            value={formData.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
          />
          <View style={{ width: 10 }} />
          <Input
            placeholder="Last Name"
            flex={1}
            value={formData.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
          />
        </View>

        {/* Username is optional or derived, skipping for now based on backend model */}

        <Input
          placeholder="Email Address"
          icon="mail-outline"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        <Input
          placeholder="Mobile Number"
          icon="call-outline"
          keyboardType="phone-pad"
          value={formData.mobile}
          onChangeText={(text) => handleChange("mobile", text)}
        />
        <Input
          placeholder="Password"
          icon="lock-closed-outline"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <Input
          placeholder="Confirm Password"
          icon="lock-closed-outline"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Input({ placeholder, icon, secureTextEntry, keyboardType, flex, value, onChangeText }) {
  return (
    <View style={[styles.inputContainer, flex && { flex }]}>
      {icon && <Ionicons name={icon} size={20} color="#94a3b8" style={styles.inputIcon} />}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        style={styles.input}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  scroll: { padding: 24, paddingTop: 60 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#1e293b", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 30, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#94a3b8", marginBottom: 32 },
  row: { flexDirection: "row" },
  inputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b",
    borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: "#334155",
    paddingHorizontal: 16
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, color: "#fff", fontSize: 15 },
  button: {
    backgroundColor: "#3b82f6", padding: 18, borderRadius: 14, alignItems: "center", marginTop: 10,
    shadowColor: "#3b82f6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 30, marginBottom: 40 },
  footerText: { color: "#94a3b8" },
  link: { color: "#3b82f6", fontWeight: "bold" },
});