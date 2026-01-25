import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const DataFlowLines = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect device performance
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowPerf = isMobile || navigator.hardwareConcurrency <= 4;

    // Configuration - adjusted for performance with your color scheme
    const params = {
      colorBg: '#050505', // void-black
      colorLine: '#8c8c8c', // subtle gray
      colorSignal: '#ccff00', // acid-green (primary)
      colorSignal2: '#3b82f6', // signal-blue (accent)
      useColor2: true,
      lineCount: isLowPerf ? 30 : 50, // Further reduced
      globalRotation: 0,
      positionX: 0,
      positionY: 0,
      spreadHeight: 30.33,
      spreadDepth: 0,
      curveLength: 50,
      straightLength: 100,
      curvePower: 0.8265,
      waveSpeed: 2.48,
      waveHeight: 0.145,
      lineOpacity: 0.4, // Reduced opacity
      signalCount: isLowPerf ? 20 : 35, // Further reduced
      speedGlobal: 0.345,
      trailLength: 3,
      bloomStrength: isLowPerf ? 1.5 : 2.5, // Reduced bloom
      bloomRadius: 0.4,
    };

    params.positionX = (params.curveLength - params.straightLength) / 2;

    const CONSTANTS = { segmentCount: isLowPerf ? 80 : 120 }; // Further reduced segments

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(params.colorBg);
    scene.fog = new THREE.FogExp2(params.colorBg, 0.003); // Slightly more fog

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 90);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isLowPerf, // Disable antialiasing on mobile
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPerf ? 1 : 2)); // Limit pixel ratio on mobile
    containerRef.current.appendChild(renderer.domElement);

    const contentGroup = new THREE.Group();
    contentGroup.position.set(params.positionX, params.positionY, 0);
    scene.add(contentGroup);

    // Post-processing
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight),
      params.bloomStrength,
      params.bloomRadius,
      0.85
    );
    bloomPass.threshold = 0;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Path calculation
    function getPathPoint(t: number, lineIndex: number, time: number) {
      const totalLen = params.curveLength + params.straightLength;
      const currentX = -params.curveLength + t * totalLen;
      let y = 0;
      let z = 0;

      const spreadFactor = (lineIndex / params.lineCount - 0.5) * 2;

      if (currentX < 0) {
        const ratio = (currentX + params.curveLength) / params.curveLength;
        let shapeFactor = (Math.cos(ratio * Math.PI) + 1) / 2;
        shapeFactor = Math.pow(shapeFactor, params.curvePower);
        y = spreadFactor * params.spreadHeight * shapeFactor;
        z = spreadFactor * params.spreadDepth * shapeFactor;

        const waveFactor = shapeFactor;
        const wave =
          Math.sin(time * params.waveSpeed + currentX * 0.1 + lineIndex) *
          params.waveHeight *
          waveFactor;
        y += wave;
      }

      return new THREE.Vector3(currentX, y, z);
    }

    // Create lines
    const backgroundLines: THREE.Line[] = [];
    const bgMaterial = new THREE.LineBasicMaterial({
      color: params.colorLine,
      transparent: true,
      opacity: params.lineOpacity,
      depthWrite: false,
    });

    for (let i = 0; i < params.lineCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(CONSTANTS.segmentCount * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const line = new THREE.Line(geometry, bgMaterial);
      line.userData = { id: i };
      line.renderOrder = 0;
      contentGroup.add(line);
      backgroundLines.push(line);
    }

    // Create signals
    const signalMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    });

    const signalColorObj = new THREE.Color(params.colorSignal);
    const signalColorObj2 = new THREE.Color(params.colorSignal2);

    function pickSignalColor() {
      return Math.random() > 0.5 ? signalColorObj : signalColorObj2;
    }

    interface Signal {
      mesh: THREE.Line;
      laneIndex: number;
      speed: number;
      progress: number;
      history: THREE.Vector3[];
      assignedColor: THREE.Color;
    }

    const signals: Signal[] = [];

    for (let i = 0; i < params.signalCount; i++) {
      const maxTrail = 150;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(maxTrail * 3);
      const colors = new Float32Array(maxTrail * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mesh = new THREE.Line(geometry, signalMaterial);
      mesh.frustumCulled = false;
      mesh.renderOrder = 1;
      contentGroup.add(mesh);

      signals.push({
        mesh,
        laneIndex: Math.floor(Math.random() * params.lineCount),
        speed: 0.2 + Math.random() * 0.5,
        progress: Math.random(),
        history: [],
        assignedColor: pickSignalColor(),
      });
    }

    // Animation with aggressive throttling for maximum performance
    const clock = new THREE.Clock();
    let animationId: number;
    let lastFrameTime = 0;
    const targetFPS = isLowPerf ? 20 : 30; // Lower FPS for better performance
    const frameInterval = 1000 / targetFPS;
    let frameCount = 0;

    function animate() {
      animationId = requestAnimationFrame(animate);
      
      const now = performance.now();
      const elapsed = now - lastFrameTime;
      
      // Throttle frame rate aggressively
      if (elapsed < frameInterval) return;
      
      lastFrameTime = now - (elapsed % frameInterval);
      const time = clock.getElapsedTime();
      
      frameCount++;

      // Update lines (skip more frames on low perf)
      if (!isLowPerf || frameCount % 3 === 0) {
        backgroundLines.forEach((line) => {
          const positions = line.geometry.attributes.position.array as Float32Array;
          const lineId = line.userData.id;
          for (let j = 0; j < CONSTANTS.segmentCount; j++) {
            const t = j / (CONSTANTS.segmentCount - 1);
            const vec = getPathPoint(t, lineId, time);
            positions[j * 3] = vec.x;
            positions[j * 3 + 1] = vec.y;
            positions[j * 3 + 2] = vec.z;
          }
          line.geometry.attributes.position.needsUpdate = true;
        });
      }

      // Update signals
      signals.forEach((sig) => {
        sig.progress += sig.speed * 0.005 * params.speedGlobal;
        if (sig.progress > 1.0) {
          sig.progress = 0;
          sig.laneIndex = Math.floor(Math.random() * params.lineCount);
          sig.history = [];
          sig.assignedColor = pickSignalColor(); // Pick new color on reset
        }

        const pos = getPathPoint(sig.progress, sig.laneIndex, time);
        sig.history.push(pos);
        if (sig.history.length > params.trailLength + 1) {
          sig.history.shift();
        }

        const positions = sig.mesh.geometry.attributes.position.array as Float32Array;
        const colors = sig.mesh.geometry.attributes.color.array as Float32Array;
        const drawCount = Math.max(1, params.trailLength);
        const currentLen = sig.history.length;

        for (let i = 0; i < drawCount; i++) {
          let index = currentLen - 1 - i;
          if (index < 0) index = 0;
          const p = sig.history[index] || new THREE.Vector3();
          positions[i * 3] = p.x;
          positions[i * 3 + 1] = p.y;
          positions[i * 3 + 2] = p.z;

          let alpha = 1;
          if (params.trailLength > 0) {
            alpha = Math.max(0, 1 - i / params.trailLength);
          }
          colors[i * 3] = sig.assignedColor.r * alpha;
          colors[i * 3 + 1] = sig.assignedColor.g * alpha;
          colors[i * 3 + 2] = sig.assignedColor.b * alpha;
        }

        sig.mesh.geometry.setDrawRange(0, drawCount);
        sig.mesh.geometry.attributes.position.needsUpdate = true;
        sig.mesh.geometry.attributes.color.needsUpdate = true;
      });

      composer.render();
    }

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      composer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
      backgroundLines.forEach((line) => {
        line.geometry.dispose();
        contentGroup.remove(line);
      });
      
      signals.forEach((sig) => {
        sig.mesh.geometry.dispose();
        contentGroup.remove(sig.mesh);
      });
      
      bgMaterial.dispose();
      signalMaterial.dispose();
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, willChange: 'auto' }}
    />
  );
};

export default DataFlowLines;
