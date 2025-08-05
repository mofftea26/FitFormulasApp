import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native";

export default function ProtectedLayout() {
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const background = useThemeColor({}, "background");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tint,
          tabBarInactiveTintColor: icon,
          tabBarStyle: {
            backgroundColor: background,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="person" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="calendar" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="calculators"
          options={{
            title: "Calculators",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="calculator" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
function TabIcon({
  name,
  color,
  size,
}: {
  name: any;
  color: string;
  size: number;
}) {
  return <Ionicons name={name} color={color} size={size} />;
}
