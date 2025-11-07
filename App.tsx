import React, { useState, useEffect } from 'react';
import { CharacterProvider, useCharacterContext } from './context/CharacterContext';
import { StatsFooter } from './components/StatsFooter';
import { PageOne } from './components/PageOne';
import { PageTwo } from './components/PageTwo';
import { PageThree } from './components/PageThree';
import { PageFour } from './components/PageFour';
import { PageFive } from './components/PageFive';
import { PageSix } from './components/PageSix';
import { SectionHeader } from './components/ui';
import { SplashScreen } from './components/SplashScreen';
import { BackgroundMusic } from './components/BackgroundMusic';
import { ReferencePage } from './components/ReferencePage';

const PAGE_TITLES = ['YOUR BIRTH', 'YOUR SCHOOLING', 'SIGILS & BLESSINGS', 'DESIGN YOUR MAGIC', 'YOUR CAREER', 'YOUR RETIREMENT'];
const PAGE_BACKGROUNDS = ['bg-[#0a101f]', 'bg-[#2a201c]', 'bg-[#100c14]', 'bg-[#1a1412]', 'bg-[#09110e]', 'bg-[#0c0c0e]'];
const PAGE_HEADERS = ["https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/main1.png", "https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg2/main1.png", "https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg3/main1.png", "https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg5/main7.png", "https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg6/main1.png", "https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg6/main3.png"];
const BUTTON_THEMES = [
  'bg-cyan-900/60 border-cyan-700 hover:bg-cyan-800/80', // Page 1
  'bg-amber-900/60 border-amber-700 hover:bg-amber-800/80', // Page 2
  'bg-purple-900/60 border-purple-700 hover:bg-purple-800/80', // Page 3
  'bg-orange-900/60 border-orange-700 hover:bg-orange-800/80', // Page 4
  'bg-green-900/60 border-green-700 hover:bg-green-800/80', // Page 5
  'bg-slate-800/60 border-slate-600 hover:bg-slate-700/80' // Page 6
];

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { isReferencePageOpen, openReferencePage, closeReferencePage } = useCharacterContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const PageNavigation = () => (
    <div className="flex justify-between items-center mt-16 max-w-7xl mx-auto">
      {currentPage > 1 ? (
        <button 
          onClick={() => setCurrentPage(p => p - 1)}
          className="px-6 py-2 font-cinzel text-lg bg-gray-800/50 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
        >
          ← BACK TO {PAGE_TITLES[currentPage - 2]}
        </button>
      ) : <div />}
      
      <div className="flex-grow" />

      {currentPage < 6 ? (
        <button 
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-6 py-2 font-cinzel text-lg bg-gray-800/50 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
        >
          GO TO {PAGE_TITLES[currentPage]} →
        </button>
      ) : <div />}
    </div>
  );

  return (
    <>
      {isReferencePageOpen && <ReferencePage onClose={closeReferencePage} />}
      <div className={`min-h-screen text-white font-sans transition-colors duration-500 ${PAGE_BACKGROUNDS[currentPage - 1]}`}>
        <div className="container mx-auto px-4 py-8 relative pb-20">
          <header className="mb-12">
            <img src={PAGE_HEADERS[currentPage - 1]} alt={PAGE_TITLES[currentPage - 1]} className="mx-auto w-full max-w-4xl no-glow" />
          </header>

          {currentPage === 1 && <PageOne />}
          {currentPage === 2 && <PageTwo />}
          {currentPage === 3 && <PageThree />}
          {currentPage === 4 && <PageFour />}
          {currentPage === 5 && <PageFive />}
          {currentPage === 6 && <PageSix />}
          
          {currentPage > 6 && (
            <div className="text-center py-20">
              <SectionHeader>{PAGE_TITLES[currentPage - 1]}</SectionHeader>
              <p className="text-gray-400 mt-4">This page is under construction.</p>
            </div>
          )}
          
          <PageNavigation />
        </div>
        <StatsFooter />
      </div>
      <button
        onClick={openReferencePage}
        className={`fixed bottom-12 right-8 z-[51] px-6 py-3 font-cinzel text-lg rounded-md transition-colors backdrop-blur-sm shadow-lg ${BUTTON_THEMES[currentPage - 1]}`}
      >
          The Reference Page
      </button>
    </>
  );
};

const MainApp: React.FC = () => {
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [isExitingSplash, setIsExitingSplash] = useState(false);

  const handleStartApp = () => {
    setIsExitingSplash(true);
    window.dispatchEvent(new Event('play-background-music'));
    setTimeout(() => {
      setIsAppStarted(true);
    }, 1000); // Animation duration
  };

  return (
    <>
      {!isAppStarted && <SplashScreen onStart={handleStartApp} isExiting={isExitingSplash} />}
      <BackgroundMusic />
      <div className={`transition-opacity duration-1000 ${isAppStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {isAppStarted && <AppContent />}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <CharacterProvider>
      <MainApp />
    </CharacterProvider>
  );
};

export default App;
