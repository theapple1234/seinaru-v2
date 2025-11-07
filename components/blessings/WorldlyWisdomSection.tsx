import React from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { WORLDLY_WISDOM_DATA, WORLDLY_WISDOM_SIGIL_TREE_DATA, ELEANORS_TECHNIQUES_DATA, GENEVIEVES_TECHNIQUES_DATA } from '../../constants';
import type { WorldlyWisdomPower, WorldlyWisdomSigil } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { ChoiceCard } from '../TraitCard';

const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const WorldlyWisdomSection: React.FC = () => {
    const ctx = useCharacterContext();

    const isWorldlyWisdomPowerDisabled = (power: WorldlyWisdomPower, type: 'eleanor' | 'genevieve'): boolean => {
      if (type === 'eleanor') {
        if (!ctx.selectedEleanorsTechniques.has(power.id) && ctx.selectedEleanorsTechniques.size >= ctx.availableEleanorsPicks) return true;
        if (power.specialRequirement === 'requires_3_eleanor' && ctx.selectedEleanorsTechniques.size < 3) return true;
        if (power.requires && !power.requires.every(req => ctx.selectedEleanorsTechniques.has(req))) return true;
      } else { // genevieve
        if (!ctx.selectedGenevievesTechniques.has(power.id) && ctx.selectedGenevievesTechniques.size >= ctx.availableGenevievesPicks) return true;
        if (power.requires && !power.requires.every(req => ctx.selectedWorldlyWisdomSigils.has(req))) return true;
      }
      return false;
    };

    const isWorldlyWisdomSigilDisabled = (sigil: WorldlyWisdomSigil): boolean => {
        if (ctx.selectedWorldlyWisdomSigils.has(sigil.id)) return false; // Can always deselect
        if (!sigil.prerequisites.every(p => ctx.selectedWorldlyWisdomSigils.has(p))) return true;

        const sigilType = getSigilTypeFromImage(sigil.imageSrc);
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof typeof ctx.availableSigilCounts] < 1) return true;

        return false;
    };

    const getWorldlyWisdomSigil = (id: string) => WORLDLY_WISDOM_SIGIL_TREE_DATA.find(s => s.id === id)!;
    
    const getSigilDisplayInfo = (sigil: WorldlyWisdomSigil): { color: SigilColor, benefits: React.ReactNode } => {
        // FIX: Explicitly type colorMap to ensure color is inferred as SigilColor, not string.
        const colorMap: Record<string, SigilColor> = {
            'Arborealist': 'orange', 'Sanctified': 'lime', 'Healer': 'gray', 'Dark Art': 'purple',
        };
        const color = colorMap[sigil.type] || 'gray';
        const benefits = (
            <>
                {sigil.benefits.eleanors ? <p className="text-blue-300">+ {sigil.benefits.eleanors} Eleanor's Techniques</p> : null}
                {sigil.benefits.genevieves ? <p className="text-green-300">+ {sigil.benefits.genevieves} Genevieve's Techniques</p> : null}
            </>
        );
        return { color, benefits };
    };

    const boostDescriptions: { [key: string]: string } = {
        healing_bliss: "Slightly faster. Once per day, can heal twice as quickly for a few minutes.",
        defensive_circle: "Once per day, can place a circle either twice as large or twice as effective.",
        rejuvenating_bolt: "Each bolt slightly more effective. Once per day, a bolt can heal twice as much.",
        guardian_angels: "Can create up to six angels at a time.",
        psychic_surgery: "Much faster and with much less chance of complications.",
        chloromancy: "Doubled mutation rate, and mutated plants are twice as durable.",
        botanic_mistresses: "More durable and numerous.",
        maneaters: "More durable, quick and difficult to escape.",
        flashback: "Significantly reduces amount of energy that needs to be stored before full flashback.",
        sustaining_bond: "Halves the amount of time exhaustion sets in after use.",
        tree_of_life: "Revival ability can be used twice.",
        the_reinmans_curse: "Aging occurs twice as quickly."
    };

    const isEleanorsBoostDisabled = !ctx.isEleanorsTechniquesBoosted && ctx.availableSigilCounts.kaarn <= 0;
    const isGenevievesBoostDisabled = !ctx.isGenevievesTechniquesBoosted && ctx.availableSigilCounts.purth <= 0;
    
    return (
        <section>
            <BlessingIntro {...WORLDLY_WISDOM_DATA} />
            <div className="my-16 bg-black/20 p-8 rounded-lg border border-gray-800">
                <SectionHeader>SIGIL TREE</SectionHeader>
                <div className="flex flex-col items-center gap-4">
                    <CompellingWillSigilCard sigil={getWorldlyWisdomSigil('arborealist')} isSelected={ctx.selectedWorldlyWisdomSigils.has('arborealist')} isDisabled={isWorldlyWisdomSigilDisabled(getWorldlyWisdomSigil('arborealist'))} onSelect={ctx.handleWorldlyWisdomSigilSelect} benefitsContent={getSigilDisplayInfo(getWorldlyWisdomSigil('arborealist')).benefits} color={getSigilDisplayInfo(getWorldlyWisdomSigil('arborealist')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getWorldlyWisdomSigil('sanctified_i')} isSelected={ctx.selectedWorldlyWisdomSigils.has('sanctified_i')} isDisabled={isWorldlyWisdomSigilDisabled(getWorldlyWisdomSigil('sanctified_i'))} onSelect={ctx.handleWorldlyWisdomSigilSelect} benefitsContent={getSigilDisplayInfo(getWorldlyWisdomSigil('sanctified_i')).benefits} color={getSigilDisplayInfo(getWorldlyWisdomSigil('sanctified_i')).color} />
                        <CompellingWillSigilCard sigil={getWorldlyWisdomSigil('healer_i')} isSelected={ctx.selectedWorldlyWisdomSigils.has('healer_i')} isDisabled={isWorldlyWisdomSigilDisabled(getWorldlyWisdomSigil('healer_i'))} onSelect={ctx.handleWorldlyWisdomSigilSelect} benefitsContent={getSigilDisplayInfo(getWorldlyWisdomSigil('healer_i')).benefits} color={getSigilDisplayInfo(getWorldlyWisdomSigil('healer_i')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getWorldlyWisdomSigil('healer_ii')} isSelected={ctx.selectedWorldlyWisdomSigils.has('healer_ii')} isDisabled={isWorldlyWisdomSigilDisabled(getWorldlyWisdomSigil('healer_ii'))} onSelect={ctx.handleWorldlyWisdomSigilSelect} benefitsContent={getSigilDisplayInfo(getWorldlyWisdomSigil('healer_ii')).benefits} color={getSigilDisplayInfo(getWorldlyWisdomSigil('healer_ii')).color} />
                        <CompellingWillSigilCard sigil={getWorldlyWisdomSigil('healer_iii')} isSelected={ctx.selectedWorldlyWisdomSigils.has('healer_iii')} isDisabled={isWorldlyWisdomSigilDisabled(getWorldlyWisdomSigil('healer_iii'))} onSelect={ctx.handleWorldlyWisdomSigilSelect} benefitsContent={getSigilDisplayInfo(getWorldlyWisdomSigil('healer_iii')).benefits} color={getSigilDisplayInfo(getWorldlyWisdomSigil('healer_iii')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <div className="flex gap-24">
                        <CompellingWillSigilCard sigil={getWorldlyWisdomSigil('sanctified_ii')} isSelected={ctx.selectedWorldlyWisdomSigils.has('sanctified_ii')} isDisabled={isWorldlyWisdomSigilDisabled(getWorldlyWisdomSigil('sanctified_ii'))} onSelect={ctx.handleWorldlyWisdomSigilSelect} benefitsContent={getSigilDisplayInfo(getWorldlyWisdomSigil('sanctified_ii')).benefits} color={getSigilDisplayInfo(getWorldlyWisdomSigil('sanctified_ii')).color} />
                        <CompellingWillSigilCard sigil={getWorldlyWisdomSigil('healer_iv')} isSelected={ctx.selectedWorldlyWisdomSigils.has('healer_iv')} isDisabled={isWorldlyWisdomSigilDisabled(getWorldlyWisdomSigil('healer_iv'))} onSelect={ctx.handleWorldlyWisdomSigilSelect} benefitsContent={getSigilDisplayInfo(getWorldlyWisdomSigil('healer_iv')).benefits} color={getSigilDisplayInfo(getWorldlyWisdomSigil('healer_iv')).color} />
                    </div>
                    <div className="h-8 w-px bg-gray-600"></div>
                    <CompellingWillSigilCard sigil={getWorldlyWisdomSigil('dark_art')} isSelected={ctx.selectedWorldlyWisdomSigils.has('dark_art')} isDisabled={isWorldlyWisdomSigilDisabled(getWorldlyWisdomSigil('dark_art'))} onSelect={ctx.handleWorldlyWisdomSigilSelect} benefitsContent={getSigilDisplayInfo(getWorldlyWisdomSigil('dark_art')).benefits} color={getSigilDisplayInfo(getWorldlyWisdomSigil('dark_art')).color} />
                    <div className="h-8 w-px bg-gray-600"></div>
                    <CompellingWillSigilCard sigil={getWorldlyWisdomSigil('sanctified_iii')} isSelected={ctx.selectedWorldlyWisdomSigils.has('sanctified_iii')} isDisabled={isWorldlyWisdomSigilDisabled(getWorldlyWisdomSigil('sanctified_iii'))} onSelect={ctx.handleWorldlyWisdomSigilSelect} benefitsContent={getSigilDisplayInfo(getWorldlyWisdomSigil('sanctified_iii')).benefits} color={getSigilDisplayInfo(getWorldlyWisdomSigil('sanctified_iii')).color} />
                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>Eleanor's Techniques</SectionHeader>
                <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isEleanorsTechniquesBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isEleanorsBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isEleanorsBoostDisabled ? () => ctx.handleWorldlyWisdomBoostToggle('eleanorsTechniques') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/kaarn.png" alt="Kaarn Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isEleanorsTechniquesBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isEleanorsTechniquesBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Kaarn sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableEleanorsPicks - ctx.selectedEleanorsTechniques.size} / {ctx.availableEleanorsPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ELEANORS_TECHNIQUES_DATA.map(power => {
                        const boostedText = ctx.isEleanorsTechniquesBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        return <ChoiceCard key={power.id} item={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedEleanorsTechniques.has(power.id)} onSelect={ctx.handleEleanorsTechniqueSelect} disabled={isWorldlyWisdomPowerDisabled(power, 'eleanor')} selectionColor="amber" />
                    })}
                </div>
            </div>
            <div className="mt-16">
                <SectionHeader>Genevieve's Techniques</SectionHeader>
                 <div className={`my-4 max-w-sm mx-auto p-4 border rounded-lg transition-all bg-black/20 ${ ctx.isGenevievesTechniquesBoosted ? 'border-amber-400 ring-2 ring-amber-400/50 cursor-pointer hover:border-amber-300' : isGenevievesBoostDisabled ? 'border-gray-700 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-amber-400/50 cursor-pointer'}`} onClick={!isGenevievesBoostDisabled ? () => ctx.handleWorldlyWisdomBoostToggle('genevievesTechniques') : undefined}>
                    <div className="flex items-center justify-center gap-4">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/sigils/purth.png" alt="Purth Sigil" className="w-16 h-16"/>
                        <div className="text-left">
                            <h4 className="font-cinzel text-lg font-bold text-amber-300 tracking-widest">{ctx.isGenevievesTechniquesBoosted ? 'BOOSTED' : 'BOOST'}</h4>
                            {!ctx.isGenevievesTechniquesBoosted && <p className="text-xs text-gray-400 mt-1">Activating this will consume one Purth sigil.</p>}
                        </div>
                    </div>
                </div>
                <SectionSubHeader>Picks Available: {ctx.availableGenevievesPicks - ctx.selectedGenevievesTechniques.size} / {ctx.availableGenevievesPicks}</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {GENEVIEVES_TECHNIQUES_DATA.map(power => {
                         const boostedText = ctx.isGenevievesTechniquesBoosted && boostDescriptions[power.id] ? `\n\nBOOSTED: ${boostDescriptions[power.id]}` : '';
                        return <ChoiceCard key={power.id} item={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedGenevievesTechniques.has(power.id)} onSelect={ctx.handleGenevievesTechniqueSelect} disabled={isWorldlyWisdomPowerDisabled(power, 'genevieve')} selectionColor="amber" />
                    })}
                </div>
            </div>
        </section>
    );
};