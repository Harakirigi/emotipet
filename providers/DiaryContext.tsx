import { useLogger } from "@/hooks/useLogger";
import { DiaryEntry } from "@/models/diaryEntry";
import { UserContext } from "@/providers/UserContext";
import { StorageService } from "@/services/storageService";
import React, { createContext, useContext, useEffect, useState } from "react";

// Context for managing diary entries
interface DiaryContextType {
    diary: DiaryEntry[];
    addDiaryEntry: (event: string, mood: string) => Promise<void>;
}

export const DiaryContext = createContext<DiaryContextType>({
    diary: [],
    addDiaryEntry: async () => {},
});

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [diary, setDiary] = useState<DiaryEntry[]>([]);
    const logger = useLogger();
    const storageService = new StorageService(logger);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const loadDiary = async () => {
            if (!user) {
                logger.debug("No user, skipping diary load");
                setDiary([]);
                return;
            }
            const cloudDiary = await storageService.loadDiaryFromCloud(user.id);
            if (cloudDiary.length > 0) {
                setDiary(cloudDiary);
                await storageService.saveDiary(cloudDiary);
                logger.info("Diary loaded from cloud", {
                    count: cloudDiary.length,
                });
            } else {
                const localDiary = await storageService.loadDiary();
                setDiary(localDiary);
                if (localDiary.length > 0) {
                    logger.info("Diary loaded from local storage", {
                        count: localDiary.length,
                    });
                }
            }
        };
        loadDiary();
    }, [user]);

    const addDiaryEntry = async (event: string, mood: string) => {
        const entry: DiaryEntry = { timestamp: new Date(), event, mood };
        const updatedDiary = [...diary, entry];
        setDiary(updatedDiary);
        await storageService.saveDiary(updatedDiary);
        await storageService.syncDiaryToCloud(updatedDiary);
    };

    return (
        <DiaryContext.Provider value={{ diary, addDiaryEntry }}>
            {children}
        </DiaryContext.Provider>
    );
};
