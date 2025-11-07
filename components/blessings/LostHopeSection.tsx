import React from 'react';
import { useCharacterContext } from '../../context/CharacterContext';
import { FIDELIA_DATA, LOST_HOPE_DATA, LOST_HOPE_SIGIL_TREE_DATA, CHANNELLING_DATA, NECROMANCY_DATA, BLACK_MAGIC_DATA } from '../../constants';
import type { LostHopePower, LostHopeSigil } from '../../types';
import { BlessingIntro, SectionHeader, SectionSubHeader } from '../ui';
import { CompellingWillSigilCard, SigilColor } from '../CompellingWillSigilCard';
import { ChoiceCard } from '../TraitCard';

const sigilImageMap: {[key: string]: string} = { 'kaarn.png': 'kaarn', 'purth.png': 'purth', 'juathas.png': 'juathas', 'xuth.png': 'xuth', 'sinthru.png': 'sinthru', 'lekolu.png': 'lekolu' };
const getSigilTypeFromImage = (imageSrc: string): keyof typeof sigilImageMap | null => {
    for (const key in sigilImageMap) { if (imageSrc.endsWith(key)) { return sigilImageMap[key]; } }
    return null;
}

export const LostHopeSection: React.FC = () => {
    const ctx = useCharacterContext();

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
        if (sigilType && ctx.availableSigilCounts[sigilType as keyof typeof ctx.availableSigilCounts] < 1) return true;

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
    const isBlackMagicBoostDisabled = !ctx.blackMagicBoostSigil && ctx.availableSigilCounts.sinthru < 1 && ctx.availableSigilCounts.xuth < 1;

    return (
        <section>
            <BlessingIntro {...FIDELIA_DATA} />
            <BlessingIntro {...LOST_HOPE_DATA} reverse />
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
                        return <ChoiceCard key={power.id} item={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedChannelling.has(power.id)} onSelect={ctx.handleChannellingSelect} disabled={isLostHopePowerDisabled(power, 'channelling')} selectionColor="amber" />
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
                        return <ChoiceCard key={power.id} item={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedNecromancy.has(power.id)} onSelect={ctx.handleNecromancySelect} disabled={isLostHopePowerDisabled(power, 'necromancy')} selectionColor="amber" />
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
                        return <ChoiceCard key={power.id} item={{...power, cost: '', description: power.description + boostedText}} isSelected={ctx.selectedBlackMagic.has(power.id)} onSelect={ctx.handleBlackMagicSelect} disabled={isLostHopePowerDisabled(power, 'black_magic')} selectionColor="amber" />
                    })}
                </div>
            </div>
        </section>
    );
};