import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingSphereProps {
  position: [number, number, number];
  color: string;
  size: number;
  speed: number;
}

/**
 * Small floating colored spheres - more dynamic movement
 */
const FloatingSphere = ({ position, color, size, speed }: FloatingSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useRef(position);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime * speed;
    // More dynamic movement in all directions
    meshRef.current.position.x = initialPosition.current[0] + Math.cos(time * 0.7) * 0.5;
    meshRef.current.position.y = initialPosition.current[1] + Math.sin(time) * 0.6;
    meshRef.current.position.z = initialPosition.current[2] + Math.sin(time * 0.5) * 0.4;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
};

/**
 * Small wireframe globe in center - no glow
 */
const WireframeGlobe = () => {
  const globeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={globeRef} position={[0, 0, 0]}>
      {/* Main wireframe sphere */}
      <mesh>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshBasicMaterial
          color="#ccff00"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

/**
 * Connection lines - only connect nearby spheres
 */
const ConnectionLines = ({ spheres }: { spheres: Array<{ position: [number, number, number]; color: string }> }) => {
  const linesRef = useRef<THREE.LineSegments>(null);
  const sphereRefs = useRef<Array<THREE.Vector3>>(
    spheres.map(s => new THREE.Vector3(...s.position))
  );

  useFrame((state) => {
    if (!linesRef.current) return;
    
    const positions: number[] = [];
    const time = state.clock.elapsedTime;
    
    // Update sphere positions based on animation
    spheres.forEach((sphere, i) => {
      const speed = 0.5 + (i * 0.1);
      sphereRefs.current[i].x = sphere.position[0] + Math.cos(time * speed * 0.7) * 0.5;
      sphereRefs.current[i].y = sphere.position[1] + Math.sin(time * speed) * 0.6;
      sphereRefs.current[i].z = sphere.position[2] + Math.sin(time * speed * 0.5) * 0.4;
    });
    
    // Only connect nearby spheres (within distance threshold)
    for (let i = 0; i < sphereRefs.current.length; i++) {
      for (let j = i + 1; j < sphereRefs.current.length; j++) {
        const distance = sphereRefs.current[i].distanceTo(sphereRefs.current[j]);
        
        // Only draw line if spheres are close enough
        if (distance < 10) {
          positions.push(
            sphereRefs.current[i].x,
            sphereRefs.current[i].y,
            sphereRefs.current[i].z,
            sphereRefs.current[j].x,
            sphereRefs.current[j].y,
            sphereRefs.current[j].z
          );
        }
      }
    }

    const geometry = linesRef.current.geometry;
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#555555" transparent opacity={0.25} />
    </lineSegments>
  );
};

/**
 * Main scene
 */
const Scene = () => {
  const { camera } = useThree();

  // Define sphere positions and colors matching the reference
  const spheres = useMemo(() => [
    // Top left - lime green
    { position: [-8, 4, -2] as [number, number, number], color: '#ccff00', size: 0.4, speed: 0.5 },
    // Top right - cyan
    { position: [7, 3, -1] as [number, number, number], color: '#4ecdc4', size: 0.35, speed: 0.6 },
    // Top right - blue
    { position: [8, 5, 1] as [number, number, number], color: '#2952ff', size: 0.45, speed: 0.4 },
    // Top right - red/pink
    { position: [9, 2, 0] as [number, number, number], color: '#ff6b6b', size: 0.3, speed: 0.7 },
    // Bottom left - lime
    { position: [-7, -3, 1] as [number, number, number], color: '#ccff00', size: 0.5, speed: 0.45 },
    // Bottom left - lime (smaller)
    { position: [-9, -4, -1] as [number, number, number], color: '#ccff00', size: 0.35, speed: 0.55 },
    // Bottom right - cyan
    { position: [8, -2, 2] as [number, number, number], color: '#4ecdc4', size: 0.6, speed: 0.5 },
    // Bottom right - red
    { position: [9, -4, -1] as [number, number, number], color: '#ff6b6b', size: 0.4, speed: 0.6 },
    // Bottom center - blue
    { position: [2, -5, 0] as [number, number, number], color: '#2952ff', size: 0.5, speed: 0.5 },
    // Top center - purple
    { position: [0, 5, -2] as [number, number, number], color: '#a855f7', size: 0.35, speed: 0.65 },
    // Left side - lime (small)
    { position: [-4, 1, 2] as [number, number, number], color: '#ccff00', size: 0.25, speed: 0.7 },
    // Center left - red
    { position: [-2, -1, 1] as [number, number, number], color: '#ff6b6b', size: 0.3, speed: 0.6 },
    // Center - large lime (near text)
    { position: [-3, 0, 3] as [number, number, number], color: '#ccff00', size: 0.7, speed: 0.4 },
    // Center right - red
    { position: [1, -2, 2] as [number, number, number], color: '#ff6b6b', size: 0.35, speed: 0.55 },
  ], []);

  // Subtle camera movement
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.1) * 0.5;
    camera.position.y = Math.cos(time * 0.15) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#2952ff" />
      
      {/* Small wireframe globe in center */}
      <WireframeGlobe />
      
      {/* Floating colored spheres */}
      {spheres.map((sphere, index) => (
        <FloatingSphere
          key={index}
          position={sphere.position}
          color={sphere.color}
          size={sphere.size}
          speed={sphere.speed}
        />
      ))}
      
      {/* Connection lines */}
      <ConnectionLines spheres={spheres} />
    </>
  );
};

/**
 * Main component
 */
interface NeuralNetworkEnhancedProps {
  mousePosition: { x: number; y: number };
}

const NeuralNetworkEnhanced = ({ mousePosition }: NeuralNetworkEnhancedProps) => {
  return (
    <div className="absolute inset-0 w-full h-full opacity-60">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default NeuralNetworkEnhanced;
