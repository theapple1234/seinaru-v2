import React from 'react';
import type { ChoiceItem } from '../types';

interface ChoiceCardProps {
  item: ChoiceItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  selectionColor?: 'cyan' | 'amber' | 'green' | 'brown';
  layout?: 'vertical' | 'horizontal' | 'horizontal-tall';
  imageShape?: 'rect' | 'circle';
  aspect?: 'square';
  assignedColors?: string[];
  noBorder?: boolean;
  children?: React.ReactNode;
  alwaysShowChildren?: boolean;
  onIconButtonClick?: () => void;
  iconButton?: React.ReactNode;
  imageRounding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ item, isSelected, onSelect, disabled = false, selectionColor = 'cyan', layout = 'vertical', imageShape = 'rect', aspect, assignedColors = [], noBorder = false, children, alwaysShowChildren = false, onIconButtonClick, iconButton, imageRounding = 'md' }) => {
  const { id, title, cost, description, imageSrc } = item;

  const isGain = cost && (cost.toLowerCase().includes('grants') || cost.toLowerCase().includes('+'));
  const costColor = isGain ? 'text-green-400' : 'text-red-400';

  const colorThemes = {
    cyan: {
        border: 'border-cyan-400',
        ring: 'ring-cyan-400',
        hover: 'hover:border-cyan-300/70',
        ringHover: 'group-hover:ring-cyan-300/70',
        bg: 'bg-slate-900/80',
        iconBg: 'bg-cyan-900/50',
        iconText: 'text-cyan-200/70',
        iconHoverBg: 'hover:bg-cyan-800/60',
        iconHoverText: 'hover:text-cyan-100',
    },
    amber: {
        border: 'border-amber-400',
        ring: 'ring-amber-400',
        hover: 'hover:border-amber-300/70',
        ringHover: 'group-hover:ring-amber-300/70',
        bg: 'bg-slate-900/80',
        iconBg: 'bg-amber-900/50',
        iconText: 'text-amber-200/70',
        iconHoverBg: 'hover:bg-amber-800/60',
        iconHoverText: 'hover:text-amber-100',
    },
    green: {
        border: 'border-green-400',
        ring: 'ring-green-400',
        hover: 'hover:border-green-300/70',
        ringHover: 'group-hover:ring-green-300/70',
        bg: 'bg-slate-900/80',
        iconBg: 'bg-green-900/50',
        iconText: 'text-green-200/70',
        iconHoverBg: 'hover:bg-green-800/60',
        iconHoverText: 'hover:text-green-100',
    },
    brown: {
        border: 'border-yellow-700',
        ring: 'ring-yellow-700',
        hover: 'hover:border-yellow-600/70',
        ringHover: 'group-hover:ring-yellow-600/70',
        bg: 'bg-black/40',
        iconBg: 'bg-yellow-900/50',
        iconText: 'text-yellow-200/70',
        iconHoverBg: 'hover:bg-yellow-800/60',
        iconHoverText: 'hover:text-yellow-100',
    }
  };
  const currentTheme = colorThemes[selectionColor] || colorThemes.cyan;

  const hasAssignedColors = assignedColors.length > 0;
  
  const cardStyle: React.CSSProperties = {};
  if (hasAssignedColors) {
    cardStyle.boxShadow = assignedColors
        .map((color, i) => `inset 0 0 0 ${2 * (i + 1)}px ${color}`)
        .join(',');
  }

  let borderClass: string;
  if (noBorder) {
    borderClass = 'border border-transparent';
  } else {
    if (isSelected) {
      if (hasAssignedColors) {
        borderClass = 'border-2 border-transparent';
      } else {
        borderClass = `border-2 ${currentTheme.border}`;
      }
    } else {
      borderClass = `border border-gray-800 ${currentTheme.hover}`;
    }
  }
  
  const interactionClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer transition-colors';

  const showChildren = (isSelected || alwaysShowChildren) && React.Children.count(children) > 0;
  
  const handleIconButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onIconButtonClick?.();
  };

  const roundingClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
  };
  const imageRoundingClass = roundingClasses[imageRounding] || 'rounded-md';

  const CardWrapper: React.FC<{ children: React.ReactNode, className: string }> = ({ children, className }) => (
    <div
      className={`${className} relative`}
      style={cardStyle}
      onClick={() => !disabled && onSelect(id)}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
      {onIconButtonClick && iconButton && (
        <button 
          onClick={handleIconButtonClick}
          className={`absolute top-2 right-2 p-3 rounded-full ${currentTheme.iconBg} ${currentTheme.iconText} ${currentTheme.iconHoverBg} ${currentTheme.iconHoverText} transition-colors z-10`}
          aria-label="Card action"
          title="Card action"
          disabled={disabled}
        >
          {iconButton}
        </button>
      )}
    </div>
  );

  if (layout === 'horizontal-tall') {
    return (
      <CardWrapper className={`${currentTheme.bg} backdrop-blur-sm rounded-lg p-3 flex flex-row items-start gap-4 h-full text-left ${borderClass} ${interactionClass}`}>
        <img src={imageSrc} alt={title} className={`w-28 h-48 object-cover ${imageRoundingClass} flex-shrink-0`} />
        <div className="flex flex-col justify-start pt-2">
          <h4 className="font-bold font-cinzel text-white text-base">{title}</h4>
          {cost && cost.trim() && <p className={`text-xs font-semibold my-1 ${costColor}`}>{cost.toUpperCase()}</p>}
          <p className="text-sm text-gray-400 leading-snug mt-1 whitespace-pre-wrap">{description}</p>
          {showChildren && (
              <div className="mt-2 pt-2 border-t border-gray-700/50">
                  {children}
              </div>
          )}
        </div>
      </CardWrapper>
    );
  }
    
  if (layout === 'horizontal') {
    return (
      <CardWrapper className={`${currentTheme.bg} backdrop-blur-sm rounded-lg p-3 flex flex-row items-start gap-4 h-full text-left ${borderClass} ${interactionClass}`}>
        <img src={imageSrc} alt={title} className={`w-32 h-24 object-contain bg-black/20 flex-shrink-0 ${imageShape === 'circle' ? 'rounded-full' : imageRoundingClass}`} />
        <div className="flex flex-col justify-center">
          <h4 className="font-bold font-cinzel text-white">{title}</h4>
          {cost && cost.trim() && <p className={`text-xs font-semibold my-1 ${costColor}`}>{cost.toUpperCase()}</p>}
          <p className="text-sm text-gray-400 leading-snug mt-1 whitespace-pre-wrap">{description}</p>
           {showChildren && (
              <div className="mt-2 pt-2 border-t border-gray-700/50">
                  {children}
              </div>
          )}
        </div>
      </CardWrapper>
    );
  }

  // Vertical layout
  return (
    <CardWrapper className={`${currentTheme.bg} backdrop-blur-sm rounded-lg p-2 sm:p-4 flex flex-col h-full text-center ${borderClass} ${interactionClass} ${aspect === 'square' ? 'aspect-square' : ''}`}>
      {imageShape === 'circle' ? (
        <div className={`p-1 rounded-full mx-auto mb-2 sm:mb-4 transition-all`}>
          <img src={imageSrc} alt={title} className="w-36 h-36 object-cover rounded-full" />
        </div>
      ) : (
        <img src={imageSrc} alt={title} className={`w-full ${aspect === 'square' ? 'flex-grow min-h-0' : 'h-48'} object-contain ${imageRoundingClass} ${aspect === 'square' ? 'mb-2' : 'mb-4'}`} />
      )}
      
      <div className={`flex flex-col justify-center ${aspect === 'square' ? '' : 'flex-grow'}`}>
        <h4 className={`font-bold font-cinzel text-white ${description ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>{title}</h4>
        {cost && cost.trim() && <p className={`text-[10px] font-semibold my-1 ${costColor}`}>{cost.toUpperCase()}</p>}
        {description && <p className="text-xs text-gray-400 leading-snug mt-2 flex-grow text-left whitespace-pre-wrap">{description}</p>}
        {showChildren && (
            <div className="mt-2 pt-2 border-t border-gray-700/50">
                {children}
            </div>
        )}
      </div>
    </CardWrapper>
  );
};