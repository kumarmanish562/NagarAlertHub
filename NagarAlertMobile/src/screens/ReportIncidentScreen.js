import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function ReportIncidentScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState("Traffic");
  const [autoLocation, setAutoLocation] = useState(true);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const incidentTypes = [
    { name: "Traffic", icon: "car-outline", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
    { name: "Power", icon: "flash-outline", color: "#eab308", bg: "rgba(234, 179, 8, 0.1)" },
    { name: "Water", icon: "water-outline", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
    { name: "Sanitation", icon: "trash-outline", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" },
  ];

  const pickImage = async () => {
    Alert.alert(
      "Upload Media",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: openCamera,
        },
        {
          text: "Gallery",
          onPress: openGallery,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const openGallery = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Incident</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Incident Type */}
        <Text style={styles.sectionLabel}>Select Incident Type</Text>
        <View style={styles.typesGrid}>
          {incidentTypes.map((item) => {
            const isSelected = selectedType === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.typeCard,
                  isSelected && styles.activeTypeCard,
                  { borderColor: isSelected ? item.color : 'transparent' }
                ]}
                onPress={() => setSelectedType(item.name)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.typeText}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upload Media */}
        <Text style={styles.sectionLabel}>Upload Media</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.cameraIconCircle}>
                <Ionicons name="camera" size={24} color="#fff" />
              </View>
              <Text style={styles.uploadText}>Upload</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Auto Detect Location */}
        <View style={styles.locationCard}>
          <View style={styles.locationLeft}>
            <Ionicons name="location-outline" size={20} color="#94a3b8" />
            <Text style={styles.locationLabel}>Auto Detect Location</Text>
          </View>
          <Switch
            value={autoLocation}
            onValueChange={setAutoLocation}
            thumbColor={"#fff"}
            trackColor={{ false: "#334155", true: "#2563eb" }}
          />
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>Add Description</Text>
        <TextInput
          placeholder="Add a description..."
          placeholderTextColor="#64748b"
          multiline
          value={description}
          onChangeText={setDescription}
          style={styles.textArea}
        />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            Alert.alert("Report Submitted", "Thank you for your report!");
            navigation.goBack();
          }}
        >
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1221", // Very dark blue/black
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  sectionLabel: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 20,
  },

  /* Types Grid */
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: 'space-between',
  },
  typeCard: {
    width: "22%", // approx 4 items
    aspectRatio: 1, // square
    backgroundColor: "#162032",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  activeTypeCard: {
    backgroundColor: "#1e293b",
    // Border color handled inline
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  typeText: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "500",
  },

  /* Upload */
  uploadBox: {
    width: 100,
    height: 100,
    backgroundColor: "#162032",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    alignItems: "center",
  },
  cameraIconCircle: {
    marginBottom: 6,
  },
  uploadText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },

  /* Location */
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#162032",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationLabel: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "500",
  },

  /* Description */
  textArea: {
    backgroundColor: "#162032",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    padding: 16,
    color: "#fff",
    height: 120,
    textAlignVertical: "top",
    fontSize: 14,
  },

  /* Footer */
  footer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
