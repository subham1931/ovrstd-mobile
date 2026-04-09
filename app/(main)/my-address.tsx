import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { addAddress, updateAddress, deleteAddress } from "@/api/auth/auth";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

const emptyAddress: Omit<Address, '_id'> = {
  fullName: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  isDefault: false,
};

export default function MyAddress() {
  const router = useRouter();

  const handleBack = () => {
    router.navigate("/(main)/profile");
  };
  const [fontsLoaded] = useFonts({
    'SNPro': require('../../assets/fonts/SNPro-VariableFont_wght.ttf'),
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState(emptyAddress);
  const [error, setError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const useCurrentLocation = async () => {
    setIsGettingLocation(true);
    setError("");
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied. Please enable it in settings.");
        setIsGettingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode) {
        setFormData(prev => ({
          ...prev,
          street: [geocode.streetNumber, geocode.street, geocode.name]
            .filter(Boolean)
            .join(", ") || prev.street,
          city: geocode.city || geocode.subregion || prev.city,
          state: geocode.region || prev.state,
          postalCode: geocode.postalCode || prev.postalCode,
          country: geocode.country || prev.country,
        }));
      } else {
        setError("Could not find address for your location");
      }
    } catch (err) {
      console.log("Location error:", err);
      setError("Failed to get current location. Please try again.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const loadAddresses = useCallback(async () => {
    try {
      const userData = await SecureStore.getItemAsync("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        setAddresses(parsed.address || []);
      }
    } catch (error) {
      console.log("Error loading addresses:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [loadAddresses])
  );

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData(emptyAddress);
    setError("");
    setModalVisible(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setError("");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.postalCode) {
      setError("Please fill all required fields");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      let updatedAddresses: Address[];
      
      if (editingAddress) {
        const response = await updateAddress(editingAddress._id, formData);
        updatedAddresses = response.address || [];
      } else {
        const response = await addAddress(formData);
        updatedAddresses = response.address || [];
      }

      // Update local storage with server response
      const userData = await SecureStore.getItemAsync("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        parsed.address = updatedAddresses;
        await SecureStore.setItemAsync("userData", JSON.stringify(parsed));
        setAddresses(updatedAddresses);
      }

      setModalVisible(false);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (address: Address) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddress(address._id);
              const userData = await SecureStore.getItemAsync("userData");
              if (userData) {
                const parsed = JSON.parse(userData);
                parsed.address = parsed.address.filter((a: Address) => a._id !== address._id);
                await SecureStore.setItemAsync("userData", JSON.stringify(parsed));
                setAddresses(parsed.address);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete address");
            }
          },
        },
      ]
    );
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.nameRow}>
          <Ionicons name="location" size={20} color="#000" />
          <Text style={styles.addressName}>{item.fullName}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionBtn}>
            <Ionicons name="pencil" size={18} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
            <Ionicons name="trash" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.addressPhone}>{item.phone}</Text>
      <Text style={styles.addressText}>
        {item.street}, {item.city}
      </Text>
      <Text style={styles.addressText}>
        {item.state} - {item.postalCode}, {item.country}
      </Text>
    </View>
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
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={80} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>No Addresses</Text>
          <Text style={styles.emptySubtitle}>Add your delivery addresses here</Text>
          <TouchableOpacity style={styles.addNewButton} onPress={openAddModal}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addNewButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingAddress ? "Edit Address" : "Add Address"}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={useCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Ionicons name="location" size={20} color="#000" />
              )}
              <Text style={styles.locationButtonText}>
                {isGettingLocation ? "Getting Location..." : "Use Current Location"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#9CA3AF"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />

            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 14 }]}
              placeholder="House no, Building, Street, Area"
              placeholderTextColor="#9CA3AF"
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
              multiline
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#9CA3AF"
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>State *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor="#9CA3AF"
                  value={formData.state}
                  onChangeText={(text) => setFormData({ ...formData, state: text })}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Postal Code *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="PIN Code"
                  placeholderTextColor="#9CA3AF"
                  value={formData.postalCode}
                  onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  placeholderTextColor="#9CA3AF"
                  value={formData.country}
                  onChangeText={(text) => setFormData({ ...formData, country: text })}
                />
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingAddress ? "Update Address" : "Save Address"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
  },
  addressCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "SNPro",
    color: "#000",
  },
  defaultBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  addressPhone: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "SNPro",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#4B5563",
    fontFamily: "SNPro",
    lineHeight: 20,
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
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
    gap: 8,
  },
  addNewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SNPro",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "SNPro",
    color: "#000",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  label: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "SNPro",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#fff",
    fontFamily: "SNPro",
    fontSize: 16,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    fontFamily: "SNPro",
    textAlign: "center",
    marginTop: 16,
  },
  saveButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    backgroundColor: "#666",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "SNPro",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  locationButtonText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "SNPro",
    color: "#000",
  },
});
