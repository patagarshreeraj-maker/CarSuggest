import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface InteractiveCar3DProps {
  selectedCarIndex?: number; // 0: Fortuner, 1: Creta, 2: Polo, 3: All 3 Models (Convoy)
  onCarSelect?: (index: number) => void;
  onPaintChange?: (isBlack: boolean) => void;
}

export const InteractiveCar3D: React.FC<InteractiveCar3DProps> = ({
  selectedCarIndex = 3, // Default to showcasing all 3 models!
  onCarSelect,
  onPaintChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const selectedCarRef = useRef<number>(selectedCarIndex);
  const setCarFnRef = useRef<((i: number) => void) | null>(null);

  useEffect(() => {
    selectedCarRef.current = selectedCarIndex;
    if (setCarFnRef.current) {
      setCarFnRef.current(selectedCarIndex);
    }
  }, [selectedCarIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDark =
      document.documentElement.classList.contains('dark') ||
      document.documentElement.dataset.theme === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const BL = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 200);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x334466, 0.45));
    const L1 = new THREE.DirectionalLight(0xffffff, 0.9);
    L1.position.set(4, 8, 6);
    scene.add(L1);

    const L2 = new THREE.PointLight(0xffffff, 1.0, 45);
    L2.position.set(-5, 3, -4);
    scene.add(L2);

    const L3 = new THREE.PointLight(0xdbe6ff, 0.8, 45);
    L3.position.set(5, 3, 5);
    scene.add(L3);

    // Master car container group
    const carRoot = new THREE.Group();
    scene.add(carRoot);

    // Sub-groups for each car
    const fortGroup = new THREE.Group();
    const cretaGroup = new THREE.Group();
    const poloGroup = new THREE.Group();
    carRoot.add(fortGroup);
    carRoot.add(cretaGroup);
    carRoot.add(poloGroup);

    // Environment map generated via canvas
    try {
      const ec = document.createElement('canvas');
      ec.width = 512;
      ec.height = 256;
      const eg = ec.getContext('2d');
      if (eg) {
        const egr = eg.createLinearGradient(0, 0, 0, 256);
        egr.addColorStop(0, '#d6e4ff');
        egr.addColorStop(0.48, '#8d98ad');
        egr.addColorStop(0.52, '#2b2e38');
        egr.addColorStop(1, '#0b0c10');
        eg.fillStyle = egr;
        eg.fillRect(0, 0, 512, 256);
        eg.fillStyle = '#ffffff';
        [
          [40, 40, 100, 24],
          [210, 28, 120, 20],
          [390, 46, 90, 26],
          [130, 104, 70, 10],
          [320, 100, 80, 10],
        ].forEach((r) => eg.fillRect(r[0], r[1], r[2], r[3]));
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromEquirectangular(new THREE.CanvasTexture(ec)).texture;
        pmrem.dispose();
      }
    } catch {
      // safe fallback
    }

    // Shared materials matching landigpage.html
    const body = new THREE.MeshPhysicalMaterial({
      color: 0xe8eaed,
      metalness: 0.1,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 0.9,
    });
    const glassM = new THREE.MeshPhysicalMaterial({
      color: 0x0a121c,
      metalness: 0.2,
      roughness: 0.04,
      clearcoat: 1,
      envMapIntensity: 1.6,
      transparent: true,
      opacity: 0.88,
    });
    const plastic = new THREE.MeshStandardMaterial({ color: 0x111216, roughness: 0.7, metalness: 0.1 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe4ec, metalness: 1, roughness: 0.12 });
    const lamp = (c: number, n: number) =>
      new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: n, roughness: 0.2 });

    const std = (c: number, m: number, r: number, e = 1) =>
      new THREE.MeshStandardMaterial({ color: c, metalness: m, roughness: r, envMapIntensity: e });
    const amber = new THREE.MeshStandardMaterial({
      color: 0x6b3a00,
      emissive: 0xff9a00,
      emissiveIntensity: 0,
      roughness: 0.35,
      metalness: 0,
    });
    const lens = new THREE.MeshPhysicalMaterial({
      color: 0xdfe8f5,
      metalness: 0,
      roughness: 0.05,
      transparent: true,
      opacity: 0.4,
      envMapIntensity: 2,
      depthWrite: false,
    });

    const MT: Record<string, THREE.Material> = {
      carpaint: body,
      black: std(0x101114, 0.2, 0.5),
      chrome,
      chrome_only: chrome,
      o: chrome,
      rim: std(0xc2c7d0, 0.9, 0.28, 1.2),
      tire: std(0x121216, 0, 0.92),
      'Material #18': std(0x2a2c31, 0.7, 0.5),
      grey: std(0x9aa0a8, 0.6, 0.4),
      windows_glass: glassM,
      r_glass: glassM,
      'Material #8': lens,
      r_tailight: lamp(0xd0121f, 1),
      ind_tailighjt: amber,
      indicator_signal: amber,
      indicator_arrow: amber,
      'Material #164': plastic,
    };
    body.side = glassM.side = THREE.DoubleSide;

    // Glow sprite generator for hazard indicators
    const gt = document.createElement('canvas');
    gt.width = gt.height = 64;
    const gc = gt.getContext('2d');
    if (gc) {
      const gg = gc.createRadialGradient(32, 32, 0, 32, 32, 32);
      gg.addColorStop(0, 'rgba(255,230,160,1)');
      gg.addColorStop(0.25, 'rgba(255,170,20,.8)');
      gg.addColorStop(1, 'rgba(255,140,0,0)');
      gc.fillStyle = gg;
      gc.fillRect(0, 0, 64, 64);
    }
    const createGlowMaterial = () =>
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(gt),
        transparent: true,
        depthWrite: false,
        blending: BL,
        opacity: 0,
      });

    // Floor highlight
    const flC = document.createElement('canvas');
    flC.width = flC.height = 256;
    const flX = flC.getContext('2d');
    if (flX) {
      const flG = flX.createRadialGradient(128, 128, 0, 128, 128, 128);
      flG.addColorStop(0, isDark ? 'rgba(120,145,190,.35)' : 'rgba(255,255,255,.9)');
      flG.addColorStop(0.55, isDark ? 'rgba(120,145,190,.12)' : 'rgba(255,255,255,.35)');
      flG.addColorStop(1, 'rgba(255,255,255,0)');
      flX.fillStyle = flG;
      flX.fillRect(0, 0, 256, 256);
    }
    const studioFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(flC), transparent: true, depthWrite: false })
    );
    studioFloor.rotation.x = -Math.PI / 2;
    studioFloor.position.y = 0.004;
    scene.add(studioFloor);

    // Shadow generator for ground
    const shC = document.createElement('canvas');
    shC.width = shC.height = 128;
    const shG = shC.getContext('2d');
    if (shG) {
      const shR = shG.createRadialGradient(64, 64, 4, 64, 64, 64);
      shR.addColorStop(0, 'rgba(0,0,0,.6)');
      shR.addColorStop(1, 'rgba(0,0,0,0)');
      shG.fillStyle = shR;
      shG.fillRect(0, 0, 128, 128);
    }
    const createShadow = () => {
      const sh = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 3.4),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shC), transparent: true, depthWrite: false })
      );
      sh.rotation.x = -Math.PI / 2;
      sh.position.y = 0.015;
      return sh;
    };

    fortGroup.add(createShadow());
    cretaGroup.add(createShadow());
    poloGroup.add(createShadow());

    // Hazard lights state
    interface HazardSetup {
      m: THREE.MeshStandardMaterial;
      gm: THREE.SpriteMaterial;
      l: THREE.PointLight[];
      k?: [number, number, number];
    }
    let hazardF: HazardSetup | null = null;
    let hazardC: HazardSetup | null = null;
    let hazardP: HazardSetup | null = null;

    let fortWheels: THREE.Object3D[] = [];
    let cretaWheels: THREE.Object3D[] = [];
    let poloWheels: THREE.Object3D[] = [];

    let currentMode = selectedCarRef.current; // 0: Fortuner, 1: Creta, 2: Polo, 3: All 3 Models

    const loader = new GLTFLoader();

    // ── Load 1: Toyota Fortuner ──
    loader.load(
      '/models/fortuner.glb',
      (g) => {
        g.scene.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            const mesh = o as THREE.Mesh;
            const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
            mesh.material = MT[mat.name] || plastic;
          }
        });
        fortWheels = [];
        g.scene.traverse((o) => {
          if (/^wheel/.test(o.name)) fortWheels.push(o);
        });
        fortGroup.add(g.scene);

        const gm = createGlowMaterial();
        [
          [2.08, 0.5, 0.58, 0.5],
          [2.08, 0.5, -0.58, 0.5],
          [-2.11, 1.07, 0.59, 0.45],
          [-2.11, 1.07, -0.59, 0.45],
          [0.62, 1.18, 0.9, 0.3],
          [0.62, 1.18, -0.9, 0.3],
        ].forEach((q) => {
          const sp3 = new THREE.Sprite(gm);
          sp3.position.set(q[0], q[1], q[2]);
          sp3.scale.set(q[3], q[3], 1);
          fortGroup.add(sp3);
        });
        const hf = new THREE.PointLight(0xffa000, 0, 4);
        const hr = new THREE.PointLight(0xffa000, 0, 4);
        hf.position.set(2.3, 0.55, 0);
        hr.position.set(-2.3, 1, 0);
        fortGroup.add(hf, hr);
        hazardF = { m: amber, gm, l: [hf, hr] };
        updateVisibility();
      },
      undefined,
      () => {}
    );

    // ── Load 2: Hyundai Creta ──
    loader.load(
      '/models/creta.glb',
      (g) => {
        const amberC = new THREE.MeshStandardMaterial({
          color: 0x6b3a00,
          emissive: 0xff9a00,
          emissiveIntensity: 0,
          roughness: 0.35,
          metalness: 0,
        });
        g.scene.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            const mesh = o as THREE.Mesh;
            const n = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material).name;
            if (n === 'BODYY') mesh.material = body;
            else if (n === 'glass') mesh.material = glassM;
            else if (n === 'indicator') mesh.material = amberC;
          }
        });
        cretaWheels = [];
        g.scene.traverse((o) => {
          if (/^wheel/.test(o.name)) cretaWheels.push(o);
        });
        cretaGroup.add(g.scene);

        const gm = createGlowMaterial();
        [
          [1.84, 0.54, 0.65, 0.34],
          [1.84, 0.54, -0.65, 0.34],
          [-1.9, 1.03, 0.63, 0.34],
          [-1.9, 1.03, -0.63, 0.34],
          [0.66, 1.07, 0.86, 0.22],
          [0.66, 1.07, -0.86, 0.22],
        ].forEach((q) => {
          const sp = new THREE.Sprite(gm);
          sp.position.set(q[0], q[1], q[2]);
          sp.scale.set(q[3], q[3], 1);
          cretaGroup.add(sp);
        });
        const hf = new THREE.PointLight(0xffa000, 0, 4);
        const hr = new THREE.PointLight(0xffa000, 0, 4);
        hf.position.set(2.05, 0.55, 0);
        hr.position.set(-2.05, 1, 0);
        cretaGroup.add(hf, hr);
        hazardC = { m: amberC, gm, l: [hf, hr], k: [0.4, 0.45, 0.35] };
        updateVisibility();
      },
      undefined,
      () => {}
    );

    // ── Load 3: Volkswagen Polo ──
    loader.load(
      '/models/polo.glb',
      (g) => {
        const amberP = new THREE.MeshStandardMaterial({
          color: 0x6b3a00,
          emissive: 0xff9a00,
          emissiveIntensity: 0,
          roughness: 0.35,
          metalness: 0,
        });
        g.scene.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            const mesh = o as THREE.Mesh;
            const n = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material).name;
            if (n === 'BODYY') mesh.material = body;
            else if (n === 'glass') mesh.material = glassM;
            else if (n === 'indicator') mesh.material = amberP;
          }
        });
        poloWheels = [];
        g.scene.traverse((o) => {
          if (/^wheel/.test(o.name)) poloWheels.push(o);
        });
        poloGroup.add(g.scene);

        const gm = createGlowMaterial();
        [
          [1.64, 0.6, 0.62, 0.3],
          [1.64, 0.6, -0.62, 0.3],
          [-1.68, 0.765, 0.61, 0.3],
          [-1.68, 0.765, -0.61, 0.3],
          [0.46, 0.93, 0.87, 0.2],
          [0.46, 0.93, -0.87, 0.2],
        ].forEach((q) => {
          const sp = new THREE.Sprite(gm);
          sp.position.set(q[0], q[1], q[2]);
          sp.scale.set(q[3], q[3], 1);
          poloGroup.add(sp);
        });
        const hf = new THREE.PointLight(0xffa000, 0, 4);
        const hr = new THREE.PointLight(0xffa000, 0, 4);
        hf.position.set(1.95, 0.6, 0);
        hr.position.set(-1.95, 0.8, 0);
        poloGroup.add(hf, hr);
        hazardP = { m: amberP, gm, l: [hf, hr], k: [0.4, 0.45, 0.35] };
        updateVisibility();
      },
      undefined,
      () => {}
    );

    const updateVisibility = () => {
      if (currentMode === 3) {
        // Convoy mode: all 3 models visible
        fortGroup.visible = true;
        cretaGroup.visible = true;
        poloGroup.visible = true;
      } else {
        fortGroup.visible = currentMode === 0;
        cretaGroup.visible = currentMode === 1;
        poloGroup.visible = currentMode === 2;
      }
    };

    const setCar = (mode: number) => {
      currentMode = mode;
      updateVisibility();
      onCarSelect?.(mode);
    };

    setCarFnRef.current = setCar;
    setCar(selectedCarRef.current);

    // Driving curve path projection
    const cl = (a: number, l: number, h: number) => Math.min(Math.max(a, l), h);
    const ss = (a: number) => a * a * (3 - 2 * a);
    const CAM = { h: 4.2, d: 12.5, ly: 0.2 };
    const CB = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    const PL = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const RR = new THREE.Raycaster();
    const q2 = new THREE.Vector2();

    const PTS: [number, number][] = [
      [-0.67, 0.5],
      [-0.34, 0.24],
      [-0.04, -0.04],
      [0.1, -0.3],
      [0.08, -0.6],
    ];

    const crm = (a: number, b: number, c: number, d: number, t: number) =>
      0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);

    // Smooth path with linear tangent extrapolation for u < 0 and u > 1 (convoy trailing)
    const curve = (u: number): [number, number] => {
      if (u < 0) {
        const c0 = PTS[0];
        const c1 = PTS[1];
        return [c0[0] + u * (c1[0] - c0[0]) * 4, c0[1] + u * (c1[1] - c0[1]) * 4];
      } else if (u > 1) {
        const cLast = PTS[PTS.length - 1];
        const cPrev = PTS[PTS.length - 2];
        return [cLast[0] + (u - 1) * (cLast[0] - cPrev[0]) * 4, cLast[1] + (u - 1) * (cLast[1] - cPrev[1]) * 4];
      }
      const n = PTS.length - 1;
      const f = u * n;
      const i = Math.min(Math.floor(f), n - 1);
      const t = f - i;
      const P = (j: number) => PTS[cl(j, 0, n)];
      return [0, 1].map((k) => crm(P(i - 1)[k], P(i)[k], P(i + 1)[k], P(i + 2)[k], t)) as [number, number];
    };

    let XS = 1;
    const spot = (u: number, o: THREE.Vector3) => {
      const c = curve(u);
      RR.setFromCamera(q2.set(c[0] * XS, c[1]), CB);
      RR.ray.intersectPlane(PL, o);
      return o;
    };

    const getScrollProg = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return cl(scrollY / maxScroll, 0, 1);
    };

    const handleResize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(window.innerWidth, window.innerHeight);
      const a = window.innerWidth / window.innerHeight;
      camera.aspect = CB.aspect = a;
      XS = a < 1 ? 0.78 : 1;
      camera.updateProjectionMatrix();
      CB.updateProjectionMatrix();
      CB.position.set(0, CAM.h, CAM.d);
      CB.lookAt(0, CAM.ly, 0);
      CB.updateMatrixWorld(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse parallax
    let tmx = 0;
    let tmy = 0;
    let mx = 0;
    let my = 0;
    const handlePointerMove = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth) * 2 - 1;
      tmy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // Click car to toggle paint (Pearl White vs Obsidian Black)
    const RC = new THREE.Raycaster();
    const mv2 = new THREE.Vector2();
    const PW = new THREE.Color(0xe8eaed);
    const PB = new THREE.Color(0x0c0d10);
    let paintT = 0;
    let paint = 0;

    const onCar = (x: number, y: number) => {
      mv2.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
      RC.setFromCamera(mv2, camera);
      const activeMeshes = carRoot.children.filter((c) => c.visible);
      return RC.intersectObjects(activeMeshes, true).some((h) => {
        return !(h.object as THREE.Sprite).isSprite && h.object.type !== 'Line';
      });
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('a, button, input, select, textarea, label, summary, [role=button], .chip')) return;
      if (String(window.getSelection())) return;
      if (onCar(e.clientX, e.clientY)) {
        paintT = paintT ? 0 : 1;
        onPaintChange?.(paintT === 1);
      }
    };
    window.addEventListener('click', handleClick);

    // Animation loop
    let t0 = performance.now();
    const born = t0;
    let pS = getScrollProg();
    let pit = 0;
    let vs = 0;
    let ppx: number | null = null;
    let ppz = 0;

    const W0 = new THREE.Vector3();
    const W1 = new THREE.Vector3();
    const W2 = new THREE.Vector3();
    const WC0 = new THREE.Vector3();
    const WC1 = new THREE.Vector3();
    const WC2 = new THREE.Vector3();
    const WP0 = new THREE.Vector3();
    const WP1 = new THREE.Vector3();
    const WP2 = new THREE.Vector3();

    fortGroup.rotation.order = 'YZX';
    cretaGroup.rotation.order = 'YZX';
    poloGroup.rotation.order = 'YZX';

    let animId = 0;
    const frame = (now: number) => {
      animId = requestAnimationFrame(frame);
      const dt = Math.min((now - t0) / 1000, 0.05) || 0.016;
      t0 = now;
      const ie = reduce ? 1 : 1 - Math.pow(1 - Math.min((now - born) / 2800, 1), 3);

      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      // Smooth scroll progress interpolation
      const targetProg = getScrollProg();
      pS += (targetProg - pS) * (1 - Math.exp(-dt * (reduce ? 9 : 4.5)));

      const ar = window.innerWidth / window.innerHeight;

      // ── 1. Calculate Fortuner Position ──
      const uFort = currentMode === 1 || currentMode === 2 ? pS : pS;
      const uFort0 = uFort - 0.003;
      spot(uFort, W0);
      spot(uFort0, W1);
      spot(uFort0 + 0.006, W2);

      const distF = Math.hypot(W0.x - CB.position.x, CB.position.y, W0.z - CB.position.z);
      const yawF = Math.atan2(-(W2.z - W1.z), W2.x - W1.x) * ie;
      const pxF = W0.x - (1 - ie) * (10 + distF * 1.2);
      const pzF = W0.z;

      if (ppx === null) {
        ppx = pxF;
        ppz = pzF;
      }
      const ds = (pxF - ppx) * Math.cos(yawF) - (pzF - ppz) * Math.sin(yawF);
      ppx = pxF;
      ppz = pzF;

      const vp = ds / dt;
      vs += (vp - vs) * 0.08;
      pit += (cl((vp - vs) * 0.012, -0.035, 0.035) - pit) * 0.1;
      const scaleF = cl(cl((0.19 + 0.09 * ss(cl(pS, 0, 1))) * cl(1.45 / ar, 1, 2.4), 0, 0.9) * 0.688 * ar * (distF / 3.4), 0.45, 4);

      fortGroup.scale.setScalar(scaleF);
      fortGroup.position.set(pxF, reduce ? 0 : Math.sin(now / 90) * 0.004 * cl(Math.abs(vp), 0, 3), pzF);
      fortGroup.rotation.y = yawF + mx * 0.1;
      fortGroup.rotation.z = pit - mx * 0.02;

      // ── 2. Calculate Creta Position ──
      // In Convoy mode: trails slightly behind Fortuner with right lateral offset.
      // In Single mode (mode 1): occupies primary lead position.
      const uCreta = currentMode === 3 ? pS - 0.07 : pS;
      const uCreta0 = uCreta - 0.003;
      spot(uCreta, WC0);
      spot(uCreta0, WC1);
      spot(uCreta0 + 0.006, WC2);

      const distC = Math.hypot(WC0.x - CB.position.x, CB.position.y, WC0.z - CB.position.z);
      const yawC = Math.atan2(-(WC2.z - WC1.z), WC2.x - WC1.x) * ie;
      const rawPxC = WC0.x - (1 - ie) * (10 + distC * 1.2);
      const rawPzC = WC0.z;
      const latOffsetC = currentMode === 3 ? 0.75 : 0;
      const pxC = rawPxC - Math.sin(yawC) * latOffsetC;
      const pzC = rawPzC - Math.cos(yawC) * latOffsetC;

      const scaleC = cl(cl((0.18 + 0.08 * ss(cl(uCreta, 0, 1))) * cl(1.45 / ar, 1, 2.4), 0, 0.9) * 0.688 * ar * (distC / 3.4), 0.42, 3.8);
      cretaGroup.scale.setScalar(scaleC);
      cretaGroup.position.set(pxC, reduce ? 0 : Math.sin((now + 350) / 90) * 0.004 * cl(Math.abs(vp), 0, 3), pzC);
      cretaGroup.rotation.y = yawC + mx * 0.1;
      cretaGroup.rotation.z = pit - mx * 0.02;

      // ── 3. Calculate Polo Position ──
      // In Convoy mode: trails behind Creta with left lateral offset.
      // In Single mode (mode 2): occupies primary lead position.
      const uPolo = currentMode === 3 ? pS - 0.14 : pS;
      const uPolo0 = uPolo - 0.003;
      spot(uPolo, WP0);
      spot(uPolo0, WP1);
      spot(uPolo0 + 0.006, WP2);

      const distP = Math.hypot(WP0.x - CB.position.x, CB.position.y, WP0.z - CB.position.z);
      const yawP = Math.atan2(-(WP2.z - WP1.z), WP2.x - WP1.x) * ie;
      const rawPxP = WP0.x - (1 - ie) * (10 + distP * 1.2);
      const rawPzP = WP0.z;
      const latOffsetP = currentMode === 3 ? -0.75 : 0;
      const pxP = rawPxP - Math.sin(yawP) * latOffsetP;
      const pzP = rawPzP - Math.cos(yawP) * latOffsetP;

      const scaleP = cl(cl((0.17 + 0.07 * ss(cl(uPolo, 0, 1))) * cl(1.45 / ar, 1, 2.4), 0, 0.9) * 0.688 * ar * (distP / 3.4), 0.38, 3.6);
      poloGroup.scale.setScalar(scaleP);
      poloGroup.position.set(pxP, reduce ? 0 : Math.sin((now + 700) / 90) * 0.004 * cl(Math.abs(vp), 0, 3), pzP);
      poloGroup.rotation.y = yawP + mx * 0.1;
      poloGroup.rotation.z = pit - mx * 0.02;

      // Floor & lights follow primary focus
      const focusX = currentMode === 1 ? pxC : currentMode === 2 ? pxP : pxF;
      const focusZ = currentMode === 1 ? pzC : currentMode === 2 ? pzP : pzF;
      studioFloor.position.set(focusX, 0.004, focusZ);
      L2.position.set(focusX - 5, 2, focusZ - 4);
      L3.position.set(focusX + 5, 2, focusZ + 5);

      camera.position.set(CB.position.x + mx * 0.7, CB.position.y - my * 0.4, CB.position.z);
      camera.lookAt(0, CAM.ly, 0);

      // Roll wheels dynamically from distance moved
      const spinF = cl(ds / (0.34 * scaleF), -0.6, 0.6);
      const spinC = cl(ds / (0.32 * scaleC), -0.6, 0.6);
      const spinP = cl(ds / (0.292 * scaleP), -0.6, 0.6);
      fortWheels.forEach((w) => (w.rotation.z -= spinF));
      cretaWheels.forEach((w) => (w.rotation.z -= spinC));
      poloWheels.forEach((w) => (w.rotation.z -= spinP));

      // Hazard indicators sync
      const hv = reduce ? 0.8 : cl(Math.sin(now / 111.4) * 3 + 0.5, 0, 1);
      (
        [
          [hazardF, fortGroup.visible],
          [hazardC, cretaGroup.visible],
          [hazardP, poloGroup.visible],
        ] as [HazardSetup | null, boolean][]
      ).forEach(([h, on]) => {
        if (h) {
          const v = on ? hv : 0;
          const k = h.k || [1, 1, 1];
          h.m.emissiveIntensity = v * 2.2 * k[0];
          h.gm.opacity = v * (isDark ? 0.75 : 0.45) * k[1];
          h.l.forEach((l) => (l.intensity = v * 0.9 * k[2]));
        }
      });

      // Paint transition
      if (Math.abs(paintT - paint) > 0.002) {
        paint += (paintT - paint) * (1 - Math.exp(-dt * 7));
        body.color.copy(PW).lerp(PB, paint);
        body.roughness = 0.32 - 0.12 * paint;
        body.metalness = 0.1 + 0.25 * paint;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="c"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
