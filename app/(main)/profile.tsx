import Navbar from "@/components/Navbar";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/build/Feather";
import { useRouter } from "expo-router";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();
  return (
    <SafeAreaView style={style.home}>
      <Navbar />
      <View style={style.profileContainer}>
        <View style={style.profileHeader}>
          <Image
            source={require("@/assets/images/user.png")}
            style={style.profileImage}
          />
          <Text style={style.profileName}>John Doe</Text>
          <Text style={style.profileEmail}>john.doe@example.com</Text>
        </View>
      </View>

      <View style={style.profileOverview}>
        <Text style={{fontSize: 16, fontWeight: "bold", color: "#000", fontFamily: "SNPro"}}>Account Overview</Text>
        <TouchableOpacity style={style.profileButton}>
            <Feather name="user" size={20} color="#000" />
          <Text>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" style={{marginLeft: "auto"}}/>
        </TouchableOpacity>
        <TouchableOpacity style={style.profileButton}>
          <Feather name="shopping-bag" size={20} color="#000" />
          <Text>My Orders</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" style={{marginLeft: "auto"}}/>
        </TouchableOpacity>
        <TouchableOpacity style={style.profileButton}>
          <Feather name="map-pin" size={20} color="#000" />
          <Text>My Address</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" style={{marginLeft: "auto"}}/>
        </TouchableOpacity>
        <TouchableOpacity style={style.profileButton}>
          <Feather name="heart" size={20} color="#000" />
          <Text>My Wishlist</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" style={{marginLeft: "auto"}}/>
        </TouchableOpacity>

        <TouchableOpacity style={style.logoutButton} onPress={() => router.push("/login")}>
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
    // marginBottom: 16,
    backgroundColor: "#C7C6C6",
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
