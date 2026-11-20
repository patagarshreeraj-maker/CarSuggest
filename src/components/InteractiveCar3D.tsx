import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface InteractiveCar3DProps {
  selectedCarIndex?: number;
  onCarSelect?: (index: number) => void;
  onPaintChange?: (isBlack: boolean) => void;
}

export const InteractiveCar3D: React.FC<InteractiveCar3DProps> = ({
  selectedCarIndex = 0,
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
    } catch (e) {
      console.warn('WebGL init failed', e);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 200);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x334466, 0.35));
    const L1 = new THREE.DirectionalLight(0xffffff, 0.8);
    L1.position.set(4, 8, 6);
    scene.add(L1);

    const L2 = new THREE.PointLight(0xffffff, 0.9, 40);
    L2.position.set(-5, 2, -4);
    scene.add(L2);

    const L3 = new THREE.PointLight(0xdbe6ff, 0.7, 40);
    L3.position.set(5, 2, 5);
    scene.add(L3);

    const car = new THREE.Group();
    scene.add(car);

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

    // Car materials
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
    const archM = new THREE.MeshBasicMaterial({ color: 0x050507 });
    const lamp = (c: number, n: number) =>
      new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: n, roughness: 0.2 });
    const bm = (c: number) => new THREE.MeshBasicMaterial({ color: c });

    const put = (g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
      const o = new THREE.Mesh(g, m);
      o.position.set(x, y, z);
      car.add(o);
      return o;
    };

    const ex = (draw: (p: THREE.Shape) => void, d: number, bs: number, bt: number) => {
      const sh = new THREE.Shape();
      draw(sh);
      const g = new THREE.ExtrudeGeometry(sh, {
        depth: d,
        bevelEnabled: true,
        bevelSize: bs,
        bevelThickness: bt,
        bevelSegments: 6,
        curveSegments: 14,
      });
      g.translate(0, 0, -d / 2);
      return g;
    };

    // Procedural baseline car body
    put(
      ex(
        (p) => {
          p.moveTo(-1.9, 0.35);
          p.lineTo(1.9, 0.35);
          p.quadraticCurveTo(2.05, 0.35, 2.05, 0.5);
          p.lineTo(2.05, 0.7);
          p.quadraticCurveTo(2.05, 0.85, 1.8, 0.87);
          p.lineTo(1.05, 0.93);
          p.lineTo(-1.75, 0.93);
          p.quadraticCurveTo(-2.05, 0.93, -2.05, 0.78);
          p.lineTo(-2.05, 0.5);
          p.quadraticCurveTo(-2.05, 0.35, -1.9, 0.35);
        },
        1.7,
        0.1,
        0.16
      ),
      body
    );

    put(
      ex(
        (p) => {
          p.moveTo(-1.6, 0.98);
          p.lineTo(-1.1, 1.55);
          p.quadraticCurveTo(-1, 1.62, -0.85, 1.62);
          p.lineTo(0.4, 1.63);
          p.quadraticCurveTo(0.55, 1.63, 0.65, 1.52);
          p.lineTo(1.15, 0.98);
        },
        1.36,
        0.03,
        0.04
      ),
      glassM
    );

    put(
      ex(
        (p) => {
          p.moveTo(-1.15, 1.55);
          p.lineTo(-0.9, 1.69);
          p.lineTo(0.45, 1.7);
          p.lineTo(0.72, 1.55);
        },
        1.4,
        0.05,
        0.06
      ),
      body
    );

    const pil = (x1: number, y1: number, x2: number, y2: number) =>
      [1, -1].forEach((sd) => {
        const m = put(
          new THREE.BoxGeometry(Math.hypot(x2 - x1, y2 - y1), 0.075, 0.09),
          body,
          (x1 + x2) / 2,
          (y1 + y2) / 2,
          sd * 0.73
        );
        m.rotation.z = Math.atan2(y2 - y1, x2 - x1);
      });
    pil(1.15, 0.98, 0.68, 1.55);
    pil(-1.6, 0.98, -1.12, 1.55);
    pil(-0.3, 0.98, -0.3, 1.6);

    put(new THREE.BoxGeometry(0.08, 0.12, 1.5), plastic, 2.1, 0.4, 0);
    put(new THREE.BoxGeometry(0.04, 0.2, 0.85), plastic, 2.14, 0.64, 0);
    put(new THREE.BoxGeometry(0.045, 0.025, 0.85), chrome, 2.14, 0.72, 0);
    put(new THREE.BoxGeometry(0.02, 0.13, 0.4), bm(0xf2f2ee), 2.17, 0.46, 0);
    put(new THREE.BoxGeometry(0.02, 0.14, 0.42), bm(0xf2f2ee), -2.17, 0.55, 0);
    put(new THREE.BoxGeometry(0.04, 0.04, 0.7), lamp(0xff1133, 1.6), -2.16, 0.84, 0);

    [1, -1].forEach((sd) => {
      put(new THREE.BoxGeometry(3.5, 0.13, 0.03), plastic, 0, 0.4, sd * 1.02);
      const hl = put(new THREE.SphereGeometry(0.2, 20, 12), lamp(0xfff4dd, 1.6), 2.08, 0.84, sd * 0.63);
      hl.scale.set(0.35, 0.5, 2.1);
      put(new THREE.BoxGeometry(0.03, 0.02, 0.46), lamp(0xffffff, 2), 2.15, 0.76, sd * 0.63);
      const tl = put(new THREE.SphereGeometry(0.2, 20, 12), lamp(0xff1133, 2.2), -2.12, 0.84, sd * 0.64);
      tl.scale.set(0.3, 0.45, 2);
      const mr = put(new THREE.SphereGeometry(0.1, 16, 10), body, 0.78, 1.12, sd * 0.84);
      mr.scale.set(1.1, 0.7, 1.5);
      put(new THREE.BoxGeometry(0.05, 0.04, 0.12), plastic, 0.78, 1.1, sd * 0.77);
      [0.95, -0.3, -1.45].forEach((x) => put(new THREE.BoxGeometry(0.012, 0.55, 0.01), bm(0x07080a), x, 0.66, sd * 1.02));
      [-0.1, -1.25].forEach((x) => put(new THREE.BoxGeometry(0.18, 0.025, 0.03), chrome, x, 0.86, sd * 1.025));
    });

    const tireM = new THREE.MeshStandardMaterial({ color: 0x121216, roughness: 0.9 });
    const tireG = new THREE.LatheGeometry(
      [
        [0.29, -0.15],
        [0.38, -0.16],
        [0.435, -0.12],
        [0.45, 0],
        [0.435, 0.12],
        [0.38, 0.16],
        [0.29, 0.15],
      ].map((q) => new THREE.Vector2(q[0], q[1])),
      40
    );
    tireG.rotateX(Math.PI / 2);

    const wheels: THREE.Object3D[] = [];
    [
      [1.3, 0.88],
      [1.3, -0.88],
      [-1.3, 0.88],
      [-1.3, -0.88],
    ].forEach((q) => {
      const w = new THREE.Group();
      const side = Math.sign(q[1]);
      w.add(new THREE.Mesh(tireG, tireM));
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32), plastic);
      barrel.rotation.x = Math.PI / 2;
      w.add(barrel);
      const face = new THREE.Group();
      face.position.z = side * 0.13;
      face.add(new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.024, 8, 40), chrome));
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 20), chrome);
      hub.rotation.x = Math.PI / 2;
      face.add(hub);
      for (let n = 0; n < 6; n++) {
        const pv = new THREE.Group();
        pv.rotation.z = (n * Math.PI) / 3;
        const spk = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.24, 0.03), chrome);
        spk.position.y = 0.16;
        pv.add(spk);
        face.add(pv);
      }
      w.add(face);
      w.position.set(q[0], 0.45, q[1]);
      car.add(w);
      wheels.push(w);
      const arch = put(new THREE.CircleGeometry(0.48, 32, 0, Math.PI), archM, q[0], 0.45, side * 1.02);
      if (side < 0) arch.rotation.y = Math.PI;
    });

    // Shadow
    const shC = document.createElement('canvas');
    shC.width = shC.height = 128;
    const shG = shC.getContext('2d');
    if (shG) {
      const shR = shG.createRadialGradient(64, 64, 4, 64, 64, 64);
      shR.addColorStop(0, 'rgba(0,0,0,.55)');
      shR.addColorStop(1, 'rgba(0,0,0,0)');
      shG.fillStyle = shR;
      shG.fillRect(0, 0, 128, 128);
    }
    const shadow = put(
      new THREE.PlaneGeometry(6, 3.4),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shC), transparent: true, depthWrite: false }),
      0,
      0.015,
      0
    );
    shadow.rotation.x = -Math.PI / 2;

    // Floor highlight
    const flC = document.createElement('canvas');
    flC.width = flC.height = 256;
    const flX = flC.getContext('2d');
    if (flX) {
      const flG = flX.createRadialGradient(128, 128, 0, 128, 128, 128);
      flG.addColorStop(0, isDark ? 'rgba(120,145,190,.30)' : 'rgba(255,255,255,.9)');
      flG.addColorStop(0.55, isDark ? 'rgba(120,145,190,.10)' : 'rgba(255,255,255,.35)');
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

    // Hazard light interface
    interface HazardSetup {
      m: THREE.MeshStandardMaterial;
      gm: THREE.SpriteMaterial;
      l: THREE.PointLight[];
      k?: [number, number, number];
    }

    let hazard: HazardSetup | null = null;
    let hazC: HazardSetup | null = null;
    let hazP: HazardSetup | null = null;

    let fort: THREE.Group | null = null;
    let crt: THREE.Group | null = null;
    let plo: THREE.Group | null = null;

    let sel = 0;
    let fw: THREE.Object3D[] = [];
    let cw: THREE.Object3D[] = [];
    let pw: THREE.Object3D[] = [];

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

    const loader = new GLTFLoader();
    const proc = car.children.filter((o) => o !== shadow);

    // Load Toyota Fortuner (model 0)
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
        proc.forEach((o) => (o.visible = false));
        wheels.length = 0;
        g.scene.traverse((o) => {
          if (/^wheel/.test(o.name)) wheels.push(o);
        });
        fw = wheels.slice();
        fort = g.scene;
        fort.visible = sel === 0;
        car.add(fort);

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
          car.add(sp3);
        });
        const hf = new THREE.PointLight(0xffa000, 0, 4);
        const hr = new THREE.PointLight(0xffa000, 0, 4);
        hf.position.set(2.3, 0.55, 0);
        hr.position.set(-2.3, 1, 0);
        car.add(hf, hr);
        hazard = { m: amber, gm, l: [hf, hr] };
      },
      undefined,
      (e) => console.warn('Fortuner model load notice', e)
    );

    // Function to load Hyundai Creta (model 1)
    const loadCreta = () => {
      if (crt) return;
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
          cw = [];
          g.scene.traverse((o) => {
            if (/^wheel/.test(o.name)) cw.push(o);
          });
          crt = g.scene;
          crt.visible = sel === 1;
          car.add(crt);

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
            car.add(sp);
          });
          const hf = new THREE.PointLight(0xffa000, 0, 4);
          const hr = new THREE.PointLight(0xffa000, 0, 4);
          hf.position.set(2.05, 0.55, 0);
          hr.position.set(-2.05, 1, 0);
          car.add(hf, hr);
          hazC = { m: amberC, gm, l: [hf, hr], k: [0.4, 0.45, 0.35] };

          if (sel === 1) {
            wheels.length = 0;
            wheels.push(...cw);
          }
        },
        undefined,
        (e) => console.warn('Creta model notice', e)
      );
    };

    // Function to load Volkswagen Polo (model 2)
    const loadPolo = () => {
      if (plo) return;
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
          pw = [];
          g.scene.traverse((o) => {
            if (/^wheel/.test(o.name)) pw.push(o);
          });
          plo = g.scene;
          plo.visible = sel === 2;
          car.add(plo);

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
            car.add(sp);
          });
          const hf = new THREE.PointLight(0xffa000, 0, 4);
          const hr = new THREE.PointLight(0xffa000, 0, 4);
          hf.position.set(1.95, 0.6, 0);
          hr.position.set(-1.95, 0.8, 0);
          car.add(hf, hr);
          hazP = { m: amberP, gm, l: [hf, hr], k: [0.4, 0.45, 0.35] };

          if (sel === 2) {
            wheels.length = 0;
            wheels.push(...pw);
          }
        },
        undefined,
        (e) => console.warn('Polo model notice', e)
      );
    };

    const setCar = (i: number) => {
      sel = i;
      if (i === 1 && !crt) loadCreta();
      if (i === 2 && !plo) loadPolo();

      if (fort) fort.visible = i === 0;
      if (crt) crt.visible = i === 1;
      if (plo) plo.visible = i === 2;

      wheels.length = 0;
      wheels.push(...(i === 2 ? pw : i === 1 ? cw : fw));
      onCarSelect?.(i);
    };

    setCarFnRef.current = setCar;
    if (selectedCarIndex !== 0) setCar(selectedCarIndex);

    // Preload remaining models smoothly in the background
    const preloadTimer = setTimeout(() => {
      loadCreta();
      loadPolo();
    }, 1500);

    // Scroll driving path calculation
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

    const curve = (u: number): [number, number] => {
      const n = PTS.length - 1;
      const f = cl(u, 0, 1) * n;
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

    const prog = () => {
      const goE = document.getElementById('go');
      const maxScroll = Math.max(
        1,
        (goE ? goE.offsetTop + goE.offsetHeight : document.documentElement.scrollHeight) - window.innerHeight
      );
      return cl(window.scrollY / maxScroll, 0, 1);
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
      return RC.intersectObjects(
        car.children.filter((o) => o.visible),
        true
      ).some((h) => {
        if ((h.object as THREE.Sprite).isSprite || h.object === shadow) return false;
        for (let o: THREE.Object3D | null = h.object; o; o = o.parent) {
          if (!o.visible) return false;
        }
        return true;
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
    let pS = prog();
    let pit = 0;
    let vs = 0;
    let ppx: number | null = null;
    let ppz = 0;
    const W0 = new THREE.Vector3();
    const W1 = new THREE.Vector3();
    const W2 = new THREE.Vector3();
    car.rotation.order = 'YZX';

    let animId = 0;
    const frame = (now: number) => {
      animId = requestAnimationFrame(frame);
      const dt = Math.min((now - t0) / 1000, 0.05) || 0.016;
      t0 = now;
      const ie = reduce ? 1 : 1 - Math.pow(1 - Math.min((now - born) / 2800, 1), 3);

      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      const pr = prog();
      pS += (pr - pS) * (1 - Math.exp(-dt * (reduce ? 9 : 4.5)));
      const u0 = cl(pS - 0.003, 0, 0.994);
      spot(pS, W0);
      spot(u0, W1);
      spot(u0 + 0.006, W2);

      const ar = window.innerWidth / window.innerHeight;
      const dist = Math.hypot(W0.x - CB.position.x, CB.position.y, W0.z - CB.position.z);
      const yaw = Math.atan2(-(W2.z - W1.z), W2.x - W1.x) * ie;
      const px = W0.x - (1 - ie) * (10 + dist * 1.2);
      const pz = W0.z;

      if (ppx === null) {
        ppx = px;
        ppz = pz;
      }
      const ds = (px - ppx) * Math.cos(yaw) - (pz - ppz) * Math.sin(yaw);
      ppx = px;
      ppz = pz;

      const vp = ds / dt;
      vs += (vp - vs) * 0.08;
      pit += (cl((vp - vs) * 0.012, -0.035, 0.035) - pit) * 0.1;
      const sc = cl(cl((0.19 + 0.09 * ss(pS)) * cl(1.45 / ar, 1, 2.4), 0, 0.9) * 0.688 * ar * (dist / 3.4), 0.45, 4);
      car.scale.setScalar(sc);
      car.position.set(px, reduce ? 0 : Math.sin(now / 90) * 0.004 * cl(Math.abs(vp), 0, 3), pz);
      car.rotation.y = yaw + mx * 0.1;
      car.rotation.z = pit - mx * 0.02;
      car.rotation.x = 0;

      studioFloor.position.set(px, 0.004, pz);
      L2.position.set(px - 5, 2, pz - 4);
      L3.position.set(px + 5, 2, pz + 5);

      camera.position.set(CB.position.x + mx * 0.7, CB.position.y - my * 0.4, CB.position.z);
      camera.lookAt(0, CAM.ly, 0);

      // Roll wheels based on distance traveled
      const spin = cl(ds / ((sel === 2 ? 0.292 : 0.34) * sc), -0.6, 0.6);
      wheels.forEach((w) => (w.rotation.z -= spin));

      // Hazard indicators
      const hv = reduce ? 0.8 : cl(Math.sin(now / 111.4) * 3 + 0.5, 0, 1);
      (
        [
          [hazard, sel === 0],
          [hazC, sel === 1],
          [hazP, sel === 2],
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
      clearTimeout(preloadTimer);
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
