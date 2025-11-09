import React, { useState, useEffect } from 'react';
import type { CustomColleagueInstance } from '../types';

export const usePageFiveState = ({ isMultiplayer }: { isMultiplayer: boolean }) => {
    const [selectedAllmillorIds, setSelectedAllmillorIds] = useState<Set<string>>(new Set());
    const [selectedCareerGoalIds, setSelectedCareerGoalIds] = useState<Set<string>>(new Set());
    const [selectedColleagueIds, setSelectedColleagueIds] = useState<Set<string>>(new Set());
    const [joysOfParentingCompanionName, setJoysOfParentingCompanionName] = useState<string | null>(null);
    const [colleagueUniforms, setColleagueUniforms] = useState<Map<string, string>>(new Map());

    const [customColleagues, setCustomColleagues] = useState<CustomColleagueInstance[]>([]);
    const [assigningColleague, setAssigningColleague] = useState<CustomColleagueInstance | null>(null);

    useEffect(() => {
        if (isMultiplayer) {
            setSelectedColleagueIds(new Set());
            setColleagueUniforms(new Map());
        }
    }, [isMultiplayer]);

    useEffect(() => {
        if (!selectedCareerGoalIds.has('joys_of_parenting')) {
            setJoysOfParentingCompanionName(null);
        }
    }, [selectedCareerGoalIds]);

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

    const handleAllmillorSelect = createMultiSelectHandler(setSelectedAllmillorIds, 3);
    const handleCareerGoalSelect = createMultiSelectHandler(setSelectedCareerGoalIds);
    
    const handleColleagueSelect = (id: string) => {
        setSelectedColleagueIds(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // When deselecting, clear the uniform.
                setColleagueUniforms(prevMap => {
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

    const handleJoysOfParentingCompanionAssign = (name: string | null) => {
        setJoysOfParentingCompanionName(name);
    };

    const handleColleagueUniformSelect = (colleagueId: string, uniformId: string) => {
        setColleagueUniforms(prev => new Map(prev).set(colleagueId, uniformId));
    };

    const handleAddCustomColleague = (optionId: string) => {
        setCustomColleagues(prev => [...prev, { id: Date.now() + Math.random(), optionId, companionName: null }]);
    };
    
    const handleRemoveCustomColleague = (id: number) => {
        setCustomColleagues(prev => prev.filter(c => c.id !== id));
    };

    const handleOpenAssignColleagueModal = (colleagueInstance: CustomColleagueInstance) => {
        setAssigningColleague(colleagueInstance);
    };

    const handleCloseAssignColleagueModal = () => {
        setAssigningColleague(null);
    };

    const handleAssignCustomColleagueName = (id: number, name: string | null) => {
        setCustomColleagues(prev => prev.map(c => (c.id === id ? { ...c, companionName: name } : c)));
    };

    return {
        selectedAllmillorIds, handleAllmillorSelect,
        selectedCareerGoalIds, handleCareerGoalSelect,
        selectedColleagueIds, handleColleagueSelect,
        joysOfParentingCompanionName, handleJoysOfParentingCompanionAssign,
        colleagueUniforms, handleColleagueUniformSelect,
        customColleagues,
        handleAddCustomColleague,
        handleRemoveCustomColleague,
        assigningColleague,
        handleOpenAssignColleagueModal,
        handleCloseAssignColleagueModal,
        handleAssignCustomColleagueName,
    };
};