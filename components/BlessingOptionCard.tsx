import React from 'react';
import type { ChoiceItem } from '../types';

interface BlessingOptionCardProps {
  item: ChoiceItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const BlessingOptionCard: React.FC<BlessingOptionCardProps> = ({ item, isSelected, onSelect }) => {
  const { id, title, description, imageSrc } = item;
  
  const ringClass = isSelected 
    ? 'ring-2 ring-purple-400' 
    : 'group-hover:ring-2 group-hover:ring-purple-400/70';

  return (
    <div 
      className="flex flex-col items-center text-center cursor-pointer group"
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
    >
      <div className={`relative p-2 rounded-full transition-all duration-300 bg-black/20 ${ringClass}`}>
        <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg shadow-black/50">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
          />
        </div>
      </div>
      <h3 className="font-cinzel text-2xl font-bold mt-6 mb-3 text-white tracking-wider">{title}</h3>
      <div className="p-4 border-t border-gray-700 w-full max-w-sm">
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};