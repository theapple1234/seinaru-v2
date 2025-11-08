import { useState, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { CLOSED_CIRCUITS_SIGIL_TREE_DATA, NET_AVATAR_DATA, TECHNOMANCY_DATA, NANITE_CONTROL_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const useClosedCircuitsState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedClosedCircuitsSigils, setSelectedClosedCircuitsSigils] = useState<Set<string>>(new Set());
    const [selectedNetAvatars, setSelectedNetAvatars] = useState<Set<string>>(new Set());
    const [selectedTechnomancies, setSelectedTechnomancies] = useState<Set<string>>(new Set());
    const [selectedNaniteControls, setSelectedNaniteControls] = useState<Set<string>>(new Set());
    const [isTechnomancyBoosted, setIsTechnomancyBoosted] = useState(false);
    const [isNaniteControlBoosted, setIsNaniteControlBoosted] = useState(false);
    
    const { availableNetAvatarPicks, availableTechnomancyPicks, availableNaniteControlPicks } = useMemo(() => {
        let netAvatar = 0, technomancy = 0, naniteControl = 0;
        selectedClosedCircuitsSigils.forEach(sigilId => {
            const sigil = CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                netAvatar += sigil.benefits.netAvatar ?? 0;
                technomancy += sigil.benefits.technomancy ?? 0;
                naniteControl += sigil.benefits.naniteControl ?? 0;
            }
        });
        return { availableNetAvatarPicks: netAvatar, availableTechnomancyPicks: technomancy, availableNaniteControlPicks: naniteControl };
    }, [selectedClosedCircuitsSigils]);
    
    const handleClosedCircuitsSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedClosedCircuitsSigils);
        const sigil = CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                CLOSED_CIRCUITS_SIGIL_TREE_DATA.forEach(child => {
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

            deselectDependent(NET_AVATAR_DATA, selectedNetAvatars, setSelectedNetAvatars);
            deselectDependent(TECHNOMANCY_DATA, selectedTechnomancies, setSelectedTechnomancies);
            deselectDependent(NANITE_CONTROL_DATA, selectedNaniteControls, setSelectedNaniteControls);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedClosedCircuitsSigils(newSelected);
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

    const handleNetAvatarSelect = createMultiSelectHandler(setSelectedNetAvatars, availableNetAvatarPicks);
    const handleTechnomancySelect = createMultiSelectHandler(setSelectedTechnomancies, availableTechnomancyPicks);
    const handleNaniteControlSelect = createMultiSelectHandler(setSelectedNaniteControls, availableNaniteControlPicks);

    const handleClosedCircuitsBoostToggle = (type: 'technomancy' | 'naniteControl') => {
        if (type === 'technomancy') {
            if (!isTechnomancyBoosted && availableSigilCounts.kaarn > 0) setIsTechnomancyBoosted(true);
            else setIsTechnomancyBoosted(false);
        }
        if (type === 'naniteControl') {
            if (!isNaniteControlBoosted && availableSigilCounts.purth > 0) setIsNaniteControlBoosted(true);
            else setIsNaniteControlBoosted(false);
        }
    };
    
    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedClosedCircuitsSigils.forEach(id => {
            const sigil = CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        if (isTechnomancyBoosted) used.kaarn += 1;
        if (isNaniteControlBoosted) used.purth += 1;
        return used;
    }, [selectedClosedCircuitsSigils, isTechnomancyBoosted, isNaniteControlBoosted]);
    
    return {
        selectedClosedCircuitsSigils, handleClosedCircuitsSigilSelect,
        selectedNetAvatars, handleNetAvatarSelect,
        selectedTechnomancies, handleTechnomancySelect,
        selectedNaniteControls, handleNaniteControlSelect,
        isTechnomancyBoosted, isNaniteControlBoosted, handleClosedCircuitsBoostToggle,
        availableNetAvatarPicks, availableTechnomancyPicks, availableNaniteControlPicks,
        usedSigilCounts,
    };
};
