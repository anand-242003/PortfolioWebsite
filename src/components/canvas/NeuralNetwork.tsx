import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { skills, Skill } from '@/store/useStore';

interface NodeProps {
  skill: Skill;
  position: [number, number, number];
  mousePosition: { x: number; y: number };
}

const SkillNode = ({ skill, position, mousePosition }: NodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalPosition = useRef(position);
  const velocity = useRef([0, 0, 0]);

  const categoryColors: Record<string, string> = {
    frontend: '#ccff00',
    backend: '#2952ff',
    ai: '#ff6b6b',
    database: '#4ecdc4',
    tools: '#a855f7',
  };

  const color = categoryColors[skill.category] || '#ccff00';

  useFrame((state) => {
    if (!meshRef.current) return;

    // Mouse repulsion physics
    const { viewport } = state;
    const mouseX = (mousePosition.x / window.innerWidth) * 2 - 1;
    const mouseY = -(mousePosition.y / window.innerHeight) * 2 + 1;
    
    const mouse3D = new THREE.Vector3(
      mouseX * viewport.width / 2,
      mouseY * viewport.height / 2,
      0
    );

    const nodePos = meshRef.current.position;
    const distance = nodePos.distanceTo(mouse3D);
    const repulsionRadius = 3;

    if (distance < repulsionRadius && distance > 0.1) {
      const force = (1 - distance / repulsionRadius) * 0.8;
      const direction = nodePos.clone().sub(mouse3D).normalize();
      
      velocity.current[0] += direction.x * force * 0.1;
      velocity.current[1] += direction.y * force * 0.1;
      velocity.current[2] += direction.z * force * 0.05;
    }

    // Spring back to original position
    const springStrength = 0.02;
    const damping = 0.92;

    velocity.current[0] += (originalPosition.current[0] - nodePos.x) * springStrength;
    velocity.current[1] += (originalPosition.current[1] - nodePos.y) * springStrength;
    velocity.current[2] += (originalPosition.current[2] - nodePos.z) * springStrength;

    velocity.current[0] *= damping;
    velocity.current[1] *= damping;
    velocity.current[2] *= damping;

    nodePos.x += velocity.current[0];
    nodePos.y += velocity.current[1];
    nodePos.z += velocity.current[2];

    // Pulsing glow effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + skill.proficiency * 0.1) * 0.1;
    meshRef.current.scale.setScalar(scale * (skill.proficiency / 100 + 0.3));
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
}

const ConnectionLine = ({ start, end }: ConnectionLineProps) => {
  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#ccff00', transparent: true, opacity: 0.15 }))} />
  );
};

interface SceneProps {
  mousePosition: { x: number; y: number };
}

const Scene = ({ mousePosition }: SceneProps) => {
  const { camera } = useThree();

  // Generate node positions in a spherical distribution
  const nodePositions = useMemo(() => {
    const positions: Map<string, [number, number, number]> = new Map();
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    skills.forEach((skill, i) => {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / skills.length);
      const radius = 3 + (skill.proficiency / 100) * 1.5;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      positions.set(skill.id, [x, y, z]);
    });
    
    return positions;
  }, []);

  // Generate connection lines
  const connections = useMemo(() => {
    const lines: { start: [number, number, number]; end: [number, number, number] }[] = [];
    
    skills.forEach((skill) => {
      const startPos = nodePositions.get(skill.id);
      if (!startPos) return;
      
      skill.connections.forEach((connectedId) => {
        const endPos = nodePositions.get(connectedId);
        if (endPos) {
          lines.push({ start: startPos, end: endPos });
        }
      });
    });
    
    return lines;
  }, [nodePositions]);

  useFrame((state) => {
    // Auto-rotate camera
    const time = state.clock.elapsedTime * 0.1;
    camera.position.x = Math.sin(time) * 8;
    camera.position.z = Math.cos(time) * 8;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ccff00" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2952ff" />
      
      {/* Central core */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial
          color="#ccff00"
          emissive="#ccff00"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>

      {/* Skill nodes */}
      {skills.map((skill) => {
        const position = nodePositions.get(skill.id);
        if (!position) return null;
        return (
          <SkillNode
            key={skill.id}
            skill={skill}
            position={position}
            mousePosition={mousePosition}
          />
        );
      })}

      {/* Connection lines */}
      {connections.map((conn, i) => (
        <ConnectionLine key={i} start={conn.start} end={conn.end} />
      ))}

      {/* Particles */}
      <Points count={200} />
    </>
  );
};

const Points = ({ count }: { count: number }) => {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ccff00" transparent opacity={0.4} />
    </points>
  );
};

interface NeuralNetworkProps {
  mousePosition: { x: number; y: number };
}

const NeuralNetwork = ({ mousePosition }: NeuralNetworkProps) => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene mousePosition={mousePosition} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default NeuralNetwork;
