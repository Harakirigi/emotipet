import { supabase } from "@/constants/supabase";
import { DiaryEntry } from "@/models/diaryEntry";
import { Pet } from "@/models/pet";
import { AppUser } from "@/models/user";
import { Logger } from "@/utils/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Service for managing local (AsyncStorage) and cloud (Supabase) storage
export class StorageService {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    async saveUser(user: AppUser): Promise<void> {
        this.logger.debug("Saving user to AsyncStorage", { userId: user.id });
        try {
            await AsyncStorage.setItem("currentUser", JSON.stringify(user));
            this.logger.info("User saved to AsyncStorage", { userId: user.id });
        } catch (e) {
            this.logger.error("Failed to save user to AsyncStorage", {
                error: e,
            });
            throw e;
        }
    }

    async loadUser(): Promise<AppUser | null> {
        this.logger.debug("Loading user from AsyncStorage");
        try {
            const userData = await AsyncStorage.getItem("currentUser");
            if (userData) {
                const user = JSON.parse(userData) as AppUser;
                this.logger.info("User loaded from AsyncStorage", {
                    userId: user.id,
                });
                return user;
            }
            this.logger.debug("No user found in AsyncStorage");
            return null;
        } catch (e) {
            this.logger.error("Failed to load user from AsyncStorage", {
                error: e,
            });
            return null;
        }
    }

    async syncUserToCloud(user: AppUser): Promise<void> {
        this.logger.debug("Syncing user to Supabase", { userId: user.id });
        try {
            await supabase.from("users").upsert(
                {
                    id: user.id,
                    username: user.username,
                    password: user.password,
                    pet_name: user.petName,
                    emoti_coins: user.emotiCoins,
                },
                { onConflict: "id" }
            );
            this.logger.info("User synced to Supabase", { userId: user.id });
        } catch (e) {
            this.logger.error("Failed to sync user to Supabase", { error: e });
        }
    }

    async loadUserFromCloud(username: string): Promise<AppUser | null> {
        this.logger.debug("Loading user from Supabase", { username });
        try {
            const { data, error } = await supabase
                .from("users")
                .select()
                .eq("username", username)
                .maybeSingle();
            if (error || !data) {
                this.logger.warn("No user found in Supabase", { username });
                return null;
            }
            const user: AppUser = {
                id: data.id,
                username: data.username,
                password: data.password,
                petName: data.pet_name,
                emotiCoins: data.emoti_coins ?? 1000,
            };
            this.logger.info("User loaded from Supabase", { userId: user.id });
            return user;
        } catch (e) {
            this.logger.error("Failed to load user from Supabase", {
                error: e,
            });
            return null;
        }
    }

    async savePet(pet: Pet): Promise<void> {
        this.logger.debug("Saving pet to AsyncStorage", { petName: pet.name });
        try {
            await AsyncStorage.setItem("currentPet", JSON.stringify(pet));
            this.logger.info("Pet saved to AsyncStorage", {
                petName: pet.name,
            });
        } catch (e) {
            this.logger.error("Failed to save pet to AsyncStorage", {
                error: e,
            });
            throw e;
        }
    }

    async loadPet(): Promise<Pet | null> {
        this.logger.debug("Loading pet from AsyncStorage");
        try {
            const petData = await AsyncStorage.getItem("currentPet");
            if (petData) {
                const pet = JSON.parse(petData) as Pet;
                pet.lastUpdated = new Date(pet.lastUpdated);
                pet.createdAt = new Date(pet.createdAt);
                if (pet.lastCareAction) {
                    pet.lastCareAction.timestamp = new Date(
                        pet.lastCareAction.timestamp
                    );
                }
                this.logger.info("Pet loaded from AsyncStorage", {
                    petName: pet.name,
                });
                return pet;
            }
            this.logger.debug("No pet found in AsyncStorage");
            return null;
        } catch (e) {
            this.logger.error("Failed to load pet from AsyncStorage", {
                error: e,
            });
            return null;
        }
    }

    async syncPetToCloud(pet: Pet): Promise<void> {
        this.logger.debug("Syncing pet to Supabase", { petName: pet.name });
        try {
            const user = await this.loadUser();
            if (!user) {
                this.logger.error("No user found for pet syncing");
                return;
            }
            await supabase.from("pets").upsert(
                {
                    user_id: user.id,
                    name: pet.name,
                    hunger: pet.hunger,
                    happiness: pet.happiness,
                    cleanliness: pet.cleanliness,
                    energy: pet.energy,
                    evolution_stage: pet.evolutionStage,
                    mood: pet.mood,
                    last_updated: pet.lastUpdated.toISOString(),
                    created_at: pet.createdAt.toISOString(),
                    care_count: pet.careCount,
                    last_care_action: pet.lastCareAction
                        ? {
                              type: pet.lastCareAction.type,
                              timestamp:
                                  pet.lastCareAction.timestamp.toISOString(),
                          }
                        : null,
                },
                { onConflict: "user_id" }
            );
            this.logger.info("Pet synced to Supabase", { petName: pet.name });
        } catch (e) {
            this.logger.error("Failed to sync pet to Supabase", { error: e });
        }
    }

