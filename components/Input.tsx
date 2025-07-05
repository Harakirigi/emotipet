import { useToast } from "@/providers/ToastContext";
import React, { forwardRef, useEffect, useState } from "react";
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableWithoutFeedback,
    View,
} from "react-native";

type InputProps = {
    className?: string;
    onChangeText?: (text: string) => void;
    value?: string;
    placeholder?: string;
    inputLabel?: string;
    letCount?: boolean;
    maxChar?: number | null;
    id?: string;
    readOnly?: boolean;
    textarea?: boolean;
    inputText?: string;
} & TextInputProps;

const Input = forwardRef<TextInput, InputProps>(
    (
        {
            className = "",
            onChangeText,
            value,
            placeholder = "",
            inputLabel = "",
            letCount = false,
            maxChar = null,
            id,
            readOnly = false,
            textarea = false,
            inputText = "",
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [isHovered, setIsHovered] = useState(false);
        const [inputValue, setInputValue] = useState(value || "");
        const { toast } = useToast();

        useEffect(() => {
            if (value !== undefined) {
                setInputValue(value);
            }
        }, [value]);

        useEffect(() => {
            if (maxChar && inputValue.length > maxChar) {
                toast({
                    message: "You have exceeded the character limit.",
                    type: "warning",
                    position: "top",
                    duration: 5000,
                });
            }
        }, [maxChar, inputValue]);

        const handleChange = (text: string) => {
            if (readOnly) return;
            setInputValue(text);
            if (onChangeText) onChangeText(text);
        };

        const baseStyle =
            "w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-400 rounded-xl";

        const focusedStyle = isFocused
            ? "border-2 border-accent placeholder-gray-600"
            : "placeholder-transparent";

        const hoveredStyle = isHovered
            ? "border-2 border-accent placeholder-gray-600"
            : "";

        const disabledStyle = readOnly ? "cursor-not-allowed opacity-50" : "";

        return (
            <View className="mb-4">
                {inputLabel && (
                    <Text
                        className={`mx-2 mb-2 text-sm ${isFocused ? "text-accent font-medium" : "text-gray-400"}`}
                    >
                        {inputLabel}
                    </Text>
                )}

                <TouchableWithoutFeedback
                    onPressIn={() => setIsHovered(true)}
                    onPressOut={() => setIsHovered(false)}
                >
                    <TextInput
                        id={id}
                        ref={ref}
                        className={`${baseStyle} ${focusedStyle} ${hoveredStyle} ${disabledStyle} ${className}`}
                        placeholder={placeholder}
                        placeholderTextColor={
                            isFocused || isHovered ? "#6b7280" : "transparent"
                        }
                        value={inputValue}
                        onChangeText={handleChange}
                        onFocus={(e) => {
                            setIsFocused(true);
                            if (props.onFocus) props.onFocus(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            if (props.onBlur) props.onBlur(e);
                        }}
                        editable={!readOnly}
                        multiline={textarea}
                        numberOfLines={textarea ? 4 : 1}
                        style={
                            textarea
                                ? { height: 128, textAlignVertical: "top" }
                                : { height: 45 }
                        }
                        {...props}
                    />
                </TouchableWithoutFeedback>

                <Text
                    className={`mt-2 mx-2 text-sm text-gray-500 ${
                        isFocused ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {letCount ? inputValue.length : ""}
                    {inputText}
                </Text>
            </View>
        );
    }
);

Input.displayName = "Input";

export default Input;
