import React, { useState } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { GRACIOUS_DEFEAT_DATA, GRACIOUS_DEFEAT_SIGIL_TREE_DATA, ENTRANCE_DATA, FEATURES_DATA, INFLUENCE_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { GraciousDefeatPower, GraciousDefeatSigil } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { ChoiceCard } from '../TraitCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';


const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const GraciousDefeatSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const {
        selectedBlessingEngraving,
        graciousDefeatEngraving,
        handleGraciousDefeatEngravingSelect,
        graciousDefeatWeaponName,
        handleGraciousDefeatWeaponAssign,
    } = useCharacterContext();

    const isGraciousDefeatPowerDisabled = (power: GraciousDefeatPower, type: 'entrance' | 'features' | 'influence'): boolean => {
        const selectedSet = type === 'entrance' ? ctx.selectedEntrance : type === 'features' ? ctx.selectedFeatures : ctx.selectedInfluence;
        const availablePicks = type === 'entrance' ? ctx.availableEntrancePicks : type === 'features' ? ctx.availableFeaturesPicks : ctx.availableInfluencePicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedEntrance, ...ctx.selectedFeatures, ...ctx.selectedInfluence, ...ctx.selectedGraciousDefeatSigils]);
            if (!power.requires.every(req => allSelected.has(req))) return true;
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
        // FIX: Explicitly type colorMap to ensure color is inferred as SigilColor, not string.
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
                    {ENTRANCE_DATA.map(power => <ChoiceCard key={power.id} item={{...power, cost: ''}} isSelected={ctx.selectedEntrance.has(power.id)} onSelect={ctx.handleEntranceSelect} disabled={isGraciousDefeatPowerDisabled(power, 'entrance')} selectionColor="amber" />)}
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
                <SectionSubHeader>Picks Available: {ctx.availableFeaturesPicks - ctx.selectedFeatures.size} / {ctx.availableFeaturesPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES_DATA.map(power => {
                        const boostedText = ctx.isFeaturesBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        return <ChoiceCard key={power.id} item={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedFeatures.has(power.id)} onSelect={ctx.handleFeaturesSelect} disabled={isGraciousDefeatPowerDisabled(power, 'features')} selectionColor="amber" />
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
                           return <ChoiceCard 
                                key={power.id} 
                                item={{...power, cost: ''}} 
                                isSelected={ctx.selectedInfluence.has(power.id)} 
                                onSelect={ctx.handleInfluenceSelect} 
                                disabled={isGraciousDefeatPowerDisabled(power, 'influence')} 
                                selectionColor="amber" 
                            />
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