import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useLogger } from "../hooks/useLogger";
import { PetContext } from "../providers/PetContext";
import { UserContext } from "../providers/UserContext";

export default function PetNamingScreen() {
    const [petName, setPetName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { setPet } = useContext(PetContext);
    const { updatePetName } = useContext(UserContext);
    const router = useRouter();
    const logger = useLogger();

    const validatePetName = () => {
        if (!petName.trim()) {
            setError("Pet name is required");
            return false;
        }
        if (petName.length < 2) {
            setError("Pet name must be at least 2 characters");
            return false;
        }
        if (petName.length > 20) {
            setError("Pet name must be less than 20 characters");
            return false;
        }
        return true;
    };

    const handlePetCreation = async () => {
        logger.debug("Attempting to create pet", { petName });
        if (!validatePetName()) {
            logger.warn("Pet name validation failed", { error });
            return;
        }

        try {
            const now = new Date();
            const newPet = {
                name: petName.trim(),
                hunger: 50,
                happiness: 50,
                cleanliness: 50,
                energy: 50,
                evolutionStage: 0,
                mood: "neutral",
                lastUpdated: now,
                careCount: 0,
                createdAt: now,
            };
            setPet(newPet);
            const error = await updatePetName(petName.trim());
            if (!error) {
                logger.info("Pet created and user updated", { petName });
                router.replace("/(tabs)");
            } else {
                setError(error);
                logger.warn("Failed to update pet name", { error });
            }
        } catch (e) {
            setError("Unexpected error occurred");
            logger.error("Error creating pet", { error: e });
        }
    };

    return (
        <View className="items-center justify-center flex-1 bg-gradient-to-b from-purple-100 to-white">
            <View className="bg-white p-6 rounded-2xl shadow-lg w-[420px] max-w-[90%]">
                <Text className="text-2xl font-bold text-center text-purple-800">
                    Name Your Pet
                </Text>
                <TextInput
                    className="p-3 mt-6 bg-gray-100 border border-gray-300 rounded-lg"
                    placeholder="Pet Name"
                    value={petName}
                    onChangeText={setPetName}
                />
                {error && <Text className="mt-3 text-red-400">{error}</Text>}
                <Pressable
                    className="p-4 mt-6 bg-purple-600 rounded-lg"
                    onPress={handlePetCreation}
                >
                    <Text className="font-bold text-center text-white">
                        Start Caring!
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
