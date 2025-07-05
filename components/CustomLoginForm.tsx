import Input from "@/components/Input";
import { UserContext } from "@/providers/UserContext";
import { LoggerContext } from "@/utils/logger";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

// Login and signup form component
export const CustomLoginForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null); // Declare error state first
    const { login, register } = useContext(UserContext);
    const logger = useContext(LoggerContext);
    const router = useRouter();

    if (!logger)
        throw new Error("LoggerContext must be used within LoggerProvider");

    const validateInputs = () => {
        let errorMessage: string | null = null; // Local variable to avoid using state before assignment

        if (!username.trim()) {
            errorMessage = "Username is required";
        } else if (username.length < 3) {
            errorMessage = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errorMessage =
                "Username can only contain letters, numbers, and underscores";
        } else if (!password) {
            errorMessage = "Password is required";
        } else if (password.length < 6) {
            errorMessage = "Password must be at least 6 characters";
        } else if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
            errorMessage =
                "Password must contain at least one uppercase letter and one number";
        }

        if (errorMessage) {
            setError(errorMessage);
            logger.warn("Validation failed", { error: errorMessage });
            return false;
        }
        setError(null); // Clear error if validation passes
        return true;
    };

    const handleLogin = async () => {
        logger.debug("Attempting login", { username });
        if (!validateInputs()) return;

        const loginError = await login(username.trim(), password);
        setError(loginError); // Set error after login attempt
        if (!loginError) {
            logger.info("Login successful");
            router.replace("/(tabs)");
        } else {
            logger.warn("Login failed", { error: loginError });
        }
    };

    const handleSignup = async () => {
        logger.debug("Attempting signup", { username });
        if (!validateInputs()) return;

        const signupError = await register(username.trim(), password);
        setError(signupError);
        if (!signupError) {
            logger.info("Signup successful");
            router.replace("/pet-naming");
        } else {
            logger.warn("Signup failed", { error: signupError });
        }
    };

    return (
        <View className="bg-white bg-opacity-95 p-6 rounded-2xl shadow-lg w-[420px] max-w-[90%]">
            <Text className="text-4xl font-bold text-center text-purple-800">
                EmotiPet
            </Text>
            <Input placeholder="Your username" inputLabel="Username" />
            <TextInput
                className="p-3 mt-6 bg-gray-100 border border-gray-300 rounded-lg"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                className="p-3 mt-4 bg-gray-100 border border-gray-300 rounded-lg"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {error && <Text className="mt-3 text-red-400">{error}</Text>}
            <View className="flex-row justify-around mt-8">
                <Pressable
                    className="p-4 bg-purple-600 rounded-lg"
                    onPress={handleLogin}
                >
                    <Text className="font-bold text-white">Login</Text>
                </Pressable>
                <Pressable
                    className="p-4 bg-white border border-purple-600 rounded-lg"
                    onPress={handleSignup}
                >
                    <Text className="font-bold text-purple-600">Sign Up</Text>
                </Pressable>
            </View>
        </View>
    );
};
