import React, { useState, useCallback, useEffect } from 'react';
import { TRAITS_DATA } from '../constants';

// This hook encapsulates state and logic for Page One of the character creation.
export const usePageOneState = () => {
    const [numParents, setNumParents] = useState(2);
    const [numSiblings, setNumSiblings] = useState(0);
    const [assignedTraits, setAssignedTraits] = useState<Map<string, Set<string>>>(new Map());
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<string | null>('parent-0');
    const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
    const [selectedUpgrades, setSelectedUpgrades] = useState<Set<string>>(new Set());
    const [selectedTrueSelfTraits, setSelectedTrueSelfTraits] = useState<Set<string>>(new Set());
    const [selectedAlterEgoTraits, setSelectedAlterEgoTraits] = useState<Set<string>>(new Set());
    const [selectedUniforms, setSelectedUniforms] = useState<string[]>([]);
    const [selectedMagicalStyles, setSelectedMagicalStyles] = useState<Set<string>>(new Set());
    const [selectedBuildTypeId, setSelectedBuildTypeId] = useState<string | null>(null);

    // States for new features
    const [vacationHomeCount, setVacationHomeCount] = useState(0);
    const [mansionExtraSqFt, setMansionExtraSqFt] = useState(0);
    const [islandExtraMiles, setIslandExtraMiles] = useState(0);
    const [vrChamberCostType, setVrChamberCostType] = useState<'fp' | 'bp' | null>(null);
    const [assignedVehicleName, setAssignedVehicleName] = useState<string | null>(null);

    // New state for assignments
    const [blessedCompanions, setBlessedCompanions] = useState<Map<string, string | null>>(new Map());
    const [mythicalPetBeastName, setMythicalPetBeastName] = useState<string | null>(null);
    const [inhumanAppearanceBeastName, setInhumanAppearanceBeastName] = useState<string | null>(null);

    const handleAssignBlessedCompanion = (memberId: string, companionName: string | null) => {
        setBlessedCompanions(prev => new Map(prev).set(memberId, companionName));
    };
    const handleAssignMythicalPet = (beastName: string | null) => setMythicalPetBeastName(beastName);
    const handleAssignInhumanAppearance = (beastName: string | null) => setInhumanAppearanceBeastName(beastName);


    const handleNumParentsChange = (newCount: number) => { 
        if (newCount >= 0 && newCount <= 6) {
            if (newCount < numParents) {
                const newAssignedTraits = new Map(assignedTraits);
                const newBlessedCompanions = new Map(blessedCompanions);
                for (let i = newCount; i < numParents; i++) {
                    newAssignedTraits.delete(`parent-${i}`);
                    newBlessedCompanions.delete(`parent-${i}`);
                }
                setAssignedTraits(newAssignedTraits);
                setBlessedCompanions(newBlessedCompanions);

                if (selectedFamilyMemberId && selectedFamilyMemberId.startsWith('parent-') && parseInt(selectedFamilyMemberId.split('-')[1]) >= newCount) {
                    setSelectedFamilyMemberId(null);
                }
            }
            setNumParents(newCount); 
        }
    };
    const handleNumSiblingsChange = (newCount: number) => { 
        if (newCount >= 0 && newCount <= 8) {
             if (newCount < numSiblings) {
                const newAssignedTraits = new Map(assignedTraits);
                const newBlessedCompanions = new Map(blessedCompanions);
                for (let i = newCount; i < numSiblings; i++) {
                    newAssignedTraits.delete(`sibling-${i}`);
                    newBlessedCompanions.delete(`sibling-${i}`);
                }
                setAssignedTraits(newAssignedTraits);
                setBlessedCompanions(newBlessedCompanions);

                if (selectedFamilyMemberId && selectedFamilyMemberId.startsWith('sibling-') && parseInt(selectedFamilyMemberId.split('-')[1]) >= newCount) {
                    setSelectedFamilyMemberId(null);
                }
            }
            setNumSiblings(newCount); 
        }
    };
    const handleSelectFamilyMember = (id: string | null) => setSelectedFamilyMemberId(id);

    const handleVacationHomeChange = (newCount: number) => { if (newCount >= 0) setVacationHomeCount(newCount); };
    const handleMansionSqFtChange = (newCount: number) => { if (newCount >= 0) setMansionExtraSqFt(newCount); };
    const handleIslandMilesChange = (newCount: number) => { if (newCount >= 0) setIslandExtraMiles(newCount); };
    const handleVrChamberCostSelect = (type: 'fp' | 'bp') => setVrChamberCostType(prev => prev === type ? null : type);
    const handleAssignVehicle = (vehicleName: string | null) => { setAssignedVehicleName(vehicleName); };

    const handleTraitSelect = useCallback((traitId: string) => {
        if (!selectedFamilyMemberId) return;
    
        const isNegative = TRAITS_DATA.negative.some(t => t.id === traitId);
    
        // Trait constraints
        const memberType = selectedFamilyMemberId.split('-')[0];
        if (traitId === 'loaded' && memberType !== 'parent') return;
        if (traitId === 'abusive' && memberType !== 'parent') return;
        if (traitId === 'disobedient' && memberType !== 'sibling') return;
        if ((traitId === 'strict' || traitId === 'forgiving') && !['parent', 'sibling'].includes(memberType)) return;
    
        setAssignedTraits(prev => {
            const newMap = new Map<string, Set<string>>(prev);
            const memberTraits = new Set(newMap.get(selectedFamilyMemberId) || []);
    
            if (memberTraits.has(traitId)) {
                memberTraits.delete(traitId);
                 if (traitId === 'blessed') {
                    setBlessedCompanions(prevBlessed => {
                        const newBlessedMap = new Map(prevBlessed);
                        newBlessedMap.delete(selectedFamilyMemberId);
                        return newBlessedMap;
                    });
                }
            } else {
                // Incompatibility check
                if (traitId === 'strict' && memberTraits.has('forgiving')) return prev;
                if (traitId === 'forgiving' && memberTraits.has('strict')) return prev;

                if (isNegative) {
                    const currentNegativeTraits = [...memberTraits].filter(id => TRAITS_DATA.negative.some(t => t.id === id));
                    if (currentNegativeTraits.length > 0) {
                        return prev;
                    }
                }
                memberTraits.add(traitId);
            }
    
            if (memberTraits.size === 0) {
                newMap.delete(selectedFamilyMemberId);
            } else {
                newMap.set(selectedFamilyMemberId, memberTraits);
            }
            return newMap;
        });
    }, [selectedFamilyMemberId]);
    
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

    const handleUpgradeSelect = (id: string) => {
        setSelectedUpgrades(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                if (id === 'virtual_reality') setVrChamberCostType(null);
                if (id === 'private_island') setIslandExtraMiles(0);
                if (id === 'mythical_pet') setMythicalPetBeastName(null);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleTrueSelfTraitSelect = createMultiSelectHandler(setSelectedTrueSelfTraits);
    
    const handleAlterEgoTraitSelect = (id: string) => {
        setSelectedAlterEgoTraits(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                if (id === 'signature_vehicle') {
                    setAssignedVehicleName(null);
                }
                if (id === 'inhuman_appearance') {
                    setInhumanAppearanceBeastName(null);
                }
                if (id === 'exotic_appearance') {
                    newSet.delete('inhuman_appearance');
                    setInhumanAppearanceBeastName(null);
                }
            } else {
                if (id === 'inhuman_appearance' && !newSet.has('exotic_appearance')) {
                    return prevSet;
                }
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleMagicalStyleSelect = createMultiSelectHandler(setSelectedMagicalStyles);
    
    const handleHouseSelect = (id: string) => {
        if (selectedHouseId === 'mansion' && id !== 'mansion') {
            setMansionExtraSqFt(0);
        }
        setSelectedHouseId(prevId => prevId === id ? null : id);
    };

    const handleUniformSelect = (id: string) => {
        setSelectedUniforms(prev => {
            const newArray = [...prev];
            const index = newArray.indexOf(id);
            if (index > -1) {
                newArray.splice(index, 1);
            } else {
                newArray.push(id);
            }
            return newArray;
        });
    };

    const handleBuildTypeSelect = createSingleSelectHandler(setSelectedBuildTypeId);

    const isMultiplayer = selectedBuildTypeId === 'multiplayer';

    return {
        numParents, handleNumParentsChange,
        numSiblings, handleNumSiblingsChange,
        assignedTraits, handleTraitSelect,
        selectedFamilyMemberId, handleSelectFamilyMember,
        selectedHouseId, handleHouseSelect,
        selectedUpgrades, handleUpgradeSelect,
        selectedTrueSelfTraits, handleTrueSelfTraitSelect,
        selectedAlterEgoTraits, handleAlterEgoTraitSelect,
        selectedUniforms, handleUniformSelect,
        selectedMagicalStyles, handleMagicalStyleSelect,
        selectedBuildTypeId, handleBuildTypeSelect,
        isMultiplayer,
        vacationHomeCount, handleVacationHomeChange,
        mansionExtraSqFt, handleMansionSqFtChange,
        islandExtraMiles, handleIslandMilesChange,
        vrChamberCostType, handleVrChamberCostSelect,
        assignedVehicleName, handleAssignVehicle,
        blessedCompanions, handleAssignBlessedCompanion,
        mythicalPetBeastName, handleAssignMythicalPet,
        inhumanAppearanceBeastName, handleAssignInhumanAppearance,
    };
};