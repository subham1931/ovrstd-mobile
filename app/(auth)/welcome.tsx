import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";

const IMAGES = [
    "https://skream.in/cdn/shop/files/skreamoversizedt-shirtBLACKBACKOSTEE2_977590fd-fb91-4519-bea7-6c387e04f811.webp?v=1740749882&width=1946",
    "https://skream.in/cdn/shop/files/skreamoversizedt-shirtBLACKBACKOSTEE2_977590fd-fb91-4519-bea7-6c387e04f811.webp?v=1740749882&width=1946",
    "https://skream.in/cdn/shop/files/skreamoversizedt-shirtBLACKBACKOSTEE2_977590fd-fb91-4519-bea7-6c387e04f811.webp?v=1740749882&width=1946",
    "https://skream.in/cdn/shop/files/skreamoversizedt-shirtBLACKBACKOSTEE2_977590fd-fb91-4519-bea7-6c387e04f811.webp?v=1740749882&width=1946",
];

const DATA = Array(1000).fill(IMAGES).flat();

export default function Welcome() {
    const router = useRouter();
    const { width, height } = Dimensions.get('window');
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(IMAGES.length * 500);
    const intervalRef = useRef<any>(null);

    const [fontsLoaded] = useFonts({
        'SNPro': require('../../assets/fonts/SNPro-VariableFont_wght.ttf'),
    });

    const startAutoPlay = () => {
        stopAutoPlay();
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;
                flatListRef.current?.scrollToIndex({ index: next, animated: true });
                return next;
            });
        }, 3000);
    };

    const stopAutoPlay = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, []);

    const renderItem = ({ item }: { item: string }) => (
        <View style={{ width, height }}>
            <Image source={{ uri: item }} style={{ width: "100%", height: "90%" }} resizeMode="cover" />
        </View>
    );

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ref={flatListRef}
                data={DATA}
                renderItem={renderItem}
                initialScrollIndex={IMAGES.length * 500}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
                onScrollBeginDrag={stopAutoPlay}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                    startAutoPlay();
                }}
            />
            <View style={{ 
                position: "absolute", 
                bottom: 0, 
                width: "100%", 
                backgroundColor: "rgba(0, 0, 0, 0.9)", 
                height: "28%", 
                borderTopLeftRadius: 35, 
                borderTopRightRadius: 35, 
                padding: 24,
                justifyContent: "space-between",
                alignItems: "center",
             }}>
                <View style={{ alignItems: "center", marginTop: 10 }}>
                    <Text style={{ fontSize: 36, fontWeight: "900", color: "#ffffff", fontFamily: "SNPro", letterSpacing: 1.5 }}>OVRSTD</Text>
                    <Text style={{ fontSize: 15, color: "#aaaaaa", fontFamily: "SNPro", marginTop: 8, textAlign: "center", paddingHorizontal: 20 }}>Elevate your look with premium oversized streetwear and comfort style.</Text>
                </View>

                <TouchableOpacity 
                    onPress={() => router.push("/login")}
                    style={{ 
                        width: "100%", 
                        backgroundColor: "#ffffff", 
                        height: 56, 
                        borderRadius: 18, 
                        justifyContent: "center", 
                        alignItems: "center",
                        marginBottom: 10
                    }}
                >
                    <Text style={{ color: "#000", fontSize: 18, fontWeight: "800", fontFamily: "SNPro" }}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}