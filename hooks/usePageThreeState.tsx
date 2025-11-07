import React, { useState, useMemo, useCallback } from 'react';
import type { SigilCounts } from '../types';
import { useGoodTidingsState } from './blessings/useGoodTidingsState';
import { useCompellingWillState } from './blessings/useCompellingWillState';
import { useWorldlyWisdomState } from './blessings/useWorldlyWisdomState';
import { useBitterDissatisfactionState } from './blessings/useBitterDissatisfactionState';
import { useLostHopeState } from './blessings/useLostHopeState';
import { useFallenPeaceState } from './blessings/useFallenPeaceState';
import { useGraciousDefeatState } from './blessings/useGraciousDefeatState';
import { useClosedCircuitsState } from './blessings/useClosedCircuitsState';
import { useRighteousCreationState } from './blessings/useRighteousCreationState';
import { useStarCrossedLoveState } from './blessings/useStarCrossedLoveState';


const initialSigilCounts: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };

export const usePageThreeState = () => {
    // This state is calculated in the main context and passed back in via useEffect.
    const [availableSigilCounts, setAvailableSigilCounts] = useState<SigilCounts>(initialSigilCounts);
    const setAvailableSigilCountsCallback = useCallback((counts: SigilCounts) => {
        setAvailableSigilCounts(counts);
    }, []);

    // --- TOP-LEVEL SIGIL/BLESSING STATE ---
    const [selectedBlessingEngraving, setSelectedBlessingEngraving] = useState<string | null>(null);
    const [acquiredCommonSigils, setAcquiredCommonSigils] = useState<Map<string, number>>(new Map());
    const [acquiredLekoluJobs, setAcquiredLekoluJobs] = useState<Map<string, number>>(new Map());
    const [selectedSpecialSigilChoices, setSelectedSpecialSigilChoices] = useState<Map<string, Set<string>>>(new Map());
    
    // --- TOP-LEVEL HANDLERS ---
    const handleBlessingEngravingSelect = (id: string) => {
        setSelectedBlessingEngraving(prevId => prevId === id ? null : id);
    };

    const handleCommonSigilAction = (id: string, action: 'buy' | 'sell') => {
        setAcquiredCommonSigils(prev => {
            const newMap = new Map<string, number>(prev);
            const currentCount = newMap.get(id) ?? 0;
            // FIX: Removed incorrect check on availableSigilCounts.bp, which does not exist. Point calculation is handled reactively.
            if (action === 'buy') { // Assuming common sigils have a BP cost that needs checking
                newMap.set(id, currentCount + 1);
            } else if (action === 'sell' && currentCount > 0) {
                newMap.set(id, currentCount - 1);
            }
            return newMap;
        });
    };

    const handleLekoluJobAction = (subOptionId: string, action: 'buy' | 'sell') => {
        setAcquiredLekoluJobs(prev => {
            const newMap = new Map<string, number>(prev);
            const currentCount = newMap.get(subOptionId) ?? 0;
            if (action === 'buy') {
                newMap.set(subOptionId, currentCount + 1);
            } else if (action === 'sell' && currentCount > 0) {
                newMap.set(subOptionId, currentCount - 1);
            }
            return newMap;
        });
    };

    const handleSpecialSigilChoice = (sigilId: string, subOptionId: string) => {
        if (sigilId === 'lekolu') return;
        setSelectedSpecialSigilChoices(prevMap => {
            const newMap = new Map<string, Set<string>>(prevMap);
            const currentSet = new Set(newMap.get(sigilId) || []);
            if (currentSet.has(subOptionId)) {
                currentSet.delete(subOptionId);
            } else {
                currentSet.add(subOptionId);
            }
            if (currentSet.size === 0) {
                newMap.delete(sigilId);
            } else {
                newMap.set(sigilId, currentSet);
            }
            return newMap;
        });
    };
    
    // --- INDIVIDUAL BLESSING STATE HOOKS ---
    const props = { availableSigilCounts };
    const goodTidingsState = useGoodTidingsState(props);
    const compellingWillState = useCompellingWillState(props);
    const worldlyWisdomState = useWorldlyWisdomState(props);
    const bitterDissatisfactionState = useBitterDissatisfactionState(props);
    const lostHopeState = useLostHopeState(props);
    const fallenPeaceState = useFallenPeaceState(props);
    const graciousDefeatState = useGraciousDefeatState(props);
    const closedCircuitsState = useClosedCircuitsState(props);
    const righteousCreationState = useRighteousCreationState(props);
    const starCrossedLoveState = useStarCrossedLoveState(props);

    // --- AGGREGATE CALCULATIONS ---
    const usedSigilCounts = useMemo(() => {
        const totalUsed: SigilCounts = { ...initialSigilCounts };
        const allUsedCounts = [
            goodTidingsState.usedSigilCounts,
            compellingWillState.usedSigilCounts,
            worldlyWisdomState.usedSigilCounts,
            bitterDissatisfactionState.usedSigilCounts,
            lostHopeState.usedSigilCounts,
            fallenPeaceState.usedSigilCounts,
            graciousDefeatState.usedSigilCounts,
            closedCircuitsState.usedSigilCounts,
            righteousCreationState.usedSigilCounts,
            starCrossedLoveState.usedSigilCounts,
        ];

        allUsedCounts.forEach(counts => {
            for (const key in counts) {
                totalUsed[key as keyof SigilCounts] += counts[key as keyof SigilCounts];
            }
        });
        return totalUsed;
    }, [
        goodTidingsState.usedSigilCounts,
        compellingWillState.usedSigilCounts,
        worldlyWisdomState.usedSigilCounts,
        bitterDissatisfactionState.usedSigilCounts,
        lostHopeState.usedSigilCounts,
        fallenPeaceState.usedSigilCounts,
        graciousDefeatState.usedSigilCounts,
        closedCircuitsState.usedSigilCounts,
        righteousCreationState.usedSigilCounts,
        starCrossedLoveState.usedSigilCounts,
    ]);

    return {
        // Top Level
        setAvailableSigilCounts: setAvailableSigilCountsCallback,
        usedSigilCounts,
        selectedBlessingEngraving, handleBlessingEngravingSelect,
        acquiredCommonSigils, handleCommonSigilAction,
        acquiredLekoluJobs, handleLekoluJobAction,
        selectedSpecialSigilChoices, handleSpecialSigilChoice,
        // Spread all blessing states
        ...goodTidingsState,
        ...compellingWillState,
        ...worldlyWisdomState,
        ...bitterDissatisfactionState,
        ...lostHopeState,
        ...fallenPeaceState,
        ...graciousDefeatState,
        ...closedCircuitsState,
        ...righteousCreationState,
        ...starCrossedLoveState,
    };
};