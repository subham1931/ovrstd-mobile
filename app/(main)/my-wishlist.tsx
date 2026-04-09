import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { toggleWishlist } from "@/api/auth/auth";

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  description?: string;
}

export default function MyWishlist() {
  const router = useRouter();

  const handleBack = () => {
    router.navigate("/(main)/profile");
  };
  const [fontsLoaded] = useFonts({
    'SNPro': require('../../assets/fonts/SNPro-VariableFont_wght.ttf'),
  });

  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadWishlist = useCallback(async () => {
    try {
      const userData = await SecureStore.getItemAsync("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        setWishlist(parsed.wishlist || []);
      }
    } catch (error) {
      console.log("Error loading wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [loadWishlist])
  );

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await toggleWishlist(productId);
      
      const userData = await SecureStore.getItemAsync("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        parsed.wishlist = parsed.wishlist.filter((item: any) => 
          (typeof item === 'string' ? item : item._id) !== productId
        );
        await SecureStore.setItemAsync("userData", JSON.stringify(parsed));
        setWishlist(parsed.wishlist);
      }
    } catch (error) {
      console.log("Error removing from wishlist:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const renderProduct = ({ item }: { item: Product | string }) => {
    const isObjectItem = typeof item !== 'string';
    const productId = isObjectItem ? item._id : item;
    const productName = isObjectItem ? item.name : `Product ${item.slice(-6)}`;
    const productPrice = isObjectItem ? item.price : 0;
    const productImage = isObjectItem ? (item.image || item.images?.[0]) : null;

    return (
      <View style={styles.productCard}>
        <View style={styles.imageContainer}>
          {productImage && productImage.startsWith('http') ? (
            <Image source={{ uri: productImage }} style={styles.productImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={30} color="#9CA3AF" />
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
          {productPrice > 0 && (
            <Text style={styles.productPrice}>₹{productPrice.toFixed(2)}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(productId)}
          disabled={removingId === productId}
        >
          {removingId === productId ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons name="heart" size={24} color="#EF4444" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{wishlist.length}</Text>
        </View>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={80} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>Save items you love to your wishlist</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push("/(main)/home")}
          >
            <Text style={styles.shopButtonText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderProduct}
          keyExtractor={(item) => typeof item === 'string' ? item : item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  countBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "SNPro",
    color: "#000",
  },
  listContent: {
    padding: 20,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SNPro",
    color: "#000",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "SNPro",
    color: "#000",
  },
  removeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "SNPro",
    color: "#000",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "SNPro",
    textAlign: "center",
    marginTop: 8,
  },
  shopButton: {
    backgroundColor: "#000",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SNPro",
  },
});
