import React from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { STAR_CROSSED_LOVE_DATA, STAR_CROSSED_LOVE_SIGIL_TREE_DATA, STAR_CROSSED_LOVE_PACTS_DATA } from '../../constants';
import type { StarCrossedLovePact, StarCrossedLoveSigil } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { ChoiceCard } from '../TraitCard';

const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const StarCrossedLoveSection: React.FC = () => {
    const ctx = useCharacterContext();

    const isStarCrossedLovePactDisabled = (pact: StarCrossedLovePact): boolean => {
        return !ctx.selectedStarCrossedLovePacts.has(pact.id) && ctx.selectedStarCrossedLovePacts.size >= ctx.availablePactPicks;
    };
    
    const isStarCrossedLoveSigilDisabled = (sigil: StarCrossedLoveSigil): boolean => {
        if (ctx.selectedStarCrossedLoveSigils.has(sigil.id)) return false; // Can always deselect
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof typeof ctx.availableSigilCounts] < 1) return true;

        return false;
    };


    const getStarCrossedLoveSigil = (id: string) => STAR_CROSSED_LOVE_SIGIL_TREE_DATA.find(s => s.id === id)!;

    const getSigilDisplayInfo = (sigil: StarCrossedLoveSigil): { color: SigilColor, benefits: React.ReactNode } => {
        // FIX: Explicitly type colorMap to ensure color is inferred as SigilColor, not string.
        const colorMap: Record<string, SigilColor> = {
            'SWORN FEALTY': 'orange', 'DUAL LOYALTY': 'red',
        };
        const color = colorMap[sigil.title] || 'gray';
        const benefits = (
          <>
            {sigil.benefits.pacts ? <p className="text-amber-300">+ {sigil.benefits.pacts} Pact</p> : null}
          </>
        );
        return { color, benefits };
    };

    return (
        <section>
            <BlessingIntro {...STAR_CROSSED_LOVE_DATA} />
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getStarCrossedLoveSigil('sworn_fealty')} isSelected={ctx.selectedStarCrossedLoveSigils.has('sworn_fealty')} isDisabled={isStarCrossedLoveSigilDisabled(getStarCrossedLoveSigil('sworn_fealty'))} onSelect={ctx.handleStarCrossedLoveSigilSelect} benefitsContent={getSigilDisplayInfo(getStarCrossedLoveSigil('sworn_fealty')).benefits} color={getSigilDisplayInfo(getStarCrossedLoveSigil('sworn_fealty')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getStarCrossedLoveSigil('dual_loyalty')} isSelected={ctx.selectedStarCrossedLoveSigils.has('dual_loyalty')} isDisabled={ctx.selectedStarCrossedLoveSigils.size === 0 || isStarCrossedLoveSigilDisabled(getStarCrossedLoveSigil('dual_loyalty'))} onSelect={ctx.handleStarCrossedLoveSigilSelect} benefitsContent={getSigilDisplayInfo(getStarCrossedLoveSigil('dual_loyalty')).benefits} color={getSigilDisplayInfo(getStarCrossedLoveSigil('dual_loyalty')).color} />
                    </div>
                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>PACTS</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availablePactPicks - ctx.selectedStarCrossedLovePacts.size} / {ctx.availablePactPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STAR_CROSSED_LOVE_PACTS_DATA.map(pact => <ChoiceCard key={pact.id} item={{...pact, cost: ''}} isSelected={ctx.selectedStarCrossedLovePacts.has(pact.id)} onSelect={ctx.handleStarCrossedLovePactSelect} disabled={isStarCrossedLovePactDisabled(pact)} selectionColor="amber" />)}
                </div>
            </div>
        </section>
    );
};