import React, { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { Pet, recordCareAction } from "../models/pet";
import { DiaryContext } from "../providers/DiaryContext";
import { PetContext } from "../providers/PetContext";

// Component for pet care actions (feed, clean, play, rest)
interface CareButtonsProps {
    pet: Pet;
}

export const CareButtons: React.FC<CareButtonsProps> = ({ pet }) => {
    const { updatePet } = useContext(PetContext);
    const { addDiaryEntry } = useContext(DiaryContext);

    const handleCareAction = (
        action: string,
        updateFn: (pet: Pet) => Partial<Pet>
    ) => {
        updatePet((currentPet) => {
            const updatedPet = { ...currentPet, ...updateFn(currentPet) };
            const petWithCare = recordCareAction(
                updatedPet,
                action.toLowerCase()
            );
            addDiaryEntry(`${action} ${pet.name}`, petWithCare.mood);
            return petWithCare;
        });
    };

    return (
        <View className="flex-row justify-around p-4 bg-white shadow-lg rounded-2xl">
            <Pressable
                className="flex-row items-center p-3 bg-red-400 rounded-lg"
                onPress={() =>
                    handleCareAction("Feed", (pet) => ({
                        hunger: Math.min(pet.hunger + 20, 100),
                        energy: Math.max(pet.energy - 10, 0),
                    }))
                }
            >
                <Text className="mr-2 text-white">🍽️</Text>
                <Text className="font-bold text-white">Feed</Text>
            </Pressable>
            <Pressable
                className="flex-row items-center p-3 bg-blue-400 rounded-lg"
                onPress={() =>
                    handleCareAction("Clean", (pet) => ({
                        cleanliness: Math.min(pet.cleanliness + 20, 100),
                        energy: Math.max(pet.energy - 10, 0),
                    }))
                }
            >
                <Text className="mr-2 text-white">🧼</Text>
                <Text className="font-bold text-white">Clean</Text>
            </Pressable>
            <Pressable
                className="flex-row items-center p-3 bg-green-400 rounded-lg"
                onPress={() =>
                    handleCareAction("Play", (pet) => ({
                        happiness: Math.min(pet.happiness + 20, 100),
                        energy: Math.max(pet.energy - 15, 0),
                    }))
                }
            >
                <Text className="mr-2 text-white">🎲</Text>
                <Text className="font-bold text-white">Play</Text>
            </Pressable>
            <Pressable
                className="flex-row items-center p-3 bg-yellow-400 rounded-lg"
                onPress={() =>
                    handleCareAction("Rest", (pet) => ({
                        energy: Math.min(pet.energy + 20, 100),
                    }))
                }
            >
                <Text className="mr-2 text-white">🛏️</Text>
                <Text className="font-bold text-white">Rest</Text>
            </Pressable>
        </View>
    );
};
