import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface CartProductProps {
  title: string;
  price: number;
  img: ImageSourcePropType;
  quantity: number;
}

export default function CartProduct({
  title,
  price,
  img,
  quantity,
}: CartProductProps) {
  return (
    <View style={style.cartProduct}>
      <View style={style.cartProductImage}>
        <Image source={img} style={{ width: 100, height: 100 }} />
      </View>

      <View style={style.cartProductInfo}>
        <View style={style.cartProductTitleContainer}>
          <Text style={style.cartProductTitleText}>{title}</Text>
          <Text style={style.cartProductPriceText}>₹{price}</Text>
        </View>
        <View style={style.cartProductQuantityAndRemoveContainer}>
        <View style={style.cartProductQuantityContainer}>
          <TouchableOpacity>
            <Text>+</Text>
          </TouchableOpacity>
          <Text style={style.cartProductQuantityText}>{quantity}</Text>
          <TouchableOpacity>
            <Text>-</Text>
          </TouchableOpacity>
        </View>

        <View style={style.cartProductRemoveContainer}>
          <TouchableOpacity>
            <Text style={style.cartProductRemoveText}>Remove</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  cartProduct: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cartProductImage: {
    width: 130,
    height: 180,
    borderRadius: 16,
    backgroundColor: "#C7C6C6",
    justifyContent: "center",
    alignItems: "center",
  },
  cartProductTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cartProductPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cartProductQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cartProductInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: "column",
    gap: 16,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    padding: 12,
  },
  cartProductTitleContainer: {
    width: "100%",
    // display: 'flex',
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  cartProductTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
  },
  cartProductPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
  },
  cartProductQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    width: 100,
    justifyContent: "space-between",
  },
  cartProductQuantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
  },
  cartProductRemoveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  cartProductRemoveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
  },
  cartProductQuantityAndRemoveContainer: {
    // backgroundColor: "red",
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
