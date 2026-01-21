import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore, skills, Skill } from '@/store/useStore';

interface NodeProps {
  skill: Skill;
  position: [number, number, number];
  mousePosition: { x: number; y: number };
  onNodeClick: (skill: Skill) => void;
}

/**
 * Individual skill node with physics-based mouse repulsion
 * Uses inverse square law for realistic force calculation
 */
const SkillNode = ({ skill, position, mousePosition, onNodeClick }: NodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalPosition = useRef(position);
  const velocity = useRef([0, 0, 0]);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const categoryColors: Record<string, THREE.Color> = {
    frontend: new THREE.Color('#ccff00'),
    backend: new THREE.Color('#2952ff'),
    database: new THREE.Color('#4ecdc4'),
    tools: new THREE.Color('#a855f7'),
  };

  const color = categoryColors[skill.category] || new THREE.Color('#ccff00');

  // Custom shader material for pulsing glow
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uIntensity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
          float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
          vec3 glow = uColor * (fresnel + pulse * 0.3) * uIntensity;
          gl_FragColor = vec4(glow, 1.0);
        }
      `,
    });
  }, [color]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Update shader time for pulsing animation
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Mouse repulsion physics (inverse square law)
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

    // Apply inverse square law: F = k / r²
    if (distance < repulsionRadius && distance > 0.1) {
      const forceMagnitude = (1 - distance / repulsionRadius) ** 2 * 0.8;
      const direction = nodePos.clone().sub(mouse3D).normalize();
      
      velocity.current[0] += direction.x * forceMagnitude * 0.1;
      velocity.current[1] += direction.y * forceMagnitude * 0.1;
      velocity.current[2] += direction.z * forceMagnitude * 0.05;
    }

    // Spring force back to original position (Hooke's law: F = -kx)
    const springStrength = 0.02;
    const damping = 0.92;

    velocity.current[0] += (originalPosition.current[0] - nodePos.x) * springStrength;
    velocity.current[1] += (originalPosition.current[1] - nodePos.y) * springStrength;
    velocity.current[2] += (originalPosition.current[2] - nodePos.z) * springStrength;

    // Apply damping
    velocity.current[0] *= damping;
    velocity.current[1] *= damping;
    velocity.current[2] *= damping;

    // Update position
    nodePos.x += velocity.current[0];
    nodePos.y += velocity.current[1];
    nodePos.z += velocity.current[2];

    // Scale based on proficiency
    const scale = 0.15 + (skill.proficiency / 100) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  const handleClick = () => {
    onNodeClick(skill);
  };

  return (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial ref={materialRef} attach="material" {...shaderMaterial} />
    </mesh>
  );
};

/**
 * Connection lines between related skills
 * Only renders lines between nodes within 2.5 units distance
 */
const ConnectionLines = () => {
  const linesRef = useRef<THREE.LineSegments>(null);

  const { geometry, material } = useMemo(() => {
    const positions: number[] = [];
    const nodePositions = new Map<string, THREE.Vector3>();

    // Generate positions using golden ratio for even distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    skills.forEach((skill, i) => {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / skills.length);
      const radius = 3 + (skill.proficiency / 100) * 1.5;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      nodePositions.set(skill.id, new THREE.Vector3(x, y, z));
    });

    // Create lines between connected skills within distance threshold
    skills.forEach((skill) => {
      const startPos = nodePositions.get(skill.id);
      if (!startPos) return;

      skill.connections.forEach((connectedId) => {
        const endPos = nodePositions.get(connectedId);
        if (endPos && startPos.distanceTo(endPos) < 2.5) {
          positions.push(startPos.x, startPos.y, startPos.z);
          positions.push(endPos.x, endPos.y, endPos.z);
        }
      });
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: '#ccff00',
      transparent: true,
      opacity: 0.15,
    });

    return { geometry, material };
  }, []);

  return <lineSegments ref={linesRef} geometry={geometry} material={material} />;
};

/**
 * Main scene with camera controls and auto-rotation
 */
const Scene = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const { camera } = useThree();
  const { setSelectedSkill } = useStore();
  const controlsRef = useRef<any>(null);

  // Generate node positions using golden ratio spiral
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

  // Gentle auto-rotation (0.001 rad/frame)
  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.1;
    camera.position.x = Math.sin(time) * 8;
    camera.position.z = Math.cos(time) * 8;
    camera.lookAt(0, 0, 0);
  });

  // Handle node click with GSAP camera zoom
  const handleNodeClick = (skill: Skill) => {
    setSelectedSkill(skill);
    const position = nodePositions.get(skill.id);
    
    if (position && controlsRef.current) {
      gsap.to(camera.position, {
        x: position[0] * 1.5,
        y: position[1] * 1.5,
        z: position[2] * 1.5,
        duration: 1.5,
        ease: 'power3.inOut',
      });
      
      gsap.to(controlsRef.current.target, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 1.5,
        ease: 'power3.inOut',
      });
    }
  };

  return (
    <>
      {/* Lighting */}
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
            onNodeClick={handleNodeClick}
          />
        );
      })}

      {/* Connection lines */}
      <ConnectionLines />

      {/* Particles */}
      <Points count={200} />

      {/* Controls */}
      <OrbitControls 
        ref={controlsRef}
        enableZoom={false} 
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

/**
 * Background particles for depth
 */
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

/**
 * Main Neural Network component with post-processing
 */
interface NeuralNetworkEnhancedProps {
  mousePosition: { x: number; y: number };
}

const NeuralNetworkEnhanced = ({ mousePosition }: NeuralNetworkEnhancedProps) => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]} // Adaptive pixel ratio for performance
      >
        <Scene mousePosition={mousePosition} />
        
        {/* Bloom post-processing for Acid Green glow */}
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default NeuralNetworkEnhanced;
