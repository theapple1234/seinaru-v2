import React, { useState } from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { RIGHTEOUS_CREATION_DATA, RIGHTEOUS_CREATION_SIGIL_TREE_DATA, RIGHTEOUS_CREATION_SPECIALTIES_DATA, RIGHTEOUS_CREATION_MAGITECH_DATA, RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA, RIGHTEOUS_CREATION_METAMAGIC_DATA, BLESSING_ENGRAVINGS } from '../../constants';
import type { RighteousCreationPower, RighteousCreationSigil } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader, WeaponIcon } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { ChoiceCard } from '../TraitCard';
import { WeaponSelectionModal } from '../WeaponSelectionModal';


const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const RighteousCreationSection: React.FC = () => {
    const ctx = useCharacterContext();
    const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
    const {
        selectedBlessingEngraving,
        righteousCreationEngraving,
        handleRighteousCreationEngravingSelect,
        righteousCreationWeaponName,
        handleRighteousCreationWeaponAssign,
    } = useCharacterContext();

    const isRighteousCreationPowerDisabled = (power: RighteousCreationPower, type: 'magitech' | 'arcane_constructs' | 'metamagic'): boolean => {
        const selectedSet = type === 'magitech' ? ctx.selectedMagitechPowers : type === 'arcane_constructs' ? ctx.selectedArcaneConstructsPowers : ctx.selectedMetamagicPowers;
        const availablePicks = type === 'magitech' ? ctx.availableMagitechPicks : type === 'arcane_constructs' ? ctx.availableArcaneConstructsPicks : ctx.availableMetamagicPicks;
        const specialtyId = type === 'magitech' ? 'magitech_specialty' : type === 'arcane_constructs' ? 'arcane_constructs_specialty' : 'metamagic_specialty';

        if (!ctx.selectedSpecialties.has(specialtyId)) return true;
        if (!selectedSet.has(power.id) && selectedSet.size >= availablePicks) return true;
        if (power.requires) {
            const allSelected = new Set([...ctx.selectedMagitechPowers, ...ctx.selectedArcaneConstructsPowers, ...ctx.selectedMetamagicPowers, ...ctx.selectedRighteousCreationSigils]);
            if (!power.requires.every(req => allSelected.has(req))) return true;
        }
        return false;
    };

    const isRighteousCreationSigilDisabled = (sigil: RighteousCreationSigil): boolean => {
        if (ctx.selectedRighteousCreationSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedRighteousCreationSigils.has(p))) return true;
        
        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        const sigilCost = sigilType ? 1 : 0;
        if (sigilType && ctx.availableSigilCounts[sigilType] < sigilCost) return true;

        return false;
    };

    const getRighteousCreationSigil = (id: string) => RIGHTEOUS_CREATION_SIGIL_TREE_DATA.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: RighteousCreationSigil): { color: SigilColor, benefits: React.ReactNode } => {
        // FIX: Explicitly type colorMap to ensure color is inferred as SigilColor, not string.
        const colorMap: Record<string, SigilColor> = {
            'ROOKIE ENGINEER': 'orange', 'POLYMATH™': 'yellow', 'TECHNICIAN': 'gray', 'MAGICIAN': 'gray',
            'MAGITECHNICIAN': 'green', 'ARCANE WIZARD': 'green', 'METAMAGICIAN': 'green',
            'MASTER MAGITECH': 'red', 'MASTER ARCANA': 'red', 'METAMASTER': 'red',
        };
        const color = colorMap[sigil.title] || 'gray';
        const benefits = (
          <>
            {sigil.benefits.specialty ? <p className="text-yellow-300">+ {sigil.benefits.specialty} Specialty</p> : null}
            {sigil.benefits.magitech ? <p className="text-cyan-300">+ {sigil.benefits.magitech} Magitech</p> : null}
            {sigil.benefits.arcaneConstructs ? <p className="text-purple-300">+ {sigil.benefits.arcaneConstructs} Arcane Constructs</p> : null}
            {sigil.benefits.metamagic ? <p className="text-rose-300">+ {sigil.benefits.metamagic} Metamagic</p> : null}
          </>
        );
        return { color, benefits };
    };

    return (
        <section>
            <BlessingIntro {...RIGHTEOUS_CREATION_DATA} />
            <div className="mt-8 mb-16 max-w-3xl mx-auto">
                <h4 className="font-cinzel text-xl text-center tracking-widest my-6 text-purple-300 uppercase">
                    Engrave this Blessing
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {BLESSING_ENGRAVINGS.map(engraving => {
                        const finalEngraving = righteousCreationEngraving ?? selectedBlessingEngraving;
                        const isSelected = finalEngraving === engraving.id;
                        const isOverridden = righteousCreationEngraving !== null;
                        const isWeapon = engraving.id === 'weapon';

                        return (
                             <div key={engraving.id} className="relative">
                                <button
                                    onClick={() => handleRighteousCreationEngravingSelect(engraving.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center h-full text-center
                                        ${isSelected 
                                            ? (isOverridden ? 'border-purple-400 bg-purple-900/40' : 'border-purple-600/50 bg-purple-900/20') 
                                            : 'border-gray-700 bg-black/30 hover:border-purple-400/50'}
                                    `}
                                >
                                    <span className="font-cinzel tracking-wider uppercase">{engraving.title}</span>
                                    {isWeapon && isSelected && righteousCreationWeaponName && (
                                        <p className="text-xs text-purple-300 mt-2 truncate">({righteousCreationWeaponName})</p>
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
                        handleRighteousCreationWeaponAssign(weaponName);
                        setIsWeaponModalOpen(false);
                    }}
                    currentWeaponName={righteousCreationWeaponName}
                />
            )}
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex flex-col items-center gap-4">
                    <CompellingWillSigilCard sigil={getRighteousCreationSigil('rookie_engineer')} isSelected={ctx.selectedRighteousCreationSigils.has('rookie_engineer')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('rookie_engineer'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('rookie_engineer')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('rookie_engineer')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-8">
                        <CompellingWillSigilCard sigil={getRighteousCreationSigil('polymat')} isSelected={ctx.selectedRighteousCreationSigils.has('polymat')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('polymat'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('polymat')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('polymat')).color} />
                        <CompellingWillSigilCard sigil={getRighteousCreationSigil('technician')} isSelected={ctx.selectedRighteousCreationSigils.has('technician')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('technician'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('technician')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('technician')).color} />
                        <CompellingWillSigilCard sigil={getRighteousCreationSigil('magician')} isSelected={ctx.selectedRighteousCreationSigils.has('magician')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('magician'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('magician')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('magician')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                     <div className="flex gap-8">
                        <CompellingWillSigilCard sigil={getRighteousCreationSigil('magitechnician')} isSelected={ctx.selectedRighteousCreationSigils.has('magitechnician')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('magitechnician'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('magitechnician')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('magitechnician')).color} />
                        <CompellingWillSigilCard sigil={getRighteousCreationSigil('arcane_wizard')} isSelected={ctx.selectedRighteousCreationSigils.has('arcane_wizard')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('arcane_wizard'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('arcane_wizard')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('arcane_wizard')).color} />
                        <CompellingWillSigilCard sigil={getRighteousCreationSigil('metamagician')} isSelected={ctx.selectedRighteousCreationSigils.has('metamagician')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('metamagician'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('metamagician')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('metamagician')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                     <div className="flex gap-8">
                        <CompellingWillSigilCard sigil={getRighteousCreationSigil('master_magitech')} isSelected={ctx.selectedRighteousCreationSigils.has('master_magitech')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('master_magitech'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('master_magitech')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('master_magitech')).color} />
                        <CompellingWillSigilCard sigil={getRighteousCreationSigil('master_arcana')} isSelected={ctx.selectedRighteousCreationSigils.has('master_arcana')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('master_arcana'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('master_arcana')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('master_arcana')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <CompellingWillSigilCard sigil={getRighteousCreationSigil('metamaster')} isSelected={ctx.selectedRighteousCreationSigils.has('metamaster')} isDisabled={isRighteousCreationSigilDisabled(getRighteousCreationSigil('metamaster'))} onSelect={ctx.handleRighteousCreationSigilSelect} benefitsContent={getSigilDisplayInfo(getRighteousCreationSigil('metamaster')).benefits} color={getSigilDisplayInfo(getRighteousCreationSigil('metamaster')).color} />
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>SPECIALTY</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availableSpecialtyPicks - ctx.selectedSpecialties.size} / {ctx.availableSpecialtyPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {RIGHTEOUS_CREATION_SPECIALTIES_DATA.map(specialty => <ChoiceCard key={specialty.id} item={{...specialty, cost: ''}} isSelected={ctx.selectedSpecialties.has(specialty.id)} onSelect={ctx.handleSpecialtySelect} disabled={!ctx.selectedSpecialties.has(specialty.id) && ctx.selectedSpecialties.size >= ctx.availableSpecialtyPicks} selectionColor="amber" />)}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>MAGITECH</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availableMagitechPicks - ctx.selectedMagitechPowers.size} / {ctx.availableMagitechPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {RIGHTEOUS_CREATION_MAGITECH_DATA.map(power => <ChoiceCard key={power.id} item={{...power, cost: ''}} isSelected={ctx.selectedMagitechPowers.has(power.id)} onSelect={ctx.handleMagitechPowerSelect} disabled={isRighteousCreationPowerDisabled(power, 'magitech')} selectionColor="amber" />)}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>ARCANE CONSTRUCTS</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availableArcaneConstructsPicks - ctx.selectedArcaneConstructsPowers.size} / {ctx.availableArcaneConstructsPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(() => {
                        const specialPower = RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA.find(p => p.id === 'divine_clay');
                        const otherPowers = RIGHTEOUS_CREATION_ARCANE_CONSTRUCTS_DATA.filter(p => p.id !== 'divine_clay');
                        const firstHalf = otherPowers.slice(0, 3);
                        const secondHalf = otherPowers.slice(3);
                        
                        const renderPower = (power: RighteousCreationPower) => (
                            <ChoiceCard 
                                key={power.id} 
                                item={{...power, cost: ''}} 
                                isSelected={ctx.selectedArcaneConstructsPowers.has(power.id)} 
                                onSelect={ctx.handleArcaneConstructsPowerSelect} 
                                disabled={isRighteousCreationPowerDisabled(power, 'arcane_constructs')} 
                                selectionColor="amber"
                             />
                        );

                        return (
                            <>
                                {firstHalf.map(renderPower)}
                                {specialPower && (
                                    <div key={specialPower.id} className="lg:row-span-2">
                                        <ChoiceCard
                                            item={{...specialPower, cost: ''}}
                                            isSelected={ctx.selectedArcaneConstructsPowers.has(specialPower.id)}
                                            onSelect={ctx.handleArcaneConstructsPowerSelect}
                                            disabled={isRighteousCreationPowerDisabled(specialPower, 'arcane_constructs')}
                                            selectionColor="amber"
                                        />
                                    </div>
                                )}
                                {secondHalf.map(renderPower)}
                            </>
                        );
                    })()}
                </div>
            </div>
            <div className="mt-16 px-4 lg:px-8">
                <SectionHeader>METAMAGIC</SectionHeader>
                <SectionSubHeader>Picks Available: {ctx.availableMetamagicPicks - ctx.selectedMetamagicPowers.size} / {ctx.availableMetamagicPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(() => {
                        const specialPower = RIGHTEOUS_CREATION_METAMAGIC_DATA.find(p => p.id === 'marias_gift');
                        const otherPowers = RIGHTEOUS_CREATION_METAMAGIC_DATA.filter(p => p.id !== 'marias_gift');
                        const firstHalf = otherPowers.slice(0, 3);
                        const secondHalf = otherPowers.slice(3);

                        const renderPower = (power: RighteousCreationPower) => (
                            <ChoiceCard 
                                key={power.id} 
                                item={{...power, cost: ''}} 
                                isSelected={ctx.selectedMetamagicPowers.has(power.id)} 
                                onSelect={ctx.handleMetamagicPowerSelect} 
                                disabled={isRighteousCreationPowerDisabled(power, 'metamagic')} 
                                selectionColor="amber"
                            />
                        );

                        return (
                            <>
                                {firstHalf.map(renderPower)}
                                {specialPower && (
                                    <div key={specialPower.id} className="lg:row-span-2">
                                        <ChoiceCard
                                            item={{...specialPower, cost: ''}}
                                            isSelected={ctx.selectedMetamagicPowers.has(specialPower.id)}
                                            onSelect={ctx.handleMetamagicPowerSelect}
                                            disabled={isRighteousCreationPowerDisabled(specialPower, 'metamagic')}
                                            selectionColor="amber"
                                        />
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