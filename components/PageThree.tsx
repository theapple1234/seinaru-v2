import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { BLESSING_ENGRAVINGS, COMMON_SIGILS_DATA, SPECIAL_SIGILS_DATA } from '../constants';
import { BlessingOptionCard } from './BlessingOptionCard';
import { SigilCard } from './SigilCard';
import { SpecialSigilCard } from './SpecialSigilCard';
import { SectionHeader, SectionSubHeader } from './ui';
import { GoodTidingsSection } from './blessings/GoodTidingsSection';
import { CompellingWillSection } from './blessings/CompellingWillSection';
import { WorldlyWisdomSection } from './blessings/WorldlyWisdomSection';
import { BitterDissatisfactionSection } from './blessings/BitterDissatisfactionSection';
import { LostHopeSection } from './blessings/LostHopeSection';
import { FallenPeaceSection } from './blessings/FallenPeaceSection';
import { GraciousDefeatSection } from './blessings/GraciousDefeatSection';
import { ClosedCircuitsSection } from './blessings/ClosedCircuitsSection';
import { RighteousCreationSection } from './blessings/RighteousCreationSection';
import { StarCrossedLoveSection } from './blessings/StarCrossedLoveSection';

interface SigilCounterProps {
  counts: { kaarn: number; purth: number; juathas: number; xuth: number; sinthru: number; lekolu: number; };
}

const ALL_SIGILS_META = [
    ...COMMON_SIGILS_DATA,
    ...SPECIAL_SIGILS_DATA
];

