import { useState, useMemo, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { BITTER_DISSATISFACTION_SIGIL_TREE_DATA, BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const SIGIL_BP_COSTS: Record<string, number> = { kaarn: 3, purth: 5, juathas: 8, xuth: 12, lekolu: 4, sinthru: 10 };

export const useBitterDissatisfactionState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedBitterDissatisfactionSigils, setSelectedBitterDissatisfactionSigils] = useState<Set<string>>(new Set());
    const [selectedBrewing, setSelectedBrewing] = useState<Set<string>>(new Set());
    const [selectedSoulAlchemy, setSelectedSoulAlchemy] = useState<Set<string>>(new Set());
    const [selectedTransformation, setSelectedTransformation] = useState<Set<string>>(new Set());
    const [isBrewingBoosted, setIsBrewingBoosted] = useState(false);
    const [isSoulAlchemyBoosted, setIsSoulAlchemyBoosted] = useState(false);
    const [isTransformationBoosted, setIsTransformationBoosted] = useState(false);
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);
    const [humanMarionetteCount, setHumanMarionetteCount] = useState<number | null>(null);
    const [humanMarionetteCompanionName, setHumanMarionetteCompanionName] = useState<string | null>(null);
    
    const [mageFamiliarBeastName, setMageFamiliarBeastName] = useState<string | null>(null);
    const [beastmasterCount, setBeastmasterCount] = useState<number | null>(null);
    const [beastmasterBeastNames, setBeastmasterBeastNames] = useState<(string | null)[]>([]);
    
    const [shedHumanityBeastName, setShedHumanityBeastName] = useState<string | null>(null);
    const [malrayootsMageFormName, setMalrayootsMageFormName] = useState<string | null>(null);
    const [malrayootsUniversalFormName, setMalrayootsUniversalFormName] = useState<string | null>(null);

    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);
    
    const handleShedHumanityBeastAssign = (name: string | null) => {
        setShedHumanityBeastName(name);
    };

    const handleMalrayootsMageFormAssign = (name: string | null) => {
        setMalrayootsMageFormName(name);
    };
    const handleMalrayootsUniversalFormAssign = (name: string | null) => {
        setMalrayootsUniversalFormName(name);
    };

    const handleMageFamiliarBeastAssign = (name: string | null) => {
        setMageFamiliarBeastName(name);
    };

    const handleBeastmasterCountChange = (count: number | null) => {
        setBeastmasterCount(count);
        if (count === null || count === 0) {
            setBeastmasterBeastNames([]);
        } else {
            setBeastmasterBeastNames(Array(count).fill(null));
        }
    };

    const handleBeastmasterBeastAssign = (index: number, name: string | null) => {
        setBeastmasterBeastNames(prev => {
            const newArray = [...prev];
            if (index < newArray.length) {
                newArray[index] = name;
            }
            return newArray;
        });
    };

    const prevSoulAlchemyBoosted = useRef(isSoulAlchemyBoosted);
    useEffect(() => {
        if (prevSoulAlchemyBoosted.current && !isSoulAlchemyBoosted) {
            // Human Marionette logic
            const nonBoostedCounts = [1, 2, 4, 5, 10, 20, 25, 50];
            if (humanMarionetteCount && !nonBoostedCounts.includes(humanMarionetteCount)) {
                setHumanMarionetteCount(null);
            } else {
                setHumanMarionetteCompanionName(null);
            }

            // Familiar/Beastmaster logic
            setMageFamiliarBeastName(null);
            setBeastmasterBeastNames(prev => Array(prev.length).fill(null));
        }
        prevSoulAlchemyBoosted.current = isSoulAlchemyBoosted;
    }, [isSoulAlchemyBoosted, humanMarionetteCount]);

    const prevTransformationBoosted = useRef(isTransformationBoosted);
    useEffect(() => {
        if (prevTransformationBoosted.current && !isTransformationBoosted) {
            setShedHumanityBeastName(null);
        }
        prevTransformationBoosted.current = isTransformationBoosted;
    }, [isTransformationBoosted]);


    const { availableBrewingPicks, availableSoulAlchemyPicks, availableTransformationPicks } = useMemo(() => {
        let brewing = 0, soulAlchemy = 0, transformation = 0;
        selectedBitterDissatisfactionSigils.forEach(sigilId => {
            const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                if (sigil.id === 'fireborn') {
                    // Special case: choose 2 of 3
                    const selectedCount = (brewing > 0 ? 1:0) + (soulAlchemy > 0 ? 1:0) + (transformation > 0 ? 1:0);
                    if (selectedCount < 2) {
                        brewing += sigil.benefits.brewing ?? 0;
                        soulAlchemy += sigil.benefits.soulAlchemy ?? 0;
                        transformation += sigil.benefits.transformation ?? 0;
                    }
                } else {
                    brewing += sigil.benefits.brewing ?? 0;
                    soulAlchemy += sigil.benefits.soulAlchemy ?? 0;
                    transformation += sigil.benefits.transformation ?? 0;
                }
            }
        });
        return { availableBrewingPicks: brewing, availableSoulAlchemyPicks: soulAlchemy, availableTransformationPicks: transformation };
    }, [selectedBitterDissatisfactionSigils]);

    const totalBeastPoints = useMemo(() => {
        let points = 0;
        const boostAmount = isSoulAlchemyBoosted ? 10 : 0;

        if (selectedSoulAlchemy.has('mages_familiar_i')) points = 30 + boostAmount;
        if (selectedSoulAlchemy.has('mages_familiar_ii')) points = 60 + boostAmount;
        if (selectedSoulAlchemy.has('mages_familiar_iii')) points = 90 + boostAmount;

        return points;
    }, [selectedSoulAlchemy, isSoulAlchemyBoosted]);

    const shedHumanityPoints = useMemo(() => {
        let points = 0;
        const boostAmount = isTransformationBoosted ? 10 : 0;
        if (selectedTransformation.has('shed_humanity_i')) points = 50 + boostAmount;
        if (selectedTransformation.has('shed_humanity_ii')) points = 70 + boostAmount;
        return points;
    }, [selectedTransformation, isTransformationBoosted]);


    const handleBitterDissatisfactionSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedBitterDissatisfactionSigils);
        const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                BITTER_DISSATISFACTION_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));

            const deselectDependent = (powersData: any[], selectedSet: Set<string>, setFunc: Dispatch<SetStateAction<Set<string>>>) => {
                const newPowerSet = new Set(selectedSet);
                selectedSet.forEach(powerId => {
                    const power = powersData.find(p => p.id === powerId);
                    if(power?.requires?.some((req: string) => toRemove.has(req))) {
                        newPowerSet.delete(powerId);
                    }
                });
                setFunc(newPowerSet);
            };

            deselectDependent(BREWING_DATA, selectedBrewing, setSelectedBrewing);
            deselectDependent(SOUL_ALCHEMY_DATA, selectedSoulAlchemy, setSelectedSoulAlchemy);
            deselectDependent(TRANSFORMATION_DATA, selectedTransformation, setSelectedTransformation);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedBitterDissatisfactionSigils(newSelected);
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

    const handleBrewingSelect = createMultiSelectHandler(setSelectedBrewing, availableBrewingPicks);
    
    const handleSoulAlchemySelect = (id: string) => {
        setSelectedSoulAlchemy(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Clean up dependent state
                if (id === 'human_marionettes') {
                    setHumanMarionetteCount(null);
                    setHumanMarionetteCompanionName(null);
                }
                if (id === 'mages_familiar_i') { // Deselecting base power clears everything
                    setMageFamiliarBeastName(null);
                    setBeastmasterCount(null);
                    setBeastmasterBeastNames([]);
                    // Also deselect higher tiers and beastmaster
                    newSet.delete('mages_familiar_ii');
                    newSet.delete('mages_familiar_iii');
                    newSet.delete('beastmaster');
                }
                 if (id === 'beastmaster') {
                    setBeastmasterCount(null);
                    setBeastmasterBeastNames([]);
                }
            } else if (newSet.size < availableSoulAlchemyPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleTransformationSelect = (id: string) => {
        setSelectedTransformation(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
                if (id === 'shed_humanity_i') {
                    setShedHumanityBeastName(null);
                    newSet.delete('shed_humanity_ii');
                }
                if (id === 'malrayoots') {
                    setMalrayootsMageFormName(null);
                    setMalrayootsUniversalFormName(null);
                }
            } else if (newSet.size < availableTransformationPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };


    const handleHumanMarionetteCountChange = (count: number | null) => {
        setHumanMarionetteCount(count);
        setHumanMarionetteCompanionName(null);
    };

    const handleHumanMarionetteCompanionAssign = (name: string | null) => {
        setHumanMarionetteCompanionName(name);
    };

    const handleBitterDissatisfactionBoostToggle = (type: 'brewing' | 'soulAlchemy' | 'transformation') => {
        const toggleBoost = (isBoosted: boolean, setIsBoosted: Dispatch<SetStateAction<boolean>>) => {
            if (!isBoosted && availableSigilCounts.kaarn > 0) setIsBoosted(true);
            else setIsBoosted(false);
        }
        if (type === 'brewing') toggleBoost(isBrewingBoosted, setIsBrewingBoosted);
        if (type === 'soulAlchemy') toggleBoost(isSoulAlchemyBoosted, setIsSoulAlchemyBoosted);
        if (type === 'transformation') toggleBoost(isTransformationBoosted, setIsTransformationBoosted);
    };

    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedBitterDissatisfactionSigils.forEach(id => {
            const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        if(isBrewingBoosted) used.kaarn += 1;
        if(isSoulAlchemyBoosted) used.kaarn += 1;
        if(isTransformationBoosted) used.kaarn += 1;
        return used;
    }, [selectedBitterDissatisfactionSigils, isBrewingBoosted, isSoulAlchemyBoosted, isTransformationBoosted]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        selectedBitterDissatisfactionSigils.forEach(id => {
            const sigil = BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type && SIGIL_BP_COSTS[type]) {
                cost += SIGIL_BP_COSTS[type];
            }
        });
        return cost;
    }, [selectedBitterDissatisfactionSigils]);

    return {
        selectedBitterDissatisfactionSigils, handleBitterDissatisfactionSigilSelect,
        selectedBrewing, handleBrewingSelect,
        selectedSoulAlchemy, handleSoulAlchemySelect,
        selectedTransformation, handleTransformationSelect,
        isBrewingBoosted, isSoulAlchemyBoosted, isTransformationBoosted, handleBitterDissatisfactionBoostToggle,
        availableBrewingPicks, availableSoulAlchemyPicks, availableTransformationPicks,
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        humanMarionetteCount, handleHumanMarionetteCountChange,
        humanMarionetteCompanionName, handleHumanMarionetteCompanionAssign,
        totalBeastPoints,
        mageFamiliarBeastName, handleMageFamiliarBeastAssign,
        beastmasterCount, handleBeastmasterCountChange,
        beastmasterBeastNames, handleBeastmasterBeastAssign,
        shedHumanityPoints,
        shedHumanityBeastName, handleShedHumanityBeastAssign,
        malrayootsMageFormName, handleMalrayootsMageFormAssign,
        malrayootsUniversalFormName, handleMalrayootsUniversalFormAssign,
        usedSigilCounts,
    };
};