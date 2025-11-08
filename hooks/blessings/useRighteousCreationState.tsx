import { useState, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { RIGHTEOUS_CREATION_SIGIL_TREE_DATA, RIGHTEOUS_CREATION_MAGITECH_DATA, RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, RIGHTEOUS_CREATION_METAMAGIC_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const useRighteousCreationState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedRighteousCreationSigils, setSelectedRighteousCreationSigils] = useState<Set<string>>(new Set());
    const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set());
    const [selectedMagitechPowers, setSelectedMagitechPowers] = useState<Set<string>>(new Set());
    const [selectedArcaneConstructsPowers, setSelectedArcaneConstructsPowers] = useState<Set<string>>(new Set());
    const [selectedMetamagicPowers, setSelectedMetamagicPowers] = useState<Set<string>>(new Set());

    const { availableSpecialtyPicks, availableMagitechPicks, availableArcaneConstructsPicks, availableMetamagicPicks } = useMemo(() => {
        let specialty = 0, magitech = 0, arcaneConstructs = 0, metamagic = 0;
        selectedRighteousCreationSigils.forEach(sigilId => {
            const sigil = RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                specialty += sigil.benefits.specialty ?? 0;
                magitech += sigil.benefits.magitech ?? 0;
                arcaneConstructs += sigil.benefits.arcaneConstructs ?? 0;
                metamagic += sigil.benefits.metamagic ?? 0;
            }
        });
        return { availableSpecialtyPicks: specialty, availableMagitechPicks: magitech, availableArcaneConstructsPicks: arcaneConstructs, availableMetamagicPicks: metamagic };
    }, [selectedRighteousCreationSigils]);
    
    const handleRighteousCreationSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedRighteousCreationSigils);
        const sigil = RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                RIGHTEOUS_CREATION_SIGIL_TREE_DATA.forEach(child => {
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

            deselectDependent(RIGHTEOUS_CREATION_MAGITECH_DATA, selectedMagitechPowers, setSelectedMagitechPowers);
            deselectDependent(RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, selectedArcaneConstructsPowers, setSelectedArcaneConstructsPowers);
            deselectDependent(RIGHTEOUS_CREATION_METAMAGIC_DATA, selectedMetamagicPowers, setSelectedMetamagicPowers);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedRighteousCreationSigils(newSelected);
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

    const handleSpecialtySelect = createMultiSelectHandler(setSelectedSpecialties, availableSpecialtyPicks);
    const handleMagitechPowerSelect = createMultiSelectHandler(setSelectedMagitechPowers, availableMagitechPicks);
    const handleArcaneConstructsPowerSelect = createMultiSelectHandler(setSelectedArcaneConstructsPowers, availableArcaneConstructsPicks);
    const handleMetamagicPowerSelect = createMultiSelectHandler(setSelectedMetamagicPowers, availableMetamagicPicks);

    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedRighteousCreationSigils.forEach(id => {
            const sigil = RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        return used;
    }, [selectedRighteousCreationSigils]);
    
    return {
        selectedRighteousCreationSigils, handleRighteousCreationSigilSelect,
        selectedSpecialties, handleSpecialtySelect,
        selectedMagitechPowers, handleMagitechPowerSelect,
        selectedArcaneConstructsPowers, handleArcaneConstructsPowerSelect,
        selectedMetamagicPowers, handleMetamagicPowerSelect,
        availableSpecialtyPicks, availableMagitechPicks, availableArcaneConstructsPicks, availableMetamagicPicks,
        usedSigilCounts,
    };
};
