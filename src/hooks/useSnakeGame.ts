import { useState, useEffect, useCallback, useRef } from 'react';

export type Position = { x: number; y: number };
export type Direction = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = { x: 1, y: 0 };
const GAME_SPEED = 150; // ms

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs for mutable state in the game loop
  const snakeRef = useRef(INITIAL_SNAKE);
  const foodRef = useRef({ x: 15, y: 10 });
  const directionRef = useRef(INITIAL_DIRECTION); // Current moving direction
  const directionQueueRef = useRef<Direction[]>([]); // Queue of pending direction changes
  const gameOverRef = useRef(false);
  const isPausedRef = useRef(false);

  // Sync refs with state for the loop
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    let isOnSnake;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    } while (isOnSnake);
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const newSnake = INITIAL_SNAKE;
    const newDir = INITIAL_DIRECTION;
    const newFood = generateFood(newSnake);
    
    setSnake(newSnake);
    snakeRef.current = newSnake;
    
    setFood(newFood);
    foodRef.current = newFood;
    
    setDirection(newDir);
    directionRef.current = newDir;
    directionQueueRef.current = [];
    
    setScore(0);
    setGameOver(false);
    gameOverRef.current = false;
    
    setIsPaused(false);
    isPausedRef.current = false;
  }, [generateFood]);

  const changeDirection = useCallback((newDir: Direction) => {
    // Determine the direction we are comparing against
    // If queue has items, compare against the last queued item
    // Otherwise, compare against the current moving direction
    const lastDir = directionQueueRef.current.length > 0 
      ? directionQueueRef.current[directionQueueRef.current.length - 1] 
      : directionRef.current;

    // Prevent reversing direction
    if (newDir.x === -lastDir.x && newDir.y === -lastDir.y) {
      return;
    }
    
    // Prevent duplicates (optional, but good for sanity)
    if (newDir.x === lastDir.x && newDir.y === lastDir.y) {
      return;
    }

    // Add to queue
    if (directionQueueRef.current.length < 3) {
      directionQueueRef.current.push(newDir);
    }
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOverRef.current || isPausedRef.current) return;

    // Process direction queue
    if (directionQueueRef.current.length > 0) {
      directionRef.current = directionQueueRef.current.shift()!;
      setDirection(directionRef.current); // Sync state for UI if needed
    }

    const currentSnake = snakeRef.current;
    const head = currentSnake[0];
    const currentDir = directionRef.current;

    const newHead = {
      x: head.x + currentDir.x,
      y: head.y + currentDir.y,
    };

    // Check wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      setGameOver(true);
      gameOverRef.current = true;
      return;
    }

    // Check self collision
    // Note: We don't check against the last segment (tail) because it will move away unless we grow.
    // But if we grow, the tail stays.
    // Simplification: Check against all segments. If it hits tail, it's a collision only if we grow.
    // Standard snake: hitting tail is fine if tail moves.
    // Let's check against all segments except the last one for now.
    // Actually, if newHead equals any existing segment, it's a collision.
    // Exception: If newHead is the tail, and we are NOT growing, then it's safe because tail moves.
    // But checking against all is safer for now.
    if (
      currentSnake.some(
        (segment, index) => 
          index !== currentSnake.length - 1 && 
          segment.x === newHead.x && 
          segment.y === newHead.y
      )
    ) {
      setGameOver(true);
      gameOverRef.current = true;
      return;
    }

    const newSnake = [newHead, ...currentSnake];
    const currentFood = foodRef.current;

    // Check food collision
    if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
      // Grow
      setScore((s) => s + 1);
      const nextFood = generateFood(newSnake);
      setFood(nextFood);
      foodRef.current = nextFood;
    } else {
      // Move (remove tail)
      newSnake.pop();
    }

    setSnake(newSnake);
    snakeRef.current = newSnake;
  }, [generateFood]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          changeDirection({ x: 0, y: -1 }); // In 2D grid, usually y-1 is up if 0,0 is top-left. But in 3D, let's say z is y.
          // Let's align with 3D coordinates.
          // x is left/right. z is up/down (forward/backward).
          // In Three.js, x is right, z is forward (towards camera).
          // Let's say grid is x, z.
          // forward (up arrow) -> z - 1
          // backward (down arrow) -> z + 1
          // left -> x - 1
          // right -> x + 1
          break;
        case 'ArrowDown':
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          changeDirection({ x: 1, y: 0 });
          break;
        case ' ':
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, togglePause]);

  return {
    snake,
    food,
    score,
    gameOver,
    isPaused,
    resetGame,
    togglePause,
    changeDirection,
    gridSize: GRID_SIZE,
  };
};
