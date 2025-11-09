import React, { useState } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { STAR_CROSSED_LOVE_DATA, STAR_CROSSED_LOVE_SIGIL_TREE_DATA, STAR_CROSSED_LOVE_PACTS_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { StarCrossedLovePact, StarCrossedLoveSigil, ChoiceItem } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, CompanionIcon } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { BeastSelectionModal } from '../BeastSelectionModal';

const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const PowerCard: React.FC<{
    power: ChoiceItem;
    isSelected: boolean;
    isDisabled: boolean;
    onToggle: (id: string) => void;
    children?: React.ReactNode;
    iconButton?: React.ReactNode;
    onIconButtonClick?: () => void;
}> = ({ power, isSelected, isDisabled, onToggle, children, iconButton, onIconButtonClick }) => {
    const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all h-full ${
        isSelected
        ? 'border-purple-400 ring-2 ring-purple-400/50'
        : isDisabled
            ? 'opacity-50 cursor-not-allowed border-gray-800'
            : 'border-white/10 hover:border-purple-400/70 cursor-pointer'
    }`;

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onIconButtonClick?.();
    };
    
    return (
        <div className={`${wrapperClass} relative`} onClick={() => !isDisabled && onToggle(power.id)}>
            {iconButton && onIconButtonClick && isSelected && (
                <button
                    onClick={handleIconClick}
                    className="absolute top-2 right-2 p-2 rounded-full bg-purple-900/50 text-purple-200/70 hover:bg-purple-800/60 hover:text-purple-100 transition-colors z-10"
                    aria-label="Card action"
                >
                    {iconButton}
                </button>
            )}
            <img src={power.imageSrc} alt={power.title} className="w-full h-40 rounded-md mb-4 object-cover" />
            <h4 className="font-cinzel font-bold text-white tracking-wider text-xl">{power.title}</h4>
            {power.cost && <p className="text-xs text-yellow-300/70 italic mt-1">{power.cost}</p>}
            <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>
            <p className="text-xs text-gray-400 leading-relaxed flex-grow text-left whitespace-pre-wrap">{power.description}</p>
            {children && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50">
                    {children}
                 </div>
            )}
        </div>
    );
};

export const StarCrossedLoveSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isOnisBlessingModalOpen, setIsOnisBlessingModalOpen] = useState(false);

    const {
        onisBlessingGuardianName,
        handleOnisBlessingGuardianAssign,
    } = useCharacterContext();

    const isStarCrossedLovePactDisabled = (pact: StarCrossedLovePact): boolean => {
        return !ctx.selectedStarCrossedLovePacts.has(pact.id) && ctx.selectedStarCrossedLovePacts.size >= ctx.availablePactPicks;
    };
    
    const isStarCrossedLoveSigilDisabled = (sigil: StarCrossedLoveSigil): boolean => {
        if (ctx.selectedStarCrossedLoveSigils.has(sigil.id)) return false; // Can always deselect
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        if (sigil.id === 'dual_loyalty' && !ctx.selectedStarCrossedLoveSigils.has('sworn_fealty')) return true;

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
                        <CompellingWillSigilCard sigil={getStarCrossedLoveSigil('dual_loyalty')} isSelected={ctx.selectedStarCrossedLoveSigils.has('dual_loyalty')} isDisabled={isStarCrossedLoveSigilDisabled(getStarCrossedLoveSigil('dual_loyalty'))} onSelect={ctx.handleStarCrossedLoveSigilSelect} benefitsContent={getSigilDisplayInfo(getStarCrossedLoveSigil('dual_loyalty')).benefits} color={getSigilDisplayInfo(getStarCrossedLoveSigil('dual_loyalty')).color} />
                    </div>
                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>PACTS</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availablePactPicks - ctx.selectedStarCrossedLovePacts.size} / {ctx.availablePactPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STAR_CROSSED_LOVE_PACTS_DATA.map(pact => {
                        const isSelected = ctx.selectedStarCrossedLovePacts.has(pact.id);
                        const isAsmodeus = pact.id === 'onis_blessing';
                        return (
                            <PowerCard 
                                key={pact.id} 
                                power={{...pact, cost: ''}} 
                                isSelected={isSelected} 
                                onToggle={ctx.handleStarCrossedLovePactSelect} 
                                isDisabled={isStarCrossedLovePactDisabled(pact)} 
                                iconButton={isAsmodeus && isSelected ? <CompanionIcon /> : undefined}
                                onIconButtonClick={isAsmodeus && isSelected ? () => setIsOnisBlessingModalOpen(true) : undefined}
                            >
                                {isAsmodeus && isSelected && onisBlessingGuardianName && (
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400">Assigned Guardian:</p>
                                        <p className="text-sm font-bold text-amber-300">{onisBlessingGuardianName}</p>
                                    </div>
                                )}
                            </PowerCard>
                        )
                    })}
                </div>
            </div>
            {isOnisBlessingModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsOnisBlessingModalOpen(false)}
                    onSelect={(name) => {
                        handleOnisBlessingGuardianAssign(name);
                        setIsOnisBlessingModalOpen(false);
                    }}
                    currentBeastName={onisBlessingGuardianName}
                    pointLimit={100}
                    title="Assign Oni's Guardian"
                />
            )}
        </section>
    );
};