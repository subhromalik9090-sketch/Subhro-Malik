import { Grid as DreiGrid } from '@react-three/drei';

interface GridProps {
  size: number;
}

export function Grid({ size }: GridProps) {
  return (
    <group position={[size / 2 - 0.5, 0, size / 2 - 0.5]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
      </mesh>
      <DreiGrid
        position={[0, 0.01, 0]}
        args={[size, size]}
        cellSize={1}
        cellThickness={1}
        cellColor="#334155"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#475569"
        fadeDistance={50}
        infiniteGrid
      />
    </group>
  );
}
