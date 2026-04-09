import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateProfile } from "@/api/auth/auth";

interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  gender?: string;
  profileImage?: string;
}

export default function EditProfile() {
  const router = useRouter();

  const handleBack = () => {
    router.navigate("/(main)/profile");
  };
  const [fontsLoaded] = useFonts({
    'SNPro': require('../../assets/fonts/SNPro-VariableFont_wght.ttf'),
  });

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync("userData");
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser(parsed);
          setUsername(parsed.username || "");
          if (parsed.profileImage?.startsWith('http')) {
            setProfileImage(parsed.profileImage);
          }
        }
      } catch (error) {
        console.log("Error loading user data:", error);
      } finally {
        setIsPageLoading(false);
      }
    };
    loadUserData();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (username.length < 3 || username.length > 30) {
      setError("Username must be between 3 and 30 characters");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);

      if (profileImage && !profileImage.startsWith('http')) {
        const filename = profileImage.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("profileImage", {
          uri: profileImage,
          name: filename,
          type,
        } as any);
      }

      const response = await updateProfile(formData);

      if (response.user) {
        const updatedUser = {
          ...user,
          username: response.user.username || username,
          profileImage: response.user.profileImage || user?.profileImage,
        };
        await SecureStore.setItemAsync("userData", JSON.stringify(updatedUser));
        setSuccess("Profile updated successfully!");
        
        setTimeout(() => {
          router.navigate("/(main)/profile");
        }, 1000);
      }
    } catch (error: any) {
      console.log("Update error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isPageLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Image */}
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="person" size={50} color="#9CA3AF" />
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Enter username"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Email</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledText}>{user?.email || ""}</Text>
              <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
            </View>
            <Text style={styles.helperText}>Email cannot be changed</Text>

            {user?.phone && (
              <>
                <Text style={styles.label}>Phone</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledText}>{user.phone}</Text>
                  <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                </View>
              </>
            )}

            {user?.gender && (
              <>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledText}>{user.gender}</Text>
                  <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                </View>
              </>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}

            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "SNPro",
    color: "#000",
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: 20,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  changePhotoText: {
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "SNPro",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 30,
  },
  formContainer: {
    gap: 8,
  },
  label: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "SNPro",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#fff",
    fontFamily: "SNPro",
    fontSize: 16,
    color: "#000",
  },
  disabledInput: {
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disabledText: {
    fontFamily: "SNPro",
    fontSize: 16,
    color: "#6B7280",
  },
  helperText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontFamily: "SNPro",
    marginLeft: 4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    fontFamily: "SNPro",
    textAlign: "center",
    marginTop: 16,
  },
  successText: {
    color: "#10B981",
    fontSize: 14,
    fontFamily: "SNPro",
    textAlign: "center",
    marginTop: 16,
  },
  saveButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: "#666",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "SNPro",
  },
});
