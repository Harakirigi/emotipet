import { NavBar } from '@/components/NavBar';
import { Tabs } from 'expo-router';

// Tab layout for the main app screens
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <NavBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="diary" options={{ title: 'Diary' }} />
    </Tabs>
  );
}