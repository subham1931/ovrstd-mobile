import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const recentSearchedItems = [
  "T-shirt",
  "Hoodie",
  "Joggers",
  "Cap",
  "Shoes",
  "Streetwear",
  "Jacket",
  "Sneakers",
];

export default function Search() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <TextInput
          placeholder="Search products"
          placeholderTextColor="#7a7a7a"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent searches</Text>
        <View style={styles.chipsWrap}>
          {recentSearchedItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  searchInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: "#d7d7d7",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#000",
    backgroundColor: "#fafafa",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#dedede",
    borderRadius: 999,
    backgroundColor: "#f8f8f8",
  },
  chipText: {
    color: "#222",
    fontSize: 14,
  },
});