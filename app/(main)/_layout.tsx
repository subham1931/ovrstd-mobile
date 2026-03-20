import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MainLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false, animation: "fade",tabBarActiveTintColor:"black",tabBarInactiveTintColor:'gray' }}>
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
                name="categories" 
                options={{ 
                    title: "Categories",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "grid" : "grid-outline"} size={size} color={color} />
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
            }}/>
        </Tabs>
    )
}