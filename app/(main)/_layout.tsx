import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MainLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false, animation: "fade", tabBarActiveTintColor: "black", tabBarInactiveTintColor: 'gray' }}>
            <Tabs.Screen 
                name="home" 
                options={{ 
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
                    )
                }} 
            />
            <Tabs.Screen 
                name="ai-studio" 
                options={{ 
                    title: "AI Studio",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "sparkles" : "sparkles-outline"} size={size} color={color} />
                    )
                }} 
            />
            <Tabs.Screen 
                name="profile" 
                options={{ 
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
                    )
                }} 
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "cart" : "cart-outline"} size={size} color={color} />
                    )
                }}
            />
            {/* Hidden screens - accessible via navigation but not shown in tab bar */}
            <Tabs.Screen name="edit-profile" options={{ href: null }} />
            <Tabs.Screen name="my-orders" options={{ href: null }} />
            <Tabs.Screen name="my-address" options={{ href: null }} />
            <Tabs.Screen name="my-wishlist" options={{ href: null }} />
        </Tabs>
    )
}