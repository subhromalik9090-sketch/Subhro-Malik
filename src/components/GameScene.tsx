import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Snake } from './Snake';
import { Food } from './Food';
import { Grid } from './Grid';
import { Position } from '../hooks/useSnakeGame';

interface GameSceneProps {
  snake: Position[];
  food: Position;
  gridSize: number;
}

export function GameScene({ snake, food, gridSize }: GameSceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[gridSize / 2, gridSize, gridSize * 1.5]} fov={50} />
      <OrbitControls 
        target={[gridSize / 2, 0, gridSize / 2]} 
        enablePan={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.5}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>

      <Snake snake={snake} />
      <Food position={food} />
      <Grid size={gridSize} />
      
      <Environment preset="city" />
    </>
  );
}
