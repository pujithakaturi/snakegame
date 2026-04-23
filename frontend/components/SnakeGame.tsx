import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE_SPEED } from '../constants';
import { useInterval } from '../hooks/useInterval';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const getInitialSnake = (): Point[] => [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const getRandomFoodPosition = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(getInitialSnake());
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SNAKE_SPEED);

  // Use a ref for direction to avoid stale state in the interval without resetting it
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction); // To prevent rapid double-turns causing self-collision

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = useCallback(() => {
    setSnake(getInitialSnake());
    setDirection(Direction.UP);
    directionRef.current = Direction.UP;
    nextDirectionRef.current = Direction.UP;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setSpeed(INITIAL_SNAKE_SPEED);
    setFood(getRandomFoodPosition(getInitialSnake()));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && hasStarted) {
      setIsPaused(prev => !prev);
      return;
    }

    if (gameOver || isPaused) return;

    const currentDir = nextDirectionRef.current;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== Direction.DOWN) nextDirectionRef.current = Direction.UP;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== Direction.UP) nextDirectionRef.current = Direction.DOWN;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== Direction.RIGHT) nextDirectionRef.current = Direction.LEFT;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== Direction.LEFT) nextDirectionRef.current = Direction.RIGHT;
        break;
    }
  }, [gameOver, isPaused, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = nextDirectionRef.current;
      setDirection(currentDir); // Sync state with ref for rendering if needed

      const newHead = { ...head };

      switch (currentDir) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(getRandomFoodPosition(newSnake));
        // Slightly increase speed
        setSpeed(prev => Math.max(prev - 2, 50));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [gameOver, isPaused, food, score, highScore]);

  useInterval(gameLoop, isPaused || gameOver ? null : speed);

  // Generate grid cells
  const gridCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const isSnakeHead = snake[0].x === col && snake[0].y === row;
      const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === col && segment.y === row);
      const isFood = food.x === col && food.y === row;

      let cellClass = "w-full h-full border border-neon-darker/30 rounded-sm transition-all duration-75 ";
      
      if (isSnakeHead) {
        cellClass += "bg-neon-cyan shadow-neon-cyan z-10 relative";
      } else if (isSnakeBody) {
        cellClass += "bg-neon-cyan/80 shadow-[0_0_5px_#05d9e8] opacity-90";
      } else if (isFood) {
        cellClass += "bg-neon-pink shadow-neon-pink animate-pulse rounded-full scale-75";
      } else {
        cellClass += "bg-transparent";
      }

      gridCells.push(
        <div key={`${row}-${col}`} className="aspect-square p-[1px]">
          <div className={cellClass} />
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {/* Score Board */}
      <div className="flex justify-between w-full mb-6 px-4 py-3 bg-neon-dark/80 backdrop-blur-md border-2 border-neon-cyan rounded-xl shadow-neon-cyan">
        <div className="flex flex-col">
          <span className="text-neon-cyan text-xs uppercase tracking-widest font-mono">Score</span>
          <span className="text-3xl font-bold text-white font-mono">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-neon-pink text-xs uppercase tracking-widest font-mono flex items-center gap-1">
            <Trophy size={12} /> High Score
          </span>
          <span className="text-3xl font-bold text-white font-mono">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full aspect-square bg-neon-darker border-4 border-neon-purple rounded-xl shadow-neon-purple overflow-hidden p-2">
        
        {/* Grid */}
        <div 
          className="w-full h-full grid"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {gridCells}
        </div>

        {/* Overlays */}
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            {!hasStarted ? (
              <div className="text-center">
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mb-6 drop-shadow-lg">NEON SNAKE</h2>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 mx-auto bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black px-6 py-3 rounded-full font-bold tracking-wider transition-all shadow-neon-cyan"
                >
                  <Play size={20} fill="currentColor" /> START GAME
                </button>
                <p className="mt-6 text-gray-400 text-sm font-mono">Use Arrow Keys or WASD to move</p>
              </div>
            ) : gameOver ? (
              <div className="text-center">
                <h2 className="text-5xl font-bold text-neon-pink mb-2 shadow-neon-pink drop-shadow-[0_0_10px_rgba(255,42,109,0.8)]">SYSTEM FAILURE</h2>
                <p className="text-xl text-white mb-8 font-mono">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 mx-auto bg-neon-pink/20 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white px-6 py-3 rounded-full font-bold tracking-wider transition-all shadow-neon-pink"
                >
                  <RotateCcw size={20} /> REBOOT
                </button>
              </div>
            ) : isPaused ? (
              <div className="text-center">
                <h2 className="text-4xl font-bold text-neon-cyan mb-6 tracking-widest">PAUSED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 mx-auto bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black px-6 py-3 rounded-full font-bold tracking-wider transition-all shadow-neon-cyan"
                >
                  <Play size={20} fill="currentColor" /> RESUME
                </button>
                <p className="mt-4 text-gray-400 text-sm font-mono">Press SPACE to pause/resume</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
