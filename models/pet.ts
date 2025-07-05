export interface Pet {
    name: string;
    hunger: number;
    happiness: number;
    cleanliness: number;
    energy: number;
    evolutionStage: number;
    mood: string;
    lastUpdated: Date;
    careCount: number;
    createdAt: Date;
    lastCareAction?: { type: string; timestamp: Date };
}

export const decayStats = (pet: Pet): Pet => {
    const now = new Date();
    const minutesPassed =
        (now.getTime() - pet.lastUpdated.getTime()) / (1000 * 60);
    if (minutesPassed < 1) return pet;

    const hungerDecay = Math.random() * 0.2 + 0.1; // 0.1–0.3 per minute
    const happinessDecay = Math.random() * 0.15 + 0.05; // 0.05–0.2 per minute
    const cleanlinessDecay = Math.random() * 0.18 + 0.08; // 0.08–0.26 per minute
    const energyDecay = Math.random() * 0.25 + 0.1; // 0.1–0.35 per minute

    const hour = now.getHours();
    const isNight = hour >= 22 || hour < 6;
    const energyModifier = isNight ? 1.2 : 1.0; // Faster energy decay at night
    const happinessModifier = isNight ? 0.8 : 1.0; // Slower happiness decay at night

    // recent care slows decay
    const lastActionTime = pet.lastCareAction?.timestamp;
    const minutesSinceLastAction = lastActionTime
        ? (now.getTime() - lastActionTime.getTime()) / (1000 * 60)
        : Number.MAX_VALUE;
    const careModifier = minutesSinceLastAction < 30 ? 0.5 : 1.0; // halve decay if cared for recently

    const updatedPet = {
        ...pet,
        hunger: Math.max(
            pet.hunger - hungerDecay * minutesPassed * careModifier,
            0
        ),
        happiness: Math.max(
            pet.happiness -
                happinessDecay *
                    minutesPassed *
                    careModifier *
                    happinessModifier,
            0
        ),
        cleanliness: Math.max(
            pet.cleanliness - cleanlinessDecay * minutesPassed * careModifier,
            0
        ),
        energy: Math.max(
            pet.energy -
                energyDecay * minutesPassed * careModifier * energyModifier,
            0
        ),
        lastUpdated: now,
    };

    return updateMood(updatedPet);
};

export const updateMood = (pet: Pet): Pet => {
    // Weighted scoring for nuanced moods
    const weights = {
        hunger: 0.3,
        happiness: 0.4,
        cleanliness: 0.15,
        energy: 0.15,
    };
    const score =
        pet.hunger * weights.hunger +
        pet.happiness * weights.happiness +
        pet.cleanliness * weights.cleanliness +
        pet.energy * weights.energy;

    // Define mood thresholds
    const moodMap: { minScore: number; mood: string }[] = [
        { minScore: 90, mood: "excited" },
        { minScore: 75, mood: "happy" },
        { minScore: 50, mood: "neutral" },
        { minScore: 25, mood: "lonely" },
        { minScore: 10, mood: "tired" },
        { minScore: 0, mood: "sick" },
    ];

    // Consider recent care actions for mood boosts
    const lastAction = pet.lastCareAction;
    const minutesSinceLastAction = lastAction
        ? (new Date().getTime() - lastAction.timestamp.getTime()) / (1000 * 60)
        : Number.MAX_VALUE;
    let mood = moodMap.find((m) => score >= m.minScore)?.mood || "sick";
    if (minutesSinceLastAction < 15) {
        if (lastAction?.type === "feed" && score < 75) mood = "happy";
        if (lastAction?.type === "play" && score < 90) mood = "excited";
        if (lastAction?.type === "clean" && pet.cleanliness > 80)
            mood = "happy";
        if (lastAction?.type === "rest" && pet.energy > 80) mood = "neutral";
    }

    return { ...pet, mood };
};

export const checkEvolution = (pet: Pet): Pet => {
    const now = new Date();
    const daysSinceCreation =
        (now.getTime() - pet.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const statConsistency = Math.min(
        pet.hunger,
        pet.happiness,
        pet.cleanliness,
        pet.energy
    );
    const careThresholds = [0, 50, 150, 300, 500]; // Care actions needed per stage
    const timeThresholds = [0, 3, 7, 14, 30]; // Days needed per stage

    if (pet.evolutionStage < 4) {
        if (
            statConsistency >= 75 && // All stats must be consistently high
            pet.careCount >= careThresholds[pet.evolutionStage + 1] && // Enough care actions
            daysSinceCreation >= timeThresholds[pet.evolutionStage + 1] // Enough time passed
        ) {
            return {
                ...pet,
                evolutionStage: pet.evolutionStage + 1,
                mood: "evolving",
                hunger: Math.min(pet.hunger + 10, 100), // Boost stats on evolution
                happiness: Math.min(pet.happiness + 10, 100),
                cleanliness: Math.min(pet.cleanliness + 10, 100),
                energy: Math.min(pet.energy + 10, 100),
            };
        }
    }
    return pet;
};

// Helper to update pet with care action
export const recordCareAction = (pet: Pet, actionType: string): Pet => {
    return {
        ...pet,
        careCount: pet.careCount + 1,
        lastCareAction: { type: actionType, timestamp: new Date() },
    };
};
