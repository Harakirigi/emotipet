import { COLORS } from "@/constants/logColors";
import * as FileSystem from "expo-file-system";
import { createContext } from "react";
import { Platform } from "react-native";

export interface Logger {
    debug: (message: string, data?: any) => void;
    info: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, data?: any) => void;
}

const logColors = {
    reset: COLORS.RESET,
    debug: COLORS.CYAN,
    info: COLORS.BLUE,
    warn: COLORS.YELLOW,
    error: COLORS.RED,
    timestamp: COLORS.WHITE,
};

export const LoggerContext = createContext<Logger | null>(null);

export const LoggerProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const logFile = `${FileSystem.documentDirectory}app.log`;

    const writeLog = async (level: string, message: string, data?: any) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${level}: ${message}${
            data ? " " + JSON.stringify(data) : ""
        }\n`;
        if (Platform.OS !== "web") {
            try {
                await FileSystem.writeAsStringAsync(logFile, logMessage, {
                    encoding: FileSystem.EncodingType.UTF8,
                });
            } catch (error) {
                console.error("Failed to write log:", error);
            }
        }
        const color = logColors[level.toLowerCase() as keyof typeof logColors] || logColors.reset;
        console.log(
            `${logColors.timestamp}[${timestamp}]${logColors.reset} ` +
            `${color}${level}: ${message}${logColors.reset} ` +
            (data ? ` ${JSON.stringify(data)}` : "")
        );

    };

    const logger: Logger = {
        debug: (message, data) => writeLog("DEBUG", message, data),
        info: (message, data) => writeLog("INFO", message, data),
        warn: (message, data) => writeLog("WARN", message, data),
        error: (message, data) => writeLog("ERROR", message, data),
    };

    return (
        <LoggerContext.Provider value={logger}>
            {children}
        </LoggerContext.Provider>
    );
};
