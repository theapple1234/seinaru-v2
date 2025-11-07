import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { RETIREMENT_INTRO_DATA, RETIREMENT_CHOICES_DATA, CHILD_OF_GOD_DATA } from '../constants';
import { SectionHeader } from './ui';
import { ChoiceCard } from './TraitCard';

export const PageSix: React.FC = () => {
    const { 
        selectedRetirementChoiceId, 
        handleRetirementChoiceSelect,
        selectedChildOfGodChoiceId,
        handleChildOfGodChoiceSelect
    } = useCharacterContext();

    const childOfGodChoice = CHILD_OF_GOD_DATA[0];

    return (
        <>
            <section className="flex flex-col items-center text-center gap-8 mb-16 max-w-4xl mx-auto">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{RETIREMENT_INTRO_DATA.description}</p>
            </section>

            <section className="my-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {RETIREMENT_CHOICES_DATA.map(choice => (
                        <ChoiceCard
                            key={choice.id}
                            item={choice}
                            isSelected={selectedRetirementChoiceId === choice.id}
                            onSelect={handleRetirementChoiceSelect}
                        />
                    ))}
                </div>
            </section>

            <section className="my-16">
                <div 
                    className={`p-6 bg-black/20 border-2 rounded-lg cursor-pointer transition-colors ${selectedChildOfGodChoiceId === childOfGodChoice.id ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-800 hover:border-red-500/50'}`}
                    onClick={() => handleChildOfGodChoiceSelect(childOfGodChoice.id)}
                >
                    <div className="flex flex-col items-center text-center">
                        <img src={childOfGodChoice.imageSrc} alt={childOfGodChoice.title} className="w-64 h-64 object-cover rounded-full border-4 border-gray-700 mb-6" />
                        <h3 className="font-cinzel text-3xl font-bold text-white mb-4 tracking-wider">{childOfGodChoice.title}</h3>
                        <div className="max-w-4xl mx-auto text-sm text-gray-400 leading-relaxed whitespace-pre-wrap space-y-4">
                            {childOfGodChoice.description.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            <footer className="text-center text-gray-600 text-xs mt-24">
                THANKS FOR PLAYING! | SEINARU MAGECRAFT GIRLS V1.0 | PAGE 6/6 | CYOA BY NXTUB
            </footer>
        </>
    );
};