import Navbar from "@/components/Navbar";
import { HeaderButton } from "@react-navigation/elements";
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";

const Images = [
    require('@/assets/images/t1p_nobg.png'),
    require('@/assets/images/t2_nobg.png'),
    require('@/assets/images/t3_nobg.png'),
    require('@/assets/images/t4_nobg.png'),
    require('@/assets/images/t5_nobg.png'),
];

const DATA = Array(1000).fill(Images).flat();

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
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    home: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 16,
        paddingTop: 0,
    },
    addContainer: {
        backgroundColor: '#C7C6C6',
        width: '100%',
        height: '70%',
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
    }
})