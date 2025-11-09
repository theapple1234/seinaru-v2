import React, { useState } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { GRACIOUS_DEFEAT_DATA, GRACIOUS_DEFEAT_SIGIL_TREE_DATA, ENTRANCE_DATA, FEATURES_DATA, INFLUENCE_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { GraciousDefeatPower, GraciousDefeatSigil } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon, CompanionIcon } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';
import { CompanionSelectionModal } from '../SigilTreeOptionCard';
import { BeastSelectionModal } from '../BeastSelectionModal';


const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

const FeatureCounterCard: React.FC<{
    power: GraciousDefeatPower;
    count: number;
    onCountChange: (newCount: number) => void;
    isSelectionDisabled: boolean;
    calculateDisplayValue?: (count: number) => string;
}> = ({ power, count, onCountChange, isSelectionDisabled, calculateDisplayValue }) => {
    const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all ${
        count > 0
        ? 'border-purple-400 ring-2 ring-purple-400/50'
        : isSelectionDisabled
            ? 'opacity-50 border-gray-800'
            : 'border-white/10'
    }`;

    return (
        <div className={wrapperClass}>
            <img src={power.imageSrc} alt={power.title} className="w-full h-40 rounded-md mb-4 object-cover" />
            <h4 className="font-cinzel font-bold text-white tracking-wider text-xl">{power.title}</h4>
            <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>
            <p className="text-xs text-gray-400 leading-relaxed flex-grow text-left whitespace-pre-wrap">{power.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onCountChange(count - 1)} disabled={count === 0} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">-</button>
                    <span className={`font-semibold w-24 text-center ${count > 0 ? 'text-white' : 'text-gray-500'}`}>
                        {calculateDisplayValue ? calculateDisplayValue(count) : `${count} taken`}
                    </span>
                    <button onClick={() => onCountChange(count + 1)} disabled={isSelectionDisabled} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">+</button>
                </div>
            </div>
        </div>
    );
};

const FeatureToggleCard: React.FC<{
    power: GraciousDefeatPower;
    isSelected: boolean;
    isDisabled: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
}> = ({ power, isSelected, isDisabled, onToggle, children }) => {
    const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all ${
        isSelected
        ? 'border-purple-400 ring-2 ring-purple-400/50'
        : isDisabled
            ? 'opacity-50 cursor-not-allowed border-gray-800'
            : 'border-white/10 hover:border-purple-400/70 cursor-pointer'
    }`;
    
    return (
        <div className={`${wrapperClass} relative`} onClick={isDisabled ? undefined : onToggle}>
            <img src={power.imageSrc} alt={power.title} className="w-full h-40 rounded-md mb-4 object-cover" />
            <h4 className="font-cinzel font-bold text-white tracking-wider text-xl">{power.title}</h4>
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


export const GraciousDefeatSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const [attendantModalState, setAttendantModalState] = useState<{ isOpen: boolean, index: number | null }>({ isOpen: false, index: null });
    const [livingInhabitantModalState, setLivingInhabitantModalState] = useState<{ isOpen: boolean; id: number | null; type: 'populated' | 'rarer' | null }>({ isOpen: false, id: null, type: null });
    const [isOverlordModalOpen, setIsOverlordModalOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        graciousDefeatEngraving,
        handleGraciousDefeatEngravingSelect,
        graciousDefeatWeaponName,
        handleGraciousDefeatWeaponAssign,
        verseAttendantCount,
        handleVerseAttendantCountChange,
        verseAttendantCompanionNames,
        handleVerseAttendantCompanionAssign,
        livingInhabitants,
        addLivingInhabitant,
        removeLivingInhabitant,
        assignLivingInhabitantBeast,
        overlordBeastName,
        handleOverlordBeastAssign,
        featurePicksUsed,
    } = useCharacterContext();

    const openCompanionModal = (index: number) => {
        setAttendantModalState({ isOpen: true, index });
    };

    const closeCompanionModal = () => {
        setAttendantModalState({ isOpen: false, index: null });
    };

    const isGraciousDefeatPowerDisabled = (power: GraciousDefeatPower, type: 'entrance' | 'influence'): boolean => {
        if (type === 'entrance') {
            const selectedSet = ctx.selectedEntrance;
            const availablePicks = ctx.availableEntrancePicks;
            if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        } else { // influence
            const selectedSet = ctx.selectedInfluence;
            const availablePicks = ctx.availableInfluencePicks;
            if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        }
        
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedEntrance, ...ctx.selectedInfluence, ...ctx.selectedGraciousDefeatSigils]);
            if(power.id === 'summon_attendant' && verseAttendantCount === 0) return true;
            if (!power.requires.every(req => allSelected.has(req) || (req === 'verse_attendant' && verseAttendantCount > 0))) return true;
        }
        return false;
    };

    const isGraciousDefeatSigilDisabled = (sigil: GraciousDefeatSigil): boolean => {
        if (ctx.selectedGraciousDefeatSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedGraciousDefeatSigils.has(p))) return true;
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getGraciousDefeatSigil = (id: string) => GRACIOUS_DEFEAT_SIGIL_TREE_DATA.find(s => s.id === id)!;

    const getSigilDisplayInfo = (sigil: GraciousDefeatSigil): { color: SigilColor, benefits: React.ReactNode } => {
        const colorMap: Record<string, SigilColor> = {
            'Fireborn': 'orange', 'Cultivate': 'gray', 'Realmkeeper': 'yellow', 'Strengthen': 'lime',
            'Sweet Suffering': 'purple', 'Pocket God': 'red', 'Realmmaster': 'yellow',
        };
        const color = colorMap[sigil.type] || 'gray';
        const benefits = (
            <>
                {sigil.benefits.entrance ? <p className="text-blue-300">+ {sigil.benefits.entrance} Entrance</p> : null}
                {sigil.benefits.features ? <p className="text-green-300">+ {sigil.benefits.features} Features</p> : null}
                {sigil.benefits.influence ? <p className="text-red-300">+ {sigil.benefits.influence} Influence</p> : null}
            </>
        );
        return { color, benefits };
    };

    const boostDescriptions: { [key: string]: string } = {
        natural_environment: "Triples acreage instead of doubles.",
        artificial_environment: "Triples acreage instead of doubles.",
        shifting_weather: "Doubles the potential power and damage of weather events.",
        living_inhabitants: "+10 Beast Points.",
        broken_space: "Can create spatial “booby traps” that are near-impossible to survive or navigate at limited areas of the verse.",
        broken_time: "Can set a day in the verse to be a month in real time.",
        promised_land: "Triples population limit instead of doubles.",
        verse_attendant: "+50 Companion Points."
    };

    const isFeaturesBoostDisabled = !ctx.isFeaturesBoosted && ctx.availableSigilCounts.kaarn <= 0;
    
    const featureStateMap = {
        'natural_environment': { count: ctx.naturalEnvironmentCount, handler: ctx.handleNaturalEnvironmentCountChange },
        'artificial_environment': { count: ctx.artificialEnvironmentCount, handler: ctx.handleArtificialEnvironmentCountChange },
        'shifting_weather': { count: ctx.shiftingWeatherCount, handler: ctx.handleShiftingWeatherCountChange },
        'broken_space': { count: ctx.brokenSpaceCount, handler: ctx.handleBrokenSpaceCountChange },
        'broken_time': { count: ctx.brokenTimeCount, handler: ctx.handleBrokenTimeCountChange },
        'promised_land': { count: ctx.promisedLandCount, handler: ctx.handlePromisedLandCountChange },
    };

    return (
        <section>
            <BlessingIntro {...GRACIOUS_DEFEAT_DATA} />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const finalEngraving = graciousDefeatEngraving ?? selectedBlessingEngraving;
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = graciousDefeatEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleGraciousDefeatEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && graciousDefeatWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({graciousDefeatWeaponName})</p>
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
            </div>

            {isWeaponModalOpen && (
                <WeaponSelectionModal
                    onClose={() => setIsWeaponModalOpen(false)}
                    onSelect={(weaponName) => {
                        handleGraciousDefeatWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={graciousDefeatWeaponName}
                />
            )}
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <CompellingWillSigilCard sigil={getGraciousDefeatSigil('gd_fireborn')} isSelected={ctx.selectedGraciousDefeatSigils.has('gd_fireborn')} isDisabled={isGraciousDefeatSigilDisabled(getGraciousDefeatSigil('gd_fireborn'))} onSelect={ctx.handleGraciousDefeatSigilSelect} benefitsContent={getSigilDisplayInfo(getGraciousDefeatSigil('gd_fireborn')).benefits} color={getSigilDisplayInfo(getGraciousDefeatSigil('gd_fireborn')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getGraciousDefeatSigil('cultivate_i')} isSelected={ctx.selectedGraciousDefeatSigils.has('cultivate_i')} isDisabled={isGraciousDefeatSigilDisabled(getGraciousDefeatSigil('cultivate_i'))} onSelect={ctx.handleGraciousDefeatSigilSelect} benefitsContent={getSigilDisplayInfo(getGraciousDefeatSigil('cultivate_i')).benefits} color={getSigilDisplayInfo(getGraciousDefeatSigil('cultivate_i')).color} />
                        <CompellingWillSigilCard sigil={getGraciousDefeatSigil('realmkeeper')} isSelected={ctx.selectedGraciousDefeatSigils.has('realmkeeper')} isDisabled={isGraciousDefeatSigilDisabled(getGraciousDefeatSigil('realmkeeper'))} onSelect={ctx.handleGraciousDefeatSigilSelect} benefitsContent={getSigilDisplayInfo(getGraciousDefeatSigil('realmkeeper')).benefits} color={getSigilDisplayInfo(getGraciousDefeatSigil('realmkeeper')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getGraciousDefeatSigil('cultivate_ii')} isSelected={ctx.selectedGraciousDefeatSigils.has('cultivate_ii')} isDisabled={isGraciousDefeatSigilDisabled(getGraciousDefeatSigil('cultivate_ii'))} onSelect={ctx.handleGraciousDefeatSigilSelect} benefitsContent={getSigilDisplayInfo(getGraciousDefeatSigil('cultivate_ii')).benefits} color={getSigilDisplayInfo(getGraciousDefeatSigil('cultivate_ii')).color} />
                        <CompellingWillSigilCard sigil={getGraciousDefeatSigil('strengthen_i')} isSelected={ctx.selectedGraciousDefeatSigils.has('strengthen_i')} isDisabled={isGraciousDefeatSigilDisabled(getGraciousDefeatSigil('strengthen_i'))} onSelect={ctx.handleGraciousDefeatSigilSelect} benefitsContent={getSigilDisplayInfo(getGraciousDefeatSigil('strengthen_i')).benefits} color={getSigilDisplayInfo(getGraciousDefeatSigil('strengthen_i')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getGraciousDefeatSigil('sweet_suffering')} isSelected={ctx.selectedGraciousDefeatSigils.has('sweet_suffering')} isDisabled={isGraciousDefeatSigilDisabled(getGraciousDefeatSigil('sweet_suffering'))} onSelect={ctx.handleGraciousDefeatSigilSelect} benefitsContent={getSigilDisplayInfo(getGraciousDefeatSigil('sweet_suffering')).benefits} color={getSigilDisplayInfo(getGraciousDefeatSigil('sweet_suffering')).color} />
                        <CompellingWillSigilCard sigil={getGraciousDefeatSigil('realmmaster')} isSelected={ctx.selectedGraciousDefeatSigils.has('realmmaster')} isDisabled={isGraciousDefeatSigilDisabled(getGraciousDefeatSigil('realmmaster'))} onSelect={ctx.handleGraciousDefeatSigilSelect} benefitsContent={getSigilDisplayInfo(getGraciousDefeatSigil('realmmaster')).benefits} color={getSigilDisplayInfo(getGraciousDefeatSigil('realmmaster')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getGraciousDefeatSigil('pocket_god')} isSelected={ctx.selectedGraciousDefeatSigils.has('pocket_god')} isDisabled={isGraciousDefeatSigilDisabled(getGraciousDefeatSigil('pocket_god'))} onSelect={ctx.handleGraciousDefeatSigilSelect} benefitsContent={getSigilDisplayInfo(getGraciousDefeatSigil('pocket_god')).benefits} color={getSigilDisplayInfo(getGraciousDefeatSigil('pocket_god')).color} />
                        <CompellingWillSigilCard sigil={getGraciousDefeatSigil('strengthen_ii')} isSelected={ctx.selectedGraciousDefeatSigils.has('strengthen_ii')} isDisabled={isGraciousDefeatSigilDisabled(getGraciousDefeatSigil('strengthen_ii'))} onSelect={ctx.handleGraciousDefeatSigilSelect} benefitsContent={getSigilDisplayInfo(getGraciousDefeatSigil('strengthen_ii')).benefits} color={getSigilDisplayInfo(getGraciousDefeatSigil('strengthen_ii')).color} />
                    </div>
                </div>
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Entrance</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availableEntrancePicks - ctx.selectedEntrance.size} / {ctx.availableEntrancePicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ENTRANCE_DATA.map(power => {
                        const isSelected = ctx.selectedEntrance.has(power.id);
                        const isDisabled = isGraciousDefeatPowerDisabled(power, 'entrance');
                        return <FeatureToggleCard
                                    key={power.id}
                                    power={power}
                                    isSelected={isSelected}
                                    isDisabled={isDisabled && !isSelected}
                                    onToggle={() => ctx.handleEntranceSelect(power.id)}
                                />;
                    })}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Features</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isFeaturesBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isFeaturesBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isFeaturesBoostDisabled ? () => ctx.handleGraciousDefeatBoostToggle('features') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isFeaturesBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isFeaturesBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableFeaturesPicks - featurePicksUsed} / {ctx.availableFeaturesPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES_DATA.map(power => {
                        const isSelectionDisabled = featurePicksUsed >= ctx.availableFeaturesPicks;
                        const boostedText = ctx.isFeaturesBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        const stateInfo = featureStateMap[power.id as keyof typeof featureStateMap];

                        const isSingleSelect = ['shifting_weather', 'broken_space', 'broken_time'].includes(power.id);

                        if (isSingleSelect && stateInfo) {
                             const isSelected = stateInfo.count > 0;
                             const isDisabled = isSelectionDisabled && !isSelected;
                             return <FeatureToggleCard
                                        key={power.id}
                                        power={{...power, description: power.description + boostedText}}
                                        isSelected={isSelected}
                                        isDisabled={isDisabled}
                                        onToggle={() => stateInfo.handler(isSelected ? 0 : 1)}
                                     />;
                        }

                        if (power.id === 'verse_attendant') {
                            const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all ${
                                verseAttendantCount > 0
                                ? 'border-purple-400 ring-2 ring-purple-400/50'
                                : isSelectionDisabled
                                    ? 'opacity-50 border-gray-800'
                                    : 'border-white/10'
                            }`;
                            return (
                                <div key={power.id} className={wrapperClass}>
                                    <img src={power.imageSrc} alt={power.title} className="w-full h-40 rounded-md mb-4 object-cover" />
                                    <h4 className="font-cinzel font-bold text-white tracking-wider text-xl">{power.title}</h4>
                                    <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>
                                    <p className="text-xs text-gray-400 leading-relaxed flex-grow text-left whitespace-pre-wrap">{power.description + boostedText}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
                                         <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleVerseAttendantCountChange(verseAttendantCount - 1)} disabled={verseAttendantCount === 0} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">-</button>
                                            <span className={`font-semibold w-24 text-center ${verseAttendantCount > 0 ? 'text-white' : 'text-gray-500'}`}>{verseAttendantCount} taken</span>
                                            <button onClick={() => handleVerseAttendantCountChange(verseAttendantCount + 1)} disabled={isSelectionDisabled} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">+</button>
                                        </div>
                                        {Array.from({ length: verseAttendantCount }).map((_, index) => (
                                            <div key={index} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md">
                                                <span className="text-sm text-gray-300 truncate">Attendant #{index + 1}: <em className="text-amber-300">{verseAttendantCompanionNames[index] || 'None'}</em></span>
                                                <button
                                                    onClick={() => openCompanionModal(index)}
                                                    className="p-2 rounded-full bg-amber-900/50 text-amber-200/70 hover:bg-amber-800/60 hover:text-amber-100 transition-colors flex-shrink-0"
                                                    aria-label={`Select Companion for Attendant ${index + 1}`}
                                                >
                                                    <CompanionIcon />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                         if (power.id === 'living_inhabitants') {
                            const wrapperClass = `bg-black/40 backdrop-blur-sm p-4 rounded-xl border flex flex-col text-center transition-all ${
                                livingInhabitants.length > 0
                                ? 'border-purple-400 ring-2 ring-purple-400/50'
                                : isSelectionDisabled
                                    ? 'opacity-50 border-gray-800'
                                    : 'border-white/10'
                            }`;
                            return (
                                <div key={power.id} className={wrapperClass}>
                                    <img src={power.imageSrc} alt={power.title} className="w-full h-40 rounded-md mb-4 object-cover" />
                                    <h4 className="font-cinzel font-bold text-white tracking-wider text-xl">{power.title}</h4>
                                    <div className="w-16 h-px bg-white/10 mx-auto my-2"></div>
                                    <p className="text-xs text-gray-400 leading-relaxed flex-grow text-left whitespace-pre-wrap">{power.description + boostedText}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => livingInhabitants.length > 0 && removeLivingInhabitant(livingInhabitants[livingInhabitants.length - 1].id)} disabled={livingInhabitants.length === 0} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">-</button>
                                            <span className={`font-semibold w-24 text-center ${livingInhabitants.length > 0 ? 'text-white' : 'text-gray-500'}`}>{livingInhabitants.length} taken</span>
                                            <button onClick={addLivingInhabitant} disabled={isSelectionDisabled} className="px-3 py-1 text-lg leading-none rounded bg-gray-800/50 border border-gray-700 hover:bg-gray-700 disabled:opacity-50">+</button>
                                        </div>
                                        {livingInhabitants.map((inhabitant, index) => (
                                            <div key={inhabitant.id} className="bg-slate-800/50 p-2 rounded-md text-left">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-semibold text-gray-300">Species #{index + 1}</span>
                                                    <button onClick={() => removeLivingInhabitant(inhabitant.id)} className="text-red-400 hover:text-red-300 text-xl leading-none">&times;</button>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-400">
                                                    Assigned: <span className="font-bold text-amber-300">{inhabitant.beastName || 'None'}</span>
                                                    {inhabitant.type && <span className="italic"> ({inhabitant.type === 'populated' ? (ctx.isFeaturesBoosted ? 50 : 40) : (ctx.isFeaturesBoosted ? 80 : 70)} BP)</span>}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <button onClick={() => setLivingInhabitantModalState({ isOpen: true, id: inhabitant.id, type: 'populated' })} className="px-2 py-1 text-xs rounded-md bg-purple-900/50 border border-purple-700 text-purple-200 hover:bg-purple-800/60">Populated ({ctx.isFeaturesBoosted ? 50 : 40} BP)</button>
                                                    <button onClick={() => setLivingInhabitantModalState({ isOpen: true, id: inhabitant.id, type: 'rarer' })} className="px-2 py-1 text-xs rounded-md bg-purple-900/50 border border-purple-700 text-purple-200 hover:bg-purple-800/60">Rarer ({ctx.isFeaturesBoosted ? 80 : 70} BP)</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        if (stateInfo) {
                            let displayValueCalc;
                            if (power.id === 'natural_environment' || power.id === 'artificial_environment') {
                                displayValueCalc = (count: number) => count > 0 ? `${30 * Math.pow(ctx.isFeaturesBoosted ? 3 : 2, count - 1)} acres` : '0 acres';
                            }
                            if (power.id === 'promised_land') {
                                displayValueCalc = (count: number) => count > 0 ? `${15 * Math.pow(ctx.isFeaturesBoosted ? 3 : 2, count - 1)} limit` : '0 limit';
                            }

                             return <FeatureCounterCard 
                                key={power.id}
                                power={{...power, description: power.description + boostedText}}
                                count={stateInfo.count}
                                onCountChange={stateInfo.handler}
                                isSelectionDisabled={isSelectionDisabled && stateInfo.count === 0}
                                calculateDisplayValue={displayValueCalc}
                            />
                        }
                        
                        return null;
                    })}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Influence</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availableInfluencePicks - ctx.selectedInfluence.size} / {ctx.availableInfluencePicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(() => {
                        const specialPower = INFLUENCE_DATA.find(p => p.id === 'reality_invasion');
                        const otherPowers = INFLUENCE_DATA.filter(p => p.id !== 'reality_invasion');
                        const firstHalf = otherPowers.slice(0, 3);
                        const secondHalf = otherPowers.slice(3);

                        const renderPower = (power: GraciousDefeatPower) => {
                            const isOverlord = power.id === 'overlord';
                            const isSelected = ctx.selectedInfluence.has(power.id);
                            return <FeatureToggleCard
                                        key={power.id}
                                        power={power}
                                        isSelected={isSelected}
                                        isDisabled={isGraciousDefeatPowerDisabled(power, 'influence') && !isSelected}
                                        onToggle={() => ctx.handleInfluenceSelect(power.id)}
                                     >
                                {isOverlord && isSelected && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setIsOverlordModalOpen(true); }}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-purple-900/50 text-purple-200/70 hover:bg-purple-800/60 hover:text-purple-100 transition-colors z-10"
                                        aria-label="Assign Godlike Shape"
                                    >
                                        <CompanionIcon />
                                    </button>
                                )}
                                {isOverlord && isSelected && overlordBeastName && (
                                    <div className="text-center mt-2">
                                        <p className="text-xs text-gray-400">Assigned Form:</p>
                                        <p className="text-sm font-bold text-amber-300">{overlordBeastName}</p>
                                    </div>
                                )}
                            </FeatureToggleCard>
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
            {attendantModalState.isOpen && attendantModalState.index !== null && (
                 <CompanionSelectionModal
                    onClose={closeCompanionModal}
                    onSelect={(companionName) => {
                        if (attendantModalState.index !== null) {
                            handleVerseAttendantCompanionAssign(attendantModalState.index, companionName);
                        }
                        closeCompanionModal();
                    }}
                    currentCompanionName={verseAttendantCompanionNames[attendantModalState.index]}
                    pointLimit={ctx.isFeaturesBoosted ? 100 : 50}
                    title={`Assign Companion for Attendant #${attendantModalState.index + 1}`}
                    categoryFilter="puppet"
                />
            )}
            {livingInhabitantModalState.isOpen && livingInhabitantModalState.id !== null && livingInhabitantModalState.type && (
                <BeastSelectionModal
                    onClose={() => setLivingInhabitantModalState({ isOpen: false, id: null, type: null })}
                    onSelect={(name) => {
                        assignLivingInhabitantBeast(livingInhabitantModalState.id!, livingInhabitantModalState.type!, name);
                        setLivingInhabitantModalState({ isOpen: false, id: null, type: null });
                    }}
                    currentBeastName={livingInhabitants.find(i => i.id === livingInhabitantModalState.id)?.beastName || null}
                    pointLimit={livingInhabitantModalState.type === 'populated' ? (ctx.isFeaturesBoosted ? 50 : 40) : (ctx.isFeaturesBoosted ? 80 : 70)}
                    title={`Assign ${livingInhabitantModalState.type === 'populated' ? 'Highly Populated' : 'Rarer'} Species`}
                />
            )}
            {isOverlordModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsOverlordModalOpen(false)}
                    onSelect={(name) => {
                        handleOverlordBeastAssign(name);
                        setIsOverlordModalOpen(false);
                    }}
                    currentBeastName={overlordBeastName}
                    pointLimit={Infinity}
                    title="Assign Godlike Shape"
                    excludedPerkIds={['chatterbox_beast', 'magical_beast']}
                />
            )}
        </section>
    );
};