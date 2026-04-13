import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Grid } from '@react-three/drei';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';

function Building({ position, args, color }: any) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.5} 
        roughness={0.2} 
        metalness={0.8} 
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
}

function City() {
  const group = useRef<THREE.Group>(null!);
  
  const buildings = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 60; i++) {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        const h = 1 + Math.random() * 8;
        const w = 0.5 + Math.random() * 1.5;
        const color = new THREE.Color().setHSL(Math.random() * 0.1 + 0.55, 0.8, 0.5);
        temp.push({ position: [x, h / 2, z], args: [w, h, w], color });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.position.z = (state.clock.getElapsedTime() * 0.5) % 10;
    }
  });

  return (
    <group ref={group}>
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}
    </group>
  );
}

const Background3D = () => {
  const location = useLocation();
  const isPortalPage = location.pathname === '/login' || location.pathname === '/register';

  if (isPortalPage) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas shadows gl={{ antialias: false, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={50} />
        <fog attach="fog" args={['#0F172A', 10, 40]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#38bdf8" />
        <pointLight position={[-10, 10, -10]} intensity={1} color="#818cf8" />

        <City />
        
        <Grid 
          infiniteGrid 
          fadeDistance={40} 
          fadeStrength={5} 
          sectionSize={1.5} 
          sectionThickness={1} 
          sectionColor="#38bdf8" 
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#1e293b"
          position={[0, 0, 0]}
        />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/20 to-[#0F172A]" />
    </div>
  );
};

export default Background3D;
