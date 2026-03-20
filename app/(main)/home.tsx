import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Images = [
    require('@/assets/images/t1p_nobg.png'),
    require('@/assets/images/t2_nobg.png'),
    require('@/assets/images/t3_nobg.png'),
    require('@/assets/images/t4_nobg.png'),
    require('@/assets/images/t5_nobg.png'),
];

const DATA = Array(1000).fill(Images).flat();

const PRODUCTS = [
    { title: "Midnight Tee", price: "₹1,299", img: Images[0] },
    { title: "Vintage Hoodie", price: "₹2,499", img: Images[1] },
    { title: "Night Joggers", price: "₹1,999", img: Images[2] },
    { title: "Sleek Cap", price: "₹799", img: Images[3] },
    { title: "Retro Kicks", price: "₹4,999", img: Images[4] },
    { title: "Overstd Jacket", price: "₹3,999", img: Images[0] },
    { title: "Carbon Pants", price: "₹1,799", img: Images[1] },
    { title: "Slate Cap", price: "₹899", img: Images[2] },
];

export default function home() {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(Images.length * 500);
    const intervalRef = useRef<any>(null);
    const [containerWidth, setContainerWidth] = useState(0);

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
        if (containerWidth > 0) {
            startAutoPlay();
        }
        return () => stopAutoPlay();
    }, [containerWidth]);

    return (
        <SafeAreaView style={style.home}>
            <Navbar />

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={style.addContainer}>
                    <View
                        style={style.imageContainer}
                        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                    >
                        {containerWidth > 0 && (
                            <FlatList
                                ref={flatListRef}
                                data={DATA}
                                renderItem={({ item }) => (
                                    <View style={{ width: containerWidth }}>
                                        <Image source={item} style={style.addImage} />
                                    </View>
                                )}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(_, index) => index.toString()}
                                getItemLayout={(_, index) => ({ length: containerWidth, offset: containerWidth * index, index })}
                                initialScrollIndex={Images.length * 500}
                                onScrollBeginDrag={stopAutoPlay}
                                onMomentumScrollEnd={(e) => {
                                    const index = Math.round(e.nativeEvent.contentOffset.x / containerWidth);
                                    setCurrentIndex(index);
                                    startAutoPlay();
                                }}
                            />
                        )}
                    </View>

                    <View style={style.shopContainer}>
                        <View style={style.shopTextContainer}>
                            <Text style={style.shopText1}>
                                THE MIDNIGHT
                            </Text>
                            <Text style={style.shopText2}>
                                SERIES
                            </Text>
                        </View>
                        <TouchableOpacity style={style.addButton}>
                            <Text>Shop Collection</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={style.newArrivalsContainer}>
                    <View style={style.newArrivalsHeader}>
                        <Text style={style.newArrivalsText}>New Arrivals</Text>
                    </View>

                    <View style={style.newArrivalsList}>
                        {PRODUCTS.map((product, index) => (
                            <ProductCard key={index} title={product.title} price={product.price} img={product.img} style={{ width: '48%',height:"auto", marginBottom: 16 }} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    home: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 0,
    },
    addContainer: {
        backgroundColor: '#C7C6C6',
        width: '100%',
        height: 480,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imageContainer: {
        // backgroundColor: '#420505ff',
        width: '100%',
        height: '100%',
        overflow: "visible",
    },
    addImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    shopContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,

        width: '100%',
        height: '50%',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    shopTextContainer: {
        // backgroundColor: '#fff',
        width: '100%',
        height: '50%',
        borderRadius: 16,
        // padding: 16,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    shopText1: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'SNPro',
    },
    shopText2: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        // fontFamily: 'SNPro',
    },
    addButton: {
        backgroundColor: '#fff',
        width: '70%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newArrivalsContainer: {
        width: '100%',
        borderRadius: 16,
        // padding: 12,
        alignItems: 'center',
    },
    newArrivalsHeader: {
        width: '100%',
        paddingVertical: 16,
        alignItems: 'flex-start',
    },
    newArrivalsText: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'SNPro',
    },
    newArrivalsList: {
        // backgroundColor: '#C7C6C6',
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderRadius: 16,
    },
})