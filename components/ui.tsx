import React from 'react';

// FIX: Changed component definitions to use interfaces and React.FC for more robust prop typing, resolving widespread 'children' prop errors.
interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ children, className = '' }) => (
  <h2 className={`text-3xl font-cinzel text-center tracking-[0.2em] my-12 text-white uppercase ${className}`}>
    {children}
  </h2>
);

interface SectionSubHeaderProps {
  children: React.ReactNode;
}

export const SectionSubHeader: React.FC<SectionSubHeaderProps> = ({ children }) => (
   <p className="text-center text-gray-400 italic max-w-3xl mx-auto text-sm my-8">
    {children}
  </p>
);

interface BlessingIntroProps {
  title: string;
  imageSrc: string;
  description: string;
  reverse?: boolean;
}

export const BlessingIntro: React.FC<BlessingIntroProps> = ({ title, imageSrc, description, reverse = false }) => (
  <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-center gap-12 my-8 max-w-7xl mx-auto p-6 bg-black/20 border border-gray-800 rounded-lg`}>
    <div className="flex-shrink-0 w-full md:w-1/3">
        <img src={imageSrc} alt={title} className="rounded-lg shadow-lg w-full" />
    </div>
    <div className="w-full md:w-2/3 text-gray-300 text-sm space-y-4 whitespace-pre-wrap">
        <h3 className="font-cinzel text-3xl text-center text-white mb-4">{title}</h3>
        <p>{description}</p>
    </div>
  </div>
);

export const WeaponIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 .5a1 1 0 01.993.883L11 1.5v12.25l4.636 1.545a1 1 0 01.815 1.14l-.06.115a1 1 0 01-1.14.815l-.115-.06L11 16.25v2.25a1 1 0 01-1.993.117L9 18.5v-2.25l-4.272 1.424a1 1 0 01-1.14-.815l-.06-.115a1 1 0 01.815-1.14l.115-.06L8 13.75V1.5A1 1 0 0110 .5zM10 4.5a1 1 0 00-1 1v2a1 1 0 002 0v-2a1 1 0 00-1-1z" />
    </svg>
);