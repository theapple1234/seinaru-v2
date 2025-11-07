import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { DRYADEA_DATA, LIMITLESS_POTENTIAL_DATA, CUSTOM_SPELL_RULES_DATA, LIMITLESS_POTENTIAL_RUNES_DATA } from '../constants';
import { BlessingIntro, SectionHeader } from './ui';
import { ChoiceCard } from './TraitCard';

const CustomSpellInput = ({ type, text, onChange }: { type: 'ruhai' | 'mialgrath', text: string, onChange: (type: 'ruhai' | 'mialgrath', text: string) => void }) => {
    return (
        <div className="bg-black/20 p-4 rounded-lg border border-gray-700 h-full flex flex-col">
            <label htmlFor={type} className="block mb-2 font-cinzel text-xl text-amber-300">{type === 'ruhai' ? 'RUHAI SPELL' : 'MIALGRATH SPELL'}</label>
            <textarea
                id={type}
                value={text}
                onChange={(e) => onChange(type, e.target.value)}
                className="w-full flex-grow bg-gray-900/50 border border-gray-600 rounded-md p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                placeholder="Describe your custom spell here, following the rules provided..."
                rows={10}
            />
        </div>
    );
};

export const PageFour: React.FC = () => {
    const { 
        selectedLimitlessPotentialRunes, 
        customSpells, 
        handleLimitlessPotentialRuneSelect, 
        handleCustomSpellChange 
    } = useCharacterContext();

    return (
        <>
            <BlessingIntro {...DRYADEA_DATA} />
            <BlessingIntro {...LIMITLESS_POTENTIAL_DATA} reverse />
            
            <section className="my-16 max-w-4xl mx-auto bg-black/20 p-6 border border-gray-700 rounded-lg">
                <h3 className="text-center font-cinzel text-xl text-white mb-4">{CUSTOM_SPELL_RULES_DATA.title}</h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-400 text-sm">
                    {CUSTOM_SPELL_RULES_DATA.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                    ))}
                </ol>
            </section>

            <section className="my-16">
                <SectionHeader>Purchase Runes to Create Spells</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {LIMITLESS_POTENTIAL_RUNES_DATA.map(rune => (
                        <ChoiceCard 
                            key={rune.id}
                            item={rune} 
                            isSelected={selectedLimitlessPotentialRunes.has(rune.id)}
                            onSelect={() => handleLimitlessPotentialRuneSelect(rune.id as 'ruhai' | 'mialgrath')} 
                            selectionColor="amber"
                        />
                    ))}
                </div>
            </section>
            
            {selectedLimitlessPotentialRunes.size > 0 && (
                 <section className="my-16 max-w-6xl mx-auto">
                    <SectionHeader>Design Your Custom Spells</SectionHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {selectedLimitlessPotentialRunes.has('ruhai') && (
                            <CustomSpellInput 
                                type="ruhai"
                                text={customSpells.ruhai}
                                onChange={handleCustomSpellChange}
                            />
                        )}
                        {selectedLimitlessPotentialRunes.has('mialgrath') && (
                            <CustomSpellInput 
                                type="mialgrath"
                                text={customSpells.mialgrath}
                                onChange={handleCustomSpellChange}
                            />
                        )}
                    </div>
                </section>
            )}
             <div className="flex justify-center my-16">
                 <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg5/main7.png" alt="Cityscape" className="w-full max-w-7xl rounded-lg shadow-lg no-glow" />
            </div>
        </>
    );
};