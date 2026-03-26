import Navbar from "@/components/Navbar";
import CartProduct from "@/components/CartProduct";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CartLine = {
  id: string;
  title: string;
  price: number;
  img: ImageSourcePropType;
  quantity: number;
  size: string;
};

const INITIAL_ITEMS: CartLine[] = [
  {
    id: "1",
    title: "Midnight Tee",
    price: 1299,
    img: require("@/assets/images/t1p_nobg.png"),
    quantity: 1,
    size: "M",
  },
  {
    id: "2",
    title: "Vintage Hoodie",
    price: 2499,
    img: require("@/assets/images/t2_nobg.png"),
    quantity: 2,
    size: "L",
  },
];

function formatRupee(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Cart() {
  const router = useRouter();
  const [items, setItems] = useState<CartLine[]>(INITIAL_ITEMS);

  const subtotal = useMemo(
    () => items.reduce((acc, p) => acc + p.price * p.quantity, 0),
    [items]
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  }, []);

  const setSize = useCallback((id: string, size: string) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, size } : p))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <Navbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>Your bag</Text>
        <Text style={styles.subheading}>
          {items.length === 0
            ? "Your bag is empty"
            : `${items.length} item${items.length === 1 ? "" : "s"}`}
        </Text>

        <View style={styles.list}>
          {items.map((product) => (
            <CartProduct
              key={product.id}
              title={product.title}
              price={product.price}
              img={product.img}
              quantity={product.quantity}
              size={product.size}
              onQuantityChange={(q) => setQuantity(product.id, q)}
              onSizeChange={(s) => setSize(product.id, s)}
              onRemove={() => remove(product.id)}
            />
          ))}
        </View>

        {items.length > 0 && (
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatRupee(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValueMuted}>FREE</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRowTotal}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatRupee(total)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85}>
              <Text style={styles.checkoutBtnText}>Proceed to checkout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.85}
              onPress={() => router.push("/(main)/home")}
            >
              <Text style={styles.secondaryBtnText}>Continue shopping</Text>
            </TouchableOpacity>
          </View>
        )}

        {items.length === 0 && (
          <TouchableOpacity
            style={styles.emptyCta}
            activeOpacity={0.85}
            onPress={() => router.push("/(main)/home")}
          >
            <Text style={styles.emptyCtaText}>Browse products</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    fontFamily: "SNPro",
    letterSpacing: -0.5,
    marginTop: 8,
  },
  subheading: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "SNPro",
    marginTop: 4,
    marginBottom: 20,
  },
  list: {
    gap: 14,
  },
  summary: {
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
    fontFamily: "SNPro",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "SNPro",
  },
  summaryValueMuted: {
    fontSize: 15,
    fontWeight: "700",
    color: "#059669",
    fontFamily: "SNPro",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  summaryRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    fontFamily: "SNPro",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    fontFamily: "SNPro",
  },
  checkoutBtn: {
    marginTop: 16,
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    fontFamily: "SNPro",
  },
  secondaryBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#111827",
    backgroundColor: "#fff",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "SNPro",
  },
  emptyCta: {
    marginTop: 24,
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyCtaText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    fontFamily: "SNPro",
  },
});
