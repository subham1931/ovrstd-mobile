import React, { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useFonts } from "expo-font";

const TAGLINE_DELAY_MS = 1000;
const TAGLINE_ANIM_MS = 1000;
const TAGLINE_SLIDE_FROM = 28;

export default function LoadingScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(TAGLINE_SLIDE_FROM)).current;
  const [fontsLoaded] = useFonts({
    SNPro: require('../assets/fonts/SNPro-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [fontsLoaded, progress]);

  useEffect(() => {
    if (!fontsLoaded) return;
    const enter = Animated.sequence([
      Animated.delay(TAGLINE_DELAY_MS),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: TAGLINE_ANIM_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: TAGLINE_ANIM_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);
    enter.start();
    return () => enter.stop();
  }, [fontsLoaded, taglineOpacity, taglineTranslateY]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <Text style={[styles.text, styles.title]}>OVRSTD</Text>
        <Animated.Text
          style={[
            styles.text,
            styles.tagline,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          Elevate your look with premium oversized streetwear and comfort style.
        </Animated.Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    fontFamily: "SNPro",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  tagline: {
    fontFamily: "SNPro",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 1.5,
    color: "#aaaaaa",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 12,
  },
  progressSection: {
    paddingHorizontal: 32,
    paddingBottom: 36,
    alignItems: "center",
  },
  progressTrack: {
    height: 4,
    width: "40%",
    backgroundColor: "#222",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
});