import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
    CAREER_INTRO_DATA, ALLMILLOR_INTRO_DATA, ALLMILLOR_CHOICES_DATA, 
    CAREER_GOALS_DATA, COLLEAGUES_DATA, CUSTOM_COLLEAGUE_CHOICES_DATA, DOMINIONS 
} from '../constants';
import { SectionHeader, SectionSubHeader } from './ui';
import { ChoiceCard } from './TraitCard';
import type { ChoiceItem, Colleague, CustomColleagueOption } from '../types';


interface ColleagueCardProps {
  colleague: Colleague;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const ColleagueCard: React.FC<ColleagueCardProps> = ({ colleague, isSelected, onSelect, disabled = false }) => {
  const { id, name, cost, description, imageSrc, birthplace, signature, otherPowers } = colleague;

  const isGain = cost.toLowerCase().includes('grants');
  const costColor = isGain ? 'text-green-400' : 'text-red-400';
  
  const borderClass = isSelected ? 'border-green-400 ring-2 ring-green-400' : 'border-gray-800';
  
  const interactionClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer hover:border-green-300/70 transition-colors';

  return (
    <div
      className={`flex flex-col md:flex-row p-4 bg-black/30 border rounded-lg h-full gap-4 ${interactionClass} ${borderClass}`}
      onClick={() => !disabled && onSelect(id)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      <img src={imageSrc} alt={name} className="w-full md:w-48 h-64 md:h-auto object-cover rounded-md flex-shrink-0" />
      <div className="flex flex-col flex-grow">
        <div className="text-center md:text-left">
          <h4 className="font-bold font-cinzel text-white text-xl">{name}</h4>
          <p className={`text-sm font-semibold my-1 ${costColor}`}>{cost.toUpperCase()}</p>
        </div>
        <div className="text-sm text-gray-300 mt-3 text-left flex-grow flex flex-col">
          <p className="leading-relaxed flex-grow">{description}</p>
          <div className="mt-4 text-xs text-gray-400 border-t border-gray-700 pt-3">
              <p><strong className="text-gray-200 font-semibold">Birthplace:</strong> {birthplace}</p>
              <p><strong className="text-gray-200 font-semibold">Signature:</strong> {signature}</p>
              <p><strong className="text-gray-200 font-semibold">Other Powers:</strong> {otherPowers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CustomColleagueCardProps {
    options: CustomColleagueOption[];
    selectedOptionId: string | null;
    onSelect: (id: string) => void;
}

const CustomColleagueCard: React.FC<CustomColleagueCardProps> = ({ options, selectedOptionId, onSelect }) => {
    return (
        <div className="flex flex-col md:flex-row p-4 bg-black/30 border border-gray-800 rounded-lg h-full gap-4">
             <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg6/c25.png" alt="Custom Colleague" className="w-full md:w-48 h-64 md:h-auto object-cover rounded-md flex-shrink-0" />
             <div className="flex flex-col flex-grow">
                <div className="text-center md:text-left">
                    <h4 className="font-bold font-cinzel text-white text-xl">CREATE YOUR OWN</h4>
                </div>
                <div className="text-sm text-gray-300 mt-3 text-left flex-grow flex flex-col">
                    <p className="leading-relaxed flex-grow">
                        Same as last time, if none of the options above suffice (or you're playing Multiplayer), you can create your own colleague!
                    </p>
                    <div className="flex flex-col gap-3 justify-end mt-4">
                        {options.map(option => {
                            const isSelected = selectedOptionId === option.id;
                            const isGain = option.cost.toLowerCase().includes('grants');
                            const costColor = isGain ? 'text-green-400' : 'text-red-400';
                            const borderClass = isSelected ? 'border-green-400 ring-2 ring-green-400' : 'border-gray-700 hover:border-green-300/70';

                            return (
                                <div 
                                    key={option.id}
                                    onClick={() => onSelect(option.id)}
                                    className={`p-3 bg-gray-900/50 border rounded-md cursor-pointer transition-colors ${borderClass}`}
                                >
                                    <p className={`font-semibold text-xs text-center ${costColor}`}>{option.cost.toUpperCase()}</p>
                                    <p className="text-xs text-center text-gray-400">{option.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
             </div>
        </div>
    );
};


export const PageFive: React.FC = () => {
    const { 
        selectedAllmillorIds, 
        handleAllmillorSelect,
        selectedCareerGoalIds,
        handleCareerGoalSelect,
        selectedClubIds,
        selectedMiscActivityIds,
        selectedColleagueIds, 
        handleColleagueSelect,
        customColleagueChoice,
        handleCustomColleagueChoice,
        selectedDominionId,
        isMultiplayer
    } = useCharacterContext();

    const isGoalDisabled = (goal: ChoiceItem): boolean => {
        if (!goal.requires) return false;
        
        const requiredIds = Array.isArray(goal.requires) ? goal.requires : [goal.requires];
        
        const selectedPrereqs = new Set([
            ...selectedClubIds,
            ...selectedMiscActivityIds,
            ...selectedCareerGoalIds
        ]);

        return !requiredIds.every(reqId => selectedPrereqs.has(reqId));
    };

    const getAdjustedCost = (colleague: { cost: string, birthplace: string }): string => {
        const dominion = DOMINIONS.find(d => d.id === selectedDominionId);
        if (dominion && colleague.birthplace.toUpperCase() === dominion.title.toUpperCase()) {
            const costMatch = colleague.cost.match(/Costs -(\d+)\s*FP/i);
            if (costMatch) {
                const originalCost = parseInt(costMatch[1], 10);
                const newCost = Math.max(0, originalCost - 2);
                return newCost > 0 ? `Costs -${newCost} FP` : 'Costs 0 FP';
            }
        }
        return colleague.cost;
    };


    return (
        <>
            <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-16">
                <div className="flex-shrink-0 relative">
                    <img src={CAREER_INTRO_DATA.imageSrc} alt="Your Career Intro" className="w-64 md:w-80 rounded-lg shadow-lg" />
                </div>
                <div className="max-w-2xl text-center lg:text-left">
                    <h2 className="text-2xl font-cinzel tracking-widest text-gray-400">STAGE III</h2>
                    <h1 className="text-5xl font-bold font-cinzel my-2 text-white">{CAREER_INTRO_DATA.title}</h1>
                    <hr className="border-gray-600 my-4" />
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{CAREER_INTRO_DATA.description}</p>
                </div>
            </section>
            
            <section className="my-24">
                 <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto items-center bg-black/20 p-8 rounded-lg border border-gray-800">
                    <div className="md:w-1/3">
                        <img src={ALLMILLOR_INTRO_DATA.imageSrc} alt={ALLMILLOR_INTRO_DATA.title} className="rounded-lg shadow-lg w-full" />
                    </div>
                    <div className="md:w-2/3 text-gray-300 text-sm space-y-4">
                        <h3 className="font-cinzel text-3xl text-center text-white mb-4">{ALLMILLOR_INTRO_DATA.title}</h3>
                        <p className="whitespace-pre-wrap">{ALLMILLOR_INTRO_DATA.description}</p>
                    </div>
                </div>
            </section>

            <section className="my-16">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ALLMILLOR_CHOICES_DATA.map(choice => (
                        <ChoiceCard
                            key={choice.id}
                            item={choice}
                            isSelected={selectedAllmillorIds.has(choice.id)}
                            onSelect={handleAllmillorSelect}
                            disabled={!selectedAllmillorIds.has(choice.id) && selectedAllmillorIds.size >= 3}
                            selectionColor="green"
                        />
                    ))}
                </div>
            </section>

             <section className="my-16">
                <SectionHeader>CAREER GOALS</SectionHeader>
                <SectionSubHeader>First off, if you played sports in school, you might just be able to go pro!</SectionSubHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {CAREER_GOALS_DATA.proSports.map(goal => (
                        <ChoiceCard
                            key={goal.id}
                            item={goal}
                            isSelected={selectedCareerGoalIds.has(goal.id)}
                            onSelect={handleCareerGoalSelect}
                            disabled={isGoalDisabled(goal)}
                            selectionColor="green"
                        />
                    ))}
                </div>

                <SectionSubHeader>Beyond that, your options are totally freeform! You can go try and do anything you put your mind to. But just to help, here's a few ideas for possible ambitions you can attempt...</SectionSubHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {CAREER_GOALS_DATA.general.map(goal => (
                        <ChoiceCard
                            key={goal.id}
                            item={goal}
                            isSelected={selectedCareerGoalIds.has(goal.id)}
                            onSelect={handleCareerGoalSelect}
                            disabled={isGoalDisabled(goal)}
                            selectionColor="green"
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CAREER_GOALS_DATA.finishingTouches.map(goal => (
                        <ChoiceCard
                            key={goal.id}
                            item={goal}
                            isSelected={selectedCareerGoalIds.has(goal.id)}
                            onSelect={handleCareerGoalSelect}
                            disabled={isGoalDisabled(goal)}
                            selectionColor="green"
                        />
                    ))}
                </div>
            </section>

            <section className="my-16">
                <SectionHeader>SELECT YOUR COLLEAGUES</SectionHeader>
                <SectionSubHeader>
                    You know the drill by this point. Same rules apply as for Classmates. With these, you have a lot more leeway in figuring out how you two met and what kind of relationship you have, since you haven't merely been stuck in the same school together.
                </SectionSubHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {COLLEAGUES_DATA.map(colleague => (
                        <ColleagueCard 
                            key={colleague.id} 
                            colleague={{ ...colleague, cost: getAdjustedCost(colleague) }} 
                            isSelected={selectedColleagueIds.has(colleague.id)} 
                            onSelect={handleColleagueSelect}
                            disabled={isMultiplayer}
                        />
                    ))}
                    <CustomColleagueCard 
                        options={CUSTOM_COLLEAGUE_CHOICES_DATA}
                        selectedOptionId={customColleagueChoice}
                        onSelect={handleCustomColleagueChoice}
                    />
                </div>
            </section>
        </>
    );
};