import React, { useRef } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { DRYADEA_DATA, LIMITLESS_POTENTIAL_DATA, CUSTOM_SPELL_RULES_DATA, LIMITLESS_POTENTIAL_RUNES_DATA } from '../constants';
import { BlessingIntro, SectionHeader, SectionSubHeader } from './ui';
import type { CustomSpell, ChoiceItem } from '../types';

interface RuneCounterProps {
  ruhaiCount: number;
  availableMialgrathCount: number;
}
const RuneCounter: React.FC<RuneCounterProps> = ({ ruhaiCount, availableMialgrathCount }) => {
  const ruhaiMeta = LIMITLESS_POTENTIAL_RUNES_DATA.find(r => r.id === 'ruhai')!;
  const mialgrathMeta = LIMITLESS_POTENTIAL_RUNES_DATA.find(r => r.id === 'mialgrath')!;

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    document.getElementById('rune-purchase-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="fixed top-1/2 right-0 -translate-y-1/2 bg-black/70 backdrop-blur-sm p-4 rounded-l-lg border-l border-t border-b border-gray-700 z-50 group cursor-pointer transition-colors hover:border-amber-400/70 hover:bg-black/90"
      onClick={handleScroll}
      role="button"
      tabIndex={0}
      aria-label="Scroll to Rune purchase section"
      title="Scroll to Rune purchase section"
    >
      <h4 className="font-cinzel text-lg text-amber-300 mb-4 text-center">RUNES</h4>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img src={ruhaiMeta.imageSrc} alt={ruhaiMeta.title} className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-white w-8 text-center">{ruhaiCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <img src={mialgrathMeta.imageSrc} alt={mialgrathMeta.title} className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-white w-8 text-center">{availableMialgrathCount}</span>
        </div>
      </div>
    </div>
  );
};


interface RuneCardProps {
  rune: ChoiceItem;
  onAction: (action: 'buy' | 'sell') => void;
  onAnimate: (rect: DOMRect) => void;
}

const RuneCard: React.FC<RuneCardProps> = ({ rune, onAction, onAnimate }) => {
  const { cost, description, imageSrc, title } = rune;
  const imgRef = useRef<HTMLImageElement>(null);

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction('buy');
    if (imgRef.current) {
      onAnimate(imgRef.current.getBoundingClientRect());
    }
  };

  return (
    <div 
      className={`group flex flex-col items-center text-center p-6 transition-all duration-300 ease-in-out bg-black/30 rounded-lg h-full border border-gray-800 hover:border-amber-400/50 cursor-default`}
      role="button"
      aria-label={`Rune card for ${title}`}
    >
      <div 
        className="relative cursor-pointer"
        onClick={handleBuy}
        role="button"
        aria-label={`Buy one ${title}`}
      >
        <img ref={imgRef} src={imageSrc} alt={title} className="w-24 h-24 object-contain mb-4 transition-transform group-hover:scale-110" />
      </div>
      <h3 className="font-cinzel text-2xl font-bold mt-2 mb-3 text-white tracking-wider">{title}</h3>
      <div className="border-t border-gray-700 pt-4 flex-grow">
        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
        <p className="text-purple-300/80 text-xs italic mt-4">{cost}</p>
      </div>
       <div className="mt-4 w-full flex justify-around">
         <button onClick={handleBuy} className="px-4 py-1 rounded bg-gray-700/50 border border-gray-600 hover:bg-gray-600/50 transition-colors">Buy</button>
         <button onClick={() => onAction('sell')} className="px-4 py-1 rounded bg-gray-700/50 border border-gray-600 hover:bg-gray-600/50 transition-colors">Sell</button>
      </div>
    </div>
  );
};

interface CustomSpellInputProps {
    spell: CustomSpell;
    index: number;
    onDescriptionChange: (id: number, text: string) => void;
    onMialgrathToggle: (id: number) => void;
    onMialgrathDescriptionChange: (id: number, text: string) => void;
    canApplyMialgrath: boolean;
}

