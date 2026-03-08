import { Canvas } from '@react-three/fiber';
import { useSnakeGame } from './hooks/useSnakeGame';
import { GameScene } from './components/GameScene';
import { UIOverlay } from './components/UIOverlay';

export default function App() {
  const { snake, food, score, gameOver, isPaused, resetGame, togglePause, changeDirection, gridSize } = useSnakeGame();

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={['#0f172a']} />
        <GameScene snake={snake} food={food} gridSize={gridSize} />
      </Canvas>
      
      <UIOverlay 
        score={score} 
        gameOver={gameOver} 
        isPaused={isPaused} 
        resetGame={resetGame}
        togglePause={togglePause}
        changeDirection={changeDirection}
      />
    </div>
  );
}
