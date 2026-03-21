import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

interface ProductCardProps {
  title?: string;
  img?: ImageSourcePropType;
  price?: string;
  style?: StyleProp<ViewStyle>;
}

export default function ProductCard({
  title,
  img,
  price,
  style,
}: ProductCardProps) {
  const [isWishlist, setIsWishlist] = useState(false);

  const handleWishlist = () => {
    setIsWishlist(!isWishlist);
    console.log("Wishlist:", isWishlist);
  };
  return (
    <View style={[styles.card, style]}>
      <View style={styles.imageContainer}>
        {img && <Image source={img} style={styles.image} />}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="gold" />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
        <TouchableOpacity style={styles.buttonHeart} onPress={handleWishlist}>
          <Ionicons
            name={isWishlist ? "heart" : "heart-outline"}
            size={24}
            color={isWishlist ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{price || "₹0.00"}</Text>
          <Text style={styles.priceText}>₹1000</Text>
          <Text style={styles.discountText}>-20% OFF</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title || "Product Name"}
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={styles.button}>
            <Text>ADD TO CART</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#C7C6C6", // Soft light-gray background to pop transparent-bg items
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // avoids stretching item proportions
  },
  infoContainer: {
    padding: 12,
    backgroundColor: "#fff",
    gap: 6,
  },
  title: {
    fontFamily: "SNPro",
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  price: {
    fontFamily: "SNPro",
    fontSize: 15,
    fontWeight: "700",
    color: "#4B5563",
  },
  button: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C7C6C6",
  },
  buttonHeart: {
    position: "absolute",
    right: 10,
    zIndex: 1000,
    bottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    position: "absolute",
    backgroundColor: "#FFFFFFA3",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    left: 10,
    zIndex: 1000,
    bottom: 10,
  },
  ratingText: {
    fontFamily: "SNPro",
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  priceText: {
    fontFamily: "SNPro",
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textDecorationLine: "line-through",
    textDecorationColor: "#4B5563",
    textDecorationStyle: "solid",
  },
  discountText: {
    fontFamily: "SNPro",
    fontSize: 12,
    fontWeight: "600",
    color: "#00B53A",
  },
});
