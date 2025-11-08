import { useState, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { BITTER_DISSATISFACTION_SIGIL_TREE_DATA, BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const useBitterDissatisfactionState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedBitterDissatisfactionSigils, setSelectedBitterDissatisfactionSigils] = useState<Set<string>>(new Set());
    const [selectedBrewing, setSelectedBrewing] = useState<Set<string>>(new Set());
    const [selectedSoulAlchemy, setSelectedSoulAlchemy] = useState<Set<string>>(new Set());
    const [selectedTransformation, setSelectedTransformation] = useState<Set<string>>(new Set());
    const [isBrewingBoosted, setIsBrewingBoosted] = useState(false);
    const [isSoulAlchemyBoosted, setIsSoulAlchemyBoosted] = useState(false);
    const [isTransformationBoosted, setIsTransformationBoosted] = useState(false);

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
    const handleSoulAlchemySelect = createMultiSelectHandler(setSelectedSoulAlchemy, availableSoulAlchemyPicks);
    const handleTransformationSelect = createMultiSelectHandler(setSelectedTransformation, availableTransformationPicks);

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

    return {
        selectedBitterDissatisfactionSigils, handleBitterDissatisfactionSigilSelect,
        selectedBrewing, handleBrewingSelect,
        selectedSoulAlchemy, handleSoulAlchemySelect,
        selectedTransformation, handleTransformationSelect,
        isBrewingBoosted, isSoulAlchemyBoosted, isTransformationBoosted, handleBitterDissatisfactionBoostToggle,
        availableBrewingPicks, availableSoulAlchemyPicks, availableTransformationPicks,
        usedSigilCounts,
    };
};
