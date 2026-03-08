import { Play, Pause, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '../hooks/useSnakeGame';

interface UIOverlayProps {
  score: number;
  gameOver: boolean;
  isPaused: boolean;
  resetGame: () => void;
  togglePause: () => void;
  changeDirection: (dir: Direction) => void;
}

export function UIOverlay({ score, gameOver, isPaused, resetGame, togglePause, changeDirection }: UIOverlayProps) {
  const btnClass = "w-14 h-14 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg flex items-center justify-center active:bg-emerald-500 transition-colors text-white hover:bg-slate-700/80 touch-none select-none";

  const handleDirection = (e: React.PointerEvent, dir: Direction) => {
    e.preventDefault();
    // Release pointer capture so we can slide to other buttons
    if (e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }
    changeDirection(dir);
  };

  const handlePointerEnter = (e: React.PointerEvent, dir: Direction) => {
    e.preventDefault();
    // If the primary button is pressed (or touch is active), change direction
    if (e.buttons === 1) {
      changeDirection(dir);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white drop-shadow-md">3D Snake</h1>
          <p className="text-slate-300 mt-2">Use Arrow Keys or Buttons to move • Space to pause</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePause}
            className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg hover:bg-slate-700/80 transition-colors pointer-events-auto text-emerald-400"
            aria-label={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
          </button>
          <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg">
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Score</p>
            <p className="text-4xl font-mono font-bold text-emerald-400">{score}</p>
          </div>
        </div>
      </div>

      {/* D-Pad controls */}
      <div className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 grid grid-cols-3 gap-2 touch-none">
        <div />
        <button 
          className={btnClass} 
          onPointerDown={(e) => handleDirection(e, { x: 0, y: -1 })} 
          onPointerEnter={(e) => handlePointerEnter(e, { x: 0, y: -1 })}
          aria-label="Up"
        >
          <ArrowUp size={28} />
        </button>
        <div />
        
        <button 
          className={btnClass} 
          onPointerDown={(e) => handleDirection(e, { x: -1, y: 0 })} 
          onPointerEnter={(e) => handlePointerEnter(e, { x: -1, y: 0 })}
          aria-label="Left"
        >
          <ArrowLeft size={28} />
        </button>
        <button 
          className={btnClass} 
          onPointerDown={(e) => handleDirection(e, { x: 0, y: 1 })} 
          onPointerEnter={(e) => handlePointerEnter(e, { x: 0, y: 1 })}
          aria-label="Down"
        >
          <ArrowDown size={28} />
        </button>
        <button 
          className={btnClass} 
          onPointerDown={(e) => handleDirection(e, { x: 1, y: 0 })} 
          onPointerEnter={(e) => handlePointerEnter(e, { x: 1, y: 0 })}
          aria-label="Right"
        >
          <ArrowRight size={28} />
        </button>
      </div>

      {(gameOver || isPaused) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
          <div className="bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl text-center max-w-md w-full">
            <h2 className={`text-3xl font-bold mb-4 ${gameOver ? 'text-red-500' : 'text-amber-400'}`}>
              {gameOver ? 'Game Over' : 'Paused'}
            </h2>
            
            {gameOver && (
              <p className="text-slate-300 mb-8 text-lg">
                Final Score: <span className="font-bold text-white">{score}</span>
              </p>
            )}

            <button
              onClick={gameOver ? resetGame : togglePause}
              className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              {gameOver ? 'Play Again' : 'Resume'}
            </button>
            
            {isPaused && !gameOver && (
              <p className="mt-4 text-slate-500 text-sm">Press Space to resume</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
