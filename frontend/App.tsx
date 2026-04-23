import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Track } from './types';

const App: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  return (
    <div className="min-h-screen bg-neon-darker flex flex-col font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(5,217,232,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(5,217,232,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom opacity-30"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-pink/20 blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-center items-center border-b border-neon-purple/30 bg-neon-dark/50 backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink drop-shadow-[0_0_10px_rgba(179,0,255,0.5)]">
          SYNTH<span className="text-white font-light">SNAKE</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Left/Top: Game Area */}
        <div className="flex-1 w-full flex justify-center items-center order-2 lg:order-1">
          <SnakeGame />
        </div>

        {/* Right/Bottom: Music Player Area */}
        <div className="w-full lg:w-96 flex flex-col items-center justify-center order-1 lg:order-2 shrink-0">
          <div className="mb-4 text-center lg:text-left w-full">
            <h2 className="text-neon-cyan font-mono text-sm uppercase tracking-widest mb-1">Audio System</h2>
            <div className="h-1 w-16 bg-neon-pink shadow-neon-pink mx-auto lg:mx-0 rounded-full"></div>
          </div>
          <MusicPlayer onTrackChange={setCurrentTrack} />
          
          {/* Visualizer Mockup */}
          <div className="w-full max-w-md mt-8 h-24 flex items-end justify-between gap-1 px-4 opacity-50">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-full bg-gradient-to-t from-neon-purple to-neon-cyan rounded-t-sm transition-all duration-150"
                style={{ 
                  height: currentTrack ? `${Math.random() * 100}%` : '10%',
                  animation: currentTrack ? `pulse ${0.5 + Math.random()}s infinite alternate` : 'none'
                }}
              />
            ))}
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-xs text-gray-500 font-mono border-t border-neon-cyan/20 bg-neon-dark/80">
        SYSTEM v1.0.4 // NEON PROTOCOL ACTIVE
      </footer>
    </div>
  );
};

export default App;