const CustomSpellInput: React.FC<CustomSpellInputProps> = ({ spell, index, onDescriptionChange, onMialgrathToggle, onMialgrathDescriptionChange, canApplyMialgrath }) => {
    
    const isMialgrathToggleDisabled = !spell.mialgrathApplied && !canApplyMialgrath;
    const mialgrathMeta = LIMITLESS_POTENTIAL_RUNES_DATA.find(r => r.id === 'mialgrath')!;

    return (
        <div className="bg-black/20 p-4 rounded-lg border border-gray-700 flex flex-col gap-4">
            <div>
                <label htmlFor={`ruhai-${spell.id}`} className="block mb-2 font-cinzel text-xl text-amber-300">RUHAI SPELL #{index + 1}</label>
                <textarea
                    id={`ruhai-${spell.id}`}
                    value={spell.description}
                    onChange={(e) => onDescriptionChange(spell.id, e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-md p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="Describe your custom spell here..."
                    rows={8}
                />
            </div>
            
            <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onMialgrathToggle(spell.id)}
                        disabled={isMialgrathToggleDisabled}
                        className={`px-4 py-2 rounded-md border text-sm font-semibold transition-colors flex items-center gap-3
                            ${spell.mialgrathApplied 
                                ? 'bg-amber-800/60 border-amber-500 text-white' 
                                : isMialgrathToggleDisabled 
                                    ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-amber-500/70 hover:bg-amber-900/40'}`}
                    >
                       <img src={mialgrathMeta.imageSrc} alt="Mialgrath Rune" className="w-10 h-10" />
                       {spell.mialgrathApplied ? 'Applied' : 'Apply'}
                    </button>
                    <p className="text-xs text-gray-400">Apply a Mialgrath rune to this spell to defy a restriction.</p>
                </div>

                {spell.mialgrathApplied && (
                    <div className="mt-4">
                        <label htmlFor={`mialgrath-${spell.id}`} className="block mb-2 text-sm font-semibold text-amber-400">MIALGRATH EFFECT</label>
                         <textarea
                            id={`mialgrath-${spell.id}`}
                            value={spell.mialgrathDescription}
                            onChange={(e) => onMialgrathDescriptionChange(spell.id, e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-md p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                            placeholder="Describe which restriction is being ignored (e.g., 'Allows creation of a weapon with 50 WP', 'Fits into both Metathermics and Transformation', etc.)"
                            rows={4}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


export const PageFour: React.FC = () => {
    const { 
        acquiredRunes,
        customSpells,
        handleRuneAction,
        handleSpellDescriptionChange,
        handleMialgrathDescriptionChange,
        handleToggleMialgrath,
        mialgrathRunesApplied,
        mialgrathRunesPurchased,
    } = useCharacterContext();

    const [fallingRunes, setFallingRunes] = React.useState<Array<{
        id: number;
        src: string;
        top: number;
        left: number;
        xOffsetEnd: number;
        rotation: number;
    }>>([]);

    const handleRuneAnimation = (rect: DOMRect, src: string) => {
        const xOffsetEnd = (Math.random() - 0.5) * 200;
        const rotation = (Math.random() - 0.5) * 60;
        const newRune = {
            id: Date.now() + Math.random(),
            src,
            top: rect.top,
            left: rect.left,
            xOffsetEnd,
            rotation,
        };
        setFallingRunes(prev => [...prev, newRune]);
    };

    const ruhaiCount = acquiredRunes.get('ruhai') ?? 0;
    const availableMialgrathCount = mialgrathRunesPurchased - mialgrathRunesApplied;

    return (
        <>
            {fallingRunes.map(rune => (
                <img
                    key={rune.id}
                    src={rune.src}
                    className="sigil-fall-animation"
                    style={{ 
                        top: rune.top, 
                        left: rune.left,
                        width: '96px',
                        height: '96px',
                        '--x-offset-end': `${rune.xOffsetEnd}px`,
                        '--rotation': `${rune.rotation}deg`,
                    } as React.CSSProperties}
                    onAnimationEnd={() => {
                        setFallingRunes(prev => prev.filter(s => s.id !== rune.id));
                    }}
                />
            ))}
            <RuneCounter ruhaiCount={ruhaiCount} availableMialgrathCount={availableMialgrathCount} />

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

            <section className="my-16" id="rune-purchase-section">
                <SectionHeader>Purchase Runes to Create Spells</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <RuneCard 
                        rune={LIMITLESS_POTENTIAL_RUNES_DATA[0]} 
                        onAction={(action) => handleRuneAction('ruhai', action)}
                        onAnimate={(rect) => handleRuneAnimation(rect, LIMITLESS_POTENTIAL_RUNES_DATA[0].imageSrc)}
                    />
                    <RuneCard 
                        rune={LIMITLESS_POTENTIAL_RUNES_DATA[1]} 
                        onAction={(action) => handleRuneAction('mialgrath', action)}
                        onAnimate={(rect) => handleRuneAnimation(rect, LIMITLESS_POTENTIAL_RUNES_DATA[1].imageSrc)}
                    />
                </div>
            </section>
            
            {ruhaiCount > 0 && (
                 <section className="my-16 max-w-5xl mx-auto">
                    <SectionHeader>Design Your Custom Spells</SectionHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {customSpells.map((spell, index) => (
                            <CustomSpellInput
                                key={spell.id}
                                spell={spell}
                                index={index}
                                onDescriptionChange={handleSpellDescriptionChange}
                                onMialgrathToggle={handleToggleMialgrath}
                                onMialgrathDescriptionChange={handleMialgrathDescriptionChange}
                                canApplyMialgrath={availableMialgrathCount > 0 || spell.mialgrathApplied}
                            />
                        ))}
                    </div>
                </section>
            )}
             <div className="flex justify-center my-16">
                 <img src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg5/main7.png" alt="Cityscape" className="w-full max-w-7xl rounded-lg shadow-lg no-glow" />
            </div>
        </>
    );
};