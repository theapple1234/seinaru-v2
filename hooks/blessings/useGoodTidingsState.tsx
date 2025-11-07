import { useState, useMemo } from 'react';
// FIX: Import Dispatch and SetStateAction to resolve React namespace errors.
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';

export const useGoodTidingsState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedGoodTidingsTier, setSelectedGoodTidingsTier] = useState<'standard' | 'journeyman' | 'master' | null>(null);
    const [selectedEssentialBoons, setSelectedEssentialBoons] = useState<Set<string>>(new Set());
    const [selectedMinorBoons, setSelectedMinorBoons] = useState<Set<string>>(new Set());
    const [selectedMajorBoons, setSelectedMajorBoons] = useState<Set<string>>(new Set());
    const [isMinorBoonsBoosted, setIsMinorBoonsBoosted] = useState(false);
    const [isMajorBoonsBoosted, setIsMajorBoonsBoosted] = useState(false);

    const { availableEssentialBoonPicks, availableMinorBoonPicks, availableMajorBoonPicks } = useMemo(() => {
        let essential = 0, minor = 0, major = 0;
        if (selectedGoodTidingsTier) {
            essential = 3;
            if (selectedGoodTidingsTier === 'journeyman' || selectedGoodTidingsTier === 'master') { minor = 4; }
            if (selectedGoodTidingsTier === 'master') { major = 1; }
        }
        return { availableEssentialBoonPicks: essential, availableMinorBoonPicks: minor, availableMajorBoonPicks: major };
    }, [selectedGoodTidingsTier]);

    const handleGoodTidingsTierSelect = (id: 'standard' | 'journeyman' | 'master' | null) => {
        const tierOrder: ('standard' | 'journeyman' | 'master')[] = ['standard', 'journeyman', 'master'];
        const prev = selectedGoodTidingsTier;

        if (prev === id) {
            const currentIndex = tierOrder.indexOf(id as 'standard' | 'journeyman' | 'master');
            setSelectedGoodTidingsTier(currentIndex > 0 ? tierOrder[currentIndex - 1] : null);
            return;
        }

        const prevIndex = prev ? tierOrder.indexOf(prev) : -1;
        const newIndex = id ? tierOrder.indexOf(id) : -1;
        
        if (newIndex < prevIndex) {
            setSelectedGoodTidingsTier(id);
            return;
        }
        
        if (id === 'standard' && availableSigilCounts.kaarn < 1) return;
        if (id === 'journeyman' && availableSigilCounts.purth < 1) return;
        if (id === 'master' && availableSigilCounts.xuth < 1) return;

        setSelectedGoodTidingsTier(id);
    };

    const createMultiSelectHandler = (setState: Dispatch<SetStateAction<Set<string>>>, max: number) => (id: string) => {
        setState(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else if (newSet.size < max) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleEssentialBoonSelect = createMultiSelectHandler(setSelectedEssentialBoons, availableEssentialBoonPicks);
    const handleMinorBoonSelect = createMultiSelectHandler(setSelectedMinorBoons, availableMinorBoonPicks);
    const handleMajorBoonSelect = createMultiSelectHandler(setSelectedMajorBoons, availableMajorBoonPicks);
    
    const handleGoodTidingsBoostToggle = (type: 'minorBoons' | 'majorBoons') => {
        if (type === 'minorBoons') {
            if (!isMinorBoonsBoosted && availableSigilCounts.purth > 0) {
                setIsMinorBoonsBoosted(true);
            } else {
                setIsMinorBoonsBoosted(false);
            }
        }
        if (type === 'majorBoons') {
            if (!isMajorBoonsBoosted && availableSigilCounts.xuth > 0) {
                setIsMajorBoonsBoosted(true);
            } else {
                setIsMajorBoonsBoosted(false);
            }
        }
    };

    const usedSigilCounts = useMemo(() => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        const tierOrder: ('standard' | 'journeyman' | 'master')[] = ['standard', 'journeyman', 'master'];
        const tierIndex = selectedGoodTidingsTier ? tierOrder.indexOf(selectedGoodTidingsTier) : -1;
        
        if (tierIndex >= 0) used.kaarn += 1;
        if (tierIndex >= 1) used.purth += 1;
        if (tierIndex >= 2) used.xuth += 1;

        if (isMinorBoonsBoosted) used.purth += 1;
        if (isMajorBoonsBoosted) used.xuth += 1;

        return used;
    }, [selectedGoodTidingsTier, isMinorBoonsBoosted, isMajorBoonsBoosted]);

    return {
        selectedGoodTidingsTier, handleGoodTidingsTierSelect,
        selectedEssentialBoons, handleEssentialBoonSelect, availableEssentialBoonPicks,
        selectedMinorBoons, handleMinorBoonSelect, availableMinorBoonPicks,
        selectedMajorBoons, handleMajorBoonSelect, availableMajorBoonPicks,
        isMinorBoonsBoosted, isMajorBoonsBoosted, handleGoodTidingsBoostToggle,
        usedSigilCounts,
    };
};