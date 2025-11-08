import { useState, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SigilCounts } from '../../types';
import { GRACIOUS_DEFEAT_SIGIL_TREE_DATA, INFLUENCE_DATA } from '../../constants';

const getSigilTypeFromImage = (imageSrc: string): keyof SigilCounts | null => {
    const sigilImageMap: {[key: string]: keyof SigilCounts} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const useGraciousDefeatState = ({ availableSigilCounts }: { availableSigilCounts: SigilCounts }) => {
    const [selectedGraciousDefeatSigils, setSelectedGraciousDefeatSigils] = useState<Set<string>>(new Set());
    const [selectedEntrance, setSelectedEntrance] = useState<Set<string>>(new Set());
    const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
    const [selectedInfluence, setSelectedInfluence] = useState<Set<string>>(new Set());
    const [isFeaturesBoosted, setIsFeaturesBoosted] = useState(false);

    const { availableEntrancePicks, availableFeaturesPicks, availableInfluencePicks } = useMemo(() => {
        let entrance = 0, features = 0, influence = 0;
        selectedGraciousDefeatSigils.forEach(sigilId => {
            const sigil = GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === sigilId);
            if(sigil) {
                entrance += sigil.benefits.entrance ?? 0;
                features += sigil.benefits.features ?? 0;
                influence += sigil.benefits.influence ?? 0;
            }
        });
        return { availableEntrancePicks: entrance, availableFeaturesPicks: features, availableInfluencePicks: influence };
    }, [selectedGraciousDefeatSigils]);

    const handleGraciousDefeatSigilSelect = (sigilId: string) => {
        const newSelected = new Set(selectedGraciousDefeatSigils);
        const sigil = GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === sigilId);
        if (!sigil) return;

        if (newSelected.has(sigilId)) {
            const toRemove = new Set<string>();
            const queue = [sigilId];
            toRemove.add(sigilId);
            while(queue.length > 0) {
                const currentId = queue.shift()!;
                GRACIOUS_DEFEAT_SIGIL_TREE_DATA.forEach(child => {
                    if (child.prerequisites.includes(currentId) && newSelected.has(child.id) && !toRemove.has(child.id)) {
                        toRemove.add(child.id);
                        queue.push(child.id);
                    }
                });
            }
            toRemove.forEach(id => newSelected.delete(id));
            
            const newInfluence = new Set(selectedInfluence);
            selectedInfluence.forEach(powerId => {
                const power = INFLUENCE_DATA.find(p => p.id === powerId);
                if(power?.requires?.some(req => toRemove.has(req))) {
                    newInfluence.delete(powerId);
                }
            });
            setSelectedInfluence(newInfluence);
            
        } else {
            const canSelect = sigil.prerequisites.every(p => newSelected.has(p));
            const sigilType = getSigilTypeFromImage(sigil.imageSrc);
            const sigilCost = sigilType ? 1 : 0;
            const hasSigil = sigilType ? availableSigilCounts[sigilType] >= sigilCost : true;

            if (canSelect && hasSigil) {
                newSelected.add(sigilId);
            }
        }
        setSelectedGraciousDefeatSigils(newSelected);
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

    const handleEntranceSelect = createMultiSelectHandler(setSelectedEntrance, availableEntrancePicks);
    const handleFeaturesSelect = createMultiSelectHandler(setSelectedFeatures, availableFeaturesPicks);
    const handleInfluenceSelect = createMultiSelectHandler(setSelectedInfluence, availableInfluencePicks);

    const handleGraciousDefeatBoostToggle = (type: 'features') => {
        if (type === 'features') {
            if (!isFeaturesBoosted && availableSigilCounts.kaarn > 0) setIsFeaturesBoosted(true);
            else setIsFeaturesBoosted(false);
        }
    };
    
    const usedSigilCounts = useMemo((): SigilCounts => {
        const used: SigilCounts = { kaarn: 0, purth: 0, juathas: 0, xuth: 0, sinthru: 0, lekolu: 0 };
        selectedGraciousDefeatSigils.forEach(id => {
            const sigil = GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === id);
            const type = sigil ? getSigilTypeFromImage(sigil.imageSrc) : null;
            if (type) used[type] += 1;
        });
        if(isFeaturesBoosted) used.kaarn += 1;
        return used;
    }, [selectedGraciousDefeatSigils, isFeaturesBoosted]);
    
    return {
        selectedGraciousDefeatSigils, handleGraciousDefeatSigilSelect,
        selectedEntrance, handleEntranceSelect,
        selectedFeatures, handleFeaturesSelect,
        selectedInfluence, handleInfluenceSelect,
        isFeaturesBoosted, handleGraciousDefeatBoostToggle,
        availableEntrancePicks, availableFeaturesPicks, availableInfluencePicks,
        usedSigilCounts,
    };
};
