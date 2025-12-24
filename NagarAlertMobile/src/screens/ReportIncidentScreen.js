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
  ActivityIndicator,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import api, { BASE_URL as API_URL } from "../services/api";

export default function ReportIncidentScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState("Traffic");

  // Location States
  const [autoLocation, setAutoLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState("Detecting location...");
  const [manualAddress, setManualAddress] = useState("");
  const [locationCoords, setLocationCoords] = useState(null); // Stores {lat, lng}
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Media & Submission States
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const types = [
    { name: "Traffic", icon: "car", color: "#ef4444" },
    { name: "Pothole", icon: "construct", color: "#f97316" }, // Changed for relevance
    { name: "Garbage", icon: "trash", color: "#22c55e" },
    { name: "Water", icon: "water", color: "#3b82f6" },
  ];

  // --- 1. Image Picker Logic ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need camera roll permissions to upload.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, // Optimized quality for upload
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

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      let { latitude, longitude } = location.coords;

      // Save exact coords for backend
      setLocationCoords({ latitude, longitude });
      console.log("📍 GPS:", latitude, longitude);

      // Reverse Geocode for UI
      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const fullAddress = `${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}`;
        setCurrentAddress(fullAddress);
      } else {
        setCurrentAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
      }

    } catch (error) {
      console.log("Loc Error:", error);
      setCurrentAddress("Location unavailable. Try manual.");
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // --- 3. Submit Logic ---
  const handleSubmit = async () => {
    // 1. Validation
    if (!image) {
      Alert.alert("Evidence Required", "Please upload a photo of the incident.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Get Final Location (GPS or Manual Geocode)
      let finalLat = 0;
      let finalLng = 0;

      if (autoLocation && locationCoords) {
        finalLat = locationCoords.latitude;
        finalLng = locationCoords.longitude;
      } else if (!autoLocation && manualAddress) {
        // Geocode the manual string
        const geocoded = await Location.geocodeAsync(manualAddress);
        if (geocoded.length > 0) {
          finalLat = geocoded[0].latitude;
          finalLng = geocoded[0].longitude;
        } else {
          Alert.alert("Invalid Address", "Could not find location coordinates for this address.");
          setIsSubmitting(false);
          return;
        }
      } else {
        Alert.alert("Location Missing", "Please provide a valid location.");
        setIsSubmitting(false);
        return;
      }

      // 3. Prepare FormData
      const formData = new FormData();

      // Image
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('file', { uri: image, name: filename, type });

      // Data fields
      formData.append('latitude', String(finalLat));
      formData.append('longitude', String(finalLng));
      formData.append('address', autoLocation ? currentAddress : manualAddress);
      formData.append('description', description);
      formData.append('category', selectedType);
      formData.append('user_id', "user_123"); // Hardcoded for hackathon demo

      console.log("🚀 Sending Report:", formData);

      // 4. Send API Request
      const response = await fetch(`${API_URL}/reports/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "✅ Success",
          `Report #${result.reportId} Submitted!\nAI Verification: ${result.ai_verification}`
        );
        navigation.goBack();
      } else {
        Alert.alert("Error", result.detail || "Submission failed");
      }

    } catch (error) {
      console.log("Submit Error:", error);
      Alert.alert("Network Error", "Could not connect to server. Check your internet or API URL.");
    } finally {
      setIsSubmitting(false);
    }
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
        <Text style={styles.sectionTitle}>Evidence (Required)</Text>
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
          <View style={styles.locationHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.miniIcon, { backgroundColor: autoLocation ? '#3b82f6' : '#64748b' }]}>
                <Ionicons name={autoLocation ? "navigate" : "map"} size={14} color="#fff" />
              </View>
              <Text style={styles.locationLabel}>Use GPS Location</Text>
            </View>
            <Switch
              value={autoLocation}
              onValueChange={setAutoLocation}
              trackColor={{ true: '#3b82f6', false: '#334155' }}
              thumbColor="#fff"
            />
          </View>

          {autoLocation ? (
            <View style={styles.detectedBox}>
              {isFetchingLocation ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : (
                <Ionicons name="location-sharp" size={18} color="#3b82f6" />
              )}
              <Text style={styles.detectedText} numberOfLines={2}>
                {isFetchingLocation ? "Fetching GPS..." : currentAddress}
              </Text>
            </View>
          ) : (
            <View>
              <TextInput
                style={styles.manualInput}
                placeholder="Enter address (e.g., Sector 4 Market)"
                placeholderTextColor="#64748b"
                value={manualAddress}
                onChangeText={setManualAddress}
              />
              <Text style={styles.helperText}>We will detect coords automatically.</Text>
            </View>
          )}
        </View>

        {/* Description Input */}
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe the incident..."
          placeholderTextColor="#64748b"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Report</Text>
          )}
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
  detectedBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a',
    padding: 14, borderRadius: 12, margin: 6, borderWidth: 1, borderColor: '#3b82f6'
  },
  detectedText: { color: "#3b82f6", marginLeft: 10, fontWeight: '500', flex: 1 },
  manualInput: {
    backgroundColor: '#0f172a', borderRadius: 12, padding: 14, margin: 6,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#334155'
  },
  helperText: { color: "#64748b", fontSize: 12, marginLeft: 10, marginBottom: 8 },

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