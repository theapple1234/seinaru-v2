import React from 'react';

interface SplashScreenProps {
  onStart: () => void;
  isExiting: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, isExiting }) => {
  // 'isExiting' prop을 사용하여 CSS 애니메이션을 트리거하는 'animate' 클래스를 추가합니다.
  const splashScreenClasses = `
    fixed top-0 left-0 w-full h-full bg-[#0a101f] z-[100]
    flex flex-col justify-center items-center cursor-pointer
    ${isExiting ? 'animate' : ''}
  `;

  return (
    <div className={splashScreenClasses} onClick={onStart}>
      {/* 파티클 컨테이너가 사용자의 요청에 따라 제거되었습니다. */}

      <div className={`flex flex-col items-center ${!isExiting ? 'animate-pulse' : ''}`}>
        <img 
          id="splash-image" // 애니메이션 타겟팅을 위한 ID
          src="https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/symbol_transparent.png" 
          alt="Seinaru Magecraft Girls Symbol" 
          className="max-w-md w-1/2 no-glow mb-8 px-4"
        />
        <h2 id="splash-text" className="font-cinzel text-2xl text-white tracking-[0.3em]">
          CLICK TO BEGIN
        </h2>
        <p id="splash-subtext" className="text-gray-500 text-xs mt-4 opacity-75">
          Original CYOA by nxtub, interactive by saviapple
        </p>
      </div>
    </div>
  );
};