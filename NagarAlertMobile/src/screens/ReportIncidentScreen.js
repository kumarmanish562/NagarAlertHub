import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export default function ReportIncidentScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState("Traffic");

  // Location States
  const [autoLocation, setAutoLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState("Detecting location...");
  const [manualAddress, setManualAddress] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Media State
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const types = [
    { name: "Traffic", icon: "car", color: "#ef4444" },
    { name: "Power", icon: "flash", color: "#eab308" },
    { name: "Water", icon: "water", color: "#3b82f6" },
    { name: "Trash", icon: "trash", color: "#22c55e" },
  ];

  // --- 1. Image Picker Logic ---
  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need camera roll permissions to upload.");
      return;
    }

    // Launch Picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // --- 2. Location Logic ---
  useEffect(() => {
    if (autoLocation) {
      getCurrentLocation();
    }
  }, [autoLocation]);

  const getCurrentLocation = async () => {
    setIsFetchingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentAddress("Permission denied");
        setIsFetchingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let { latitude, longitude } = location.coords;

      console.log("📍 Incident Loc:", latitude, longitude);

      // Reverse Geocode to get address
      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });

      let fullAddress = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;

      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        // Construct a readable string
        const parts = [
          addr.name,
          addr.street,
          addr.city,
          addr.region,
          addr.postalCode
        ].filter(part => part); // Remove null/undefined

        // Join with commas
        const start = parts.slice(0, 2).join(", ");
        const end = parts.slice(2).join(", ");
        fullAddress = `${start}\n${end}\n(Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)})`;
      }

      setCurrentAddress(fullAddress);
    } catch (error) {
      console.log("Loc Error:", error);
      setCurrentAddress("Location unavailable");
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSubmit = () => {
    // Logic to submit data
    Alert.alert("Report Submitted", "Thank you for your report!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Incident</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Incident Type Grid */}
        <Text style={styles.sectionTitle}>What's the issue?</Text>
        <View style={styles.grid}>
          {types.map((t) => (
            <TouchableOpacity
              key={t.name}
              style={[styles.card, selectedType === t.name && { borderColor: t.color, backgroundColor: t.color + '10' }]}
              onPress={() => setSelectedType(t.name)}
            >
              <View style={[styles.iconBox, { backgroundColor: t.color + '20' }]}>
                <Ionicons name={t.icon} size={24} color={t.color} />
              </View>
              <Text style={[styles.cardText, selectedType === t.name && { color: t.color }]}>{t.name}</Text>

              {selectedType === t.name && (
                <View style={styles.check}>
                  <Ionicons name="checkmark-circle" size={16} color={t.color} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Upload Media Section */}
        <Text style={styles.sectionTitle}>Evidence</Text>
        <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.uploadedImage} />
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={14} color="#fff" />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.cameraIconCircle}>
                <Ionicons name="camera" size={28} color="#64748b" />
              </View>
              <Text style={styles.uploadText}>Tap to upload photo</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Location Section */}
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationContainer}>
          {/* Toggle Switch Row */}
          <View style={styles.locationHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.miniIcon, { backgroundColor: autoLocation ? '#3b82f6' : '#64748b' }]}>
                <Ionicons name={autoLocation ? "navigate" : "map"} size={14} color="#fff" />
              </View>
              <Text style={styles.locationLabel}>Use Current Location</Text>
            </View>
            <Switch
              value={autoLocation}
              onValueChange={setAutoLocation}
              trackColor={{ true: '#3b82f6', false: '#334155' }}
              thumbColor="#fff"
            />
          </View>

          {/* Conditional Input/Display */}
          {autoLocation ? (
            <View style={styles.detectedBox}>
              {isFetchingLocation ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : (
                <Ionicons name="location-sharp" size={18} color="#3b82f6" />
              )}
              <Text style={styles.detectedText}>
                {isFetchingLocation ? "Fetching GPS..." : currentAddress}
              </Text>
            </View>
          ) : (
            <TextInput
              style={styles.manualInput}
              placeholder="Enter street address or landmark..."
              placeholderTextColor="#64748b"
              value={manualAddress}
              onChangeText={setManualAddress}
            />
          )}
        </View>

        {/* Description Input */}
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe the incident details..."
          placeholderTextColor="#64748b"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20
  },
  backBtn: { padding: 8, backgroundColor: '#1e293b', borderRadius: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { color: "#94a3b8", fontSize: 13, fontWeight: "700", textTransform: 'uppercase', marginBottom: 12, marginTop: 10, marginLeft: 4 },

  /* Grid Styles */
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 10 },
  card: {
    width: "48%", backgroundColor: "#1e293b", padding: 16, borderRadius: 16,
    marginBottom: 16, borderWidth: 2, borderColor: "transparent", alignItems: "center"
  },
  iconBox: {
    width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginBottom: 12
  },
  cardText: { color: "#64748b", fontWeight: "600", fontSize: 14 },
  check: { position: 'absolute', top: 10, right: 10 },

  /* Upload Styles */
  uploadArea: {
    height: 140, backgroundColor: "#1e293b", borderRadius: 16,
    borderStyle: 'dashed', borderWidth: 2, borderColor: '#334155',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden'
  },
  cameraIconCircle: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#0f172a',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8
  },
  uploadText: { color: "#64748b", fontWeight: '500' },
  imagePreviewContainer: { width: '100%', height: '100%' },
  uploadedImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  editBadge: {
    position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6, borderRadius: 20
  },

  /* Location Styles */
  locationContainer: {
    backgroundColor: '#1e293b', borderRadius: 16, padding: 6, marginBottom: 20,
    borderWidth: 1, borderColor: '#334155'
  },
  locationHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 12,
  },
  miniIcon: {
    width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 10
  },
  locationLabel: { color: "#fff", fontWeight: '500', fontSize: 15 },

  // Conditional Box Styles
  detectedBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a',
    padding: 14, borderRadius: 12, margin: 6, borderWidth: 1, borderColor: '#3b82f6'
  },
  detectedText: { color: "#3b82f6", marginLeft: 10, fontWeight: '500' },

  manualInput: {
    backgroundColor: '#0f172a', borderRadius: 12, padding: 14, margin: 6,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#334155'
  },

  /* Description & Footer */
  input: {
    backgroundColor: "#1e293b", borderRadius: 16, padding: 16, height: 100,
    color: "#fff", fontSize: 15, borderWidth: 1, borderColor: "transparent"
  },
  footer: {
    padding: 20, backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: '#1e293b'
  },
  submitBtn: {
    backgroundColor: "#3b82f6", padding: 18, borderRadius: 16, alignItems: "center",
    shadowColor: "#3b82f6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});