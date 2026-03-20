import { View, Image, Text, ImageSourcePropType, StyleProp, ViewStyle, StyleSheet } from "react-native";

interface ProductCardProps {
    title?: string;
    img?: ImageSourcePropType;
    price?: string;
    style?: StyleProp<ViewStyle>;
}

export default function ProductCard({ title, img, price, style }: ProductCardProps) {
    return (
        <View style={[styles.card, style]}>
            <View style={styles.imageContainer}>
                {img && <Image source={img} style={styles.image} />}
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {title || "Product Name"}
                </Text>
                <Text style={styles.price}>
                    {price || "$0.00"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#C7C6C6', // Soft light-gray background to pop transparent-bg items
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // avoids stretching item proportions
    },
    infoContainer: {
        padding: 12,
        backgroundColor: '#fff',
    },
    title: {
        fontFamily: 'SNPro',
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    price: {
        fontFamily: 'SNPro',
        fontSize: 15,
        fontWeight: '700',
        color: '#4B5563',
    },
});