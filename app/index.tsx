import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";


export default function Index() {
  const [fontsLoaded] = useFonts({
    SNPro: require('../assets/fonts/SNPro-VariableFont_wght.ttf'),
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return <LoadingScreen/>;
}