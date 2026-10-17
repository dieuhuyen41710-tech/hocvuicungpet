import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box as BoxGeometry, Cylinder, Sphere, Cone } from '@react-three/drei';

const ShapeRenderer = ({ shape, unfolded }: { shape: string, unfolded: boolean }) => {
  switch (shape) {
    case 'box':
    case 'cube':
      return <BoxGeometry args={unfolded ? [3, 0.2, 3] : [2, 2, 2]} scale={unfolded ? [1, 0.5, 1] : [1, 1, 1]}>
        <meshStandardMaterial color="#3B82F6" wireframe={!unfolded} />
      </BoxGeometry>;
    case 'prism_tri':
      return <Cylinder args={unfolded ? [2, 2, 0.2, 3] : [1, 1, 2, 3]}>
        <meshStandardMaterial color="#10B981" wireframe={!unfolded} />
      </Cylinder>;
    case 'prism_quad':
      return <BoxGeometry args={unfolded ? [3, 0.2, 3] : [2, 2, 2]} scale={unfolded ? [1, 0.5, 1] : [1, 1, 1]}>
        <meshStandardMaterial color="#10B981" wireframe={!unfolded} />
      </BoxGeometry>;
    case 'pyramid_tri':
      return <Cone args={[1.5, 2, 3]}>
        <meshStandardMaterial color="#F59E0B" wireframe />
      </Cone>;
    case 'pyramid_quad':
      return <Cone args={[1.5, 2, 4]}>
        <meshStandardMaterial color="#F59E0B" wireframe />
      </Cone>;
    case 'cylinder':
      return <Cylinder args={unfolded ? [2, 2, 0.2, 32] : [1, 1, 2, 32]}>
        <meshStandardMaterial color="#8B5CF6" wireframe={!unfolded} />
      </Cylinder>;
    case 'cone':
      return <Cone args={[1.5, 2, 32]}>
        <meshStandardMaterial color="#EC4899" wireframe />
      </Cone>;
    case 'sphere':
      return <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial color="#EF4444" wireframe />
      </Sphere>;
    default:
      return null;
  }
};

export default function ThreeDModelViewer({ shape }: { shape: string }) {
  const [unfolded, setUnfolded] = useState(false);

  return (
    <div className="w-full h-64 bg-blue-50 rounded-2xl overflow-hidden border-2 border-blue-100 relative">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <ShapeRenderer shape={shape} unfolded={unfolded} />
          <OrbitControls enableZoom={true} />
        </Suspense>
      </Canvas>
      {['box', 'cube', 'prism_tri', 'prism_quad', 'cylinder'].includes(shape) && (
        <button
          onClick={() => setUnfolded(!unfolded)}
          className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg text-xs font-bold text-blue-600 border border-blue-200 shadow-sm hover:bg-blue-50"
        >
          {unfolded ? 'Gập lại' : 'Mở hình'}
        </button>
      )}
    </div>
  );
}
