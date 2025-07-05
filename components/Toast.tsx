import { ToastPosition, ToastType } from "@/types/toast";
import React from "react";
import { Animated, Text, View } from "react-native";

interface ToastProps {
    message: string;
    type?: ToastType;
    position?: ToastPosition;
    onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = "default",
    position = "top",
    onDismiss,
}) => {
    const getBackgroundColor = () => {
        switch (type) {
            case "success":
                return "bg-green-500";
            case "error":
                return "bg-red-500";
            case "warning":
                return "bg-yellow-500";
            case "info":
                return "bg-blue-500";
            default:
                return "bg-gray-800";
        }
    };

    const getTextColor = () => {
        switch (type) {
            case "warning":
                return "text-gray-800";
            default:
                return "text-white";
        }
    };

    const positionStyle = position === "top" ? "top-12" : "bottom-12";

    return (
        <Animated.View
            className={`absolute left-0 right-0 ${positionStyle} flex items-center`}
        >
            <View
                className={`${getBackgroundColor()} rounded-lg px-4 py-3 shadow-lg mx-4`}
            >
                <Text className={`${getTextColor()} font-medium`}>
                    {message}
                </Text>
            </View>
        </Animated.View>
    );
};

export default Toast;
