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
                return "border-success bg-success-10";
            case "error":
                return "border-danger bg-danger-10";
            case "warning":
                return "border-warning bg-warning-10";
            case "info":
                return "border-info bg-info-10";
            default:
                return "border-white bg-gray-800";
        }
    };

    const getTextColor = () => {
        switch (type) {
            case "success":
                return "text-success";
            case "error":
                return "text-danger";
            case "warning":
                return "text-warning";
            case "info":
                return "text-info";
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
                className={`${getBackgroundColor()} rounded-full border-2 max-w-[90%] px-4 py-3 shadow-lg mx-4`}
            >
                <Text className={`${getTextColor()} font-medium`}>
                    {message}
                </Text>
            </View>
        </Animated.View>
    );
};

export default Toast;
