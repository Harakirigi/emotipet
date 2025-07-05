import { supabase } from "@/constants/supabase";
import { useLogger } from "@/hooks/useLogger";
import { AppUser } from "@/models/user";
import { StorageService } from "@/services/storageService";
import * as bcrypt from "bcryptjs";
import { useFocusEffect, useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";


interface UserContextType {
    user: AppUser | null;
    loading: boolean;
    setUser: (user: AppUser | null) => void;
    login: (username: string, password: string) => Promise<string | null>;
    register: (username: string, password: string) => Promise<string | null>;
    updatePetName: (petName: string) => Promise<string | null>;
    updateEmotiCoins: (amount: number) => Promise<string | null>;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    setUser: () => {},
    login: async () => null,
    register: async () => null,
    updatePetName: async () => null,
    updateEmotiCoins: async () => null,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const logger = useLogger();
    const storageService = new StorageService(logger);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const localUser = await storageService.loadUser();
                if (localUser) {
                    setUser(localUser);
                    logger.info("User loaded from AsyncStorage", {
                        userId: localUser.id,
                    });
                }
            } catch (e) {
                logger.error("Failed to load user", { error: e });
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (loading) return;
            if (!user) {
                router.replace("/welcome");
            } else {
                // Check pet existence in a separate effect to ensure user is loaded
                const checkPet = async () => {
                    const pet = await storageService.loadPet();
                    if (!pet) {
                        router.replace("/pet-naming");
                    } else {
                        router.replace("/(tabs)");
                    }
                };
                checkPet();
            }
        }, [user, loading, router])
    );

    const usernameExists = async (username: string): Promise<boolean> => {
        const { data } = await supabase
            .from("users")
            .select("username")
            .eq("username", username)
            .maybeSingle();
        return !!data;
    };

    const login = async (
        username: string,
        password: string
    ): Promise<string | null> => {
        logger.debug("Attempting login", { username });
        try {
            const localUser = await storageService.loadUser();
            if (localUser && localUser.username === username) {
                if (bcrypt.compareSync(password, localUser.password)) {
                    setUser(localUser);
                    await storageService.syncUserToCloud(localUser);
                    // Pet check is handled by useFocusEffect
                    return null;
                }
                return "Invalid username or password";
            }

            const cloudUser = await storageService.loadUserFromCloud(username);
            if (!cloudUser) return "Invalid username or password";
            if (!bcrypt.compareSync(password, cloudUser.password))
                return "Invalid username or password";

            setUser(cloudUser);
            await storageService.saveUser(cloudUser);
            // Pet check is handled by useFocusEffect
            return null;
        } catch (e) {
            logger.error("Login error", { error: e });
            return "Unexpected error occurred";
        }
    };

    const register = async (
        username: string,
        password: string
    ): Promise<string | null> => {
        logger.debug("Attempting signup", { username });
        try {
            if (await usernameExists(username))
                return "Username already exists";
            const localUser = await storageService.loadUser();
            if (localUser && localUser.username === username)
                return "Username already exists";
            if (password.length < 6)
                return "Password must be at least 6 characters";

            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser: AppUser = {
                id: uuidv4(),
                username,
                password: hashedPassword,
                emotiCoins: 1000,
            };
            setUser(newUser);
            await storageService.saveUser(newUser);
            await storageService.syncUserToCloud(newUser);
            router.replace("/pet-naming");
            return null;
        } catch (e) {
            logger.error("Signup error", { error: e });
            return "Unexpected error occurred";
        }
    };

    const updatePetName = async (petName: string): Promise<string | null> => {
        if (!user) {
            logger.error("Cannot update pet name: No user logged in");
            return "No user logged in";
        }
        try {
            const updatedUser = { ...user, petName };
            setUser(updatedUser);
            await storageService.saveUser(updatedUser);
            await storageService.syncUserToCloud(updatedUser);
            logger.info("Pet name updated", { petName });
            return null;
        } catch (e) {
            logger.error("Failed to update pet name", { error: e });
            return "Failed to update pet name";
        }
    };

    const updateEmotiCoins = async (amount: number): Promise<string | null> => {
        if (!user) {
            logger.error("Cannot update EmotiCoins: No user logged in");
            return "No user logged in";
        }
        try {
            const updatedUser = {
                ...user,
                emotiCoins: Math.min(Math.max(amount, 0), 999999),
            };
            setUser(updatedUser);
            await storageService.saveUser(updatedUser);
            await storageService.syncUserToCloud(updatedUser);
            logger.info("EmotiCoins updated", { amount });
            return null;
        } catch (e) {
            logger.error("Failed to update EmotiCoins", { error: e });
            return "Failed to update EmotiCoins";
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                setUser,
                login,
                register,
                updatePetName,
                updateEmotiCoins,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
