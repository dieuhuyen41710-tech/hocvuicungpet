import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box as BoxGeometry, Cylinder, Sphere } from '@react-three/drei';

const ShapeRenderer = ({ shape }: { shape: string }) => {
  switch (shape) {
    case 'box':
      return <BoxGeometry args={[2, 2, 2]}>
        <meshStandardMaterial color="#3B82F6" wireframe />
      </BoxGeometry>;
    case 'cylinder':
      return <Cylinder args={[1, 1, 2, 32]}>
        <meshStandardMaterial color="#10B981" wireframe />
      </Cylinder>;
    case 'sphere':
      return <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial color="#F59E0B" wireframe />
      </Sphere>;
    default:
      return null;
  }
};

export default function ThreeDModelViewer({ shape }: { shape: string }) {
  return (
    <div className="w-full h-64 bg-gray-900 rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <ShapeRenderer shape={shape} />
          <OrbitControls enableZoom={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}
