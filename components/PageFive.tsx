import React, { useState, useMemo } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { 
    CAREER_INTRO_DATA, ALLMILLOR_INTRO_DATA, ALLMILLOR_CHOICES_DATA, 
    CAREER_GOALS_DATA, COLLEAGUES_DATA, CUSTOM_COLLEAGUE_CHOICES_DATA, DOMINIONS,
    UNIFORMS_DATA
} from '../constants';
import { SectionHeader, SectionSubHeader, CompanionIcon } from './ui';
import { ChoiceCard } from './TraitCard';
import type { ChoiceItem, Colleague, CustomColleagueInstance } from '../types';
import { CompanionSelectionModal } from './SigilTreeOptionCard';
import { UniformSelectionModal } from './UniformSelectionModal';

const UniformIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 3.293A1 1 0 0118 4v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1h1.293l.94-1.566A1 1 0 016.133 2h7.734a1 1 0 01.894.434L15.707 3H17.293zM10 8a3 3 0 100 6 3 3 0 000-6z" />
        <path d="M4 4h2l-1-2-1 2zM14 4h2l-1-2-1 2z" />
    </svg>
);

interface ColleagueCardProps {
  colleague: Colleague;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  uniformName?: string;
  onUniformButtonClick: () => void;
}

const ColleagueCard: React.FC<ColleagueCardProps> = ({ colleague, isSelected, onSelect, disabled = false, uniformName, onUniformButtonClick }) => {
  const { id, name, cost, description, imageSrc, birthplace, signature, otherPowers } = colleague;

  const isGain = cost.toLowerCase().includes('grants');
  const costColor = isGain ? 'text-green-400' : 'text-red-400';
  
  const borderClass = isSelected ? 'border-green-400 ring-2 ring-green-400' : 'border-gray-800';
  
  const interactionClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer hover:border-green-300/70 transition-colors';

  const handleUniformClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUniformButtonClick();
  };

  return (
    <div
      className={`relative flex flex-col md:flex-row p-4 bg-black/30 border rounded-lg h-full gap-4 ${interactionClass} ${borderClass}`}
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
              <p><strong className="text-gray-200 font-semibold">Uniform:</strong> {uniformName || 'Unidentified'}</p>
          </div>
        </div>
      </div>
       <button 
        onClick={handleUniformClick}
        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-green-200/70 hover:bg-green-900/50 hover:text-green-100 transition-colors z-10"
        aria-label={`Change ${name}'s uniform`}
        title="Change Uniform"
        disabled={disabled}
      >
        <UniformIcon />
      </button>
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
        selectedDominionId,
        isMultiplayer,
        joysOfParentingCompanionName,
        handleJoysOfParentingCompanionAssign,
        colleagueUniforms,
        handleColleagueUniformSelect,
        customColleagues,
        handleAddCustomColleague,
        handleRemoveCustomColleague,
        assigningColleague,
        handleOpenAssignColleagueModal,
        handleCloseAssignColleagueModal,
        handleAssignCustomColleagueName,
    } = useCharacterContext();

    const [isJoysOfParentingModalOpen, setIsJoysOfParentingModalOpen] = useState(false);
    const [uniformModalState, setUniformModalState] = useState<{
        isOpen: boolean;
        colleagueId: string | null;
        colleagueName: string | null;
    }>({ isOpen: false, colleagueId: null, colleagueName: null });

    const pointLimit = useMemo(() => {
        if (!assigningColleague) return 0;
        return assigningColleague.optionId === 'custom_colleague_25' ? 25 :
               assigningColleague.optionId === 'custom_colleague_35' ? 35 :
               assigningColleague.optionId === 'custom_colleague_50' ? 50 : 0;
    }, [assigningColleague]);

    const handleOpenUniformModal = (colleagueId: string, colleagueName: string) => {
        setUniformModalState({ isOpen: true, colleagueId, colleagueName });
    };

    const handleCloseUniformModal = () => {
        setUniformModalState({ isOpen: false, colleagueId: null, colleagueName: null });
    };

    const handleSelectUniformInModal = (uniformId: string) => {
        if (uniformModalState.colleagueId) {
            handleColleagueUniformSelect(uniformModalState.colleagueId, uniformId);
        }
        handleCloseUniformModal();
    };

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
                    {CAREER_GOALS_DATA.finishingTouches.map(goal => {
                        const isJoysOfParenting = goal.id === 'joys_of_parenting';
                        const isSelected = selectedCareerGoalIds.has(goal.id);

                        return (
                            <ChoiceCard
                                key={goal.id}
                                item={goal}
                                isSelected={isSelected}
                                onSelect={handleCareerGoalSelect}
                                disabled={isGoalDisabled(goal)}
                                selectionColor="green"
                                iconButton={isJoysOfParenting && isSelected ? <CompanionIcon /> : undefined}
                                onIconButtonClick={isJoysOfParenting && isSelected ? () => setIsJoysOfParentingModalOpen(true) : undefined}
                            >
                                {isJoysOfParenting && isSelected && joysOfParentingCompanionName && (
                                    <div className="text-center mt-2">
                                        <p className="text-xs text-gray-400">Assigned Child:</p>
                                        <p className="text-sm font-bold text-green-300">{joysOfParentingCompanionName}</p>
                                    </div>
                                )}
                            </ChoiceCard>
                        );
                    })}
                </div>
            </section>

            <section className="my-16">
                <SectionHeader>SELECT YOUR COLLEAGUES</SectionHeader>
                <SectionSubHeader>
                    You know the drill by this point. Same rules apply as for Classmates. With these, you have a lot more leeway in figuring out how you two met and what kind of relationship you have, since you haven't merely been stuck in the same school together.
                </SectionSubHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {COLLEAGUES_DATA.map(colleague => {
                        const selectedUniformId = colleagueUniforms.get(colleague.id);
                        const uniform = UNIFORMS_DATA.find(u => u.id === selectedUniformId);

                        return (
                            <ColleagueCard 
                                key={colleague.id} 
                                colleague={{ ...colleague, cost: getAdjustedCost(colleague) }} 
                                isSelected={selectedColleagueIds.has(colleague.id)} 
                                onSelect={handleColleagueSelect}
                                disabled={isMultiplayer}
                                uniformName={uniform?.title}
                                onUniformButtonClick={() => handleOpenUniformModal(colleague.id, colleague.name)}
                            />
                        );
                    })}
                </div>
                <div className="mt-8">
                    <div className="relative flex flex-row items-start p-6 bg-black/40 border border-green-800/60 rounded-lg gap-6">
                        <img 
                            src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg6/c25.png"
                            alt="Create your own companion" 
                            className="w-2/5 sm:w-1/3 aspect-[4/3] object-cover object-left rounded-md flex-shrink-0"
                        />
                        <div className="flex flex-col flex-grow">
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                If you have something specific in mind you're after, you may want to create your own companion! If you spend -4 FP, you can create a companion with 25 Companion Points on the Reference page; if you spend -6 FP, you are given 35 Companion Points instead; and if you spend -8 FP, you are given 50 Companion Points.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {CUSTOM_COLLEAGUE_CHOICES_DATA.map(option => (
                                    <div 
                                        key={option.id}
                                        onClick={() => handleAddCustomColleague(option.id)}
                                        className="relative p-4 bg-gray-900/50 border border-gray-700 rounded-md cursor-pointer transition-colors hover:border-green-300/70 text-center"
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Add a ${option.description}`}
                                    >
                                        <div
                                            className="absolute top-1 right-1 p-1 text-green-200/50"
                                            aria-hidden="true"
                                        >
                                            <CompanionIcon />
                                        </div>
                                        <p className="font-semibold text-sm text-red-400">{option.cost.toUpperCase()}</p>
                                        <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                                    </div>
                                ))}
                            </div>
                            {customColleagues.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-green-800/30 space-y-2">
                                    <h4 className="font-cinzel text-green-200 tracking-wider">Your Custom Colleagues</h4>
                                    {customColleagues.map(c => {
                                        const optionData = CUSTOM_COLLEAGUE_CHOICES_DATA.find(opt => opt.id === c.optionId);
                                        return (
                                            <div key={c.id} className="bg-black/20 p-2 rounded-md flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleRemoveCustomColleague(c.id)} className="text-red-500 hover:text-red-400 text-xl font-bold px-2" title="Remove Companion Slot">&times;</button>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">{optionData?.description}</p>
                                                        <p className="text-xs text-gray-400">Assigned: <span className="font-bold text-green-300">{c.companionName || 'None'}</span></p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleOpenAssignColleagueModal(c)}
                                                    className="p-2 rounded-full bg-black/50 text-green-200/70 hover:bg-green-900/50 hover:text-green-100 transition-colors"
                                                    title="Assign Companion"
                                                >
                                                    <CompanionIcon />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {isJoysOfParentingModalOpen && (
                <CompanionSelectionModal
                    currentCompanionName={joysOfParentingCompanionName}
                    onClose={() => setIsJoysOfParentingModalOpen(false)}
                    onSelect={(name) => {
                        handleJoysOfParentingCompanionAssign(name);
                        setIsJoysOfParentingModalOpen(false);
                    }}
                    pointLimit={50}
                    title="Assign Your Mage Child"
                    categoryFilter="mage"
                />
            )}
            {uniformModalState.isOpen && uniformModalState.colleagueId && uniformModalState.colleagueName && (
                <UniformSelectionModal
                    classmateName={uniformModalState.colleagueName}
                    currentUniformId={colleagueUniforms.get(uniformModalState.colleagueId)}
                    onClose={handleCloseUniformModal}
                    onSelect={handleSelectUniformInModal}
                />
            )}
            {assigningColleague && (
                <CompanionSelectionModal
                    currentCompanionName={assigningColleague.companionName}
                    onClose={handleCloseAssignColleagueModal}
                    onSelect={(name) => {
                        handleAssignCustomColleagueName(assigningColleague.id, name);
                        handleCloseAssignColleagueModal();
                    }}
                    pointLimit={pointLimit}
                    title={`Assign Custom Colleague (${pointLimit} CP)`}
                    categoryFilter="mage"
                />
            )}
        </>
    );
};