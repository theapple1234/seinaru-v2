import React from 'react';
import type { Sigil } from '../types';

interface SpecialSigilCardProps {
  sigil: Sigil;
  selectedSubOptionIds: Set<string> | null;
  onSubOptionSelect: (id: string) => void;
  lekoluJobCounts?: Map<string, number>;
  onLekoluJobAction?: (subOptionId: string, action: 'buy' | 'sell') => void;
}

export const SpecialSigilCard: React.FC<SpecialSigilCardProps> = ({ sigil, selectedSubOptionIds, onSubOptionSelect, lekoluJobCounts, onLekoluJobAction }) => {
  const { id, title, description, imageSrc, cost, subOptions } = sigil;

  return (
    <div className="flex flex-col lg:flex-row p-4 bg-black/30 rounded-lg border border-gray-800 gap-4">
      {/* Sigil Info */}
      <div className="lg:w-1/3 flex-shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left p-4 border-b lg:border-b-0 lg:border-r border-gray-700">
        <img src={imageSrc} alt={title} className="w-24 h-24 object-contain flex-shrink-0 mb-4" />
        <div>
          <h3 className="font-cinzel text-3xl font-bold text-white tracking-wider">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mt-2">{description}</p>
          <p className="text-purple-300/80 text-xs italic mt-2">{cost}</p>
        </div>
      </div>

      {/* Sub-Options */}
      <div className="flex-grow p-2">
        {subOptions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {subOptions.map(option => {
              const count = id === 'lekolu' && lekoluJobCounts ? lekoluJobCounts.get(option.id) ?? 0 : 0;
              const isSelected = id === 'lekolu' ? count > 0 : selectedSubOptionIds?.has(option.id) ?? false;

              const colorConfig = {
                xuth: { selected: 'border-orange-500 ring-2 ring-orange-500/50', hover: 'hover:border-orange-400/70' },
                lekolu: { selected: 'border-yellow-400 ring-2 ring-yellow-400/50', hover: 'hover:border-yellow-400/70' },
                sinthru: { selected: 'border-purple-500 ring-2 ring-purple-500/50', hover: 'hover:border-purple-400/70' },
                default: { selected: 'border-cyan-400 ring-2 ring-cyan-400', hover: 'hover:border-cyan-400/50' }
              };
              
              const theme = colorConfig[id as keyof typeof colorConfig] || colorConfig.default;
              const subBorderClass = isSelected ? theme.selected : `border-gray-700 ${theme.hover}`;

              if (id === 'lekolu' && onLekoluJobAction && lekoluJobCounts) {
                // Multi-select for Lekolu
                const handleBuy = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    onLekoluJobAction(option.id, 'buy');
                };
                const handleSell = () => {
                    if (count > 0) {
                        onLekoluJobAction(option.id, 'sell');
                    }
                };

                return (
                  <div 
                    key={option.id} 
                    className={`flex flex-col p-3 bg-gray-900/50 border rounded-lg h-full transition-colors cursor-pointer ${subBorderClass}`}
                    onClick={handleSell}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="relative">
                        <img 
                            src={option.imageSrc} 
                            alt="" 
                            className="w-full h-32 object-cover rounded-md mb-3" 
                            onClick={handleBuy}
                        />
                        {count > 0 && (
                            <div className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-lg border-2 border-gray-800 pointer-events-none">
                                {count}
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 leading-snug flex-grow">{option.description}</p>
                    <p className="text-xs text-gray-500 italic text-center mt-2">Click image to add, card to remove.</p>
                  </div>
                );
              } else {
                // Multi-select for Xuth, Sinthru
                const columnSpanClass = id === 'xuth' ? 'sm:col-span-2' : '';
                return (
                  <div 
                    key={option.id}
                    className={`flex flex-col p-3 bg-gray-900/50 border rounded-lg h-full transition-colors cursor-pointer ${subBorderClass} ${columnSpanClass}`}
                    onClick={() => onSubOptionSelect(option.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={option.imageSrc} alt="" className="w-full h-32 object-cover rounded-md mb-3" />
                    <p className="text-xs text-gray-400 leading-snug flex-grow">{option.description}</p>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};