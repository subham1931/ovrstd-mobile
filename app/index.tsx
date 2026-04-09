import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import LoadingScreen from "../components/LoadingScreen";

export default function Index() {
  const [fontsLoaded] = useFonts({
    SNPro: require('../assets/fonts/SNPro-VariableFont_wght.ttf'),
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const userData = await SecureStore.getItemAsync("userData");

        setTimeout(() => {
          if (token && userData) {
            router.replace("/(main)/home");
          } else {
            router.replace("/(auth)/welcome");
          }
          setIsChecking(false);
        }, 1500);
      } catch (error) {
        console.log("Error checking auth:", error);
        setTimeout(() => {
          router.replace("/(auth)/welcome");
          setIsChecking(false);
        }, 1500);
      }
    };

    checkAuth();
  }, []);

  return <LoadingScreen />;
}