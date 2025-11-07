import React, { useState, useEffect, useRef } from 'react';

const MuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const UnmuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2" />
  </svg>
);

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const BackgroundMusic: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const initPlayer = () => {
      if (document.getElementById('yt-player') && !playerRef.current) {
        playerRef.current = new window.YT.Player('yt-player', {
          height: '0',
          width: '0',
          videoId: 'GzIXfP0rkMk',
          playerVars: {
            autoplay: 0, // Control playback manually
            controls: 0,
            loop: 1,
            playlist: 'GzIXfP0rkMk', // Required for loop to work
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    const handlePlayMusic = () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
        playerRef.current.unMute();
        setIsMuted(false); // Sync state
      }
    };
    
    window.addEventListener('play-background-music', handlePlayMusic);

    return () => {
      window.removeEventListener('play-background-music', handlePlayMusic);
    };
  }, []); // Run only once on mount

  const toggleMute = () => {
    setIsMuted(currentMutedState => {
      const newMutedState = !currentMutedState;
      if (playerRef.current && typeof playerRef.current.mute === 'function') {
        if (newMutedState) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      }
      return newMutedState;
    });
  };

  return (
    <>
      <div id="yt-player" style={{ position: 'absolute', top: -9999, left: -9999 }}></div>
      <button
        onClick={toggleMute}
        className="fixed bottom-4 left-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <UnmuteIcon /> : <MuteIcon />}
      </button>
    </>
  );
};