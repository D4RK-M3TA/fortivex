import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/motion';

const MAX_DELTA = 0.2; // cap delta so tab-back doesn't cause a jump

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    
    return [pos, vel];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const dt = Math.min(delta, MAX_DELTA);
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3] * (dt * 60);
      positions[i * 3 + 1] += velocities[i * 3 + 1] * (dt * 60);
      positions[i * 3 + 2] += velocities[i * 3 + 2] * (dt * 60);

      if (positions[i * 3] > 10) positions[i * 3] = -10;
      if (positions[i * 3] < -10) positions[i * 3] = 10;
      if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -10;
      if (positions[i * 3 + 1] < -10) positions[i * 3 + 1] = 10;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4F6DFF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const linePositions = useMemo(() => {
    const positions: number[] = [];
    const nodeCount = 15;
    const nodes: THREE.Vector3[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      ));
    }
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 5) {
          positions.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }
    
    return new Float32Array(positions);
  }, []);

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    if (!linesRef.current) return;
    timeRef.current += Math.min(delta, MAX_DELTA);
    linesRef.current.rotation.y = timeRef.current * 0.02;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4F6DFF" transparent opacity={0.15} />
    </lineSegments>
  );
}

function FloatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += Math.min(delta, MAX_DELTA);
    const t = timeRef.current;
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[5, 0, -3]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial 
        color="#4F6DFF" 
        transparent 
        opacity={0.1} 
        wireframe 
      />
    </mesh>
  );
}

export default function ThreeBackground() {
  const [active, setActive] = useState(!prefersReducedMotion());

  // Ambient background — no reason to keep rendering every frame while the
  // tab is backgrounded, and it should stay off entirely for reduced motion.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const onVisibility = () => setActive(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        frameloop={active ? 'always' : 'never'}
      >
        <ambientLight intensity={0.5} />
        <FloatingParticles />
        <ConnectionLines />
        <FloatingCube />
      </Canvas>
    </div>
  );
}
