import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { authLogin } from "../../api/auth/auth";

export default function Index() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'SNPro': require('../../assets/fonts/SNPro-VariableFont_wght.ttf'),
  });
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data: any) => {
    setLoginError("");
    setIsLoading(true);
    try {
      const response = await authLogin(data.Email, data.Password);
      if (response.token && response.user) {
        await SecureStore.setItemAsync("authToken", response.token);
        await SecureStore.setItemAsync("userData", JSON.stringify(response.user));
        router.replace("/(main)/home");
      } else {
        setLoginError("No token received from server.");
      }
    } catch (error: any) {
      console.log("Login error:", error);
      
      if (error.code === "ERR_NETWORK" || !error.response) {
        setLoginError("Cannot connect to server. Please check your connection.");
      } else if (error.response?.status === 401) {
        setLoginError("Invalid email or password.");
      } else if (error.response?.status === 404) {
        setLoginError("Login service unavailable.");
      } else if (error.response?.data?.message) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError("Something went wrong. Please try again.");
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
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={style.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: "https://skream.in/cdn/shop/files/skreamoversizedt-shirtBLACKBACKOSTEE2_977590fd-fb91-4519-bea7-6c387e04f811.webp?v=1740749882&width=1946" }} style={style.image} />
        <Text style={style.heading}>Ovrstd</Text>

        <View style={{ gap: 10, margin: 20 }}>
          <Text style={style.label}>Email</Text>
          <Controller
            control={control}
            name="Email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            }}

            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                style={style.input}
                autoCapitalize="none"
              />
            )}
          />
          {errors.Email && <Text style={{ color: "#EF4444", fontSize: 12, fontFamily: "SNPro", marginLeft: 4 }}>{errors.Email.message as string}</Text>}

          <Text style={style.label}>Password</Text>
          <Controller
            control={control}
            name="Password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long"
              }
            }}

            render={({ field: { onChange, value } }) => (
              <View style={{ width: 300, position: "relative" }}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  secureTextEntry={!showPassword}
                  onChangeText={onChange}
                  style={[style.input, { paddingRight: 45 }]}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: 17 }}
                >
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.Password && <Text style={{ color: "#EF4444", fontSize: 12, fontFamily: "SNPro", marginLeft: 4 }}>{errors.Password.message as string}</Text>}

          {loginError ? <Text style={{ color: "#EF4444", fontSize: 13, fontFamily: "SNPro", textAlign: "center", marginTop: 8 }}>{loginError}</Text> : null}

          <TouchableOpacity 
            style={{ width: 300, height: 54, borderRadius: 16, backgroundColor: isLoading ? "#666" : "#000", justifyContent: "center", alignItems: "center", marginTop: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 5 }} 
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800", fontFamily: "SNPro" }}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", marginTop: 16, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#4B5563", fontFamily: "SNPro", fontSize: 14 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={{ color: "#000", fontWeight: "800", fontFamily: "SNPro", fontSize: 14 }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  heading: {
    fontSize: 34,
    fontWeight: "900",
    color: "#000",
    fontFamily: "SNPro",
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 20,
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
    marginTop: 5,
  }
})