    async loadPetFromCloud(userId: string): Promise<Pet | null> {
        this.logger.debug("Loading pet from Supabase", { userId });
        try {
            const { data, error } = await supabase
                .from("pets")
                .select()
                .eq("user_id", userId)
                .maybeSingle();
            if (error || !data) {
                this.logger.debug("No pet found in Supabase", { userId });
                return null;
            }
            const pet: Pet = {
                name: data.name,
                hunger: data.hunger,
                happiness: data.happiness,
                cleanliness: data.cleanliness,
                energy: data.energy,
                evolutionStage: data.evolution_stage,
                mood: data.mood,
                lastUpdated: new Date(data.last_updated),
                careCount: data.care_count ?? 0,
                createdAt: new Date(data.created_at),
                lastCareAction: data.last_care_action
                    ? {
                          type: data.last_care_action.type,
                          timestamp: new Date(data.last_care_action.timestamp),
                      }
                    : undefined,
            };
            this.logger.info("Pet loaded from Supabase", { petName: pet.name });
            return pet;
        } catch (e) {
            this.logger.error("Failed to load pet from Supabase", { error: e });
            return null;
        }
    }

    async saveDiary(entries: DiaryEntry[]): Promise<void> {
        this.logger.debug("Saving diary entries to AsyncStorage", {
            count: entries.length,
        });
        try {
            await AsyncStorage.setItem("diary", JSON.stringify(entries));
            this.logger.info("Diary entries saved to AsyncStorage");
        } catch (e) {
            this.logger.error("Failed to save diary entries to AsyncStorage", {
                error: e,
            });
            throw e;
        }
    }

    async loadDiary(): Promise<DiaryEntry[]> {
        this.logger.debug("Loading diary entries from AsyncStorage");
        try {
            const diaryData = await AsyncStorage.getItem("diary");
            if (diaryData) {
                const entries = JSON.parse(diaryData) as DiaryEntry[];
                entries.forEach(
                    (entry) => (entry.timestamp = new Date(entry.timestamp))
                );
                this.logger.info("Loaded diary entries from AsyncStorage", {
                    count: entries.length,
                });
                return entries;
            }
            return [];
        } catch (e) {
            this.logger.error(
                "Failed to load diary entries from AsyncStorage",
                { error: e }
            );
            return [];
        }
    }

    async syncDiaryToCloud(entries: DiaryEntry[]): Promise<void> {
        this.logger.debug("Syncing diary entries to Supabase", {
            count: entries.length,
        });
        try {
            const user = await this.loadUser();
            if (!user) {
                this.logger.error("No user found for diary syncing");
                return;
            }
            const data = entries.map((entry) => ({
                user_id: user.id,
                timestamp: entry.timestamp.toISOString(),
                event: entry.event,
                mood: entry.mood,
            }));
            await supabase
                .from("diary_entries")
                .upsert(data, { onConflict: "user_id,timestamp" });
            this.logger.info("Diary entries synced to Supabase");
        } catch (e) {
            this.logger.error("Failed to sync diary entries to Supabase", {
                error: e,
            });
        }
    }

    async loadDiaryFromCloud(userId: string): Promise<DiaryEntry[]> {
        this.logger.debug("Loading diary entries from Supabase", { userId });
        try {
            const { data, error } = await supabase
                .from("diary_entries")
                .select()
                .eq("user_id", userId);
            if (error || !data) {
                this.logger.error(
                    "Failed to load diary entries from Supabase",
                    { error }
                );
                return [];
            }
            const entries = data.map((entry) => ({
                timestamp: new Date(entry.timestamp),
                event: entry.event,
                mood: entry.mood,
            }));
            this.logger.info("Loaded diary entries from Supabase", {
                count: entries.length,
            });
            return entries;
        } catch (e) {
            this.logger.error("Failed to load diary entries from Supabase", {
                error: e,
            });
            return [];
        }
    }

    async clearLocalData(): Promise<void> {
        this.logger.debug("Clearing all local AsyncStorage data");
        try {
            await AsyncStorage.multiRemove([
                "currentUser",
                "currentPet",
                "diary",
            ]);
            this.logger.info("Local AsyncStorage data cleared");
        } catch (e) {
            this.logger.error("Failed to clear local AsyncStorage data", {
                error: e,
            });
            throw e;
        }
    }

    async deleteAccount(userId: string): Promise<string | null> {
        this.logger.debug("Deleting account", { userId });
        try {
            await supabase.from("diary_entries").delete().eq("user_id", userId);
            await supabase.from("pets").delete().eq("user_id", userId);
            await supabase.from("users").delete().eq("id", userId);
            await this.clearLocalData();
            this.logger.info("Account deleted successfully");
            return null;
        } catch (e) {
            this.logger.error("Failed to delete account from Supabase", {
                error: e,
            });
            await this.clearLocalData();
            return "Failed to delete account from cloud. Local data cleared.";
        }
    }
}
