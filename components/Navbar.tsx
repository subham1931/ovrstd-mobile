import { View, Text, StyleSheet } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useFonts } from "expo-font"

export default function Navbar() {
    const [fontsLoaded] = useFonts({
        'SNPro': require('../assets/fonts/SNPro-VariableFont_wght.ttf'),
    });
    return (
        <View style={style.nav}>
            <View style={{flexDirection: 'row',alignItems: 'center',gap: 8}}>
                <Text style={{ fontSize: 32, fontWeight: 'bold',fontFamily:"SNPro",letterSpacing:1 }}>Ovrstd</Text>
                <Ionicons name="shirt" size={24} color="black" />
            </View>

            <View>
                <Feather name="search" size={24} color="black" />
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        // backgroundColor: '#582424ff',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        
    }
})