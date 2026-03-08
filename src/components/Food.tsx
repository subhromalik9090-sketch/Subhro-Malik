import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Position } from '../hooks/useSnakeGame';

interface FoodProps {
  position: Position;
}

export function Food({ position }: FoodProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
      meshRef.current.rotation.x += delta * 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[position.x, 0.5, position.y]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial
        color="#ef4444"
        emissive="#ef4444"
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}
