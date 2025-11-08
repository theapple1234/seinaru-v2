import { useState, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { STAR_CROSSED_LOVE_SIGIL_TREE_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const useStarCrossedLoveState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedStarCrossedLoveSigils, setSelectedStarCrossedLoveSigils] = useState<Set<string>>(new Set());
    const [selectedStarCrossedLovePacts, setSelectedStarCrossedLovePacts] = useState<Set<string>>(new Set());

    const { availablePactPicks } = useMemo(() => {
        let pacts = 0;
        selectedStarCrossedLoveSigils.forEach(sigilId => {
            const sigil = STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                pacts += sigil.benefits.pacts ?? 0;
            }
        });
        return { availablePactPicks: pacts };
    }, [selectedStarCrossedLoveSigils]);

    const handleStarCrossedLoveSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedStarCrossedLoveSigils);
        const sigil = STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            newSelected.delete(sigilId);
        } else {
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedStarCrossedLoveSigils(newSelected);
    };

    const handleStarCrossedLovePactSelect = (id: string) => {
        setSelectedStarCrossedLovePacts(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else if (newSet.size < availablePactPicks) {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedStarCrossedLoveSigils.forEach(id => {
            const sigil = STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        return used;
    }, [selectedStarCrossedLoveSigils]);

    return {
        selectedStarCrossedLoveSigils, handleStarCrossedLoveSigilSelect,
        selectedStarCrossedLovePacts, handleStarCrossedLovePactSelect,
        availablePactPicks,
        usedSigilCounts,
    };
};
