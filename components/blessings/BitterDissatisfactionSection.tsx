import React, { useState, useEffect, useRef } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { BITTER_DISSATISFACTION_DATA, BITTER_DISSATISFACTION_SIGIL_TREE_DATA, BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { BitterDissatisfactionPower, BitterDissatisfactionSigil, ChoiceItem } from '../../types';
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

export const BitterDissatisfactionSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
    const [isBeastModalOpen, setIsBeastModalOpen] = useState(false);
    const [beastmasterModalState, setBeastmasterModalState] = useState<{ isOpen: boolean, index: number | null }>({ isOpen: false, index: null });
    const [isShedHumanityModalOpen, setIsShedHumanityModalOpen] = useState(false);
    const [isMalrayootsMageModalOpen, setIsMalrayootsMageModalOpen] = useState(false);
    const [isMalrayootsUniversalModalOpen, setIsMalrayootsUniversalModalOpen] = useState(false);
    
    const {
        selectedBlessingEngraving,
        bitterDissatisfactionEngraving,
        handleBitterDissatisfactionEngravingSelect,
        bitterDissatisfactionWeaponName,
        handleBitterDissatisfactionWeaponAssign,
        selectedTrueSelfTraits,
        isBitterDissatisfactionMagicianApplied,
        handleToggleBitterDissatisfactionMagician,
        disableBitterDissatisfactionMagician,
        bitterDissatisfactionSigilTreeCost,
        humanMarionetteCount,
        handleHumanMarionetteCountChange,
        humanMarionetteCompanionName,
        handleHumanMarionetteCompanionAssign,
        totalBeastPoints,
        mageFamiliarBeastName, handleMageFamiliarBeastAssign,
        beastmasterCount, handleBeastmasterCountChange,
        beastmasterBeastNames, handleBeastmasterBeastAssign,
        shedHumanityPoints,
        shedHumanityBeastName,
        handleShedHumanityBeastAssign,
        malrayootsMageFormName, handleMalrayootsMageFormAssign,
        malrayootsUniversalFormName, handleMalrayootsUniversalFormAssign,
    } = useCharacterContext();

    const finalEngraving = bitterDissatisfactionEngraving ?? selectedBlessingEngraving;
    const isSkinEngraved = finalEngraving === 'skin';

    useEffect(() => {
        if (!isSkinEngraved && isBitterDissatisfactionMagicianApplied) {
            disableBitterDissatisfactionMagician();
        }
    }, [isSkinEngraved, isBitterDissatisfactionMagicianApplied, disableBitterDissatisfactionMagician]);

    const isBitterDissatisfactionPowerDisabled = (power: BitterDissatisfactionPower, type: 'brewing' | 'soul_alchemy' | 'transformation'): boolean => {
        const selectedSet = type === 'brewing' ? ctx.selectedBrewing : type === 'soul_alchemy' ? ctx.selectedSoulAlchemy : ctx.selectedTransformation;
        const availablePicks = type === 'brewing' ? ctx.availableBrewingPicks : type === 'soul_alchemy' ? ctx.availableSoulAlchemyPicks : ctx.availableTransformationPicks;

        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelectedPowersAndSigils = new Set([...ctx.selectedBrewing, ...ctx.selectedSoulAlchemy, ...ctx.selectedTransformation, ...ctx.selectedBitterDissatisfactionSigils]);
            if (!power.requires.every(req => allSelectedPowersAndSigils.has(req))) return true;
        }
        return false;
    };

    const isBitterDissatisfactionSigilDisabled = (sigil: BitterDissatisfactionSigil): boolean => {
        if (ctx.selectedBitterDissatisfactionSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedBitterDissatisfactionSigils.has(p))) return true;
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getBitterDissatisfactionSigil = (id: string) => BITTER_DISSATISFACTION_SIGIL_TREE_DATA.find(s => s.id === id)!;

    const getSigilDisplayInfo = (sigil: BitterDissatisfactionSigil): { color: SigilColor, benefits: React.ReactNode } => {
        // FIX: Explicitly type colorMap to ensure color is inferred as SigilColor, not string.
        const colorMap: Record<string, SigilColor> = {
            'Fireborn': 'orange', 'Brewer': 'gray', 'Beastmother': 'gray',
            'Shifter': 'gray', 'Mageweaver': 'red', 'Parasitology': 'purple',
        };
        let color: SigilColor = colorMap[sigil.type] || 'gray';
        if (sigil.title.endsWith(' III')) {
            color = 'lime';
        }
        const benefits = (
            <>
                {sigil.benefits.brewing ? <p className="text-yellow-300">+ {sigil.benefits.brewing} Brewing</p> : null}
                {sigil.benefits.soulAlchemy ? <p className="text-sky-300">+ {sigil.benefits.soulAlchemy} Soul Alchemy</p> : null}
                {sigil.benefits.transformation ? <p className="text-fuchsia-300">+ {sigil.benefits.transformation} Transformation</p> : null}
            </>
        );
        return { color, benefits };
    };
    
    const boostDescriptions: { [key: string]: string } = {
        'mages_familiar_i': "+10 Beast Points.",
        'mages_familiar_ii': "+10 Beast Points.",
        'mages_familiar_iii': "+10 Beast Points.",
        'human_marionettes': "+20 Companion Points.",
        'self_duplication': "Can create up to fifteen bodies, or twenty at the price of exhaustion.",
        'personification': "Changed items can change shape to become more humanlike, albeit without gaining size.",
        'material_transmutation': "Quadrupled rate of change.",
        'internal_manipulation': "Internals can have their individual durabilities doubled.",
        'shed_humanity_i': "+10 Beast Points.",
        'shed_humanity_ii': "+10 Beast Points.",
        'phase_shift': "Removed vulnerability to EITHER ice or fire.",
        'rubber_physiology': "100x times default length, powerful elastic effect when desired.",
        'supersize_me': "Can be giant for twice the time.",
        'malrayoots': "+10 Beast Points."
    };

    const isBrewingBoostDisabled = !ctx.isBrewingBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isSoulAlchemyBoostDisabled = !ctx.isSoulAlchemyBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isTransformationBoostDisabled = !ctx.isTransformationBoosted && ctx.availableSigilCounts.kaarn <= 0;
    
    const isMagicianSelected = selectedTrueSelfTraits.has('magician');
    const additionalCost = Math.floor(bitterDissatisfactionSigilTreeCost * 0.25);

    const puppetCounts = [1, 2, 4, 5, 10, 20, 25, 50];
    const boostedPuppetCounts = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60];
    const currentPuppetCounts = ctx.isSoulAlchemyBoosted ? boostedPuppetCounts : puppetCounts;
    const totalPoints = ctx.isSoulAlchemyBoosted ? 120 : 100;
    const pointsPerPuppet = humanMarionetteCount ? totalPoints / humanMarionetteCount : 0;

    return (
        <section>
            <BlessingIntro {...BITTER_DISSATISFACTION_DATA} />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = bitterDissatisfactionEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleBitterDissatisfactionEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && bitterDissatisfactionWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({bitterDissatisfactionWeaponName})</p>
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
                            onClick={handleToggleBitterDissatisfactionMagician}
                            className={`px-6 py-3 text-sm rounded-lg border transition-colors ${
                                isBitterDissatisfactionMagicianApplied
                                    ? 'bg-purple-800/60 border-purple-500 text-white'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-purple-500/70'
                            }`}
                        >
                            {isBitterDissatisfactionMagicianApplied
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
                        handleBitterDissatisfactionWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={bitterDissatisfactionWeaponName}
                />
            )}
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex flex-col items-center gap-4">
                    <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('fireborn')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('fireborn')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('fireborn'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('fireborn')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('fireborn')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-8">
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('brewer_i')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('brewer_i')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('brewer_i'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('brewer_i')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('brewer_i')).color} />
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('beastmother_i')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('beastmother_i')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('beastmother_i'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('beastmother_i')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('beastmother_i')).color} />
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('shifter_i')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('shifter_i')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('shifter_i'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('shifter_i')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('shifter_i')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-8">
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('brewer_ii')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('brewer_ii')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('brewer_ii'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('brewer_ii')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('brewer_ii')).color} />
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('beastmother_ii')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('beastmother_ii')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('beastmother_ii'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('beastmother_ii')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('beastmother_ii')).color} />
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('shifter_ii')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('shifter_ii')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('shifter_ii'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('shifter_ii')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('shifter_ii')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-8">
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('brewer_iii')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('brewer_iii')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('brewer_iii'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('brewer_iii')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('brewer_iii')).color} />
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('beastmother_iii')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('beastmother_iii')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('beastmother_iii'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('beastmother_iii')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('beastmother_iii')).color} />
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('shifter_iii')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('shifter_iii')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('shifter_iii'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('shifter_iii')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('shifter_iii')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('mageweaver')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('mageweaver')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('mageweaver'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('mageweaver')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('mageweaver')).color} />
                        <CompellingWillSigilCard sigil={getBitterDissatisfactionSigil('parasitology')} isSelected={ctx.selectedBitterDissatisfactionSigils.has('parasitology')} isDisabled={isBitterDissatisfactionSigilDisabled(getBitterDissatisfactionSigil('parasitology'))} onSelect={ctx.handleBitterDissatisfactionSigilSelect} benefitsContent={getSigilDisplayInfo(getBitterDissatisfactionSigil('parasitology')).benefits} color={getSigilDisplayInfo(getBitterDissatisfactionSigil('parasitology')).color} />
                    </div>
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Brewing</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isBrewingBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isBrewingBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isBrewingBoostDisabled ? () => ctx.handleBitterDissatisfactionBoostToggle('brewing') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isBrewingBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isBrewingBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableBrewingPicks - ctx.selectedBrewing.size} / {ctx.availableBrewingPicks}</SectionSubHeader>
                {ctx.isBrewingBoosted && (
                    <p className="text-center text-amber-300 italic max-w-3xl mx-auto text-sm -mt-4 mb-8">
                        BOOSTED: All potions can be made either twice as cheap or twice as effective. Note: The Promised Light of Morelli cannot be boosted.
                    </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {BREWING_DATA.map(power => {
                        return <PowerCard key={power.id} power={{...power, cost: ''}} isSelected={ctx.selectedBrewing.has(power.id)} onToggle={ctx.handleBrewingSelect} isDisabled={isBitterDissatisfactionPowerDisabled(power, 'brewing')} />
                    })}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Soul Alchemy</SectionHeader>
                 <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isSoulAlchemyBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isSoulAlchemyBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isSoulAlchemyBoostDisabled ? () => ctx.handleBitterDissatisfactionBoostToggle('soulAlchemy') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isSoulAlchemyBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isSoulAlchemyBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableSoulAlchemyPicks - ctx.selectedSoulAlchemy.size} / {ctx.availableSoulAlchemyPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SOUL_ALCHEMY_DATA.map(power => {
                        const boostedText = ctx.isSoulAlchemyBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        const isSelected = ctx.selectedSoulAlchemy.has(power.id);
                        const isDisabled = isBitterDissatisfactionPowerDisabled(power, 'soul_alchemy');

                        const isFamiliar1 = power.id === 'mages_familiar_i';
                        const isFamiliar2 = power.id === 'mages_familiar_ii';
                        const isFamiliar3 = power.id === 'mages_familiar_iii';
                        const isFamiliar1Selected = ctx.selectedSoulAlchemy.has('mages_familiar_i');
                        const isFamiliar2Selected = ctx.selectedSoulAlchemy.has('mages_familiar_ii');
                        const isFamiliar3Selected = ctx.selectedSoulAlchemy.has('mages_familiar_iii');
                        const isBeastmasterSelected = ctx.selectedSoulAlchemy.has('beastmaster');
                        
                        const showButtonOn1 = isFamiliar1 && isFamiliar1Selected && !isFamiliar2Selected && !isBeastmasterSelected;
                        const showButtonOn2 = isFamiliar2 && isFamiliar2Selected && !isFamiliar3Selected && !isBeastmasterSelected;
                        const showButtonOn3 = isFamiliar3 && isFamiliar3Selected && !isBeastmasterSelected;

                        const powerCard = (
                            <PowerCard
                                power={{...power, cost: '', description: power.description + boostedText}} 
                                isSelected={isSelected}
                                onToggle={ctx.handleSoulAlchemySelect}
                                isDisabled={isDisabled}
                                iconButton={
                                    (power.id === 'beastmaster' && isBeastmasterSelected) ? <CompanionIcon /> :
                                    (showButtonOn1 || showButtonOn2 || showButtonOn3) ? <CompanionIcon /> : undefined
                                }
                                onIconButtonClick={
                                    (power.id === 'beastmaster' && isBeastmasterSelected) ? () => setBeastmasterModalState({isOpen: true, index: 0}) :
                                    (showButtonOn1 || showButtonOn2 || showButtonOn3) ? () => setIsBeastModalOpen(true) : undefined
                                }
                            >
                                {isSelected && power.id === 'human_marionettes' && (
                                    <div className="space-y-3">
                                        <select
                                            value={humanMarionetteCount ?? ''}
                                            onChange={(e) => handleHumanMarionetteCountChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                                            className="w-full bg-slate-800/70 border border-gray-600 rounded-md p-2 text-white text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="">Select number of puppets</option>
                                            {currentPuppetCounts.map(count => (
                                                <option key={count} value={count}>{count} puppet{count > 1 ? 's' : ''} ({totalPoints/count} CP each)</option>
                                            ))}
                                        </select>
                                        {humanMarionetteCount && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setIsCompanionModalOpen(true); }}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-purple-800/50 border border-purple-600 text-purple-200 hover:bg-purple-700/60 transition-colors"
                                            >
                                                <CompanionIcon />
                                                <span>Assign Build</span>
                                            </button>
                                        )}
                                        {humanMarionetteCompanionName && (
                                            <div className="text-center text-xs text-gray-400">
                                                Assigned: <span className="font-bold text-amber-300">{humanMarionetteCompanionName}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {isSelected && power.id === 'beastmaster' && (
                                    <div className="space-y-3">
                                        <select
                                            value={beastmasterCount ?? ''}
                                            onChange={(e) => handleBeastmasterCountChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                                            className="w-full bg-slate-800/70 border border-gray-600 rounded-md p-2 text-white text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="">Select number of familiars</option>
                                            {[...Array(totalBeastPoints)].map((_, i) => i + 1).filter(num => num > 0 && totalBeastPoints % num === 0).map(count => (
                                                <option key={count} value={count}>{count} familiar{count > 1 ? 's' : ''} ({totalBeastPoints/count} BP each)</option>
                                            ))}
                                        </select>
                                        {beastmasterCount && Array.from({ length: beastmasterCount }).map((_, index) => (
                                             <div key={index} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md">
                                                <span className="text-sm text-gray-300 truncate">Familiar #{index + 1}: <em className="text-amber-300">{beastmasterBeastNames[index] || 'None'}</em></span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setBeastmasterModalState({isOpen: true, index}); }}
                                                    className="p-2 rounded-full bg-amber-900/50 text-amber-200/70 hover:bg-amber-800/60 hover:text-amber-100 transition-colors flex-shrink-0"
                                                    aria-label={`Select Beast for Familiar ${index + 1}`}
                                                >
                                                    <CompanionIcon />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                 {(isFamiliar1 || isFamiliar2 || isFamiliar3) && mageFamiliarBeastName && !isBeastmasterSelected && isSelected && (
                                     <div className="text-center">
                                        <p className="text-xs text-gray-400">Assigned Familiar:</p>
                                        <p className="text-sm font-bold text-amber-300">{mageFamiliarBeastName}</p>
                                    </div>
                                 )}
                            </PowerCard>
                        );

                        if (power.id === 'human_marionettes' || power.id === 'beastmaster') {
                            return (
                                <div key={power.id} className="lg:row-span-2">
                                    {powerCard}
                                </div>
                            )
                        }
                        return <React.Fragment key={power.id}>{powerCard}</React.Fragment>
                    })}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>Transformation</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isTransformationBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isTransformationBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isTransformationBoostDisabled ? () => ctx.handleBitterDissatisfactionBoostToggle('transformation') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isTransformationBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isTransformationBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableTransformationPicks - ctx.selectedTransformation.size} / {ctx.availableTransformationPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TRANSFORMATION_DATA.map(power => {
                        const boostedText = ctx.isTransformationBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        const isSelected = ctx.selectedTransformation.has(power.id);
                        
                        const isShedHumanity1 = power.id === 'shed_humanity_i';
                        const isShedHumanity2 = power.id === 'shed_humanity_ii';
                        const isShedHumanity1Selected = ctx.selectedTransformation.has('shed_humanity_i');
                        const isShedHumanity2Selected = ctx.selectedTransformation.has('shed_humanity_ii');

                        const isMalrayoots = power.id === 'malrayoots';

                        const showButtonOn1 = isShedHumanity1 && isShedHumanity1Selected && !isShedHumanity2Selected;
                        const showButtonOn2 = isShedHumanity2 && isShedHumanity2Selected;

                        return <PowerCard 
                            key={power.id} 
                            power={{...power, cost: '', description: power.description + boostedText}} 
                            isSelected={isSelected} 
                            onToggle={ctx.handleTransformationSelect} 
                            isDisabled={isBitterDissatisfactionPowerDisabled(power, 'transformation')} 
                            iconButton={(showButtonOn1 || showButtonOn2) ? <CompanionIcon /> : undefined}
                            onIconButtonClick={(showButtonOn1 || showButtonOn2) ? () => setIsShedHumanityModalOpen(true) : undefined}
                        >
                            {(isShedHumanity1 || isShedHumanity2) && isShedHumanity1Selected && shedHumanityBeastName && (
                                <div className="text-center">
                                    <p className="text-xs text-gray-400">Assigned Form:</p>
                                    <p className="text-sm font-bold text-amber-300">{shedHumanityBeastName}</p>
                                </div>
                            )}
                             {isMalrayoots && isSelected && (
                                <div className="space-y-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsMalrayootsMageModalOpen(true); }}
                                        className="w-full px-3 py-2 text-sm rounded-md bg-purple-800/50 border border-purple-600 text-purple-200 hover:bg-purple-700/60 transition-colors"
                                    >
                                        Assign Mage Form ({ctx.isTransformationBoosted ? 80 : 70} BP)
                                    </button>
                                    {malrayootsMageFormName && (
                                        <p className="text-xs text-center text-gray-400">Assigned: <span className="font-bold text-amber-300">{malrayootsMageFormName}</span></p>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsMalrayootsUniversalModalOpen(true); }}
                                        className="w-full px-3 py-2 text-sm rounded-md bg-purple-800/50 border border-purple-600 text-purple-200 hover:bg-purple-700/60 transition-colors"
                                    >
                                        Assign Universal Form ({ctx.isTransformationBoosted ? 50 : 40} BP)
                                    </button>
                                    {malrayootsUniversalFormName && (
                                        <p className="text-xs text-center text-gray-400">Assigned: <span className="font-bold text-amber-300">{malrayootsUniversalFormName}</span></p>
                                    )}
                                </div>
                            )}
                        </PowerCard>
                    })}
                </div>
            </div>
            {isCompanionModalOpen && humanMarionetteCount && (
                <CompanionSelectionModal
                    onClose={() => setIsCompanionModalOpen(false)}
                    onSelect={(name) => {
                        handleHumanMarionetteCompanionAssign(name);
                        setIsCompanionModalOpen(false);
                    }}
                    currentCompanionName={humanMarionetteCompanionName}
                    pointLimit={pointsPerPuppet}
                    title="Assign Puppet Build"
                    categoryFilter="puppet"
                />
            )}
            {isBeastModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsBeastModalOpen(false)}
                    onSelect={(name) => {
                        handleMageFamiliarBeastAssign(name);
                        setIsBeastModalOpen(false);
                    }}
                    currentBeastName={mageFamiliarBeastName}
                    pointLimit={totalBeastPoints}
                    title="Assign Familiar"
                />
            )}
            {beastmasterModalState.isOpen && beastmasterModalState.index !== null && beastmasterCount && (
                 <BeastSelectionModal
                    onClose={() => setBeastmasterModalState({isOpen: false, index: null})}
                    onSelect={(name) => {
                        if (beastmasterModalState.index !== null) {
                            handleBeastmasterBeastAssign(beastmasterModalState.index, name);
                        }
                        setBeastmasterModalState({isOpen: false, index: null});
                    }}
                    currentBeastName={beastmasterBeastNames[beastmasterModalState.index]}
                    pointLimit={totalBeastPoints / beastmasterCount}
                    title={`Assign Familiar #${beastmasterModalState.index + 1}`}
                />
            )}
            {isShedHumanityModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsShedHumanityModalOpen(false)}
                    onSelect={(name) => {
                        handleShedHumanityBeastAssign(name);
                        setIsShedHumanityModalOpen(false);
                    }}
                    currentBeastName={shedHumanityBeastName}
                    pointLimit={shedHumanityPoints}
                    title="Assign Transformed Form"
                    excludedPerkIds={['chatterbox_beast', 'magical_beast']}
                />
            )}
            {isMalrayootsMageModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsMalrayootsMageModalOpen(false)}
                    onSelect={(name) => {
                        handleMalrayootsMageFormAssign(name);
                        setIsMalrayootsMageModalOpen(false);
                    }}
                    currentBeastName={malrayootsMageFormName}
                    pointLimit={ctx.isTransformationBoosted ? 80 : 70}
                    title="Assign Mage Form"
                />
            )}
            {isMalrayootsUniversalModalOpen && (
                <BeastSelectionModal
                    onClose={() => setIsMalrayootsUniversalModalOpen(false)}
                    onSelect={(name) => {
                        handleMalrayootsUniversalFormAssign(name);
                        setIsMalrayootsUniversalModalOpen(false);
                    }}
                    currentBeastName={malrayootsUniversalFormName}
                    pointLimit={ctx.isTransformationBoosted ? 50 : 40}
                    title="Assign Universal Form"
                />
            )}
        </section>
    );
};