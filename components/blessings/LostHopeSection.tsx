import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { FIDELIA_DATA, LOST_HOPE_DATA, LOST_HOPE_SIGIL_TREE_DATA, CHANNELLING_DATA, NECROMANCY_DATA, BLACK_MAGIC_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { LostHopePower, LostHopeSigil, ChoiceItem } from '../../types';
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

export const LostHopeSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
    const [isUndeadBeastModalOpen, setIsUndeadBeastModalOpen] = useState(false);

    const {
        selectedBlessingEngraving,
        lostHopeEngraving,
        handleLostHopeEngravingSelect,
        lostHopeWeaponName,
        handleLostHopeWeaponAssign,
        selectedTrueSelfTraits,
        isLostHopeMagicianApplied,
        handleToggleLostHopeMagician,
        disableLostHopeMagician,
        lostHopeSigilTreeCost,
        undeadThrallCompanionName,
        handleUndeadThrallCompanionAssign,
        undeadBeastName,
        handleUndeadBeastAssign,
    } = useCharacterContext();

    const finalEngraving = lostHopeEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';
    
    useEffect(() => {
        if (!isSkinEngraved && isLostHopeMagicianApplied) {
            disableLostHopeMagician();
        }
    }, [isSkinEngraved, isLostHopeMagicianApplied, disableLostHopeMagician]);

    const isLostHopePowerDisabled = (power: LostHopePower, type: 'channelling' | 'necromancy' | 'black_magic'): boolean => {
        const selectedSet = type === 'channelling' ? ctx.selectedChannelling : type === 'necromancy' ? ctx.selectedNecromancy : ctx.selectedBlackMagic;
        const availablePicks = type === 'channelling' ? ctx.availableChannellingPicks : type === 'necromancy' ? ctx.availableNecromancyPicks : ctx.availableBlackMagicPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelectedPowersAndSigils = new Set([...ctx.selectedChannelling, ...ctx.selectedNecromancy, ...ctx.selectedBlackMagic, ...ctx.selectedLostHopeSigils]);
            if (!power.requires.every(req => allSelectedPowersAndSigils.has(req))) return true;
        }
        return false;
    };

    const isLostHopeSigilDisabled = (sigil: LostHopeSigil): boolean => {
        if (ctx.selectedLostHopeSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedLostHopeSigils.has(p))) return true;
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getLostHopeSigil = (id: string) => LOST_HOPE_SIGIL_TREE_DATA.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: LostHopeSigil): { color: SigilColor, benefits: React.ReactNode } => {
        // FIX: Explicitly type colorMap to ensure color is inferred as SigilColor, not string.
        const colorMap: Record<string, SigilColor> = {
            'Young Witch': 'purple', 'Spirit Channel': 'gray', 'Deadseer': 'gray', 'Necromancer': 'lime',
            'Lazarus': 'yellow', 'Forbidden Arts': 'red', 'Lich Queen': 'purple',
        };
        const color = colorMap[sigil.type] || 'gray';
        const benefits = (
            <>
                {sigil.benefits.channeling ? <p className="text-indigo-300">+ {sigil.benefits.channeling} Channelling</p> : null}
                {sigil.benefits.necromancy ? <p className="text-teal-300">+ {sigil.benefits.necromancy} Necromancy</p> : null}
                {sigil.benefits.blackMagic ? <p className="text-rose-300">+ {sigil.benefits.blackMagic} Black Magic</p> : null}
            </>
        );
        return { color, benefits };
    };

    const boostDescriptions: { [key: string]: string } = {
        spirit_medium: "Can conjure spirits physically to manifest and aid you.",
        fata_morgana_curse: "Includes wraiths, particularly powerful and malevolent spirits capable of physically damaging even mages.",
        spectral_form: "Invisible to all mages.",
        life_drain: "Doubled rate. Leeches harder to remove.",
        undead_beast: "+10 Beast Points",
        rise_from_your_graves: "Doubled range and double strength and durability for undead.",
        grasping_dead: "Ball is larger, faster, and twice as difficult to escape from.",
        the_moon_samurai: "Halves the required souls and buffs the samurai.",
        undead_thrall: "+10 Companion Points",
        vampirism: "Doubles duration of stolen spells, strength gains require less blood.",
        cursemakers_cookbook: "Curses twice as difficult to remove.",
        flowers_of_blood: "Only need watered on a monthly basis."
    };

    const isChannellingBoostDisabled = !ctx.isChannellingBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isNecromancyBoostDisabled = !ctx.isNecromancyBoosted && ctx.availableSigilCounts.purth <= 0;
    const isBlackMagicBoostDisabled = !ctx.blackMagicBoostSigil && (ctx.availableSigilCounts.sinthru < 1 && ctx.availableSigilCounts.xuth < 1);
    
    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(lostHopeSigilTreeCost * 0.25);
    
    const isBlackMagicBoosted = ctx.blackMagicBoostSigil !== null;
    const undeadThrallPointLimit = isBlackMagicBoosted ? 60 : 50;
    const undeadBeastPointLimit = ctx.isNecromancyBoosted ? 70 : 60;

    return (
        <section>
            <BlessingIntro {...FIDELIA_DATA} />
            <BlessingIntro {...LOST_HOPE_DATA} reverse />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = lostHopeEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleLostHopeEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && lostHopeWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({lostHopeWeaponName})</p>
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
                            onClick={handleToggleLostHopeMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isLostHopeMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {isLostHopeMagicianApplied
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
                        handleLostHopeWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={lostHopeWeaponName}
                />
            )}
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex flex-col items-center gap-4">
                    <CompellingWillSigilCard sigil={getLostHopeSigil('young_witch')} isSelected={ctx.selectedLostHopeSigils.has('young_witch')} isDisabled={isLostHopeSigilDisabled(getLostHopeSigil('young_witch'))} onSelect={ctx.handleLostHopeSigilSelect} benefitsContent={getSigilDisplayInfo(getLostHopeSigil('young_witch')).benefits} color={getSigilDisplayInfo(getLostHopeSigil('young_witch')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getLostHopeSigil('spirit_channel')} isSelected={ctx.selectedLostHopeSigils.has('spirit_channel')} isDisabled={isLostHopeSigilDisabled(getLostHopeSigil('spirit_channel'))} onSelect={ctx.handleLostHopeSigilSelect} benefitsContent={getSigilDisplayInfo(getLostHopeSigil('spirit_channel')).benefits} color={getSigilDisplayInfo(getLostHopeSigil('spirit_channel')).color} />
                        <CompellingWillSigilCard sigil={getLostHopeSigil('deadseer')} isSelected={ctx.selectedLostHopeSigils.has('deadseer')} isDisabled={isLostHopeSigilDisabled(getLostHopeSigil('deadseer'))} onSelect={ctx.handleLostHopeSigilSelect} benefitsContent={getSigilDisplayInfo(getLostHopeSigil('deadseer')).benefits} color={getSigilDisplayInfo(getLostHopeSigil('deadseer')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getLostHopeSigil('necromancer')} isSelected={ctx.selectedLostHopeSigils.has('necromancer')} isDisabled={isLostHopeSigilDisabled(getLostHopeSigil('necromancer'))} onSelect={ctx.handleLostHopeSigilSelect} benefitsContent={getSigilDisplayInfo(getLostHopeSigil('necromancer')).benefits} color={getSigilDisplayInfo(getLostHopeSigil('necromancer')).color} />
                        <CompellingWillSigilCard sigil={getLostHopeSigil('forbidden_arts_i')} isSelected={ctx.selectedLostHopeSigils.has('forbidden_arts_i')} isDisabled={isLostHopeSigilDisabled(getLostHopeSigil('forbidden_arts_i'))} onSelect={ctx.handleLostHopeSigilSelect} benefitsContent={getSigilDisplayInfo(getLostHopeSigil('forbidden_arts_i')).benefits} color={getSigilDisplayInfo(getLostHopeSigil('forbidden_arts_i')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getLostHopeSigil('lazarus')} isSelected={ctx.selectedLostHopeSigils.has('lazarus')} isDisabled={isLostHopeSigilDisabled(getLostHopeSigil('lazarus'))} onSelect={ctx.handleLostHopeSigilSelect} benefitsContent={getSigilDisplayInfo(getLostHopeSigil('lazarus')).benefits} color={getSigilDisplayInfo(getLostHopeSigil('lazarus')).color} />
                        <CompellingWillSigilCard sigil={getLostHopeSigil('forbidden_arts_ii')} isSelected={ctx.selectedLostHopeSigils.has('forbidden_arts_ii')} isDisabled={isLostHopeSigilDisabled(getLostHopeSigil('forbidden_arts_ii'))} onSelect={ctx.handleLostHopeSigilSelect} benefitsContent={getSigilDisplayInfo(getLostHopeSigil('forbidden_arts_ii')).benefits} color={getSigilDisplayInfo(getLostHopeSigil('forbidden_arts_ii')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <CompellingWillSigilCard sigil={getLostHopeSigil('forbidden_arts_iii')} isSelected={ctx.selectedLostHopeSigils.has('forbidden_arts_iii')} isDisabled={isLostHopeSigilDisabled(getLostHopeSigil('forbidden_arts_iii'))} onSelect={ctx.handleLostHopeSigilSelect} benefitsContent={getSigilDisplayInfo(getLostHopeSigil('forbidden_arts_iii')).benefits} color={getSigilDisplayInfo(getLostHopeSigil('forbidden_arts_iii')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <CompellingWillSigilCard sigil={getLostHopeSigil('lich_queen')} isSelected={ctx.selectedLostHopeSigils.has('lich_queen')} isDisabled={isLostHopeSigilDisabled(getLostHopeSigil('lich_queen'))} onSelect={ctx.handleLostHopeSigilSelect} benefitsContent={getSigilDisplayInfo(getLostHopeSigil('lich_queen')).benefits} color={getSigilDisplayInfo(getLostHopeSigil('lich_queen')).color} />
                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>Channelling</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isChannellingBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isChannellingBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isChannellingBoostDisabled ? () => ctx.handleLostHopeBoostToggle('channelling') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isChannellingBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isChannellingBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableChannellingPicks - ctx.selectedChannelling.size} / {ctx.availableChannellingPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CHANNELLING_DATA.map(power => {
                        const boostedText = ctx.isChannellingBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        return <PowerCard key={power.id} power={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedChannelling.has(power.id)} onToggle={ctx.handleChannellingSelect} isDisabled={isLostHopePowerDisabled(power, 'channelling')} />
                    })}
                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>Necromancy</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isNecromancyBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isNecromancyBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isNecromancyBoostDisabled ? () => ctx.handleLostHopeBoostToggle('necromancy') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isNecromancyBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isNecromancyBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Purth sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableNecromancyPicks - ctx.selectedNecromancy.size} / {ctx.availableNecromancyPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {NECROMANCY_DATA.map(power => {
                        const boostedText = ctx.isNecromancyBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        const isUndeadBeast = power.id === 'undead_beast';
                        const isSelected = ctx.selectedNecromancy.has(power.id);
                        
                        return <PowerCard 
                            key={power.id} 
                            power={{...power, cost: '', description: power.description + boostedText}} 
                            isSelected={isSelected} 
                            onToggle={ctx.handleNecromancySelect} 
                            isDisabled={isLostHopePowerDisabled(power, 'necromancy')} 
                            iconButton={isUndeadBeast && isSelected ? <CompanionIcon /> : undefined}
                            onIconButtonClick={isUndeadBeast && isSelected ? () => setIsUndeadBeastModalOpen(true) : undefined}
                        >
                             {isUndeadBeast && undeadBeastName && isSelected && (
                                <div className="text-center">
                                    <p className="text-xs text-gray-400">Assigned Creature:</p>
                                    <p className="text-sm font-bold text-amber-300">{undeadBeastName}</p>
                                </div>
                            )}
                        </PowerCard>
                    })}
                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>Black Magic</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.blackMagicBoostSigil ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isBlackMagicBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isBlackMagicBoostDisabled ? () => ctx.handleLostHopeBoostToggle('blackMagic') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src={`https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/${ctx.blackMagicBoostSigil || 'sinthru'}.png`} alt="Sinthru or Xuth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.blackMagicBoostSigil ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.blackMagicBoostSigil && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Sinthru or Xuth sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableBlackMagicPicks - ctx.selectedBlackMagic.size} / {ctx.availableBlackMagicPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {BLACK_MAGIC_DATA.map(power => {
                        const boostedText = ctx.blackMagicBoostSigil && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        const isUndeadThrall = power.id === 'undead_thrall';
                        const isThrallSelected = ctx.selectedBlackMagic.has('undead_thrall');

                        return (
                            <PowerCard 
                                key={power.id} 
                                power={{...power, cost: '', description: power.description + boostedText}} 
                                isSelected={ctx.selectedBlackMagic.has(power.id)} 
                                onToggle={ctx.handleBlackMagicSelect} 
                                isDisabled={isLostHopePowerDisabled(power, 'black_magic')} 
                                iconButton={isUndeadThrall && isThrallSelected ? <CompanionIcon /> : undefined}
                                onIconButtonClick={isUndeadThrall && isThrallSelected ? () => setIsCompanionModalOpen(true) : undefined}
                            >
                                {isUndeadThrall && undeadThrallCompanionName && isThrallSelected && (
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400">Assigned Thrall:</p>
                                        <p className="text-sm font-bold text-amber-300">{undeadThrallCompanionName}</p>
                                    </div>
                                )}
                            </PowerCard>
                        );
                    })}
                </div>
            </div>
            {isCompanionModalOpen && (
                <CompanionSelectionModal
                    onClose={() => setIsCompanionModalOpen(false)}
                    onSelect={(companionName) => {
                        handleUndeadThrallCompanionAssign(companionName);
                        setIsCompanionModalOpen(false);
                    }}
                    currentCompanionName={undeadThrallCompanionName}
                    pointLimit={undeadThrallPointLimit}
                    title="Assign True Thrall"
                    categoryFilter="undead"
                />
            )}
            {isUndeadBeastModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsUndeadBeastModalOpen(false)}
                    onSelect={(name) => {
                        handleUndeadBeastAssign(name);
                        setIsUndeadBeastModalOpen(false);
                    }}
                    currentBeastName={undeadBeastName}
                    pointLimit={undeadBeastPointLimit}
                    title="Assign Undead Beast"
                />
            )}
        </section>
    );
};