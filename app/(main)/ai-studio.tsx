import Navbar from "@/components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

type DesignMode = "image" | "text" | "ai";
const SHIRT_PREVIEW_URI =
    "https://skream.in/cdn/shop/files/skreamoversizedt-shirtBLACKBACKOSTEE2_977590fd-fb91-4519-bea7-6c387e04f811.webp?v=1740749882&width=1946";

export default function AIStudio() {
    const [designMode, setDesignMode] = useState<DesignMode>("ai");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [designText, setDesignText] = useState("");
    const [aiPrompt, setAiPrompt] = useState("");

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setDesignMode("image");
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        if (designMode === "image") {
            setDesignMode("ai");
        }
    };

    const hasDesign = selectedImage || designText.trim() || aiPrompt.trim();
    const canPlaceOrder = hasDesign;

    return (
        <SafeAreaView style={styles.container}>
            <Navbar />
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* T-Shirt Preview */}
                    <View style={styles.previewSection}>
                        <View style={styles.tshirtContainer}>
                            {selectedImage && (
                                <TouchableOpacity
                                    style={styles.removeImageBtn}
                                    onPress={removeSelectedImage}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name="close" size={18} color="#fff" />
                                </TouchableOpacity>
                            )}
                            <Image
                                source={{ uri: SHIRT_PREVIEW_URI }}
                                style={styles.tshirtImage}
                                resizeMode="contain"
                            />
                            {/* Design Overlay */}
                            <View style={styles.designOverlay}>
                                {selectedImage && designMode === "image" && (
                                    <Image 
                                        source={{ uri: selectedImage }} 
                                        style={styles.designImage}
                                        resizeMode="contain"
                                    />
                                )}
                                {designText && designMode === "text" && (
                                    <Text style={styles.designTextPreview} numberOfLines={3}>
                                        {designText}
                                    </Text>
                                )}
                                {aiPrompt && designMode === "ai" && (
                                    <View style={styles.aiPlaceholder}>
                                        <Ionicons name="sparkles" size={24} color="#fff" />
                                        <Text style={styles.aiPlaceholderText} numberOfLines={2}>
                                            {aiPrompt}
                                        </Text>
                                    </View>
                                )}
                                {!hasDesign && (
                                    <View style={styles.emptyDesign}>
                                        <Ionicons name="add" size={32} color="#666" />
                                        <Text style={styles.emptyDesignText}>Add your design</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Design Options */}
                    <View style={styles.optionsRow}>
                        <TouchableOpacity 
                            style={[styles.optionButton, designMode === "image" && styles.optionButtonActive]}
                            onPress={pickImage}
                        >
                            <Ionicons 
                                name="image-outline" 
                                size={22} 
                                color={designMode === "image" ? "#3B82F6" : "#374151"} 
                            />
                            <Text style={[styles.optionText, designMode === "image" && styles.optionTextActive]}>
                                Add Image
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.optionButton, designMode === "text" && styles.optionButtonActive]}
                            onPress={() => setDesignMode("text")}
                        >
                            <Ionicons 
                                name="text-outline" 
                                size={22} 
                                color={designMode === "text" ? "#3B82F6" : "#374151"} 
                            />
                            <Text style={[styles.optionText, designMode === "text" && styles.optionTextActive]}>
                                Add Text
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.optionButton, designMode === "ai" && styles.optionButtonActive]}
                            onPress={() => setDesignMode("ai")}
                        >
                            <Ionicons 
                                name="sparkles-outline" 
                                size={22} 
                                color={designMode === "ai" ? "#3B82F6" : "#374151"} 
                            />
                            <Text style={[styles.optionText, designMode === "ai" && styles.optionTextActive]}>
                                AI Studio
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Design Input based on mode */}
                    {designMode === "text" && (
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Your Text</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter text for your design..."
                                placeholderTextColor="#9CA3AF"
                                value={designText}
                                onChangeText={setDesignText}
                                multiline
                                numberOfLines={2}
                            />
                        </View>
                    )}

                    {designMode === "ai" && (
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Describe your AI design</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="A cosmic tiger with galaxy patterns..."
                                placeholderTextColor="#9CA3AF"
                                value={aiPrompt}
                                onChangeText={setAiPrompt}
                                multiline
                                numberOfLines={2}
                            />
                            <TouchableOpacity style={styles.generateBtn}>
                                <Ionicons name="sparkles" size={18} color="#fff" />
                                <Text style={styles.generateBtnText}>Generate with AI</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Price Info */}
                    <View style={styles.priceCard}>
                        <View>
                            <Text style={styles.priceLabel}>Custom Oversized Tee</Text>
                            <Text style={styles.priceSubtext}>Premium cotton • Black</Text>
                        </View>
                        <Text style={styles.price}>₹999</Text>
                    </View>

                    {/* Place Order Button */}
                    <TouchableOpacity 
                        style={[styles.orderButton, !canPlaceOrder && styles.orderButtonDisabled]}
                        disabled={!canPlaceOrder}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.orderButtonText}>Place Order</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        padding: 16,
        paddingTop: 0,
    },
    content: {
        paddingBottom: 30,
    },
    previewSection: {
        width: "100%",
        height: width - 24,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
        backgroundColor: "#ECECEC",
        borderRadius: 14,
        overflow: "hidden",
    },
    tshirtContainer: {
        width: "100%",
        height: "100%",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    removeImageBtn: {
        position: "absolute",
        top: 14,
        right: 14,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "rgba(17,24,39,0.85)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    tshirtImage: {
        width: "92%",
        height: "92%",
    },
    designOverlay: {
        position: "absolute",
        width: "28%",
        height: "28%",
        top: "36%",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
    },
    designImage: {
        width: "100%",
        height: "100%",
    },
    designTextPreview: {
        fontSize: 14,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        fontFamily: "SNPro",
    },
    aiPlaceholder: {
        width: "100%",
        minHeight: 90,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        gap: 4,
    },
    aiPlaceholderText: {
        fontSize: 12,
        color: "#fff",
        fontFamily: "SNPro",
        fontWeight: "600",
        textAlign: "center",
    },
    emptyDesign: {
        alignItems: "center",
        justifyContent: "center",
        width: 120,
        height: 120,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#535353",
        borderStyle: "dashed",
    },
    emptyDesignText: {
        fontSize: 10,
        color: "#666",
        fontFamily: "SNPro",
        marginTop: 4,
    },
    optionsRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
    optionButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        gap: 6,
    },
    optionButtonActive: {
        backgroundColor: "#EFF6FF",
        borderWidth: 1,
        borderColor: "#3B82F6",
    },
    optionText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#374151",
        fontFamily: "SNPro",
    },
    optionTextActive: {
        color: "#3B82F6",
    },
    inputSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        fontFamily: "SNPro",
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 14,
        fontSize: 15,
        fontFamily: "SNPro",
        color: "#000",
        minHeight: 80,
        textAlignVertical: "top",
    },
    generateBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#3B82F6",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
    },
    generateBtnText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
        fontFamily: "SNPro",
    },
    priceCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        padding: 16,
        borderRadius: 14,
        marginBottom: 16,
        marginTop: 8,
    },
    priceLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: "#000",
        fontFamily: "SNPro",
    },
    priceSubtext: {
        fontSize: 12,
        color: "#6B7280",
        fontFamily: "SNPro",
        marginTop: 2,
    },
    price: {
        fontSize: 22,
        fontWeight: "800",
        color: "#000",
        fontFamily: "SNPro",
    },
    orderButton: {
        backgroundColor: "#000",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
    },
    orderButtonDisabled: {
        backgroundColor: "#9CA3AF",
    },
    orderButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
        fontFamily: "SNPro",
    },
});
