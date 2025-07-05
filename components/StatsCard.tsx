import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pet } from '../models/pet';

// Component to display pet stats with progress bars
interface StatsCardProps {
  pet: Pet;
}

export const StatsCard: React.FC<StatsCardProps> = ({ pet }) => {
  const stats = [
    { label: 'Hunger', value: pet.hunger, color: '#f87171' },
    { label: 'Happiness', value: pet.happiness, color: '#4ade80' },
    { label: 'Cleanliness', value: pet.cleanliness, color: '#60a5fa' },
    { label: 'Energy', value: pet.energy, color: '#facc15' },
  ];

  return (
    <View className="p-4 bg-white shadow-lg rounded-2xl">
      <Text className="text-xl font-bold text-purple-800">Pet Stats</Text>
      {stats.map((stat) => (
        <View key={stat.label} className="flex-row items-center mt-2">
          <Text className="flex-1 font-semibold text-gray-800">{stat.label}</Text>
          <View className="h-2 bg-gray-200 rounded-full flex-2">
            <View
              style={[styles.progressBar, { width: `${stat.value}%`, backgroundColor: stat.color }]}
            />
          </View>
          <Text className="ml-2 text-gray-600">{stat.value}%</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: '100%',
    borderRadius: 9999,
  },
});