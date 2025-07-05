import { useContext } from "react";
import { LoggerContext } from "../utils/logger";

export const useLogger = () => {
    const logger = useContext(LoggerContext);
    if (!logger)
        throw new Error("useLogger must be used within a LoggerProvider");
    return logger;
};
