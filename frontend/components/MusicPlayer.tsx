import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { Track } from '../types';
import { PLAYLIST } from '../constants';

interface MusicPlayerProps {
  onTrackChange?: (track: Track) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onTrackChange }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (onTrackChange) {
      onTrackChange(currentTrack);
    }
  }, [currentTrackIndex, onTrackChange, currentTrack]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md bg-neon-dark/80 backdrop-blur-md border-2 border-neon-purple rounded-xl p-6 shadow-neon-purple">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      {/* Now Playing Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full bg-neon-darker border-2 border-neon-cyan flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} shadow-neon-cyan`}>
            <Music className="text-neon-cyan w-6 h-6" />
          </div>
          <div>
            <h3 className="text-neon-cyan font-bold text-lg tracking-wider truncate w-48">{currentTrack.title}</h3>
            <p className="text-neon-pink text-sm opacity-80">{currentTrack.artist}</p>
          </div>
        </div>
        <button onClick={toggleMute} className="text-gray-400 hover:text-neon-cyan transition-colors">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="h-2 w-full bg-gray-800 rounded-full cursor-pointer overflow-hidden border border-gray-700"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-neon-purple to-neon-pink shadow-neon-pink transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        <button onClick={handlePrev} className="text-neon-cyan hover:text-white hover:shadow-neon-cyan transition-all rounded-full p-2">
          <SkipBack size={28} />
        </button>
        <button 
          onClick={togglePlay} 
          className="bg-neon-darker border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white rounded-full p-4 shadow-neon-pink transition-all transform hover:scale-105"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={handleNext} className="text-neon-cyan hover:text-white hover:shadow-neon-cyan transition-all rounded-full p-2">
          <SkipForward size={28} />
        </button>
      </div>

      {/* Playlist */}
      <div className="border-t border-neon-purple/30 pt-4">
        <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-mono">AI Generated Playlist</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
          {PLAYLIST.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                index === currentTrackIndex 
                  ? 'bg-neon-purple/20 border-l-2 border-neon-purple text-white' 
                  : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <span className="text-xs font-mono opacity-50 w-4">{index + 1}</span>
                <span className="text-sm truncate">{track.title}</span>
              </div>
              <span className="text-xs opacity-50">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
