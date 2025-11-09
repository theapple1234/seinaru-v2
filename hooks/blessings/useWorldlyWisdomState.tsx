import { useState, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { WORLDLY_WISDOM_SIGIL_TREE_DATA, ELEANORS_TECHNIQUES_DATA, GENEVIEVES_TECHNIQUES_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const SIGIL_BP_COSTS: Record<string, number> = { kaarn: 3, purth: 5, juathas: 8, xuth: 12, lekolu: 4, sinthru: 10 };

export const useWorldlyWisdomState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedWorldlyWisdomSigils, setSelectedWorldlyWisdomSigils] = useState<Set<string>>(new Set());
    const [selectedEleanorsTechniques, setSelectedEleanorsTechniques] = useState<Set<string>>(new Set());
    const [selectedGenevievesTechniques, setSelectedGenevievesTechniques] = useState<Set<string>>(new Set());
    const [isEleanorsTechniquesBoosted, setIsEleanorsTechniquesBoosted] = useState(false);
    const [isGenevievesTechniquesBoosted, setIsGenevievesTechniquesBoosted] = useState(false);
    const [isMagicianApplied, setIsMagicianApplied] = useState(false);
    const handleToggleMagician = () => setIsMagicianApplied(prev => !prev);
    const disableMagician = () => setIsMagicianApplied(false);

    const { availableEleanorsPicks, availableGenevievesPicks } = useMemo(() => {
        let eleanors = 0;
        let genevieves = 0;
        selectedWorldlyWisdomSigils.forEach(sigilId => {
            const sigil = WORLDLY_WISDOM_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if (sigil) {
                eleanors += sigil.benefits.eleanors ?? 0;
                genevieves += sigil.benefits.genevieves ?? 0;
            }
        });
        return { availableEleanorsPicks: eleanors, availableGenevievesPicks: genevieves };
    }, [selectedWorldlyWisdomSigils]);
    
    const handleWorldlyWisdomSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedWorldlyWisdomSigils);
        const sigil = WORLDLY_WISDOM_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                WORLDLY_WISDOM_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));
            
            // Deselect dependent powers
            const newEleanors = new Set(selectedEleanorsTechniques);
            selectedEleanorsTechniques.forEach(powerId => {
                const power = ELEANORS_TECHNIQUES_DATA.find(p => p.id === powerId);
                if(power?.requires?.some(req => toRemove.has(req))) {
                    newEleanors.delete(powerId);
                }
            });
            setSelectedEleanorsTechniques(newEleanors);

            const newGenevieves = new Set(selectedGenevievesTechniques);
            selectedGenevievesTechniques.forEach(powerId => {
                const power = GENEVIEVES_TECHNIQUES_DATA.find(p => p.id === powerId);
                if(power?.requires?.some(req => toRemove.has(req))) {
                    newGenevieves.delete(powerId);
                }
            });
            setSelectedGenevievesTechniques(newGenevieves);

        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedWorldlyWisdomSigils(newSelected);
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

    const handleEleanorsTechniqueSelect = createMultiSelectHandler(setSelectedEleanorsTechniques, availableEleanorsPicks);
    const handleGenevievesTechniqueSelect = createMultiSelectHandler(setSelectedGenevievesTechniques, availableGenevievesPicks);

    const handleWorldlyWisdomBoostToggle = (type: 'eleanorsTechniques' | 'genevievesTechniques') => {
        if (type === 'eleanorsTechniques') {
            if (!isEleanorsTechniquesBoosted && availableSigilCounts.kaarn > 0) setIsEleanorsTechniquesBoosted(true);
            else setIsEleanorsTechniquesBoosted(false);
        }
        if (type === 'genevievesTechniques') {
            if (!isGenevievesTechniquesBoosted && availableSigilCounts.purth > 0) setIsGenevievesTechniquesBoosted(true);
            else setIsGenevievesTechniquesBoosted(false);
        }
    };
    
    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedWorldlyWisdomSigils.forEach(id => {
            const sigil = WORLDLY_WISDOM_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) {
                used[type] += 1;
            }
        });
        if(isEleanorsTechniquesBoosted) used.kaarn +=1;
        if(isGenevievesTechniquesBoosted) used.purth +=1;
        return used;
    }, [selectedWorldlyWisdomSigils, isEleanorsTechniquesBoosted, isGenevievesTechniquesBoosted]);
    
    const sigilTreeCost = useMemo(() => {
        let cost = 0;
        selectedWorldlyWisdomSigils.forEach(id => {
            const sigil = WORLDLY_WISDOM_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type && SIGIL_BP_COSTS[type]) {
                cost += SIGIL_BP_COSTS[type];
            }
        });
        return cost;
    }, [selectedWorldlyWisdomSigils]);

    return {
        selectedWorldlyWisdomSigils, handleWorldlyWisdomSigilSelect,
        selectedEleanorsTechniques, handleEleanorsTechniqueSelect,
        selectedGenevievesTechniques, handleGenevievesTechniqueSelect,
        isEleanorsTechniquesBoosted, handleWorldlyWisdomBoostToggle,
        isGenevievesTechniquesBoosted,
        availableEleanorsPicks,
        availableGenevievesPicks,
        isMagicianApplied,
        handleToggleMagician,
        disableMagician,
        sigilTreeCost,
        usedSigilCounts,
    };
};