import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE_SPEED = 150; // ms per frame

// Using reliable public domain/test audio URLs for the dummy AI music
export const PLAYLIST: Track[] = [
  {
    id: 'track-1',
    title: 'Neon Genesis (AI Gen)',
    artist: 'SynthMind Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 'track-2',
    title: 'Cybernetic Dreams',
    artist: 'Neural Network Beta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 'track-3',
    title: 'Digital Horizon',
    artist: 'Algorithm Omega',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];
