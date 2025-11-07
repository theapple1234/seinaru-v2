import React from 'react';
import type { Classmate } from '../types';

interface ClassmateCardProps {
  classmate: Classmate;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  selectionColor?: 'amber' | 'brown';
  refundText?: string;
  uniformName?: string;
  onContextMenu?: (event: React.MouseEvent) => void;
}

export const ClassmateCard: React.FC<ClassmateCardProps> = ({ classmate, isSelected, onSelect, disabled = false, selectionColor = 'amber', refundText, uniformName, onContextMenu }) => {
  const { id, name, cost, description, imageSrc, birthplace, signature, otherPowers } = classmate;

  const isGain = cost.toLowerCase().includes('grants');
  const costColor = isGain ? 'text-green-400' : 'text-red-400';

  const themeClasses = {
      amber: {
          border: 'border-amber-400',
          ring: 'ring-amber-400',
          hover: 'hover:border-amber-300/70',
          bg: 'bg-black/30'
      },
      brown: {
          border: 'border-yellow-700',
          ring: 'ring-yellow-700',
          hover: 'hover:border-yellow-600/70',
          bg: 'bg-black/40'
      }
  };
  const currentTheme = themeClasses[selectionColor];

  const borderClass = isSelected ? `${currentTheme.border} ring-2 ${currentTheme.ring}` : 'border-gray-800';

  const interactionClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : `cursor-pointer ${currentTheme.hover} transition-colors`;

  return (
    <div
      className={`flex flex-col md:flex-row p-4 ${currentTheme.bg} border rounded-lg h-full gap-4 ${interactionClass} ${borderClass}`}
      onClick={() => !disabled && onSelect(id)}
      onContextMenu={onContextMenu}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      <img src={imageSrc} alt={name} className="w-full md:w-48 h-64 md:h-auto object-cover rounded-md flex-shrink-0" />
      <div className="flex flex-col flex-grow">
        <div className="text-center md:text-left">
          <h4 className="font-bold font-cinzel text-white text-xl">{name}</h4>
          <p className={`text-sm font-semibold my-1 ${costColor}`}>{cost.toUpperCase()}</p>
          {refundText && <p className="text-sm font-semibold my-1 text-green-400">{refundText}</p>}
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
    </div>
  );
};