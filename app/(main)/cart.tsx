import Navbar from "@/components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CartProduct from "@/components/CartProduct";

const PRODUCTS = [
  {
    title: "Midnight Tee awda adawd awdaw",
    price: 100,
    img: require("@/assets/images/t1p_nobg.png"),
    quantity: 1,
  },

  {
    title: "Vintage Hoodie",
    price: 200,
    img: require("@/assets/images/t2_nobg.png"),
    quantity: 2,
  },
];

export default function cart() {
  const subtotal = PRODUCTS.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <SafeAreaView style={style.home}>
      <Navbar />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.cartContainer}>
          <Text style={style.cartText}>Your Bag</Text>
          <View style={style.cartProducts}>
            {PRODUCTS.map((product, idx) => (
              <CartProduct
                key={idx}
                title={product.title}
                price={product.price}
                img={product.img}
                quantity={product.quantity}
              />
            ))}
          </View>

          <View style={style.cartTotalContainer}>
            <View style={style.cartTotalSubtotalContainer}>
              <View style={style.cartTotalSubtotalTextContainer}>
                <Text style={style.cartTotalText}>SUBTOTAL</Text>
                <Text style={style.cartTotalPrice}>₹{subtotal}</Text>
              </View>
              <View style={style.cartTotalSubtotalTextContainer}>
                <Text style={style.cartTotalText}>SHIPPING</Text>
                <Text style={style.cartTotalPrice}>FREE</Text>
              </View>
            </View>

            <View style={style.cartTotalFinalRow}>
              <Text style={style.cartTotalFinalText}>TOTAL</Text>
              <Text style={style.cartTotalFinalPrice}>₹{total}</Text>
            </View>
            <TouchableOpacity style={style.cartTotalButton}>
              <Text style={style.cartTotalButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.continueShoppingButton}>
              <Text style={style.continueShoppingButtonText}>
                CONTINUE SHOPPING
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  cartContainer: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  cartText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
    marginBottom: 16,
  },
  cartProducts: {
    width: "100%",
    borderRadius: 16,
    // padding: 16,
    gap: 16,
  },
  cartTotalContainer: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cartTotalSubtotalContainer: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#fff",
    // borderWidth: 1,
    borderBottomWidth:0.5,
    borderColor: "#E5E7EB",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartTotalSubtotalTextContainer: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    // backgroundColor: "#fff",
    // borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection:'row',
    justifyContent:"space-between",
    // backgroundColor:"red"
  },

  cartTotalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
  },
  cartTotalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
  },
  cartTotalFinalRow: {
    width: "100%",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor:"red"
  },
  cartTotalFinalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
    
  },
  cartTotalFinalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
    
  },
  cartTotalButton: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cartTotalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "SNPro",
    textAlign: "center",
  },
  continueShoppingButton: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  continueShoppingButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "SNPro",
    textAlign: "center",
  },
});
