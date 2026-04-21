import Navbar from "@/components/Navbar";
import CartProduct from "@/components/CartProduct";
import {
  addToCart as addToCartApi,
  getCart as fetchCartApi,
  removeFromCart as removeFromCartApi,
} from "@/api/auth/auth";
import { BASE_URL } from "@/api/config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageSourcePropType,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

const PLACEHOLDER_IMG = require("@/assets/images/t1p_nobg.png");

type CartLine = {
  id: string;
  title: string;
  price: number;
  img: ImageSourcePropType;
  quantity: number;
  size: string;
  availableSizes: string[];
};

type ApiCartProduct = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  sizes?: { size: string; stock: number }[];
};

type ApiCartLine = {
  product: ApiCartProduct | null;
  quantity: number;
};

function resolveProductImage(url?: string): ImageSourcePropType {
  if (!url) return PLACEHOLDER_IMG;
  if (url.startsWith("http")) return { uri: url };
  const base = BASE_URL.replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return { uri: `${base}${path}` };
}

function mapCartLine(line: ApiCartLine): CartLine | null {
  const p = line.product;
  if (!p?._id) return null;
  const defaultSize =
    p.sizes?.find((s) => s.stock > 0)?.size ??
    p.sizes?.[0]?.size ??
    "M";
  const availableSizes = p.sizes?.map((s) => s.size) ?? [];
  return {
    id: p._id,
    title: p.name,
    price: Number(p.price) || 0,
    img: resolveProductImage(p.images?.[0]),
    quantity: line.quantity,
    size: defaultSize,
    availableSizes,
  };
}

function formatRupee(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Cart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<CartLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadCart = useCallback(async (fromRefresh = false) => {
    setError(null);
    if (fromRefresh) setRefreshing(true);

    const token = await SecureStore.getItemAsync("authToken");
    if (!token) {
      setNeedsAuth(true);
      setItems([]);
      setIsLoading(false);
      setRefreshing(false);
      return;
    }

    setNeedsAuth(false);
    try {
      const data = await fetchCartApi();
      const lines = (data.cart as ApiCartLine[] | undefined)
        ?.map(mapCartLine)
        .filter((x): x is CartLine => x != null) ?? [];
      setItems(lines);
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        setNeedsAuth(true);
        setItems([]);
      } else {
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Could not load your bag.";
        setError(msg);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  const subtotal = useMemo(
    () => items.reduce((acc, p) => acc + p.price * p.quantity, 0),
    [items]
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const showEmptyBag = !needsAuth && items.length === 0;
  const windowHeight = Dimensions.get("window").height;

  const setSize = useCallback((id: string, size: string) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, size } : p))
    );
  }, []);

  const setQuantity = useCallback(
    async (productId: string, prevQty: number, nextQty: number) => {
      if (nextQty === prevQty || nextQty < 1) return;
      setBusyId(productId);
      try {
        if (nextQty > prevQty) {
          await addToCartApi(productId, nextQty - prevQty);
        } else {
          await removeFromCartApi(productId);
          if (nextQty > 0) {
            await addToCartApi(productId, nextQty);
          }
        }
        await loadCart();
      } catch {
        setError("Could not update quantity. Try again.");
      } finally {
        setBusyId(null);
      }
    },
    [loadCart]
  );

  const removeLine = useCallback(
    async (productId: string) => {
      setBusyId(productId);
      try {
        await removeFromCartApi(productId);
        await loadCart();
      } catch {
        setError("Could not remove item. Try again.");
      } finally {
        setBusyId(null);
      }
    },
    [loadCart]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Navbar />
        <View style={styles.loadingBody}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Navbar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          showEmptyBag && styles.scrollContentGrow,
          showEmptyBag && { paddingBottom: Math.max(32, insets.bottom + 56) },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadCart(true)}
            tintColor="#111827"
          />
        }
      >
        {!showEmptyBag ? (
          <Text style={styles.heading}>Your bag</Text>
        ) : null}
        {(needsAuth || items.length > 0) && (
          <Text style={styles.subheading}>
            {needsAuth
              ? "Sign in to see your bag"
              : `${items.length} item${items.length === 1 ? "" : "s"}`}
          </Text>
        )}

        {error ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{error}</Text>
            <TouchableOpacity onPress={() => loadCart()} activeOpacity={0.85}>
              <Text style={styles.bannerAction}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {needsAuth ? (
          <TouchableOpacity
            style={styles.emptyCta}
            activeOpacity={0.85}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.emptyCtaText}>Sign in</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.list}>
          {items.map((product) => (
            <CartProduct
              key={product.id}
              title={product.title}
              price={product.price}
              img={product.img}
              quantity={product.quantity}
              size={product.size}
              availableSizes={
                product.availableSizes.length > 0
                  ? product.availableSizes
                  : undefined
              }
              onQuantityChange={(q) =>
                setQuantity(product.id, product.quantity, q)
              }
              onSizeChange={(s) => setSize(product.id, s)}
              onRemove={() => removeLine(product.id)}
            />
          ))}
        </View>

        {busyId ? (
          <View style={styles.inlineBusy}>
            <ActivityIndicator size="small" color="#111827" />
          </View>
        ) : null}

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

        {showEmptyBag && (
          <View
            style={[
              styles.emptyState,
              { minHeight: Math.max(320, windowHeight * 0.48) },
            ]}
          >
            <View style={styles.emptyIconWrap}>
              <Ionicons name="bag-outline" size={72} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>Your bag is empty</Text>
            <Text style={styles.emptySubtitle}>
              When you add products, they will show up here. Start exploring the
              store.
            </Text>
            <TouchableOpacity
              style={[styles.emptyCta, styles.emptyBrowseBtn]}
              activeOpacity={0.85}
              onPress={() => router.push("/(main)/home")}
            >
              <Text style={styles.emptyCtaText}>Browse products</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  loadingBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    color: "#991B1B",
    fontFamily: "SNPro",
  },
  bannerAction: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "SNPro",
  },
  inlineBusy: {
    paddingVertical: 8,
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  scrollContentGrow: {
    flexGrow: 1,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    fontFamily: "SNPro",
    textAlign: "center",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    fontFamily: "SNPro",
    textAlign: "center",
    marginTop: 10,
    maxWidth: 300,
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
    alignSelf: "stretch",
  },
  emptyBrowseBtn: {
    alignSelf: "stretch",
    width: "100%",
    marginTop: 28,
  },
  emptyCtaText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    fontFamily: "SNPro",
  },
});
