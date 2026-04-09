import Navbar from "@/components/Navbar";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/build/Feather";
import { useRouter } from "expo-router";
import { Text, View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
  createdAt: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      const userData = await SecureStore.getItemAsync("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("userData");
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[style.home, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={style.home}>
      <Navbar />
      <View style={style.profileContainer}>
        <View style={style.profileHeader}>
          {user?.profileImage && user.profileImage.startsWith('http') ? (
            <Image
              source={{ uri: user.profileImage }}
              style={style.profileImage}
            />
          ) : (
            <View style={style.defaultAvatar}>
              <Ionicons name="person" size={50} color="#9CA3AF" />
            </View>
          )}
          <Text style={style.profileName}>{user?.username || "Guest"}</Text>
          <Text style={style.profileEmail}>{user?.email || ""}</Text>
        </View>
      </View>

      <View style={style.profileOverview}>
        <Text style={{fontSize: 16, fontWeight: "bold", color: "#000", fontFamily: "SNPro"}}>Account Overview</Text>
        <TouchableOpacity style={style.profileButton} onPress={() => router.push("/(main)/edit-profile")}>
            <Feather name="user" size={20} color="#000" />
          <Text>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" style={{marginLeft: "auto"}}/>
        </TouchableOpacity>
        <TouchableOpacity style={style.profileButton} onPress={() => router.push("/(main)/my-orders")}>
          <Feather name="shopping-bag" size={20} color="#000" />
          <Text>My Orders</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" style={{marginLeft: "auto"}}/>
        </TouchableOpacity>
        <TouchableOpacity style={style.profileButton} onPress={() => router.push("/(main)/my-address")}>
          <Feather name="map-pin" size={20} color="#000" />
          <Text>My Address</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" style={{marginLeft: "auto"}}/>
        </TouchableOpacity>
        <TouchableOpacity style={style.profileButton} onPress={() => router.push("/(main)/my-wishlist")}>
          <Feather name="heart" size={20} color="#000" />
          <Text>My Wishlist</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" style={{marginLeft: "auto"}}/>
        </TouchableOpacity>

        <TouchableOpacity style={style.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="white" />
            <Text style={{color: "#fff"}}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  home: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  profileContainer: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  profileHeader: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    backgroundColor: "#E5E7EB",
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
  },
  profileEmail: {
    fontSize: 16,
    color: "#000",
},
profileOverview: {
  width: "100%",
  padding: 16,
  borderRadius: 16,
  // backgroundColor: "#C7C6C6",
  gap: 16,
},
  profileButton: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    height: 50,
    backgroundColor: "#F0F1F1",
    borderRadius: 16,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    fontFamily: "SNPro",
  },
  logoutButton: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    paddingLeft: 16,
  },
});
