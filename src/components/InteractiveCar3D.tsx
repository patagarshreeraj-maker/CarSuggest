import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface InteractiveCar3DProps {
  boostSpeed?: number;
  onAccentColorChange?: (colorHex: string) => void;
}

export const InteractiveCar3D: React.FC<InteractiveCar3DProps> = ({
  boostSpeed = 0,
  onAccentColorChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boostRef = useRef<number>(boostSpeed);

  useEffect(() => {
    boostRef.current = Math.max(boostRef.current, boostSpeed);
  }, [boostSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDarkTheme = document.documentElement.dataset.theme === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const blendMode = isDarkTheme ? THREE.AdditiveBlending : THREE.NormalBlending;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setClearColor(0x000000, 0);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 200);

    // Ambient & Directional Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334466, 0.95);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(4, 8, 6);
    scene.add(dirLight);

    const pointLightL2 = new THREE.PointLight(0xff5a1f, 1.6, 40);
    pointLightL2.position.set(-5, 2, -4);
    scene.add(pointLightL2);

    const pointLightL3 = new THREE.PointLight(0x3a7bff, 1.3, 40);
    pointLightL3.position.set(5, 2, 5);
    scene.add(pointLightL3);

    // Car Body Assembly
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff5a1f,
      metalness: 0.55,
      roughness: 0.28,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const createExtrusion = (pts: [number, number][], depth: number, bevel: number) => {
      const shape = new THREE.Shape();
      pts.forEach((p, idx) => (idx ? shape.lineTo(p[0], p[1]) : shape.moveTo(p[0], p[1])));
      const geom = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelSize: bevel,
        bevelThickness: bevel,
        bevelSegments: 3
      });
      geom.translate(0, 0, -depth / 2);
      return geom;
    };

    // Lower chassis & aerodynamic silhouette
    const lowerBodyGeom = createExtrusion(
      [[-2.1, 0.3], [2.1, 0.3], [2.15, 0.7], [1.7, 0.95], [0.6, 1.05], [-1.9, 1.05], [-2.15, 0.85]],
      1.7,
      0.08
    );
    carGroup.add(new THREE.Mesh(lowerBodyGeom, bodyMaterial));

    // Tinted cockpit glass
    const cabinGeom = createExtrusion(
      [[-1.6, 1.0], [-0.95, 1.62], [0.5, 1.62], [1.2, 1.0]],
      1.5,
      0.03
    );
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a1626,
      metalness: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.92
    });
    carGroup.add(new THREE.Mesh(cabinGeom, glassMaterial));

    // Aerodynamic roof panel
    const roofGeom = new THREE.BoxGeometry(1.45, 0.07, 1.56);
    const roofMesh = new THREE.Mesh(roofGeom, bodyMaterial);
    roofMesh.position.set(-0.22, 1.64, 0);
    carGroup.add(roofMesh);

    // Wheels: Tires and sport rims
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0e, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd8dde6, metalness: 1, roughness: 0.2 });
    const wheels: THREE.Group[] = [];

    const wheelPositions: [number, number][] = [
      [1.35, 0.95],
      [1.35, -0.95],
      [-1.35, 0.95],
      [-1.35, -0.95]
    ];

    wheelPositions.forEach(([wx, wz]) => {
      const wheelGroup = new THREE.Group();
      const tireGeom = new THREE.CylinderGeometry(0.44, 0.44, 0.32, 32);
      const tireMesh = new THREE.Mesh(tireGeom, tireMat);
      tireMesh.rotation.x = Math.PI / 2;

      const rimGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.34, 5);
      const rimMesh = new THREE.Mesh(rimGeom, rimMat);
      rimMesh.rotation.x = Math.PI / 2;

      wheelGroup.add(tireMesh, rimMesh);
      wheelGroup.position.set(wx, 0.44, wz);
      carGroup.add(wheelGroup);
      wheels.push(wheelGroup);
    });

    // Front LED Headlights with projected light cones
    const basicMat = (col: number) => new THREE.MeshBasicMaterial({ color: col });
    [0.6, -0.6].forEach((zPos) => {
      const headGeom = new THREE.BoxGeometry(0.1, 0.14, 0.45);
      const headMesh = new THREE.Mesh(headGeom, basicMat(0xffffff));
      headMesh.position.set(2.16, 0.78, zPos);
      carGroup.add(headMesh);

      const beamGeom = new THREE.ConeGeometry(1.3, 7, 24, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xfff2d0,
        transparent: true,
        opacity: 0.1,
        blending: blendMode,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const beamMesh = new THREE.Mesh(beamGeom, beamMat);
      beamMesh.rotation.z = Math.PI / 2;
      beamMesh.position.set(5.7, 0.7, zPos);
      carGroup.add(beamMesh);
    });

    // Rear continuous neon taillight
    const tailGeom = new THREE.BoxGeometry(0.06, 0.1, 1.4);
    const tailMesh = new THREE.Mesh(tailGeom, basicMat(0xff1133));
    tailMesh.position.set(-2.18, 0.8, 0);
    carGroup.add(tailMesh);

    // Neon ground circle ring
    const groundRingGeom = new THREE.RingGeometry(2.7, 2.82, 64);
    const groundRingMat = new THREE.MeshBasicMaterial({
      color: 0xff5a1f,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      blending: blendMode
    });
    const groundRing = new THREE.Mesh(groundRingGeom, groundRingMat);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = 0.02;
    carGroup.add(groundRing);

    // Holographic vehicle scanning plane
    const scanGeom = new THREE.PlaneGeometry(2.4, 2.2);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x3aa0ff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      blending: blendMode,
      depthWrite: false
    });
    const scanMesh = new THREE.Mesh(scanGeom, scanMat);
    scanMesh.rotation.y = Math.PI / 2;
    scanMesh.position.y = 1;
    carGroup.add(scanMesh);

    // Concentric orbital rings
    const orbitalMeshes = [4.2, 5.4].map((radius, i) => {
      const orbGeom = new THREE.TorusGeometry(radius, 0.012, 8, 128);
      const orbMat = new THREE.MeshBasicMaterial({
        color: i ? 0x3a7bff : 0xff5a1f,
        transparent: true,
        opacity: 0.55
      });
      const orbMesh = new THREE.Mesh(orbGeom, orbMat);
      orbMesh.position.y = 1;
      carGroup.add(orbMesh);
      return orbMesh;
    });

    // Telemetry particle nodes
    const nodesGroup = new THREE.Group();
    nodesGroup.position.y = 1.2;
    carGroup.add(nodesGroup);
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const nodeGeom = new THREE.OctahedronGeometry(0.07 + Math.random() * 0.08);
      const nodeMesh = new THREE.Mesh(nodeGeom, basicMat(i % 2 ? 0xff5a1f : 0x3aa0ff));
      nodeMesh.position.set(Math.cos(angle) * 5, Math.sin(angle * 3) * 0.8, Math.sin(angle) * 5);
      nodesGroup.add(nodeMesh);
    }

    // Perspective floor grid
    const roadGrid = new THREE.GridHelper(120, 60, 0xffffff, 0xffffff);
    (roadGrid.material as THREE.Material).transparent = true;
    (roadGrid.material as THREE.Material).opacity = 0.18;
    scene.add(roadGrid);

    // Highway dashes
    const roadDashes: THREE.Mesh[] = [];
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    for (let i = 0; i < 30; i++) {
      [-4, 4].forEach((zVal) => {
        const dashGeom = new THREE.BoxGeometry(1.6, 0.02, 0.12);
        const dashMesh = new THREE.Mesh(dashGeom, dashMat);
        dashMesh.position.set(i * 4 - 60, 0.01, zVal);
        scene.add(dashMesh);
        roadDashes.push(dashMesh);
      });
    }

    // Speed warp streak particles
    const STREAK_COUNT = 170;
    const streakPositions = new Float32Array(STREAK_COUNT * 6);
    const streakLengths: number[] = [];
    for (let i = 0; i < STREAK_COUNT; i++) {
      const px = Math.random() * 80 - 40;
      const py = Math.random() * 7 + 0.1;
      const pz = (Math.random() < 0.5 ? -1 : 1) * (2.8 + Math.random() * 12);
      const len = 1 + Math.random() * 4;
      streakPositions.set([px, py, pz, px + len, py, pz], i * 6);
      streakLengths.push(len);
    }
    const streakGeom = new THREE.BufferGeometry();
    streakGeom.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3));
    const streakMat = new THREE.LineBasicMaterial({
      color: 0xff9a5f,
      transparent: true,
      opacity: 0.55,
      blending: blendMode
    });
    const streakSegments = new THREE.LineSegments(streakGeom, streakMat);
    scene.add(streakSegments);

    // Camera perspective keyframes corresponding to each section
    const KEYFRAMES = [
      { r: 0.55, x: 1.8, cy: 2.3, cz: 9.5, ly: 0.9, color: 0xff5a1f }, // Section 0: #hero
      { r: -0.55, x: -3.1, cy: 2.6, cz: 10.0, ly: 0.9, color: 0x2f6bff }, // Section 1: #fx
      { r: Math.PI + 0.5, x: 3.1, cy: 2.0, cz: 9.0, ly: 0.9, color: 0x14c8a0 }, // Section 2: #try
      { r: Math.PI * 2 - 0.35, x: 0.0, cy: 1.5, cz: 8.5, ly: 2.9, color: 0xffb703 } // Section 3: #go
    ];

    const sectionColors = KEYFRAMES.map((k) => new THREE.Color(k.color));
    const targetColor = new THREE.Color();
    const currentTransform = {
      r: KEYFRAMES[0].r,
      x: KEYFRAMES[0].x,
      cy: KEYFRAMES[0].cy,
      cz: KEYFRAMES[0].cz,
      ly: 0.9
    };

    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
    const smoothStep = (t: number) => t * t * (3 - 2 * t);

    // Resize handling
    const handleResize = () => {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // Animation loop variables
    let animationFrameId: number;
    let prevTime = performance.now();
    const startTime = prevTime;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let gridOffset = 0;
    let frameCount = 0;

    const renderLoop = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const deltaTime = Math.min((currentTime - prevTime) / 1000, 0.05) || 0.016;
      prevTime = currentTime;

      const introEase = prefersReducedMotion
        ? 1
        : 1 - Math.pow(1 - Math.min((currentTime - startTime) / 2800, 1), 3);

      scrollVelocity += (Math.abs(window.scrollY - lastScrollY) / deltaTime / 1000 - scrollVelocity) * 0.1;
      lastScrollY = window.scrollY;
      boostRef.current *= Math.exp(-deltaTime * 1.5);

      const currentSpeed = (prefersReducedMotion ? 0.25 : 1) *
        (1 + (1 - introEase) * 7 + Math.min(scrollVelocity, 3) * 1.6 + boostRef.current);

      // Scroll position tracking relative to sections
      const sectionElements = ['#hero', '#fx', '#try', '#go'].map((sel) =>
        document.querySelector<HTMLElement>(sel)
      );

      const scrollCenter = window.scrollY + window.innerHeight * 0.55;
      let activeIndex = 0;
      sectionElements.forEach((el, idx) => {
        if (el && el.offsetTop <= scrollCenter) {
          activeIndex = idx;
        }
      });

      const nextIndex = Math.min(activeIndex + 1, KEYFRAMES.length - 1);
      const currEl = sectionElements[activeIndex];
      const nextEl = sectionElements[nextIndex];

      let unitProgress = 0;
      if (nextIndex > activeIndex && currEl && nextEl) {
        unitProgress = clamp((scrollCenter - currEl.offsetTop) / (nextEl.offsetTop - currEl.offsetTop), 0, 1);
      }
      const easeProgress = smoothStep(clamp((unitProgress - 0.3) / 0.6, 0, 1));

      const kfA = KEYFRAMES[activeIndex];
      const kfB = KEYFRAMES[nextIndex];
      const interpolate = (prop: 'r' | 'x' | 'cy' | 'cz' | 'ly') =>
        kfA[prop] + (kfB[prop] - kfA[prop]) * easeProgress;

      const isPortrait = window.innerWidth / window.innerHeight < 0.9;
      const lerpFactor = 1 - Math.exp(-deltaTime * 3.5);

      (['r', 'x', 'cy', 'cz', 'ly'] as const).forEach((prop) => {
        currentTransform[prop] += (interpolate(prop) - currentTransform[prop]) * lerpFactor;
      });

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      carGroup.position.x = (isPortrait ? 0 : currentTransform.x) - (1 - introEase) * 18;
      carGroup.position.y = Math.sin(currentTime / 260) * 0.012 * Math.min(currentSpeed, 3);
      carGroup.rotation.y = currentTransform.r * introEase + mouseX * 0.3;
      carGroup.rotation.z = -mouseX * 0.02;

      camera.position.set(
        mouseX * 0.9,
        currentTransform.cy - mouseY * 0.5,
        currentTransform.cz + (isPortrait ? 4 : 0)
      );
      camera.lookAt(0, currentTransform.ly + (isPortrait ? 1.3 : 0), 0);

      // Color interpolation across keyframes
      targetColor.copy(sectionColors[activeIndex]).lerp(sectionColors[nextIndex], easeProgress);
      bodyMaterial.color.lerp(targetColor, lerpFactor);
      groundRingMat.color.copy(bodyMaterial.color);
      pointLightL2.color.copy(bodyMaterial.color);
      streakMat.color.copy(bodyMaterial.color);
      // Safe grid color update
      const gridMat = roadGrid.material;
      if (Array.isArray(gridMat)) {
        gridMat.forEach((m) => {
          if ('color' in m && m.color instanceof THREE.Color) {
            m.color.copy(bodyMaterial.color);
          }
        });
      } else if (gridMat && 'color' in gridMat && (gridMat as THREE.LineBasicMaterial).color instanceof THREE.Color) {
        (gridMat as THREE.LineBasicMaterial).color.copy(bodyMaterial.color);
      }

      if ((frameCount++ & 7) === 0) {
        const hexStr = '#' + bodyMaterial.color.getHexString();
        document.documentElement.style.setProperty('--car-acc', hexStr);
        if (onAccentColorChange) onAccentColorChange(hexStr);
      }

      // Wheel rotation and environment motion
      const worldVelocity = currentSpeed * 9;
      const wheelSpin = Math.min((worldVelocity * deltaTime) / 0.44, 0.5);
      wheels.forEach((w) => {
        w.rotation.z -= wheelSpin;
      });

      roadDashes.forEach((dash) => {
        dash.position.x -= worldVelocity * deltaTime;
        if (dash.position.x < -60) dash.position.x += 120;
      });

      gridOffset = (gridOffset + worldVelocity * deltaTime) % 2;
      roadGrid.position.x = -gridOffset;

      // Update streaks
      for (let j = 0; j < STREAK_COUNT; j++) {
        const offset = j * 6;
        streakPositions[offset] -= worldVelocity * deltaTime * 1.6;
        if (streakPositions[offset] < -40) streakPositions[offset] = 40;
        streakPositions[offset + 3] =
          streakPositions[offset] + streakLengths[j] * (0.6 + currentSpeed * 0.35);
      }
      streakGeom.attributes.position.needsUpdate = true;

      // Holographic scanner movement
      scanMesh.position.x = Math.sin(currentTime / 800) * 2.2;
      scanMat.opacity = 0.1 + 0.12 * Math.abs(Math.cos(currentTime / 800));

      // Orbital animations
      orbitalMeshes[0].rotation.set(Math.PI / 2 + Math.sin(currentTime / 1300) * 0.35, 0, currentTime / 2000);
      orbitalMeshes[1].rotation.set(Math.PI / 2 + Math.cos(currentTime / 1700) * 0.4, 0, -currentTime / 1500);
      nodesGroup.rotation.y += deltaTime * 0.35;
      groundRing.scale.setScalar(1 + 0.04 * Math.sin(currentTime / 250));

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
    };
  }, [onAccentColorChange]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />;
};
