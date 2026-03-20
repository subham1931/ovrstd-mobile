import Navbar from "@/components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function Categories(){
    return (
            <SafeAreaView style={style.home}>
                <Navbar />
            </SafeAreaView>
        );
    }
    
    const style = StyleSheet.create({
        home:{
            backgroundColor: '#fff',
            flex: 1,
            padding: 16,
            paddingTop: 0,
        }
    })