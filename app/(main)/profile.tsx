import Navbar from "@/components/Navbar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function profile(){
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