import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

interface Order {
  _id: string;
  orderNumber?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items?: any[];
}

interface User {
  _id: string;
  orders?: Order[];
}

export default function MyOrders() {
  const router = useRouter();

  const handleBack = () => {
    router.navigate("/(main)/profile");
  };
  const [fontsLoaded] = useFonts({
    'SNPro': require('../../assets/fonts/SNPro-VariableFont_wght.ttf'),
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userData = await SecureStore.getItemAsync("userData");
        if (userData) {
          const parsed = JSON.parse(userData);
          setOrders(parsed.orders || []);
        }
      } catch (error) {
        console.log("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#10B981';
      case 'shipped': return '#3B82F6';
      case 'processing': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item._id?.slice(-8).toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status || 'Pending'}
          </Text>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.orderAmount}>₹{item.totalAmount?.toFixed(2) || '0.00'}</Text>
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.itemCount}>{item.items?.length || 0} items</Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={80} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push("/(main)/home")}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id}
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
  listContent: {
    padding: 20,
    gap: 16,
  },
  orderCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "SNPro",
    color: "#000",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "SNPro",
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "SNPro",
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    fontFamily: "SNPro",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  itemCount: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "SNPro",
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
