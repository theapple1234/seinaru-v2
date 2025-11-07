import React, { useState } from 'react';

export const usePageFourState = () => {
    const [selectedLimitlessPotentialRunes, setSelectedLimitlessPotentialRunes] = useState<Set<string>>(new Set());
    const [customSpells, setCustomSpells] = useState({ ruhai: '', mialgrath: '' });

    const createMultiSelectHandler = (setState: React.Dispatch<React.SetStateAction<Set<string>>>) => (id: string) => {
        setState(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleLimitlessPotentialRuneSelect = createMultiSelectHandler(setSelectedLimitlessPotentialRunes);
    const handleCustomSpellChange = (type: 'ruhai' | 'mialgrath', text: string) => {
        setCustomSpells(prev => ({ ...prev, [type]: text }));
    };

    return {
        selectedLimitlessPotentialRunes, handleLimitlessPotentialRuneSelect,
        customSpells, handleCustomSpellChange,
    };
};
