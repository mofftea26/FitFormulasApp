import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";
import { Calculator, Home, TrendingUp, User } from "lucide-react-native";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ProtectedLayout() {
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");
  const background = useThemeColor({}, "background");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              tabBarIcon: ({ color, size }) => (
                <TabIcon Icon={Home} color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="calculators"
            options={{
              title: "Calculators",
              tabBarIcon: ({ color, size }) => (
                <TabIcon Icon={Calculator} color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="progress"
            options={{
              title: "Progress",
              tabBarIcon: ({ color, size }) => (
                <TabIcon Icon={TrendingUp} color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => (
                <TabIcon Icon={User} color={color} size={size} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

function TabIcon({
  Icon,
  color,
  size,
}: {
  Icon: React.ComponentType<{ color?: string; size?: number }>;
  color: string;
  size: number;
}) {
  return <Icon color={color} size={size} />;
}
