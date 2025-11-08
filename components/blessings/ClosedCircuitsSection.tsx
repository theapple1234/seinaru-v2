import React, { useState } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { MARGRA_DATA, CLOSED_CIRCUITS_DATA, CLOSED_CIRCUITS_SIGIL_TREE_DATA, NET_AVATAR_DATA, TECHNOMANCY_DATA, NANITE_CONTROL_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { ClosedCircuitsPower, ClosedCircuitsSigil } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { ChoiceCard } from '../TraitCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';

const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const ClosedCircuitsSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const {
        selectedBlessingEngraving,
        closedCircuitsEngraving,
        handleClosedCircuitsEngravingSelect,
        closedCircuitsWeaponName,
        handleClosedCircuitsWeaponAssign,
    } = useCharacterContext();

    const isClosedCircuitsPowerDisabled = (power: ClosedCircuitsPower, type: 'netAvatar' | 'technomancy' | 'naniteControl'): boolean => {
        const selectedSet = type === 'netAvatar' ? ctx.selectedNetAvatars : type === 'technomancy' ? ctx.selectedTechnomancies : ctx.selectedNaniteControls;
        const availablePicks = type === 'netAvatar' ? ctx.availableNetAvatarPicks : type === 'technomancy' ? ctx.availableTechnomancyPicks : ctx.availableNaniteControlPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedNetAvatars, ...ctx.selectedTechnomancies, ...ctx.selectedNaniteControls, ...ctx.selectedClosedCircuitsSigils]);
            if (!power.requires.every(req => allSelected.has(req))) return true;
        }
        return false;
    };

    const isClosedCircuitsSigilDisabled = (sigil: ClosedCircuitsSigil): boolean => {
        if (ctx.selectedClosedCircuitsSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedClosedCircuitsSigils.has(p))) return true;
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getClosedCircuitsSigil = (id: string) => CLOSED_CIRCUITS_SIGIL_TREE_DATA.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: ClosedCircuitsSigil): { color: SigilColor, benefits: React.ReactNode } => {
        // FIX: Explicitly type colorMap to ensure color is inferred as SigilColor, not string.
        const colorMap: Record<string, SigilColor> = {
            'SCRIPT KIDDY': 'orange', 'KYROTIK ARMOR™': 'yellow', 'EZ-HACK™': 'yellow',
            'HEAVY DUTY': 'green', 'L33T H4XXOR': 'green', 'HACKER I': 'gray',
            'HACKER 2': 'gray', 'NANITE MASTER': 'red', 'BLACK HAT': 'purple',
        };
        const color = colorMap[sigil.title] || 'gray';
        const benefits = (
          <>
            {sigil.benefits.netAvatar ? <p className="text-blue-300">+ {sigil.benefits.netAvatar} Net Avatar</p> : null}
            {sigil.benefits.technomancy ? <p className="text-lime-300">+ {sigil.benefits.technomancy} Technomancy</p> : null}
            {sigil.benefits.naniteControl ? <p className="text-amber-300">+ {sigil.benefits.naniteControl} Nanite Control</p> : null}
          </>
        );
        return { color, benefits };
    };

    const boostDescriptions: { [key: string]: string } = {
        domain_master_i: "Doubles speed, chance of success and discretion when bypassing system security.",
        domain_master_ii: "Doubles speed, chance of success and discretion when bypassing system security.",
        weapon_sabotage: "Twice as powerful, allowing it to affect better weapons.",
        vehicle_sabotage: "Twice as powerful, allowing it to affect better vehicles.",
        digital_infiltrator: "Passively automatically sucks up all data from all computers and servers within a large radius.",
        counter_hacker: "Doubled effectiveness against other avatars.",
        verse_hijack: "All sabotages are doubled in effectiveness; stifling spread, destroying or seizing control of various verse features, etc.",
        heavily_armed: "+10 Weapon Points.",
        nanite_armor_i: "Size of weak points halved.",
        nanite_armor_ii: "Size of weak points halved.",
        nanite_armor_iii: "Size of weak points halved.",
        metal_skin: "Metallic areas are more durable than flesh.",
        nanite_form: "+10 Beast Points.",
        grey_goo: "Doubled rate of decomposition."
    };

    const isTechnomancyBoostDisabled = !ctx.isTechnomancyBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isNaniteControlBoostDisabled = !ctx.isNaniteControlBoosted && ctx.availableSigilCounts.purth <= 0;

    return (
        <section>
            <BlessingIntro {...MARGRA_DATA} />
            <BlessingIntro {...CLOSED_CIRCUITS_DATA} reverse />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const finalEngraving = closedCircuitsEngraving ?? selectedBlessingEngraving;
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = closedCircuitsEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleClosedCircuitsEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && closedCircuitsWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({closedCircuitsWeaponName})</p>
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
                        handleClosedCircuitsWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={closedCircuitsWeaponName}
                />
            )}
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex flex-col items-center gap-4">
                    {/* Level 1 */}
                    <CompellingWillSigilCard sigil={getClosedCircuitsSigil('script_kiddy')} isSelected={ctx.selectedClosedCircuitsSigils.has('script_kiddy')} isDisabled={isClosedCircuitsSigilDisabled(getClosedCircuitsSigil('script_kiddy'))} onSelect={ctx.handleClosedCircuitsSigilSelect} benefitsContent={getSigilDisplayInfo(getClosedCircuitsSigil('script_kiddy')).benefits} color={getSigilDisplayInfo(getClosedCircuitsSigil('script_kiddy')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    {/* Level 2 */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <CompellingWillSigilCard sigil={getClosedCircuitsSigil('kyrotik_armor')} isSelected={ctx.selectedClosedCircuitsSigils.has('kyrotik_armor')} isDisabled={isClosedCircuitsSigilDisabled(getClosedCircuitsSigil('kyrotik_armor'))} onSelect={ctx.handleClosedCircuitsSigilSelect} benefitsContent={getSigilDisplayInfo(getClosedCircuitsSigil('kyrotik_armor')).benefits} color={getSigilDisplayInfo(getClosedCircuitsSigil('kyrotik_armor')).color} />
                        <CompellingWillSigilCard sigil={getClosedCircuitsSigil('heavy_duty')} isSelected={ctx.selectedClosedCircuitsSigils.has('heavy_duty')} isDisabled={isClosedCircuitsSigilDisabled(getClosedCircuitsSigil('heavy_duty'))} onSelect={ctx.handleClosedCircuitsSigilSelect} benefitsContent={getSigilDisplayInfo(getClosedCircuitsSigil('heavy_duty')).benefits} color={getSigilDisplayInfo(getClosedCircuitsSigil('heavy_duty')).color} />
                        <CompellingWillSigilCard sigil={getClosedCircuitsSigil('ez_hack')} isSelected={ctx.selectedClosedCircuitsSigils.has('ez_hack')} isDisabled={isClosedCircuitsSigilDisabled(getClosedCircuitsSigil('ez_hack'))} onSelect={ctx.handleClosedCircuitsSigilSelect} benefitsContent={getSigilDisplayInfo(getClosedCircuitsSigil('ez_hack')).benefits} color={getSigilDisplayInfo(getClosedCircuitsSigil('ez_hack')).color} />
                        <CompellingWillSigilCard sigil={getClosedCircuitsSigil('hacker_i')} isSelected={ctx.selectedClosedCircuitsSigils.has('hacker_i')} isDisabled={isClosedCircuitsSigilDisabled(getClosedCircuitsSigil('hacker_i'))} onSelect={ctx.handleClosedCircuitsSigilSelect} benefitsContent={getSigilDisplayInfo(getClosedCircuitsSigil('hacker_i')).benefits} color={getSigilDisplayInfo(getClosedCircuitsSigil('hacker_i')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    {/* Level 3 */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <CompellingWillSigilCard sigil={getClosedCircuitsSigil('nanite_master')} isSelected={ctx.selectedClosedCircuitsSigils.has('nanite_master')} isDisabled={isClosedCircuitsSigilDisabled(getClosedCircuitsSigil('nanite_master'))} onSelect={ctx.handleClosedCircuitsSigilSelect} benefitsContent={getSigilDisplayInfo(getClosedCircuitsSigil('nanite_master')).benefits} color={getSigilDisplayInfo(getClosedCircuitsSigil('nanite_master')).color} />
                        <CompellingWillSigilCard sigil={getClosedCircuitsSigil('black_hat')} isSelected={ctx.selectedClosedCircuitsSigils.has('black_hat')} isDisabled={isClosedCircuitsSigilDisabled(getClosedCircuitsSigil('black_hat'))} onSelect={ctx.handleClosedCircuitsSigilSelect} benefitsContent={getSigilDisplayInfo(getClosedCircuitsSigil('black_hat')).benefits} color={getSigilDisplayInfo(getClosedCircuitsSigil('black_hat')).color} />
                        <CompellingWillSigilCard sigil={getClosedCircuitsSigil('hacker_2')} isSelected={ctx.selectedClosedCircuitsSigils.has('hacker_2')} isDisabled={isClosedCircuitsSigilDisabled(getClosedCircuitsSigil('hacker_2'))} onSelect={ctx.handleClosedCircuitsSigilSelect} benefitsContent={getSigilDisplayInfo(getClosedCircuitsSigil('hacker_2')).benefits} color={getSigilDisplayInfo(getClosedCircuitsSigil('hacker_2')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    {/* Level 4 */}
                    <CompellingWillSigilCard sigil={getClosedCircuitsSigil('l33t_h4xx0r')} isSelected={ctx.selectedClosedCircuitsSigils.has('l33t_h4xx0r')} isDisabled={isClosedCircuitsSigilDisabled(getClosedCircuitsSigil('l33t_h4xx0r'))} onSelect={ctx.handleClosedCircuitsSigilSelect} benefitsContent={getSigilDisplayInfo(getClosedCircuitsSigil('l33t_h4xx0r')).benefits} color={getSigilDisplayInfo(getClosedCircuitsSigil('l33t_h4xx0r')).color} />
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>NET AVATAR</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availableNetAvatarPicks - ctx.selectedNetAvatars.size} / {ctx.availableNetAvatarPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {NET_AVATAR_DATA.map(power => <ChoiceCard key={power.id} item={{...power, cost: ''}} isSelected={ctx.selectedNetAvatars.has(power.id)} onSelect={ctx.handleNetAvatarSelect} disabled={isClosedCircuitsPowerDisabled(power, 'netAvatar')} selectionColor="amber" />)}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>TECHNOMANCY</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isTechnomancyBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isTechnomancyBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isTechnomancyBoostDisabled ? () => ctx.handleClosedCircuitsBoostToggle('technomancy') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isTechnomancyBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isTechnomancyBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableTechnomancyPicks - ctx.selectedTechnomancies.size} / {ctx.availableTechnomancyPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TECHNOMANCY_DATA.map(power => {
                        const boostedText = ctx.isTechnomancyBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        return <ChoiceCard key={power.id} item={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedTechnomancies.has(power.id)} onSelect={ctx.handleTechnomancySelect} disabled={isClosedCircuitsPowerDisabled(power, 'technomancy')} selectionColor="amber" />
                    })}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>NANITE CONTROL</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isNaniteControlBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isNaniteControlBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isNaniteControlBoostDisabled ? () => ctx.handleClosedCircuitsBoostToggle('naniteControl') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isNaniteControlBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isNaniteControlBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Purth sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableNaniteControlPicks - ctx.selectedNaniteControls.size} / {ctx.availableNaniteControlPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(() => {
                        const specialPower = NANITE_CONTROL_DATA.find(p => p.id === 'nanite_armor_iii');
                        const otherPowers = NANITE_CONTROL_DATA.filter(p => p.id !== 'nanite_armor_iii');
                        const firstHalf = otherPowers.slice(0, 3);
                        const secondHalf = otherPowers.slice(3);

                        const renderPower = (power: ClosedCircuitsPower) => {
                            const boostedText = ctx.isNaniteControlBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                             return <ChoiceCard 
                                key={power.id} 
                                item={{...power, cost: '', description: power.description + boostedText}} 
                                isSelected={ctx.selectedNaniteControls.has(power.id)} 
                                onSelect={ctx.handleNaniteControlSelect} 
                                disabled={isClosedCircuitsPowerDisabled(power, 'naniteControl')} 
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
                        )
                    })()}
                </div>
            </div>
        </section>
    );
};