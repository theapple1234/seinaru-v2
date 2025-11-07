import React from 'react';

export type SigilColor = 'red' | 'green' | 'gray' | 'yellow' | 'orange' | 'lime' | 'purple';

interface CompellingWillSigilCardProps {
  sigil: {id: string, title: string, imageSrc: string, description?: string};
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (id: string) => void;
  benefitsContent: React.ReactNode;
  color: SigilColor;
}

export const CompellingWillSigilCard: React.FC<CompellingWillSigilCardProps> = ({ sigil, isSelected, isDisabled, onSelect, benefitsContent, color }) => {
  const { id, title, imageSrc, description } = sigil;
  
  const colorClassMap = {
      red: { border: 'border-red-400', ring: 'ring-red-400', hover: 'hover:border-red-400/70', text: 'text-red-300' },
      green: { border: 'border-green-400', ring: 'ring-green-400', hover: 'hover:border-green-400/70', text: 'text-green-300' },
      gray: { border: 'border-gray-400', ring: 'ring-gray-400', hover: 'hover:border-gray-400/70', text: 'text-gray-300' },
      yellow: { border: 'border-yellow-400', ring: 'ring-yellow-400', hover: 'hover:border-yellow-400/70', text: 'text-yellow-300' },
      orange: { border: 'border-orange-400', ring: 'ring-orange-400', hover: 'hover:border-orange-400/70', text: 'text-orange-300' },
      lime: { border: 'border-lime-400', ring: 'ring-lime-400', hover: 'hover:border-lime-400/70', text: 'text-lime-300' },
      purple: { border: 'border-purple-400', ring: 'ring-purple-400', hover: 'hover:border-purple-400/70', text: 'text-purple-300' },
  };

  const currentColors = colorClassMap[color] || colorClassMap.gray;

  const borderClass = isSelected 
    ? `${currentColors.border} ring-2 ${currentColors.ring}` 
    : `border-gray-700 ${currentColors.hover}`;
  
  const interactionClass = isDisabled
    ? 'opacity-40 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <div 
      className={`group flex flex-col items-center text-center p-3 transition-all duration-300 ease-in-out bg-black/40 rounded-lg h-full border ${borderClass} ${interactionClass} w-44 min-h-[160px] justify-between`}
      onClick={() => !isDisabled && onSelect(id)}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      <img src={imageSrc} alt={title} className="w-16 h-16 object-contain mb-2" />
      <div className="flex flex-col">
        <h3 className={`font-cinzel text-sm font-bold ${currentColors.text} tracking-wider`}>{title}</h3>
        <div className="border-t border-gray-600 w-full pt-2 mt-2 text-xs">
          {benefitsContent}
          {description && <p className="text-yellow-300 italic text-[10px] mt-1 whitespace-pre-wrap">{description}</p>}
        </div>
      </div>
    </div>
  );
};
