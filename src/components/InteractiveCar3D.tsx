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

    // ── Renderer ──────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a14, 0.032);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(2, 2.4, 10);
    camera.lookAt(0, 0.9, 0);

    // ── Lighting ──────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x1a1f35, 0.6);
    scene.add(ambientLight);

    // Key spotlight – warm orange on car body
    const keySpot = new THREE.SpotLight(0xff7a40, 3.5, 60, Math.PI / 5, 0.4, 1.2);
    keySpot.position.set(5, 10, 8);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.set(1024, 1024);
    scene.add(keySpot);
    scene.add(keySpot.target);

    // Fill light – cool blue rim
    const fillSpot = new THREE.SpotLight(0x3a7bff, 2.2, 55, Math.PI / 6, 0.5, 1.4);
    fillSpot.position.set(-6, 7, -5);
    scene.add(fillSpot);

    // Under-car neon point light (animated)
    const neonUnder = new THREE.PointLight(0xff5a1f, 2.0, 8);
    neonUnder.position.set(0, 0.1, 0);
    scene.add(neonUnder);

    // Top rim backlight
    const rimLight = new THREE.DirectionalLight(0xb0c8ff, 0.8);
    rimLight.position.set(0, 12, -10);
    scene.add(rimLight);

    // ── Floor / Showroom ──────────────────────────────────────
    const floorGeom = new THREE.PlaneGeometry(80, 80, 1, 1);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x08111e,
      metalness: 0.9,
      roughness: 0.12,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid lines on floor (subtle)
    const gridHelper = new THREE.GridHelper(80, 60, 0x1e3045, 0x0d1a28);
    (gridHelper.material as THREE.LineBasicMaterial).transparent = true;
    (gridHelper.material as THREE.LineBasicMaterial).opacity = 0.55;
    scene.add(gridHelper);

    // ── Car Body ──────────────────────────────────────────────
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xff5a1f,
      metalness: 0.65,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x060e1a,
      metalness: 0.95,
      roughness: 0.03,
      transparent: true,
      opacity: 0.88,
      transmission: 0.1,
    });

    const createExtruded = (pts: [number, number][], depth: number, bevel: number) => {
      const shape = new THREE.Shape();
      pts.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
      const geom = new THREE.ExtrudeGeometry(shape, {
        depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 4
      });
      geom.translate(0, 0, -depth / 2);
      return geom;
    };

    // Lower chassis
    const lowerGeom = createExtruded(
      [[-2.15, 0.28], [2.15, 0.28], [2.2, 0.72], [1.75, 1.0], [0.6, 1.08], [-1.9, 1.08], [-2.2, 0.88]],
      1.75, 0.09
    );
    const lowerBody = new THREE.Mesh(lowerGeom, bodyMat);
    lowerBody.castShadow = true;
    carGroup.add(lowerBody);

    // Cabin/roof
    const cabinGeom = createExtruded(
      [[-1.62, 1.0], [-0.98, 1.65], [0.52, 1.65], [1.22, 1.0]],
      1.55, 0.04
    );
    const cabinMesh = new THREE.Mesh(cabinGeom, glassMat);
    carGroup.add(cabinMesh);

    // Roof reinforcement strip
    const roofGeom = new THREE.BoxGeometry(1.5, 0.08, 1.6);
    const roofMesh = new THREE.Mesh(roofGeom, bodyMat);
    roofMesh.position.set(-0.2, 1.67, 0);
    carGroup.add(roofMesh);

    // Hood scoop detail
    const scoopGeom = new THREE.BoxGeometry(0.6, 0.06, 0.3);
    const scoopMesh = new THREE.Mesh(scoopGeom, bodyMat);
    scoopMesh.position.set(1.6, 1.0, 0);
    carGroup.add(scoopMesh);

    // Side skirts
    [-0.9, 0.9].forEach(z => {
      const skirtGeom = new THREE.BoxGeometry(3.5, 0.1, 0.12);
      const skirt = new THREE.Mesh(skirtGeom, bodyMat);
      skirt.position.set(0, 0.5, z);
      carGroup.add(skirt);
    });

    // ── Wheels ────────────────────────────────────────────────
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0d, roughness: 0.9, metalness: 0.0 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd0d8e8, metalness: 1.0, roughness: 0.15 });
    const spokesMat = new THREE.MeshStandardMaterial({ color: 0xb8c4d4, metalness: 0.9, roughness: 0.2 });
    const wheels: THREE.Group[] = [];

    const wheelPositions: [number, number, number][] = [
      [1.38, 0.44, 0.96],
      [1.38, 0.44, -0.96],
      [-1.38, 0.44, 0.96],
      [-1.38, 0.44, -0.96],
    ];

    wheelPositions.forEach(([wx, wy, wz]) => {
      const wg = new THREE.Group();

      // Tire
      const tireGeom = new THREE.CylinderGeometry(0.44, 0.44, 0.33, 48);
      const tire = new THREE.Mesh(tireGeom, tireMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wg.add(tire);

      // Rim disc
      const rimGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.355, 5);
      const rimMesh = new THREE.Mesh(rimGeom, rimMat);
      rimMesh.rotation.x = Math.PI / 2;
      wg.add(rimMesh);

      // Spokes
      for (let s = 0; s < 5; s++) {
        const angle = (s / 5) * Math.PI * 2;
        const spokeGeom = new THREE.BoxGeometry(0.055, 0.22, 0.36);
        const spoke = new THREE.Mesh(spokeGeom, spokesMat);
        spoke.rotation.z = angle;
        spoke.rotation.x = Math.PI / 2;
        wg.add(spoke);
      }

      wg.position.set(wx, wy, wz);
      carGroup.add(wg);
      wheels.push(wg);
    });

    // ── Headlights ────────────────────────────────────────────
    const basicMat = (col: number, opacity = 1) => new THREE.MeshBasicMaterial({ color: col, transparent: opacity < 1, opacity });

    [0.62, -0.62].forEach(zPos => {
      // Headlight housing
      const hGeom = new THREE.BoxGeometry(0.11, 0.15, 0.48);
      carGroup.add(Object.assign(new THREE.Mesh(hGeom, basicMat(0xffffff)), { position: new THREE.Vector3(2.17, 0.79, zPos) }));

      // DRL strip
      const drlGeom = new THREE.BoxGeometry(0.05, 0.03, 0.44);
      const drl = new THREE.Mesh(drlGeom, basicMat(0xddeeff));
      drl.position.set(2.19, 0.84, zPos);
      carGroup.add(drl);

      // Light cone
      const beamGeom = new THREE.ConeGeometry(1.5, 8, 24, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xfff4d0, transparent: true, opacity: 0.07,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      });
      const beam = new THREE.Mesh(beamGeom, beamMat);
      beam.rotation.z = Math.PI / 2;
      beam.position.set(6.5, 0.72, zPos);
      carGroup.add(beam);
    });

    // Tail lights
    const tailMat = basicMat(0xff1133);
    [0.72, -0.72].forEach(zPos => {
      const tGeom = new THREE.BoxGeometry(0.07, 0.11, 0.42);
      const tail = new THREE.Mesh(tGeom, tailMat);
      tail.position.set(-2.2, 0.82, zPos);
      carGroup.add(tail);
    });

    // Connecting center tail strip
    const stripGeom = new THREE.BoxGeometry(0.06, 0.07, 1.6);
    carGroup.add(Object.assign(new THREE.Mesh(stripGeom, tailMat), { position: new THREE.Vector3(-2.2, 0.82, 0) }));

    // ── Neon ground ring ──────────────────────────────────────
    const ringGeom = new THREE.RingGeometry(2.75, 2.88, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff5a1f, transparent: true, opacity: 0.75,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending
    });
    const groundRing = new THREE.Mesh(ringGeom, ringMat);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = 0.015;
    carGroup.add(groundRing);

    // ── Orbital rings ─────────────────────────────────────────
    const orbitalMeshes = [
      { radius: 4.4, color: 0xff5a1f, speed: 1.8, tiltX: 0.5, tiltZ: 0.2 },
      { radius: 5.6, color: 0x3a7bff, speed: -1.3, tiltX: -0.3, tiltZ: 0.4 },
      { radius: 6.5, color: 0x14c8a0, speed: 1.0, tiltX: 0.6, tiltZ: -0.3 },
    ].map(({ radius, color, speed, tiltX, tiltZ }) => {
      const orbGeom = new THREE.TorusGeometry(radius, 0.015, 8, 160);
      const orbMat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending
      });
      const orb = new THREE.Mesh(orbGeom, orbMat);
      orb.position.y = 1.0;
      scene.add(orb);
      return { mesh: orb, speed, tiltX, tiltZ };
    });

    // ── Particle field ────────────────────────────────────────
    const PARTICLE_COUNT = 320;
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pSpeeds = new Float32Array(PARTICLE_COUNT);
    const pRadii = new Float32Array(PARTICLE_COUNT);
    const pAngles = new Float32Array(PARTICLE_COUNT);
    const pHeights = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pAngles[i] = Math.random() * Math.PI * 2;
      pRadii[i] = 3.5 + Math.random() * 9;
      pHeights[i] = Math.random() * 5;
      pSpeeds[i] = 0.2 + Math.random() * 0.5;
      pPositions[i * 3] = Math.cos(pAngles[i]) * pRadii[i];
      pPositions[i * 3 + 1] = pHeights[i];
      pPositions[i * 3 + 2] = Math.sin(pAngles[i]) * pRadii[i];
    }

    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xff5a1f,
      size: 0.055,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeom, pMat);
    scene.add(particles);

    // ── Speed streaks ─────────────────────────────────────────
    const STREAK_COUNT = 140;
    const streakPos = new Float32Array(STREAK_COUNT * 6);
    const streakLens: number[] = [];
    for (let i = 0; i < STREAK_COUNT; i++) {
      const px = Math.random() * 80 - 40;
      const py = Math.random() * 6 + 0.08;
      const pz = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 13);
      const len = 1.2 + Math.random() * 4.5;
      streakPos.set([px, py, pz, px + len, py, pz], i * 6);
      streakLens.push(len);
    }
    const streakGeom = new THREE.BufferGeometry();
    streakGeom.setAttribute('position', new THREE.BufferAttribute(streakPos, 3));
    const streakMat = new THREE.LineBasicMaterial({
      color: 0xff9a5f, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending
    });
    const streaks = new THREE.LineSegments(streakGeom, streakMat);
    scene.add(streaks);

    // ── Road dashes ───────────────────────────────────────────
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const roadDashes: THREE.Mesh[] = [];
    for (let i = 0; i < 36; i++) {
      [-3.8, 3.8].forEach(zv => {
        const dg = new THREE.BoxGeometry(1.8, 0.015, 0.14);
        const dm = new THREE.Mesh(dg, dashMat);
        dm.position.set(i * 4.5 - 80, 0.005, zv);
        scene.add(dm);
        roadDashes.push(dm);
      });
    }

    // ── Holographic scan plane ────────────────────────────────
    const scanGeom = new THREE.PlaneGeometry(2.6, 2.4);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x44aaff, transparent: true, opacity: 0.18,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const scanPlane = new THREE.Mesh(scanGeom, scanMat);
    scanPlane.rotation.y = Math.PI / 2;
    scanPlane.position.y = 1.0;
    carGroup.add(scanPlane);

    // ── Camera keyframes per section ──────────────────────────
    const KEYFRAMES = [
      { r: 0.5,          x: 1.9,  cy: 2.4, cz: 9.6,  ly: 0.9, color: 0xff5a1f },
      { r: -0.5,         x: -3.2, cy: 2.7, cz: 10.2, ly: 0.9, color: 0x2f6bff },
      { r: Math.PI + 0.4,x: 3.0,  cy: 2.0, cz: 9.0,  ly: 0.9, color: 0x14c8a0 },
      { r: Math.PI * 2 - 0.3, x: 0.0, cy: 1.5, cz: 8.4, ly: 2.8, color: 0xffb703 }
    ];

    const sectionColors = KEYFRAMES.map(k => new THREE.Color(k.color));
    const targetColor = new THREE.Color();
    const currentTransform = { r: KEYFRAMES[0].r, x: KEYFRAMES[0].x, cy: KEYFRAMES[0].cy, cz: KEYFRAMES[0].cz, ly: 0.9 };

    const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
    const smoothStep = (t: number) => t * t * (3 - 2 * t);

    // Section anchor caching
    const SECTION_SELECTORS = ['#hero', '#fx', '#try', '#go'];
    let sectionTops: number[] = [];
    const measureSections = () => {
      sectionTops = SECTION_SELECTORS.map(sel => {
        const el = document.querySelector<HTMLElement>(sel);
        return el ? el.offsetTop : 0;
      });
    };
    measureSections();
    let lastDocHeight = document.body.scrollHeight;

    // Resize
    const handleResize = () => {
      if (!canvas) return;
      const W = window.innerWidth, H = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      measureSections();
      lastDocHeight = document.body.scrollHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // ── Mouse / Touch interaction ──────────────────────────────
    let targetMouseX = 0, targetMouseY = 0;
    let mouseX = 0, mouseY = 0;
    // drag-to-rotate
    let isDragging = false;
    let dragStartX = 0, dragCurrentX = 0;
    let extraRotation = 0, dragDelta = 0;

    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
      if (isDragging) {
        dragDelta = (e.clientX - dragStartX) * 0.008;
        dragCurrentX = e.clientX;
      }
    };
    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragDelta = 0;
    };
    const handlePointerUp = () => {
      if (isDragging) {
        // commit drag rotation
        extraRotation += dragDelta;
        dragDelta = 0;
      }
      isDragging = false;
    };

    // only the canvas itself captures drag so it doesn't interfere with page scroll
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // ── Animation loop ────────────────────────────────────────
    let animId: number;
    let prevTime = performance.now();
    const startTime = prevTime;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let gridOffset = 0;
    let frameCount = 0;
    const FRAME_MS = 1000 / 60;

    const renderLoop = (now: number) => {
      animId = requestAnimationFrame(renderLoop);

      if (document.hidden) { prevTime = now; lastScrollY = window.scrollY; return; }

      const elapsed = now - prevTime;
      if (elapsed < FRAME_MS * 0.8) return;
      const dt = Math.min(elapsed / 1000, 0.05) || 0.016;
      prevTime = now;
      frameCount++;

      // intro ease (car zooms in from far)
      const introEase = prefersReducedMotion
        ? 1
        : 1 - Math.pow(1 - Math.min((now - startTime) / 2600, 1), 3);

      // scroll velocity for speed boost
      const rawDY = Math.abs(window.scrollY - lastScrollY);
      scrollVelocity += (rawDY / dt / 900 - scrollVelocity) * 0.08;
      lastScrollY = window.scrollY;
      boostRef.current *= Math.exp(-dt * 1.6);

      const currentSpeed = (prefersReducedMotion ? 0.2 : 1.0) *
        (1 + (1 - introEase) * 8 + Math.min(scrollVelocity, 4) * 1.8 + boostRef.current);

      // Re-measure sections occasionally
      if ((frameCount & 63) === 0 && document.body.scrollHeight !== lastDocHeight) {
        lastDocHeight = document.body.scrollHeight;
        measureSections();
      }

      // Active section / interpolation
      const scrollCenter = window.scrollY + window.innerHeight * 0.5;
      let activeIdx = 0;
      sectionTops.forEach((top, i) => { if (top <= scrollCenter) activeIdx = i; });
      const nextIdx = Math.min(activeIdx + 1, KEYFRAMES.length - 1);

      let unitProg = 0;
      if (nextIdx > activeIdx && sectionTops[nextIdx] > sectionTops[activeIdx]) {
        unitProg = clamp(
          (scrollCenter - sectionTops[activeIdx]) / (sectionTops[nextIdx] - sectionTops[activeIdx]),
          0, 1
        );
      }
      const easeProg = smoothStep(clamp((unitProg - 0.25) / 0.6, 0, 1));
      const kA = KEYFRAMES[activeIdx], kB = KEYFRAMES[nextIdx];
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      // Smooth camera lerp
      const lf = 1 - Math.exp(-dt * 3.8);
      currentTransform.r  += (lerp(kA.r,  kB.r,  easeProg) - currentTransform.r)  * lf;
      currentTransform.x  += (lerp(kA.x,  kB.x,  easeProg) - currentTransform.x)  * lf;
      currentTransform.cy += (lerp(kA.cy, kB.cy, easeProg) - currentTransform.cy) * lf;
      currentTransform.cz += (lerp(kA.cz, kB.cz, easeProg) - currentTransform.cz) * lf;
      currentTransform.ly += (lerp(kA.ly, kB.ly, easeProg) - currentTransform.ly) * lf;

      // Mouse parallax smooth
      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;

      // Drag delta lerp
      const totalDrag = extraRotation + (isDragging ? dragDelta : 0);

      const isPortrait = window.innerWidth / window.innerHeight < 0.9;
      carGroup.position.x = (isPortrait ? 0 : currentTransform.x) - (1 - introEase) * 20;
      carGroup.position.y = Math.sin(now / 280) * 0.013 * Math.min(currentSpeed, 3);
      carGroup.rotation.y = currentTransform.r * introEase + mouseX * 0.28 + totalDrag;
      carGroup.rotation.z = -mouseX * 0.025;

      camera.position.set(
        mouseX * 0.85,
        currentTransform.cy - mouseY * 0.45,
        currentTransform.cz + (isPortrait ? 4.5 : 0)
      );
      camera.lookAt(0, currentTransform.ly + (isPortrait ? 1.4 : 0), 0);

      // Color shift
      targetColor.copy(sectionColors[activeIdx]).lerp(sectionColors[nextIdx], easeProg);
      bodyMat.color.lerp(targetColor, lf);
      ringMat.color.copy(bodyMat.color);
      neonUnder.color.copy(bodyMat.color);
      streakMat.color.copy(bodyMat.color);
      pMat.color.copy(bodyMat.color);
      keySpot.color.lerp(targetColor, lf * 0.4);

      // Emit accent color
      if ((frameCount & 31) === 0) {
        const hex = '#' + bodyMat.color.getHexString();
        document.documentElement.style.setProperty('--car-acc', hex);
        onAccentColorChange?.(hex);
      }

      // World velocity
      const worldVel = currentSpeed * 9;

      // Wheel spin
      wheels.forEach(w => { w.rotation.z -= Math.min((worldVel * dt) / 0.44, 0.52); });

      // Road dashes scroll
      roadDashes.forEach(d => {
        d.position.x -= worldVel * dt;
        if (d.position.x < -80) d.position.x += 160;
      });

      // Grid scroll
      gridOffset = (gridOffset + worldVel * dt) % 2;
      gridHelper.position.x = -gridOffset;

      // Speed streaks update
      for (let j = 0; j < STREAK_COUNT; j++) {
        const o = j * 6;
        streakPos[o] -= worldVel * dt * 1.7;
        if (streakPos[o] < -40) streakPos[o] = 40;
        streakPos[o + 3] = streakPos[o] + streakLens[j] * (0.6 + currentSpeed * 0.38);
      }
      streakGeom.attributes.position.needsUpdate = true;

      // Particle orbit update
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pAngles[i] += pSpeeds[i] * dt * 0.3;
        // subtle float
        pHeights[i] += Math.sin(now / 1200 + i) * 0.004;
        pPositions[i * 3]     = Math.cos(pAngles[i]) * pRadii[i];
        pPositions[i * 3 + 1] = pHeights[i] % 6;
        pPositions[i * 3 + 2] = Math.sin(pAngles[i]) * pRadii[i];
      }
      pGeom.attributes.position.needsUpdate = true;

      // Orbital rings animate
      orbitalMeshes.forEach(({ mesh, speed, tiltX, tiltZ }, i) => {
        mesh.rotation.x = tiltX + Math.sin(now / 1400 + i) * 0.2;
        mesh.rotation.z = tiltZ + now / (2000 / speed);
      });

      // Neon under-glow pulse
      neonUnder.intensity = 1.6 + Math.sin(now / 220) * 0.7;
      groundRing.scale.setScalar(1 + 0.045 * Math.sin(now / 260));

      // Scan plane sweep
      scanPlane.position.x = Math.sin(now / 850) * 2.3;
      scanMat.opacity = 0.09 + 0.14 * Math.abs(Math.cos(now / 850));

      // Tail light pulse
      tailMat.color.setRGB(1, 0.05 + 0.08 * Math.sin(now / 180), 0.07);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
    };
  }, [onAccentColorChange]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ pointerEvents: 'auto', cursor: 'grab' }}
      aria-hidden="true"
    />
  );
};
