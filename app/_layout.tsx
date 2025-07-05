import "@/app/globals.css";
import { DiaryProvider } from "@/providers/DiaryContext";
import { PetProvider } from "@/providers/PetContext";
import { ToastProvider } from "@/providers/ToastContext";
import { UserProvider } from "@/providers/UserContext";
import { LoggerProvider } from "@/utils/logger";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
    return (
        <LoggerProvider>
            <ToastProvider>
                <UserProvider>
                    <PetProvider>
                        <DiaryProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="welcome" />
                                <Stack.Screen name="pet-naming" />
                                <Stack.Screen name="(tabs)" />
                            </Stack>
                        </DiaryProvider>
                    </PetProvider>
                </UserProvider>
            </ToastProvider>
        </LoggerProvider>
    );
}
