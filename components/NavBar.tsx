import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

// Custom bottom navigation bar
export const NavBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const tabs = [
    { name: 'index', label: 'Home', icon: '🐾' },
    { name: 'shop', label: 'Shop', icon: '🛒' },
    { name: 'profile', label: 'Profile', icon: '👤' },
    { name: 'diary', label: 'Diary', icon: '📖' },
  ];

  return (
    <View className="flex-row bg-white p-3 border-t border-gray-200">
      {tabs.map((tab, index) => (
        <Pressable
          key={tab.name}
          className={`flex-1 items-center p-2 ${state.index === index ? 'bg-blue-100' : ''}`}
          onPress={() => navigation.navigate(tab.name)}
        >
          <Text className={`text-lg ${state.index === index ? 'text-blue-500' : 'text-gray-500'}`}>
            {tab.icon}
          </Text>
          <Text className={`text-sm ${state.index === index ? 'text-blue-500' : 'text-gray-500'}`}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};