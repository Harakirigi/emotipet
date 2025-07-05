import { useLogger } from "@/hooks/useLogger";
import { Pet, checkEvolution, decayStats } from "@/models/pet";
import { UserContext } from "@/providers/UserContext";
import { StorageService } from "@/services/storageService";
import React, { createContext, useContext, useEffect, useState } from "react";

// Context for managing pet state
interface PetContextType {
    pet: Pet | null;
    setPet: (pet: Pet | null) => void;
    updatePet: (updateFn: (pet: Pet) => Partial<Pet>) => void;
}

export const PetContext = createContext<PetContextType>({
    pet: null,
    setPet: () => {},
    updatePet: () => {},
});

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [pet, setPet] = useState<Pet | null>(null);
    const logger = useLogger();
    const storageService = new StorageService(logger);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const loadPet = async () => {
            if (!user) {
                logger.debug("No user, skipping pet load");
                setPet(null);
                return;
            }
            const cloudPet = await storageService.loadPetFromCloud(user.id);
            if (cloudPet) {
                setPet(cloudPet);
                await storageService.savePet(cloudPet);
                logger.info("Pet loaded from cloud", {
                    petName: cloudPet.name,
                });
            } else {
                const localPet = await storageService.loadPet();
                setPet(localPet);
                if (localPet) {
                    logger.info("Pet loaded from local storage", {
                        petName: localPet.name,
                    });
                }
            }
        };
        loadPet();
    }, [user]);

    const updatePet = async (updateFn: (pet: Pet) => Partial<Pet>) => {
        if (pet) {
            let updatedPet = decayStats(pet);
            updatedPet = { ...updatedPet, ...updateFn(updatedPet) };
            updatedPet = checkEvolution(updatedPet);
            setPet(updatedPet);
            await storageService.savePet(updatedPet);
            if (updatedPet.evolutionStage !== pet.evolutionStage) {
                await storageService.syncPetToCloud(updatedPet);
                logger.info("Pet evolved and synced to cloud", {
                    petName: updatedPet.name,
                });
            }
        }
    };

    return (
        <PetContext.Provider value={{ pet, setPet, updatePet }}>
            {children}
        </PetContext.Provider>
    );
};
