import React from 'react';
import { Image, Text, View } from 'react-native';
import { Pet } from '../models/pet';
import { AppUser } from '../models/user';

// Component to display the pet's animation and status
interface PetWidgetProps {
  pet: Pet;
  user: AppUser;
}

export const PetWidget: React.FC<PetWidgetProps> = ({ pet, user }) => {
  return (
    <View className="p-4 bg-white shadow-lg rounded-2xl">
      {/* TODO: Replace with Lottie animation for pet */}
      <Image
        source={{ uri: 'https://via.placeholder.com/200' }}
        className="w-48 h-48 mx-auto"
      />
      <Text className="text-2xl font-bold text-center text-purple-800">{pet.name}</Text>
      <Text className="mt-2 text-lg text-center text-gray-800">
        Mood: {pet.mood}
      </Text>
    </View>
  );
};