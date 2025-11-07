import React, { useState, useEffect } from 'react';

export const usePageFiveState = ({ isMultiplayer }: { isMultiplayer: boolean }) => {
    const [selectedAllmillorIds, setSelectedAllmillorIds] = useState<Set<string>>(new Set());
    const [selectedCareerGoalIds, setSelectedCareerGoalIds] = useState<Set<string>>(new Set());
    const [selectedColleagueIds, setSelectedColleagueIds] = useState<Set<string>>(new Set());
    const [customColleagueChoice, setCustomColleagueChoice] = useState<string | null>(null);

    useEffect(() => {
        if (isMultiplayer) {
            setSelectedColleagueIds(new Set());
        }
    }, [isMultiplayer]);

    const createMultiSelectHandler = (setState: React.Dispatch<React.SetStateAction<Set<string>>>, max: number = Infinity) => (id: string) => {
        setState(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                if (newSet.size < max) {
                    newSet.add(id);
                }
            }
            return newSet;
        });
    };
    
    const createSingleSelectHandler = (setState: React.Dispatch<React.SetStateAction<string | null>>) => (id: string) => {
        setState(prevId => prevId === id ? null : id);
    };

    const handleAllmillorSelect = createMultiSelectHandler(setSelectedAllmillorIds, 3);
    const handleCareerGoalSelect = createMultiSelectHandler(setSelectedCareerGoalIds);
    const handleColleagueSelect = createMultiSelectHandler(setSelectedColleagueIds);
    const handleCustomColleagueChoice = createSingleSelectHandler(setCustomColleagueChoice);

    return {
        selectedAllmillorIds, handleAllmillorSelect,
        selectedCareerGoalIds, handleCareerGoalSelect,
        selectedColleagueIds, handleColleagueSelect,
        customColleagueChoice, handleCustomColleagueChoice,
    };
};
