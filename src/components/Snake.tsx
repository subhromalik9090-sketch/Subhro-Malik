import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Position } from '../hooks/useSnakeGame';

interface SnakeProps {
  snake: Position[];
}

export function Snake({ snake }: SnakeProps) {
  return (
    <group>
      {snake.map((segment, index) => (
        <mesh
          key={index}
          position={[segment.x, 0.5, segment.y]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial
            color={index === 0 ? '#4ade80' : '#22c55e'} // Head is lighter green
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
