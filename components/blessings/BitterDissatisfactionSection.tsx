import React from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { BITTER_DISSATISFACTION_DATA, BITTER_DISSATISFACTION_SIGIL_TREE_DATA, BREWING_DATA, SOUL_ALCHEMY_DATA, TRANSFORMATION_DATA } from '../../constants';
import type { BitterDissatisfactionPower, BitterDissatisfactionSigil } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { ChoiceCard } from '../TraitCard';

const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const BitterDissatisfactionSection: React.FC = () => {
    const ctx = useCharacterContext();

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
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof typeof ctx.availableSigilCounts] < 1) return true;

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
        // Brewing potions are handled with a general message.
        
        // Soul Alchemy
        'mages_familiar_i': "+10 Beast Points.",
        'mages_familiar_ii': "+10 Beast Points.",
        'mages_familiar_iii': "+10 Beast Points.",
        'human_marionettes': "+20 Companion Points.",
        'self_duplication': "Can create up to fifteen bodies, or twenty at the price of exhaustion.",
        'personification': "Changed items can change shape to become more humanlike, albeit without gaining size.",

        // Transformation
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

    return (
        <section>
            <BlessingIntro {...BITTER_DISSATISFACTION_DATA} />
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
                        return <ChoiceCard key={power.id} item={{...power, cost: ''}} isSelected={ctx.selectedBrewing.has(power.id)} onSelect={ctx.handleBrewingSelect} disabled={isBitterDissatisfactionPowerDisabled(power, 'brewing')} selectionColor="amber" />
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
                    {(() => {
                        const specialPower = SOUL_ALCHEMY_DATA.find(p => p.id === 'human_marionettes');
                        const otherPowers = SOUL_ALCHEMY_DATA.filter(p => p.id !== 'human_marionettes');
                        const firstHalf = otherPowers.slice(0, 3);
                        const secondHalf = otherPowers.slice(3);

                        const renderPower = (power: BitterDissatisfactionPower) => {
                             const boostedText = ctx.isSoulAlchemyBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                             return <ChoiceCard 
                                key={power.id} 
                                item={{...power, cost: '', description: power.description + boostedText}} 
                                isSelected={ctx.selectedSoulAlchemy.has(power.id)} 
                                onSelect={ctx.handleSoulAlchemySelect} 
                                disabled={isBitterDissatisfactionPowerDisabled(power, 'soul_alchemy')} 
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
                        return <ChoiceCard key={power.id} item={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedTransformation.has(power.id)} onSelect={ctx.handleTransformationSelect} disabled={isBitterDissatisfactionPowerDisabled(power, 'transformation')} selectionColor="amber" />
                    })}
                </div>
            </div>
        </section>
    );
};