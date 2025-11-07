import React from 'react';

interface SplashScreenProps {
  onStart: () => void;
  isExiting: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, isExiting }) => {
  const splashScreenClasses = `
    fixed top-0 left-0 w-full h-full bg-[#0a101f] z-[100]
    flex flex-col justify-center items-center cursor-pointer
    transition-all duration-1000 ease-in-out
    ${isExiting ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}
  `;

  return (
    <div className={splashScreenClasses} onClick={onStart}>
      <div className="flex flex-col items-center animate-pulse">
        <img 
          src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/symbol_transparent.png" 
          alt="Seinaru Magecraft Girls Symbol" 
          className="max-w-md w-1/2 no-glow mb-8 px-4"
        />
        <h2 className="font-cinzel text-2xl text-white tracking-[0.3em]">
          CLICK TO BEGIN
        </h2>
        <p className="text-gray-500 text-xs mt-4 opacity-75">
          Original CYOA by nxtub, interactive by saviapple
        </p>
      </div>
    </div>
  );
};
