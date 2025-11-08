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

    // Good Tidings Override State
    const [goodTidingsEngraving, setGoodTidingsEngraving] = useState<string | null>(null);
    const [goodTidingsWeaponName, setGoodTidingsWeaponName] = useState<string | null>(null);

    // Compelling Will Override State
    const [compellingWillEngraving, setCompellingWillEngraving] = useState<string | null>(null);
    const [compellingWillWeaponName, setCompellingWillWeaponName] = useState<string | null>(null);

    // Worldly Wisdom Override State
    const [worldlyWisdomEngraving, setWorldlyWisdomEngraving] = useState<string | null>(null);
    const [worldlyWisdomWeaponName, setWorldlyWisdomWeaponName] = useState<string | null>(null);

    // Bitter Dissatisfaction Override State
    const [bitterDissatisfactionEngraving, setBitterDissatisfactionEngraving] = useState<string | null>(null);
    const [bitterDissatisfactionWeaponName, setBitterDissatisfactionWeaponName] = useState<string | null>(null);

    // Lost Hope Override State
    const [lostHopeEngraving, setLostHopeEngraving] = useState<string | null>(null);
    const [lostHopeWeaponName, setLostHopeWeaponName] = useState<string | null>(null);

    // Fallen Peace Override State
    const [fallenPeaceEngraving, setFallenPeaceEngraving] = useState<string | null>(null);
    const [fallenPeaceWeaponName, setFallenPeaceWeaponName] = useState<string | null>(null);

    // Gracious Defeat Override State
    const [graciousDefeatEngraving, setGraciousDefeatEngraving] = useState<string | null>(null);
    const [graciousDefeatWeaponName, setGraciousDefeatWeaponName] = useState<string | null>(null);

    // Closed Circuits Override State
    const [closedCircuitsEngraving, setClosedCircuitsEngraving] = useState<string | null>(null);
    const [closedCircuitsWeaponName, setClosedCircuitsWeaponName] = useState<string | null>(null);

    // Righteous Creation Override State
    const [righteousCreationEngraving, setRighteousCreationEngraving] = useState<string | null>(null);
    const [righteousCreationWeaponName, setRighteousCreationWeaponName] = useState<string | null>(null);

    // --- TOP-LEVEL HANDLERS ---
    const handleBlessingEngravingSelect = (id: string) => {
        setSelectedBlessingEngraving(prevId => prevId === id ? null : id);
    };

    const handleGoodTidingsEngravingSelect = (id: string) => {
        setGoodTidingsEngraving(prev => prev === id ? null : id);
    };
    const handleGoodTidingsWeaponAssign = (weaponName: string | null) => {
        setGoodTidingsWeaponName(weaponName);
    };

    const handleCompellingWillEngravingSelect = (id: string) => { setCompellingWillEngraving(prev => prev === id ? null : id); };
    const handleCompellingWillWeaponAssign = (weaponName: string | null) => { setCompellingWillWeaponName(weaponName); };
    const handleWorldlyWisdomEngravingSelect = (id: string) => { setWorldlyWisdomEngraving(prev => prev === id ? null : id); };
    const handleWorldlyWisdomWeaponAssign = (weaponName: string | null) => { setWorldlyWisdomWeaponName(weaponName); };
    const handleBitterDissatisfactionEngravingSelect = (id: string) => { setBitterDissatisfactionEngraving(prev => prev === id ? null : id); };
    const handleBitterDissatisfactionWeaponAssign = (weaponName: string | null) => { setBitterDissatisfactionWeaponName(weaponName); };
    const handleLostHopeEngravingSelect = (id: string) => { setLostHopeEngraving(prev => prev === id ? null : id); };
    const handleLostHopeWeaponAssign = (weaponName: string | null) => { setLostHopeWeaponName(weaponName); };
    const handleFallenPeaceEngravingSelect = (id: string) => { setFallenPeaceEngraving(prev => prev === id ? null : id); };
    const handleFallenPeaceWeaponAssign = (weaponName: string | null) => { setFallenPeaceWeaponName(weaponName); };
    const handleGraciousDefeatEngravingSelect = (id: string) => { setGraciousDefeatEngraving(prev => prev === id ? null : id); };
    const handleGraciousDefeatWeaponAssign = (weaponName: string | null) => { setGraciousDefeatWeaponName(weaponName); };
    const handleClosedCircuitsEngravingSelect = (id: string) => { setClosedCircuitsEngraving(prev => prev === id ? null : id); };
    const handleClosedCircuitsWeaponAssign = (weaponName: string | null) => { setClosedCircuitsWeaponName(weaponName); };
    const handleRighteousCreationEngravingSelect = (id: string) => { setRighteousCreationEngraving(prev => prev === id ? null : id); };
    const handleRighteousCreationWeaponAssign = (weaponName: string | null) => { setRighteousCreationWeaponName(weaponName); };


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
                // FIX: Used subOptionId instead of undefined 'id'.
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
        
        goodTidingsEngraving, handleGoodTidingsEngravingSelect,
        goodTidingsWeaponName, handleGoodTidingsWeaponAssign,
        
        compellingWillEngraving, handleCompellingWillEngravingSelect,
        compellingWillWeaponName, handleCompellingWillWeaponAssign,
        
        worldlyWisdomEngraving, handleWorldlyWisdomEngravingSelect,
        worldlyWisdomWeaponName, handleWorldlyWisdomWeaponAssign,
        
        bitterDissatisfactionEngraving, handleBitterDissatisfactionEngravingSelect,
        bitterDissatisfactionWeaponName, handleBitterDissatisfactionWeaponAssign,

        lostHopeEngraving, handleLostHopeEngravingSelect,
        lostHopeWeaponName, handleLostHopeWeaponAssign,

        fallenPeaceEngraving, handleFallenPeaceEngravingSelect,
        fallenPeaceWeaponName, handleFallenPeaceWeaponAssign,

        graciousDefeatEngraving, handleGraciousDefeatEngravingSelect,
        graciousDefeatWeaponName, handleGraciousDefeatWeaponAssign,

        closedCircuitsEngraving, handleClosedCircuitsEngravingSelect,
        closedCircuitsWeaponName, handleClosedCircuitsWeaponAssign,

        righteousCreationEngraving, handleRighteousCreationEngravingSelect,
        righteousCreationWeaponName, handleRighteousCreationWeaponAssign,

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