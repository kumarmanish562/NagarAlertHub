import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>🛡️</Text>
      </View>

      {/* Title */}
      <Text style={styles.appName}>Nagar Alert Hub</Text>
      <Text style={styles.welcome}>Welcome.</Text>
      <Text style={styles.subtitle}>
        Sign in to report and track city incidents.
      </Text>

      {/* Phone */}
      <TextInput
        placeholder="Phone number"
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
  <Text style={styles.forgot}>Forgot password?</Text>
</TouchableOpacity>


      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Signup */}
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signup}>
          Don’t have an account? <Text style={styles.link}>Sign up</Text>
        </Text>
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
  logoBox: {
    alignSelf: "center",
    backgroundColor: "#0f172a",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
  },
  appName: {
    color: "#e5e7eb",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  welcome: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  forgot: {
    color: "#60a5fa",
    textAlign: "right",
    marginBottom: 20,
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  signup: {
    color: "#9ca3af",
    textAlign: "center",
  },
  link: {
    color: "#60a5fa",
    fontWeight: "600",
  },
});
