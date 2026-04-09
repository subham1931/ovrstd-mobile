import { ActivityIndicator, Animated, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { authRegister } from "../../api/auth/auth";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type FormData = {
  username: string;
  email: string;
  phone?: string;
  password: string;
  gender: string;
};

const genderOptions = ["Male", "Female", "Other"];

export default function Signup() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'SNPro': require('../../assets/fonts/SNPro-VariableFont_wght.ttf'),
  });
  const { control, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const slideAnim = useRef(new Animated.Value(0)).current;

  const selectedGender = watch("gender");

  const animateToStep = (step: number) => {
    Animated.spring(slideAnim, {
      toValue: -step * SCREEN_WIDTH,
      useNativeDriver: true,
      tension: 50,
      friction: 10,
    }).start();
    setCurrentStep(step);
  };

  const handleNext = async () => {
    setSignupError("");
    
    if (currentStep === 0) {
      const isValid = await trigger(["username", "email", "password"]);
      if (isValid) {
        animateToStep(1);
      }
    } else if (currentStep === 1) {
      const isValid = await trigger(["gender"]);
      if (isValid) {
        animateToStep(2);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateToStep(currentStep - 1);
    }
  };

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

  const onSubmit = async (data: FormData) => {
    setSignupError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("gender", data.gender);
      
      if (data.phone) {
        formData.append("phone", data.phone);
      }

      if (profileImage) {
        const filename = profileImage.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("profileImage", {
          uri: profileImage,
          name: filename,
          type,
        } as any);
      }

      const response = await authRegister(formData);

      if (response.token && response.user) {
        await SecureStore.setItemAsync("authToken", response.token);
        await SecureStore.setItemAsync("userData", JSON.stringify(response.user));
        router.replace("/(main)/home");
      } else {
        setSignupError("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.log("Signup error:", error);

      if (error.code === "ERR_NETWORK" || !error.response) {
        setSignupError("Cannot connect to server. Please check your connection.");
      } else if (error.response?.status === 409) {
        setSignupError("User with this email or phone already exists.");
      } else if (error.response?.data?.message) {
        setSignupError(error.response.data.message);
      } else {
        setSignupError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Sliding Container */}
      <Animated.View
        style={[
          styles.slidingContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Step 1: Username, Email, Password */}
        <ScrollView
          style={styles.stepContainer}
          contentContainerStyle={styles.stepContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Let's Get Started</Text>
          <Text style={styles.subheading}>Create your account</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Username</Text>
            <Controller
              control={control}
              name="username"
              rules={{
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" },
                maxLength: { value: 30, message: "Username must be less than 30 characters" }
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter username"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  autoCapitalize="none"
                />
              )}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter email"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

            <Text style={styles.label}>Password</Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    secureTextEntry={!showPassword}
                    onChangeText={onChange}
                    style={[styles.input, { paddingRight: 45 }]}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Step 2: Phone, Gender */}
        <ScrollView
          style={styles.stepContainer}
          contentContainerStyle={styles.stepContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Almost There</Text>
          <Text style={styles.subheading}>Tell us more about you</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Phone <Text style={styles.optionalText}>(Optional)</Text></Text>
            <Controller
              control={control}
              name="phone"
              rules={{
                pattern: {
                  value: /^$|^[0-9]{10,15}$/,
                  message: "Enter a valid phone number (10-15 digits)"
                }
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

            <Text style={styles.label}>Gender</Text>
            <Controller
              control={control}
              name="gender"
              rules={{ required: "Please select a gender" }}
              render={() => (
                <View style={styles.genderContainer}>
                  {genderOptions.map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderOption,
                        selectedGender === gender && styles.genderOptionSelected
                      ]}
                      onPress={() => setValue("gender", gender)}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          selectedGender === gender && styles.genderTextSelected
                        ]}
                      >
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                <Ionicons name="arrow-back" size={20} color="#000" />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtnSmall} onPress={handleNext}>
                <Text style={styles.nextBtnText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Step 3: Profile Image */}
        <ScrollView
          style={styles.stepContainer}
          contentContainerStyle={styles.stepContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Add a Photo</Text>
          <Text style={styles.subheading}>Let people recognize you</Text>

          <View style={styles.formContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={50} color="#9CA3AF" />
                  <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
                </View>
              )}
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={16} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.skipText}>You can also skip and add later</Text>

            {signupError ? <Text style={styles.serverError}>{signupError}</Text> : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                <Ionicons name="arrow-back" size={20} color="#000" />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtnSmall, isLoading && styles.submitBtnDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
    width: 300,
  },
  backBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  backBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SNPro",
  },
  nextBtnSmall: {
    flex: 2,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  submitBtnSmall: {
    flex: 2,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  slidingContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 3,
    flex: 1,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
  },
  stepContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: "#000",
    fontFamily: "SNPro",
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "SNPro",
    marginTop: 8,
    marginBottom: 30,
  },
  formContainer: {
    width: 300,
    gap: 6,
  },
  input: {
    width: 300,
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#ffffff",
    fontFamily: "SNPro",
    fontSize: 16,
    color: "#000",
  },
  label: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "SNPro",
    marginBottom: 4,
    marginTop: 12,
  },
  optionalText: {
    color: "#9CA3AF",
    fontWeight: "400",
    fontSize: 12,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: "SNPro",
    marginLeft: 4,
  },
  serverError: {
    color: "#EF4444",
    fontSize: 13,
    fontFamily: "SNPro",
    textAlign: "center",
    marginTop: 16,
  },
  passwordContainer: {
    width: 300,
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 17,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 10,
    width: 300,
  },
  genderOption: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  genderOptionSelected: {
    borderColor: "#000",
    backgroundColor: "#000",
  },
  genderText: {
    fontSize: 15,
    fontFamily: "SNPro",
    fontWeight: "600",
    color: "#4B5563",
  },
  genderTextSelected: {
    color: "#fff",
  },
  nextBtn: {
    width: 300,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "SNPro",
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  imagePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "SNPro",
    marginTop: 8,
  },
  editBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#000",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  skipText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontFamily: "SNPro",
    fontSize: 14,
    marginBottom: 10,
  },
  submitBtn: {
    width: 300,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: "#666",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "SNPro",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#4B5563",
    fontFamily: "SNPro",
    fontSize: 14,
  },
  footerLink: {
    color: "#000",
    fontWeight: "800",
    fontFamily: "SNPro",
    fontSize: 14,
  },
});
