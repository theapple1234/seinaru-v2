import React from 'react';
import { useCharacterContext } from '../context/CharacterContext';

export const StatsFooter: React.FC = () => {
  const { blessingPoints, fortunePoints, availableSigilCounts, totalSigilCounts } = useCharacterContext();

  const sigilDisplayNames = Object.keys(totalSigilCounts)
    .filter(key => totalSigilCounts[key as keyof typeof totalSigilCounts] > 0)
    .map(name => {
      const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
      const available = availableSigilCounts[name as keyof typeof availableSigilCounts];
      const total = totalSigilCounts[name as keyof typeof totalSigilCounts];
      return `${capitalName} (${available}/${total})`;
    });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-gray-300 p-2 border-t border-gray-700 z-50 text-xs">
      <div className="container mx-auto flex justify-between items-center gap-4 flex-wrap">
        <div className="flex gap-4">
          <span className="font-bold">
            BP: <span className="text-purple-300">{blessingPoints}</span>
          </span>
          <span className="font-bold">
            FP: <span className="text-green-300">{fortunePoints}</span>
          </span>
        </div>
        <div className="flex-1 text-right truncate">
          <span className="font-bold">SIGILS: </span>
          {sigilDisplayNames.length > 0 ? (
            <span className="text-gray-400 italic">{sigilDisplayNames.join(', ')}</span>
          ) : (
            <span className="text-gray-500 italic">None</span>
          )}
        </div>
      </div>
    </div>
  );
};