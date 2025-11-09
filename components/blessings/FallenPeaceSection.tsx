import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { FALLEN_PEACE_DATA, FALLEN_PEACE_SIGIL_TREE_DATA, TELEPATHY_DATA, MENTAL_MANIPULATION_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { FallenPeacePower, FallenPeaceSigil, ChoiceItem } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';


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
}> = ({ power, isSelected, isDisabled, onToggle, children }) => {
    const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all h-full ${
        isSelected
        ? 'border-purple-400 ring-2 ring-purple-400/50'
        : isDisabled
            ? 'opacity-50 cursor-not-allowed border-gray-800'
            : 'border-white/10 hover:border-purple-400/70 cursor-pointer'
    }`;
    
    return (
        <div className={`${wrapperClass} relative`} onClick={() => !isDisabled && onToggle(power.id)}>
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

export const FallenPeaceSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const {
        selectedBlessingEngraving,
        fallenPeaceEngraving,
        handleFallenPeaceEngravingSelect,
        fallenPeaceWeaponName,
        handleFallenPeaceWeaponAssign,
        selectedTrueSelfTraits,
        isFallenPeaceMagicianApplied,
        handleToggleFallenPeaceMagician,
        disableFallenPeaceMagician,
        fallenPeaceSigilTreeCost,
    } = useCharacterContext();

    const finalEngraving = fallenPeaceEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isFallenPeaceMagicianApplied) {
            disableFallenPeaceMagician();
        }
    }, [isSkinEngraved, isFallenPeaceMagicianApplied, disableFallenPeaceMagician]);

    const isFallenPeacePowerDisabled = (power: FallenPeacePower, type: 'telepathy' | 'mental_manipulation'): boolean => {
        const selectedSet = type === 'telepathy' ? ctx.selectedTelepathy : ctx.selectedMentalManipulation;
        const availablePicks = type === 'telepathy' ? ctx.availableTelepathyPicks : ctx.availableMentalManipulationPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelectedPowersAndSigils = new Set([...ctx.selectedTelepathy, ...ctx.selectedMentalManipulation, ...ctx.selectedFallenPeaceSigils]);
            if (!power.requires.every(req => allSelectedPowersAndSigils.has(req))) return true;
        }
        return false;
    };

    const isFallenPeaceSigilDisabled = (sigil: FallenPeaceSigil): boolean => {
        if (ctx.selectedFallenPeaceSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedFallenPeaceSigils.has(p))) return true;
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getFallenPeaceSigil = (id: string) => FALLEN_PEACE_SIGIL_TREE_DATA.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: FallenPeaceSigil): { color: SigilColor, benefits: React.ReactNode } => {
        const colorMap: Record<string, SigilColor> = {
            'Left Brained': 'orange', 'Lobe': 'gray', 'Frontal Lobe': 'lime', 'Right Brained': 'red',
        };
        const color = colorMap[sigil.type] || 'gray';
        const benefits = (
            <>
                {sigil.benefits.telepathy ? <p className="text-blue-300">+ {sigil.benefits.telepathy} Telepathy</p> : null}
                {sigil.benefits.mentalManipulation ? <p className="text-purple-300">+ {sigil.benefits.mentalManipulation} Mental Manipulation</p> : null}
            </>
        );
        return { color, benefits };
    };

    const boostDescriptions: { [key: string]: string } = {
        thoughtseer: "Can simultaneously sense thoughts and feelings of entire crowds. Manipulation ability boosted.",
        lucid_dreamer: "Can invade dreams spiritually even while you’re still awake. Time seems to slow down within dreams, and emotions are more intense.",
        memory_lane: "Can see memories from much farther back. Better at breaking mental blocks.",
        mental_block: "Doubled either intensity of protection, or amount of memories that can be blocked.",
        perfect_stranger: "Halves the time to forget you.",
        masquerade: "Your disguise cant be seen through regardless of anyone’s level of willpower or psychic resistance.",
        psychic_vampire: "Always passively absorbing emotions within a miles radius.",
        master_telepath: "Significantly boosts intensity of illusions and difficulty of resistance.",
        crowd_control: "Doubles range and number of civilians that can be possessed.",
        hypnotist: "Significantly boosts length and intensity of control.",
        breaker_of_minds: "Max 20 agents."
    };

    const isTelepathyBoostDisabled = !ctx.isTelepathyBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isMentalManipulationBoostDisabled = !ctx.isMentalManipulationBoosted && ctx.availableSigilCounts.purth <= 0;

    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(fallenPeaceSigilTreeCost * 0.25);

    return (
        <section>
            <BlessingIntro {...FALLEN_PEACE_DATA} />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = fallenPeaceEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleFallenPeaceEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && fallenPeaceWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({fallenPeaceWeaponName})</p>
                                    )}
                                </button>
                                {isWeapon && isSelected && (
                                    <button
                                        onClick={() => setIsWeaponModalOpen(true)}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-purple-900/50 text-purple-200/70 hover:bg-purple-800/60 hover:text-purple-100 transition-colors z-10"
                                        aria-label="Change Weapon"
                                        title="Change Weapon"
                                    >
                                        <WeaponIcon />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                {isMagicianSelected && isSkinEngraved && (
                    <div className="text-center mt-4">
                        <button
                            onClick={handleToggleFallenPeaceMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isFallenPeaceMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {isFallenPeaceMagicianApplied
                                ? `The 'Magician' trait is applied. Click to remove. (+${additionalCost} BP)`
                                : `Click to apply the 'Magician' trait from your True Self. This allows you to use the Blessing without transforming for an additional ${additionalCost} BP.`}
                        </button>
                    </div>
                )}
            </div>

            {isWeaponModalOpen && (
                <WeaponSelectionModal
                    onClose={() => setIsWeaponModalOpen(false)}
                    onSelect={(weaponName) => {
                        handleFallenPeaceWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={fallenPeaceWeaponName}
                />
            )}
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex flex-col items-center gap-4">
                    <CompellingWillSigilCard sigil={getFallenPeaceSigil('left_brained')} isSelected={ctx.selectedFallenPeaceSigils.has('left_brained')} isDisabled={isFallenPeaceSigilDisabled(getFallenPeaceSigil('left_brained'))} onSelect={ctx.handleFallenPeaceSigilSelect} benefitsContent={getSigilDisplayInfo(getFallenPeaceSigil('left_brained')).benefits} color={getSigilDisplayInfo(getFallenPeaceSigil('left_brained')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getFallenPeaceSigil('parietal_lobe')} isSelected={ctx.selectedFallenPeaceSigils.has('parietal_lobe')} isDisabled={isFallenPeaceSigilDisabled(getFallenPeaceSigil('parietal_lobe'))} onSelect={ctx.handleFallenPeaceSigilSelect} benefitsContent={getSigilDisplayInfo(getFallenPeaceSigil('parietal_lobe')).benefits} color={getSigilDisplayInfo(getFallenPeaceSigil('parietal_lobe')).color} />
                        <CompellingWillSigilCard sigil={getFallenPeaceSigil('brocas_area')} isSelected={ctx.selectedFallenPeaceSigils.has('brocas_area')} isDisabled={isFallenPeaceSigilDisabled(getFallenPeaceSigil('brocas_area'))} onSelect={ctx.handleFallenPeaceSigilSelect} benefitsContent={getSigilDisplayInfo(getFallenPeaceSigil('brocas_area')).benefits} color={getSigilDisplayInfo(getFallenPeaceSigil('brocas_area')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <CompellingWillSigilCard sigil={getFallenPeaceSigil('frontal_lobe')} isSelected={ctx.selectedFallenPeaceSigils.has('frontal_lobe')} isDisabled={isFallenPeaceSigilDisabled(getFallenPeaceSigil('frontal_lobe'))} onSelect={ctx.handleFallenPeaceSigilSelect} benefitsContent={getSigilDisplayInfo(getFallenPeaceSigil('frontal_lobe')).benefits} color={getSigilDisplayInfo(getFallenPeaceSigil('frontal_lobe')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getFallenPeaceSigil('cerebellum')} isSelected={ctx.selectedFallenPeaceSigils.has('cerebellum')} isDisabled={isFallenPeaceSigilDisabled(getFallenPeaceSigil('cerebellum'))} onSelect={ctx.handleFallenPeaceSigilSelect} benefitsContent={getSigilDisplayInfo(getFallenPeaceSigil('cerebellum')).benefits} color={getSigilDisplayInfo(getFallenPeaceSigil('cerebellum')).color} />
                        <CompellingWillSigilCard sigil={getFallenPeaceSigil('temporal_lobe')} isSelected={ctx.selectedFallenPeaceSigils.has('temporal_lobe')} isDisabled={isFallenPeaceSigilDisabled(getFallenPeaceSigil('temporal_lobe'))} onSelect={ctx.handleFallenPeaceSigilSelect} benefitsContent={getSigilDisplayInfo(getFallenPeaceSigil('temporal_lobe')).benefits} color={getSigilDisplayInfo(getFallenPeaceSigil('temporal_lobe')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <CompellingWillSigilCard sigil={getFallenPeaceSigil('right_brained')} isSelected={ctx.selectedFallenPeaceSigils.has('right_brained')} isDisabled={isFallenPeaceSigilDisabled(getFallenPeaceSigil('right_brained'))} onSelect={ctx.handleFallenPeaceSigilSelect} benefitsContent={getSigilDisplayInfo(getFallenPeaceSigil('right_brained')).benefits} color={getSigilDisplayInfo(getFallenPeaceSigil('right_brained')).color} />
                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>Telepathy</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isTelepathyBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isTelepathyBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isTelepathyBoostDisabled ? () => ctx.handleFallenPeaceBoostToggle('telepathy') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isTelepathyBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isTelepathyBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableTelepathyPicks - ctx.selectedTelepathy.size} / {ctx.availableTelepathyPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TELEPATHY_DATA.map(power => {
                        const boostedText = ctx.isTelepathyBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        return <PowerCard key={power.id} power={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedTelepathy.has(power.id)} onToggle={ctx.handleTelepathySelect} isDisabled={isFallenPeacePowerDisabled(power, 'telepathy')} />
                    })}
                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>Mental Manipulation</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isMentalManipulationBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isMentalManipulationBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isMentalManipulationBoostDisabled ? () => ctx.handleFallenPeaceBoostToggle('mentalManipulation') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isMentalManipulationBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isMentalManipulationBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Purth sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableMentalManipulationPicks - ctx.selectedMentalManipulation.size} / {ctx.availableMentalManipulationPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(() => {
                        const specialPower = MENTAL_MANIPULATION_DATA.find(p => p.id === 'breaker_of_minds');
                        const otherPowers = MENTAL_MANIPULATION_DATA.filter(p => p.id !== 'breaker_of_minds');
                        
                        const firstHalf = otherPowers.slice(0, 3);
                        const secondHalf = otherPowers.slice(3);

                        const renderPower = (power: FallenPeacePower) => {
                            const boostedText = ctx.isMentalManipulationBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                            return <PowerCard 
                                key={power.id} 
                                power={{...power, cost: '', description: power.description + boostedText}} 
                                isSelected={ctx.selectedMentalManipulation.has(power.id)} 
                                onToggle={ctx.handleMentalManipulationSelect} 
                                isDisabled={isFallenPeacePowerDisabled(power, 'mental_manipulation')} />
                        };

                        return (
                            <>
                                {firstHalf.map(renderPower)}
                                {specialPower && (
                                    <div key={specialPower.id} className="lg:row-span-2">
                                        {renderPower(specialPower)}
                                    </div>
                                )}
                                {secondHalf.map(renderPower)}
                            </>
                        );
                    })()}
                </div>
            </div>
        </section>
    );
};