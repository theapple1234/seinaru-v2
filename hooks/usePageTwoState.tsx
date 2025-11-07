import React, { useState, useEffect } from 'react';

// This hook encapsulates state and logic for Page Two of the character creation.
export const usePageTwoState = ({ isMultiplayer }: { isMultiplayer: boolean }) => {
    const [selectedHeadmasterId, setSelectedHeadmasterId] = useState<string | null>('competent');
    const [selectedTeacherIds, setSelectedTeacherIds] = useState<Set<string>>(new Set());
    const [selectedDurationId, setSelectedDurationId] = useState<string | null>('6_years');
    const [selectedClubIds, setSelectedClubIds] = useState<Set<string>>(new Set());
    const [selectedMiscActivityIds, setSelectedMiscActivityIds] = useState<Set<string>>(new Set());
    const [selectedClassmateIds, setSelectedClassmateIds] = useState<Set<string>>(new Set());
    const [classmateUniforms, setClassmateUniforms] = useState<Map<string, string>>(new Map());

    // Lock choices in multiplayer
    useEffect(() => {
        if (isMultiplayer) {
            setSelectedHeadmasterId('competent');
            setSelectedClassmateIds(new Set());
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

    const handleClubSelect = createMultiSelectHandler(setSelectedClubIds);
    const handleMiscActivitySelect = createMultiSelectHandler(setSelectedMiscActivityIds);
    const handleClassmateSelect = createMultiSelectHandler(setSelectedClassmateIds);
    const handleTeacherSelect = createMultiSelectHandler(setSelectedTeacherIds, 5);

    const handleHeadmasterSelect = createSingleSelectHandler(setSelectedHeadmasterId);
    const handleDurationSelect = createSingleSelectHandler(setSelectedDurationId);

    const handleClassmateUniformSelect = (classmateId: string, uniformId: string) => {
        setClassmateUniforms(prev => new Map(prev).set(classmateId, uniformId));
    };

    return {
        selectedHeadmasterId, handleHeadmasterSelect,
        selectedTeacherIds, handleTeacherSelect,
        selectedDurationId, handleDurationSelect,
        selectedClubIds, handleClubSelect,
        selectedMiscActivityIds, handleMiscActivitySelect,
        selectedClassmateIds, handleClassmateSelect,
        classmateUniforms, handleClassmateUniformSelect,
    };
};