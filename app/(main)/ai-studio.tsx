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

export default function AIStudio() {
    const [designMode, setDesignMode] = useState<DesignMode>("ai");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [designText, setDesignText] = useState("");
    const [aiPrompt, setAiPrompt] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

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

    const hasDesign = selectedImage || designText.trim() || aiPrompt.trim();
    const canPlaceOrder = hasDesign && title.trim();

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
                            {/* Black T-Shirt SVG Representation */}
                            <View style={styles.tshirtShape}>
                                <View style={styles.tshirtNeck} />
                                <View style={styles.tshirtBody}>
                                    <View style={styles.tshirtSleeveLeft} />
                                    <View style={styles.tshirtSleeveRight} />
                                </View>
                            </View>
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
                                        <Text style={styles.aiPlaceholderText}>AI Design</Text>
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

                    {/* Title & Description */}
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.singleInput}
                            placeholder="Give your design a name"
                            placeholderTextColor="#9CA3AF"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Describe your custom t-shirt..."
                            placeholderTextColor="#9CA3AF"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

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
        alignItems: "center",
        marginVertical: 16,
    },
    tshirtContainer: {
        width: width - 80,
        height: width - 80,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    tshirtShape: {
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    tshirtNeck: {
        width: 50,
        height: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: "#F5F5F5",
        marginTop: 10,
    },
    tshirtBody: {
        width: "85%",
        height: "75%",
        backgroundColor: "#1a1a1a",
        borderRadius: 8,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -10,
        position: "relative",
    },
    tshirtSleeveLeft: {
        position: "absolute",
        left: -30,
        top: 0,
        width: 50,
        height: 60,
        backgroundColor: "#1a1a1a",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        transform: [{ rotate: "-20deg" }],
    },
    tshirtSleeveRight: {
        position: "absolute",
        right: -30,
        top: 0,
        width: 50,
        height: 60,
        backgroundColor: "#1a1a1a",
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        transform: [{ rotate: "20deg" }],
    },
    designOverlay: {
        position: "absolute",
        width: 120,
        height: 140,
        top: "28%",
        justifyContent: "center",
        alignItems: "center",
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
        alignItems: "center",
        gap: 4,
    },
    aiPlaceholderText: {
        fontSize: 12,
        color: "#fff",
        fontFamily: "SNPro",
        fontWeight: "600",
    },
    emptyDesign: {
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#444",
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
    singleInput: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 14,
        fontSize: 15,
        fontFamily: "SNPro",
        color: "#000",
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
