import React, { useState, useEffect } from 'react';
import type { CustomClassmateInstance } from '../types';

// This hook encapsulates state and logic for Page Two of the character creation.
export const usePageTwoState = ({ isMultiplayer }: { isMultiplayer: boolean }) => {
    const [selectedHeadmasterId, setSelectedHeadmasterId] = useState<string | null>('competent');
    const [selectedTeacherIds, setSelectedTeacherIds] = useState<Set<string>>(new Set());
    const [selectedDurationId, setSelectedDurationId] = useState<string | null>('6_years');
    const [selectedClubIds, setSelectedClubIds] = useState<Set<string>>(new Set());
    const [selectedMiscActivityIds, setSelectedMiscActivityIds] = useState<Set<string>>(new Set());
    const [selectedClassmateIds, setSelectedClassmateIds] = useState<Set<string>>(new Set());
    const [classmateUniforms, setClassmateUniforms] = useState<Map<string, string>>(new Map());
    const [isBoardingSchool, setIsBoardingSchool] = useState(false);
    const [customClassmates, setCustomClassmates] = useState<CustomClassmateInstance[]>([]);
    const [assigningClassmate, setAssigningClassmate] = useState<CustomClassmateInstance | null>(null);

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
    const handleClassmateSelect = (id: string) => {
        setSelectedClassmateIds(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                 // When deselecting, clear the uniform.
                setClassmateUniforms(prevMap => {
                    const newMap = new Map(prevMap);
                    newMap.delete(id);
                    return newMap;
                });
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    const handleTeacherSelect = createMultiSelectHandler(setSelectedTeacherIds, 5);

    const handleHeadmasterSelect = createSingleSelectHandler(setSelectedHeadmasterId);
    const handleDurationSelect = createSingleSelectHandler(setSelectedDurationId);

    const handleClassmateUniformSelect = (classmateId: string, uniformId: string) => {
        setClassmateUniforms(prev => new Map(prev).set(classmateId, uniformId));
    };

    const handleBoardingSchoolSelect = () => {
        setIsBoardingSchool(prev => !prev);
    };

    const handleAddCustomClassmate = (optionId: string) => {
        setCustomClassmates(prev => [...prev, { id: Date.now() + Math.random(), optionId, companionName: null }]);
    };
    
    const handleRemoveCustomClassmate = (id: number) => {
        setCustomClassmates(prev => prev.filter(c => c.id !== id));
    };

    const handleOpenAssignModal = (classmateInstance: CustomClassmateInstance) => {
        setAssigningClassmate(classmateInstance);
    };

    const handleCloseAssignModal = () => {
        setAssigningClassmate(null);
    };

    const handleAssignCustomClassmateName = (id: number, name: string | null) => {
        setCustomClassmates(prev => prev.map(c => (c.id === id ? { ...c, companionName: name } : c)));
    };

    return {
        selectedHeadmasterId, handleHeadmasterSelect,
        selectedTeacherIds, handleTeacherSelect,
        selectedDurationId, handleDurationSelect,
        selectedClubIds, handleClubSelect,
        selectedMiscActivityIds, handleMiscActivitySelect,
        selectedClassmateIds, handleClassmateSelect,
        classmateUniforms, handleClassmateUniformSelect,
        isBoardingSchool, handleBoardingSchoolSelect,
        customClassmates,
        handleAddCustomClassmate,
        handleRemoveCustomClassmate,
        assigningClassmate,
        handleOpenAssignModal,
        handleCloseAssignModal,
        handleAssignCustomClassmateName,
    };
};