import { CareButtons } from "@/components/CareButtons";
import { PetWidget } from "@/components/PetWidget";
import { StatsCard } from "@/components/StatsCard";
import { useLogger } from "@/hooks/useLogger";
import { PetContext } from "@/providers/PetContext";
import { UserContext } from "@/providers/UserContext";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

// Main home screen displaying pet stats, widget, and care buttons
export default function HomeScreen() {
    const { pet } = useContext(PetContext);
    const { user, loading } = useContext(UserContext);
    const logger = useLogger();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/welcome");
        } else if (!loading && !pet) {
            router.replace("/pet-naming");
        }
    }, [user, pet, loading, router]);

    if (loading || !pet || !user) {
        return null; // Navigation handled by useEffect
    }

    logger.debug("Rendering HomeScreen", {
        petName: pet.name,
        userId: user.id,
    });

    return (
        <View className="flex-1 bg-gradient-to-b from-purple-100 to-white">
            <View className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
                <View className="flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-white">
                        {pet.name}
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="mr-2 text-yellow-300">💰</Text>
                        <Text className="font-bold text-white">
                            {user.emotiCoins}
                        </Text>
                    </View>
                </View>
            </View>
            <ScrollView className="p-4">
                <StatsCard pet={pet} />
                <PetWidget pet={pet} user={user} />
                <CareButtons pet={pet} />
                {/* TODO: Implement talk-to-pet input field with NLP integration */}
            </ScrollView>
        </View>
    );
}
