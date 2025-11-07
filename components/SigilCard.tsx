import React, { useRef } from 'react';
import type { Sigil } from '../types';

interface SigilCardProps {
  sigil: Sigil;
  count: number;
  onAction: (action: 'buy' | 'sell') => void;
  onAnimate: (rect: DOMRect) => void;
}

export const SigilCard: React.FC<SigilCardProps> = ({ sigil, count, onAction, onAnimate }) => {
  const { id, title, description, imageSrc, cost } = sigil;
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
      className={`group flex flex-col items-center text-center p-6 transition-all duration-300 ease-in-out bg-black/30 rounded-lg h-full border border-gray-800 ${count > 0 ? 'cursor-pointer' : 'cursor-default'} hover:border-purple-400/50`}
      onClick={() => { if (count > 0) onAction('sell'); }}
      role="button"
      tabIndex={0}
      aria-label={`Sell one ${title}. Current count: ${count}`}
    >
      <div 
        className="relative cursor-pointer"
        onClick={handleBuy}
        role="button"
        tabIndex={0}
        aria-label={`Buy one ${title}`}
      >
        <img ref={imgRef} src={imageSrc} alt={title} className="w-24 h-24 object-contain mb-4 transition-transform group-hover:scale-110" />
      </div>
      <h3 className="font-cinzel text-2xl font-bold mt-2 mb-3 text-white tracking-wider">{title}</h3>
      <div className="border-t border-gray-700 pt-4 flex-grow">
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        <p className="text-purple-300/80 text-xs italic mt-4">{cost}</p>
      </div>
       <div className="mt-4 w-full">
         <p className="text-xs text-gray-500 italic">Click image to buy, card to sell.</p>
      </div>
    </div>
  );
};