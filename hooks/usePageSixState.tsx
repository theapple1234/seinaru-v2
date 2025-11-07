import React, { useState } from 'react';

export const usePageSixState = () => {
    const [selectedRetirementChoiceId, setSelectedRetirementChoiceId] = useState<string | null>(null);
    const [selectedChildOfGodChoiceId, setSelectedChildOfGodChoiceId] = useState<string | null>(null);
    
    const createSingleSelectHandler = (setState: React.Dispatch<React.SetStateAction<string | null>>) => (id: string) => {
        setState(prevId => prevId === id ? null : id);
    };

    const handleRetirementChoiceSelect = createSingleSelectHandler(setSelectedRetirementChoiceId);
    const handleChildOfGodChoiceSelect = createSingleSelectHandler(setSelectedChildOfGodChoiceId);
    
    return {
        selectedRetirementChoiceId, handleRetirementChoiceSelect,
        selectedChildOfGodChoiceId, handleChildOfGodChoiceSelect,
    };
};