const SigilCounter: React.FC<SigilCounterProps> = ({ counts }) => {
  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    document.getElementById('sigil-purchase-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="fixed top-1/2 right-0 -translate-y-1/2 bg-black/70 backdrop-blur-sm p-4 rounded-l-lg border-l border-t border-b border-gray-700 z-50 group cursor-pointer transition-colors hover:border-purple-400/70 hover:bg-black/90"
      onClick={handleScroll}
      role="button"
      tabIndex={0}
      aria-label="Scroll to Sigil purchase section"
      title="Scroll to Sigil purchase section"
    >
      <h4 className="font-cinzel text-lg text-purple-300 mb-4 text-center">SIGILS</h4>
      <div className="flex flex-col gap-4">
        {Object.entries(counts).map(([id, count]) => {
          const sigil = ALL_SIGILS_META.find(s => s.id === id);
          if (!sigil) return null;
          return (
            <div key={id} className="flex items-center gap-3">
              <img src={sigil.imageSrc} alt={sigil.title} className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-white w-8 text-center">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export const PageThree: React.FC = () => {
    const { 
        selectedBlessingEngraving, handleBlessingEngravingSelect, 
        acquiredCommonSigils, handleCommonSigilAction,
        acquiredLekoluJobs, handleLekoluJobAction,
        selectedSpecialSigilChoices, handleSpecialSigilChoice,
        availableSigilCounts,
        openReferencePage
    } = useCharacterContext();

    const [fallingSigils, setFallingSigils] = React.useState<Array<{
        id: number;
        src: string;
        top: number;
        left: number;
        xOffsetEnd: number;
        rotation: number;
    }>>([]);
        
    const handleSigilAnimation = (rect: DOMRect, src: string) => {
        const xOffsetEnd = (Math.random() - 0.5) * 200; // -100px to 100px
        const rotation = (Math.random() - 0.5) * 60; // Random rotation between -30 and +30 degrees

        const newSigil = {
            id: Date.now() + Math.random(),
            src,
            top: rect.top,
            left: rect.left,
            xOffsetEnd,
            rotation,
        };
        setFallingSigils(prev => [...prev, newSigil]);
    };

    return (
        <>
            {fallingSigils.map(sigil => (
                <img
                    key={sigil.id}
                    src={sigil.src}
                    className="sigil-fall-animation"
                    style={{ 
                        top: sigil.top, 
                        left: sigil.left,
                        width: '96px', // w-24 from SigilCard
                        height: '96px', // h-24 from SigilCard
                        '--x-offset-end': `${sigil.xOffsetEnd}px`,
                        '--rotation': `${sigil.rotation}deg`,
                    } as React.CSSProperties}
                    onAnimationEnd={() => {
                        setFallingSigils(prev => prev.filter(s => s.id !== sigil.id));
                    }}
                />
            ))}
            <SigilCounter counts={availableSigilCounts} />

            <section className="mb-24">
                <SectionHeader>IT'S TIME TO DESIGN YOUR MAGIC!</SectionHeader>

                <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto items-center bg-black/20 p-8 rounded-lg border border-gray-800">
                    <div className="md:w-1/3">
                        <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg3/main2.png" alt="Path of Magic" className="rounded-lg shadow-lg shadow-purple-500/20 w-full" />
                    </div>
                    <div className="md:w-2/3 text-gray-300 text-sm space-y-4">
                        <p>Your time at the academy has taught you so much. Of course, it hasn't given you anything you didn't already possess; it merely showed you how to make full use of the potential that's been inside you all along. The deeper you delved into the inner workings of magecraft, the more your nights were beset by strange dreams of murky glimpses of a higher realm, reminding you of your smallness in a great and terrifying multiverse.</p>
                        <p>Pay close attention here, for this is where it gets slightly complicated. Each <strong className="text-white">Stolen Blessing</strong> is a chunk of power ripped from the soul of the Child of God and bestowed upon Mages by the Mother of Azure, administered by her five well, four Daughters. She currently institutes the Sinsaur Doctrine of Magecraft: the power of the Blessings may only be harnessed using various <strong className="text-white">Sigils</strong> as catalysts. Beneath each blessing, you may see sigils laid out something like this:</p>
                    </div>
                </div>
                
                <div className="flex justify-center my-8">
                    <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg3/main3.png" alt="Sigil Tree Example" className="max-w-lg" />
                </div>

                <div className="max-w-4xl mx-auto p-6 bg-black/20 border border-gray-800 rounded-lg">
                    <p className="text-gray-300 text-center mb-4">Each sigil you purchase will entitle you to a great amount of that Blessing's power, in accordance with the following rules:</p>
                    <ol className="list-decimal list-inside space-y-3 text-gray-400 text-sm">
                        <li>Before buying a sigil, you must have purchased every sigil connected to it from its left. Think of it like a perk tree in an RPG. You start at the leftmost side, and make your way to the very right.</li>
                        <li>Buying more sigils allows you to choose more of the Blessing's <strong className="text-white">Modifiers</strong>, listed in the menu beneath. For example, if you buy a sigil with the description <strong className="text-white">"+1 Minor Spell"</strong>, you may then take one more option from the category marked "Minor Spells".</li>
                        <li>"Unlocking" a spell or boon is not the same as acquiring it. You still have to purchase it as described in rule #2.</li>
                        <li>You can buy a sigil twice to "boost" every power attached to it, based on the following list: <a href="https://pastebin.com/GkqPm98A" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">pastebin.com/GkqPm98A</a>.</li>
                    </ol>
                </div>

                <section className="mt-24">
                    <SectionHeader>For each Blessing, you can decide where its sigils shall be engraved</SectionHeader>
                    <SectionSubHeader>You can set this individually for each Blessing, but for now, please pick a default location.</SectionSubHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {BLESSING_ENGRAVINGS.map(engraving => (
                            <BlessingOptionCard
                                key={engraving.id}
                                item={engraving}
                                isSelected={selectedBlessingEngraving === engraving.id}
                                onSelect={handleBlessingEngravingSelect}
                            />
                        ))}
                    </div>
                </section>
            </section>

            <hr className="border-gray-700 my-24" />

            <section id="sigil-purchase-section">
                <SectionHeader>The Common Sigils</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {COMMON_SIGILS_DATA.map(sigil => (
                    <SigilCard 
                        key={sigil.id} 
                        sigil={sigil} 
                        count={acquiredCommonSigils.get(sigil.id) || 0}
                        onAction={(action) => handleCommonSigilAction(sigil.id, action)} 
                        onAnimate={(rect) => handleSigilAnimation(rect, sigil.imageSrc)}
                    />
                ))}
                </div>
            </section>

            <section className="mt-24">
                <SectionHeader>The Special Sigils</SectionHeader>
                <div className="flex flex-col gap-12 max-w-7xl mx-auto">
                {SPECIAL_SIGILS_DATA.map(sigil => (
                    <SpecialSigilCard 
                        key={sigil.id} 
                        sigil={sigil} 
                        selectedSubOptionIds={selectedSpecialSigilChoices.get(sigil.id) || null}
                        onSubOptionSelect={(subOptionId) => handleSpecialSigilChoice(sigil.id, subOptionId)}
                        lekoluJobCounts={acquiredLekoluJobs}
                        onLekoluJobAction={handleLekoluJobAction}
                    />
                ))}
                </div>
            </section>

            <hr className="border-gray-700 my-24" />
            <GoodTidingsSection />
            <hr className="border-gray-700 my-24" />
            <CompellingWillSection />
            <hr className="border-gray-700 my-24" />
            <WorldlyWisdomSection />
            <hr className="border-gray-700 my-24" />
            <BitterDissatisfactionSection />
            <hr className="border-gray-700 my-24" />
            <LostHopeSection />
            <hr className="border-gray-700 my-24" />
            <FallenPeaceSection />
            <hr className="border-gray-700 my-24" />
            <GraciousDefeatSection />
            <hr className="border-gray-700 my-24" />
            <ClosedCircuitsSection />
            <hr className="border-gray-700 my-24" />
            <RighteousCreationSection />
            <hr className="border-gray-700 my-24" />
            <StarCrossedLoveSection />
        </>
    );
};