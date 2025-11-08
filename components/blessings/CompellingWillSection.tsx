import React, { useState } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { ARABELLA_DATA, COMPELLING_WILL_DATA, COMPELLING_WILL_SIGIL_TREE_DATA, TELEKINETICS_DATA, METATHERMICS_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { CompellingWillPower, CompellingWillSigil } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { ChoiceCard } from '../TraitCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';


const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const CompellingWillSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        compellingWillEngraving,
        handleCompellingWillEngravingSelect,
        compellingWillWeaponName,
        handleCompellingWillWeaponAssign,
    } = useCharacterContext();

    const isCompellingWillPowerDisabled = (power: CompellingWillPower, type: 'telekinetics' | 'metathermics'): boolean => {
        const selectedSet = type === 'telekinetics' ? ctx.selectedTelekinetics : ctx.selectedMetathermics;
        const availablePicks = type === 'telekinetics' ? ctx.availableTelekineticsPicks : ctx.availableMetathermicsPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;

        if (power.requires) {
            const allSelectedPowersAndSigils = new Set([...ctx.selectedTelekinetics, ...ctx.selectedMetathermics, ...ctx.selectedCompellingWillSigils]);
            if (!power.requires.every(req => allSelectedPowersAndSigils.has(req))) return true;
        }
        return false;
    };
    
    const isCompellingWillSigilDisabled = (sigil: CompellingWillSigil): boolean => {
        if (ctx.selectedCompellingWillSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedCompellingWillSigils.has(p))) return true;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof typeof ctx.availableSigilCounts] < 1) return true;

        return false;
    };

    const getCompellingWillSigil = (id: string) => COMPELLING_WILL_SIGIL_TREE_DATA.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: CompellingWillSigil): { color: SigilColor, benefits: React.ReactNode } => {
        // FIX: Explicitly type colorMap to ensure color is inferred as SigilColor, not string.
        const colorMap: Record<string, SigilColor> = {
            'MANIPULATOR': 'red', 'REALITY BENDER': 'red', 'PSYCHO': 'green',
            'THERMAL MASTER': 'green', 'TELEKINETIC I': 'gray', 'TELEKINETIC II': 'gray',
            'THERMOSWORD™': 'yellow',
        };
        const color = colorMap[sigil.title] || 'gray';
        const benefits = (
            <>
                {sigil.benefits.telekinetics ? <p className="text-cyan-300">+ {sigil.benefits.telekinetics} Telekinetics</p> : null}
                {sigil.benefits.metathermics ? <p className="text-rose-300">+ {sigil.benefits.metathermics} Metathermics</p> : null}
            </>
        );
        return { color, benefits };
    };

    const kaarnBoostDescriptions: { [key: string]: string } = {
        psychic_force_i: "Can exert twice as much force at the price of exhaustion.",
        psychic_force_ii: "Can exert twice as much force at the price of exhaustion.",
        forcefield: "Can set down a static force field that is ten times as difficult to destroy, as long as you dont move.",
        subatomic_manipulation: "Changes take effect twice as quickly. Explosion force increased to 0.2 kilotons.",
        energy_channel: "Each beam slightly more powerful. Once per day, release a beam with doubled power.",
        aquatic_force: "Can exert twice as much force at the price of exhaustion.",
        sonic_boom: "Will exhaust rather than injure you."
    };

    const purthBoostDescriptions: { [key: string]: string } = {
        pyromaniac_i: "Can use flame spells with twice the heat, though they’re so intense they injure you just to release.",
        pyromaniac_ii: "Can use flame spells with twice the heat, though they’re so intense they injure you just to release.",
        pyromaniac_iii: "Can use flame spells with twice the heat, though they’re so intense they injure you just to release.",
        ice_cold_i: "Can use ice spells with twice the cold, though they’re so intense they injure you just to release.",
        ice_cold_ii: "Can use ice spells with twice the cold, though they’re so intense they injure you just to release.",
        ice_cold_iii: "Can use ice spells with twice the cold, though they’re so intense they injure you just to release.",
        plasma_strike: "Each strike slightly more powerful. Once per day, can double the power of a strike.",
        thermal_weaponry: "Gives 35 weapon points."
    };

    const isTelekineticsBoostDisabled = !ctx.isTelekineticsBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isMetathermicsBoostDisabled = !ctx.isMetathermicsBoosted && ctx.availableSigilCounts.purth <= 0;

    return (
        <section>
            <BlessingIntro {...ARABELLA_DATA} />
            <BlessingIntro {...COMPELLING_WILL_DATA} reverse />
            
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const finalEngraving = compellingWillEngraving ?? selectedBlessingEngraving;
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = compellingWillEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleCompellingWillEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && compellingWillWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({compellingWillWeaponName})</p>
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
                        handleCompellingWillWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={compellingWillWeaponName}
                />
            )}

            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex flex-col items-center gap-4">
                    <CompellingWillSigilCard sigil={getCompellingWillSigil('manipulator')} isSelected={ctx.selectedCompellingWillSigils.has('manipulator')} isDisabled={isCompellingWillSigilDisabled(getCompellingWillSigil('manipulator'))} onSelect={ctx.handleCompellingWillSigilSelect} benefitsContent={getSigilDisplayInfo(getCompellingWillSigil('manipulator')).benefits} color={getSigilDisplayInfo(getCompellingWillSigil('manipulator')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getCompellingWillSigil('telekinetic_i')} isSelected={ctx.selectedCompellingWillSigils.has('telekinetic_i')} isDisabled={isCompellingWillSigilDisabled(getCompellingWillSigil('telekinetic_i'))} onSelect={ctx.handleCompellingWillSigilSelect} benefitsContent={getSigilDisplayInfo(getCompellingWillSigil('telekinetic_i')).benefits} color={getSigilDisplayInfo(getCompellingWillSigil('telekinetic_i')).color} />
                        <CompellingWillSigilCard sigil={getCompellingWillSigil('thermal_master')} isSelected={ctx.selectedCompellingWillSigils.has('thermal_master')} isDisabled={isCompellingWillSigilDisabled(getCompellingWillSigil('thermal_master'))} onSelect={ctx.handleCompellingWillSigilSelect} benefitsContent={getSigilDisplayInfo(getCompellingWillSigil('thermal_master')).benefits} color={getSigilDisplayInfo(getCompellingWillSigil('thermal_master')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getCompellingWillSigil('psycho')} isSelected={ctx.selectedCompellingWillSigils.has('psycho')} isDisabled={isCompellingWillSigilDisabled(getCompellingWillSigil('psycho'))} onSelect={ctx.handleCompellingWillSigilSelect} benefitsContent={getSigilDisplayInfo(getCompellingWillSigil('psycho')).benefits} color={getSigilDisplayInfo(getCompellingWillSigil('psycho')).color} />
                        <CompellingWillSigilCard sigil={getCompellingWillSigil('thermosword')} isSelected={ctx.selectedCompellingWillSigils.has('thermosword')} isDisabled={isCompellingWillSigilDisabled(getCompellingWillSigil('thermosword'))} onSelect={ctx.handleCompellingWillSigilSelect} benefitsContent={getSigilDisplayInfo(getCompellingWillSigil('thermosword')).benefits} color={getSigilDisplayInfo(getCompellingWillSigil('thermosword')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <CompellingWillSigilCard sigil={getCompellingWillSigil('telekinetic_ii')} isSelected={ctx.selectedCompellingWillSigils.has('telekinetic_ii')} isDisabled={isCompellingWillSigilDisabled(getCompellingWillSigil('telekinetic_ii'))} onSelect={ctx.handleCompellingWillSigilSelect} benefitsContent={getSigilDisplayInfo(getCompellingWillSigil('telekinetic_ii')).benefits} color={getSigilDisplayInfo(getCompellingWillSigil('telekinetic_ii')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <CompellingWillSigilCard sigil={getCompellingWillSigil('reality_bender')} isSelected={ctx.selectedCompellingWillSigils.has('reality_bender')} isDisabled={isCompellingWillSigilDisabled(getCompellingWillSigil('reality_bender'))} onSelect={ctx.handleCompellingWillSigilSelect} benefitsContent={getSigilDisplayInfo(getCompellingWillSigil('reality_bender')).benefits} color={getSigilDisplayInfo(getCompellingWillSigil('reality_bender')).color} />
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>TELEKINETICS</SectionHeader>
                <div 
                    className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${
                        ctx.isTelekineticsBoosted
                        ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300'
                        : isTelekineticsBoostDisabled 
                            ? 'border-gray-700 opacity-50 cursor-not-allowed'
                            : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'
                    }`}
                    onClick={!isTelekineticsBoostDisabled ? () => ctx.handleCompellingWillBoostToggle('telekinetics') : undefined}
                >
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">
                                {ctx.isTelekineticsBoosted ? 'BOOSTED' : 'BOOST'}
                            </h4>
                            {!ctx.isTelekineticsBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableTelekineticsPicks - ctx.selectedTelekinetics.size} / {ctx.availableTelekineticsPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(() => {
                        const subatomicPower = TELEKINETICS_DATA.find(p => p.id === 'subatomic_manipulation');
                        const otherPowers = TELEKINETICS_DATA.filter(p => p.id !== 'subatomic_manipulation');
                        
                        const renderPower = (power: CompellingWillPower) => {
                            const boostedText = ctx.isTelekineticsBoosted && kaarnBoostDescriptions[power.id] ? `\n\nBOOSTED: ${kaarnBoostDescriptions[power.id]}` : '';
                            return <ChoiceCard 
                                key={power.id} 
                                item={{...power, cost: '', description: power.description + boostedText}} 
                                isSelected={ctx.selectedTelekinetics.has(power.id)} 
                                onSelect={ctx.handleTelekineticsSelect} 
                                disabled={isCompellingWillPowerDisabled(power, 'telekinetics')} 
                                selectionColor="amber" 
                            />
                        };

                        return (
                            <>
                                {otherPowers.map(renderPower)}
                                {subatomicPower && (
                                    <div key={subatomicPower.id} className="lg:col-start-4 lg:row-start-1 lg:row-span-2">
                                        {renderPower(subatomicPower)}
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>METATHERMICS</SectionHeader>
                 <div 
                    className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${
                        ctx.isMetathermicsBoosted
                        ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300'
                        : isMetathermicsBoostDisabled 
                            ? 'border-gray-700 opacity-50 cursor-not-allowed'
                            : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'
                    }`}
                    onClick={!isMetathermicsBoostDisabled ? () => ctx.handleCompellingWillBoostToggle('metathermics') : undefined}
                >
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">
                                {ctx.isMetathermicsBoosted ? 'BOOSTED' : 'BOOST'}
                            </h4>
                            {!ctx.isMetathermicsBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Purth sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableMetathermicsPicks - ctx.selectedMetathermics.size} / {ctx.availableMetathermicsPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {METATHERMICS_DATA.map(power => {
                        const boostedText = ctx.isMetathermicsBoosted && purthBoostDescriptions[power.id] ? `\n\nBOOSTED: ${purthBoostDescriptions[power.id]}` : '';
                        return <ChoiceCard key={power.id} item={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedMetathermics.has(power.id)} onSelect={ctx.handleMetathermicsSelect} disabled={isCompellingWillPowerDisabled(power, 'metathermics')} selectionColor="amber" />
                    })}
                </div>
            </div>
        </section>
    );
};