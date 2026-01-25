import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

const DataFlowLines = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect device performance
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowEndAndroid = /Android/i.test(navigator.userAgent) && (
      navigator.hardwareConcurrency <= 4 || 
      /Samsung.*A[0-3][0-9]|SM-A[0-3]/i.test(navigator.userAgent) ||
      window.innerWidth <= 480
    );
    const isLowPerf = isMobile || navigator.hardwareConcurrency <= 4;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Skip WebGL only on very low-end mobile devices
    if (isLowEndAndroid) {
      return; // Don't render anything on low-end Android
    }
    
    // Check WebGL support and context
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, skipping DataFlowLines');
      return;
    }

    // Configuration - optimized for performance with good visibility
    const params = {
      colorBg: '#050505',
      colorLine: '#ffffff', // Brighter line color
      colorSignal: '#ccff00',
      colorSignal2: '#3b82f6',
      useColor2: true,
      lineCount: isLowPerf ? 15 : 25,
      globalRotation: 0,
      positionX: 0,
      positionY: 0,
      spreadHeight: 30.33,
      spreadDepth: 0,
      curveLength: 50,
      straightLength: 100,
      curvePower: 0.8265,
      waveSpeed: prefersReducedMotion ? 0 : 2,
      waveHeight: prefersReducedMotion ? 0 : 0.12,
      lineOpacity: 0.5, // Higher opacity for visibility
      signalCount: isLowPerf ? 10 : 15,
      speedGlobal: 0.35,
      trailLength: 3,
    };

    params.positionX = (params.curveLength - params.straightLength) / 2;

    const CONSTANTS = { segmentCount: isLowPerf ? 50 : 80 }; // Good segment count for smooth lines

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background to show lines over page

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      500
    );
    camera.position.set(0, 0, 90);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disabled for performance
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false, // Disabled for 2D-like rendering
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPerf ? 1 : 1.5)); // Limit pixel ratio
    containerRef.current.appendChild(renderer.domElement);

    const contentGroup = new THREE.Group();
    contentGroup.position.set(params.positionX, params.positionY, 0);
    scene.add(contentGroup);

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

    // Create lines with staggered fade-in
    const backgroundLines: THREE.Line[] = [];
    const lineOpacities: number[] = []; // Track individual line opacities for fade-in
    const lineTargetOpacities: number[] = []; // Target opacity for each line
    const lineFadeStartTimes: number[] = []; // When each line starts fading in
    
    for (let i = 0; i < params.lineCount; i++) {
      const material = new THREE.LineBasicMaterial({
        color: params.colorLine,
        transparent: true,
        opacity: 0, // Start invisible
        depthWrite: false,
      });
      
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(CONSTANTS.segmentCount * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const line = new THREE.Line(geometry, material);
      line.userData = { id: i };
      line.renderOrder = 0;
      contentGroup.add(line);
      backgroundLines.push(line);
      
      lineOpacities.push(0);
      lineTargetOpacities.push(params.lineOpacity);
      lineFadeStartTimes.push(i * 0.08); // Stagger: each line starts 80ms after the previous
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
      opacity: number;
    }

    const signals: Signal[] = [];
    const signalsStartTime = params.lineCount * 0.08 + 0.5; // Start signals after lines fade in

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
      mesh.visible = false; // Start hidden
      contentGroup.add(mesh);

      signals.push({
        mesh,
        laneIndex: Math.floor(Math.random() * params.lineCount),
        speed: 0.2 + Math.random() * 0.5,
        progress: Math.random(),
        history: [],
        assignedColor: pickSignalColor(),
        opacity: 0,
      });
    }

    // Animation with visibility detection for performance
    const clock = new THREE.Clock();
    let animationId: number;
    let lastFrameTime = 0;
    const targetFPS = isLowPerf ? 24 : 30; // Good balance of smoothness and performance
    const frameInterval = 1000 / targetFPS;
    let frameCount = 0;

    // Visibility observer - pause when not visible
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      visibilityObserver.observe(containerRef.current);
    }

    // Page visibility handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function animate() {
      animationId = requestAnimationFrame(animate);
      
      // Skip rendering when not visible
      if (!isVisibleRef.current) return;
      
      const now = performance.now();
      const elapsed = now - lastFrameTime;
      
      // Throttle frame rate
      if (elapsed < frameInterval) return;
      
      lastFrameTime = now - (elapsed % frameInterval);
      const time = clock.getElapsedTime();
      
      frameCount++;

      // Update lines with staggered fade-in animation
      if (!isLowPerf || frameCount % 3 === 0) {
        backgroundLines.forEach((line, index) => {
          const positions = line.geometry.attributes.position.array as Float32Array;
          const lineId = line.userData.id;
          
          // Staggered fade-in: each line fades in after its delay
          if (time >= lineFadeStartTimes[index] && lineOpacities[index] < lineTargetOpacities[index]) {
            lineOpacities[index] = Math.min(
              lineOpacities[index] + 0.02, // Smooth fade speed
              lineTargetOpacities[index]
            );
            (line.material as THREE.LineBasicMaterial).opacity = lineOpacities[index];
          }
          
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

      // Update signals (fade in after lines)
      signals.forEach((sig, sigIndex) => {
        // Staggered fade-in for signals after lines are visible
        const sigStartTime = signalsStartTime + sigIndex * 0.05;
        if (time >= sigStartTime) {
          sig.mesh.visible = true;
          if (sig.opacity < 1) {
            sig.opacity = Math.min(sig.opacity + 0.03, 1);
          }
        }
        
        if (!sig.mesh.visible) return;
        
        sig.progress += sig.speed * 0.005 * params.speedGlobal;
        if (sig.progress > 1.0) {
          sig.progress = 0;
          sig.laneIndex = Math.floor(Math.random() * params.lineCount);
          sig.history = [];
          sig.assignedColor = pickSignalColor();
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

          let alpha = sig.opacity; // Apply fade-in opacity
          if (params.trailLength > 0) {
            alpha *= Math.max(0, 1 - i / params.trailLength);
          }
          colors[i * 3] = sig.assignedColor.r * alpha;
          colors[i * 3 + 1] = sig.assignedColor.g * alpha;
          colors[i * 3 + 2] = sig.assignedColor.b * alpha;
        }

        sig.mesh.geometry.setDrawRange(0, drawCount);
        sig.mesh.geometry.attributes.position.needsUpdate = true;
        sig.mesh.geometry.attributes.color.needsUpdate = true;
      });

      renderer.render(scene, camera);
    }

    animate();

    // Resize handler with debouncing
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!containerRef.current) return;
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      visibilityObserver.disconnect();
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationId);
      
      backgroundLines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.LineBasicMaterial).dispose();
        contentGroup.remove(line);
      });
      
      signals.forEach((sig) => {
        sig.mesh.geometry.dispose();
        contentGroup.remove(sig.mesh);
      });
      
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
      className="absolute inset-0 w-full h-full data-flow-container"
      style={{ zIndex: 0, willChange: 'auto' }}
    />
  );
};

export default DataFlowLines;
