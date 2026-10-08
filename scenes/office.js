/**
 * 3D open-plan office environment (Three.js).
 * One persistent scene; the "three environments" from the design are camera
 * contexts inside it: office view, monitor close-up, hardware close-up.
 * All geometry is procedural (no external models) so the package stays tiny.
 */
import * as THREE from '../lib/three.module.min.js';
import { a11y } from '../js/accessibility.js';

const VIEWS = {
  establish: { pos: [6.8, 4.2, 8.5], look: [0, 0.8, -1.3] },
  office:    { pos: [1.6, 1.7, 0.9], look: [-1.3, 1.0, -3.0] },
  monitor:   { pos: [-1.35, 1.28, -1.62], look: [-1.35, 1.22, -3.0] },
  phone:     { pos: [-0.55, 1.35, -1.85], look: [-0.62, 0.86, -2.95] },
  hardware:  { pos: [-2.35, 1.25, -1.9], look: [-2.05, 0.78, -3.2] },
  cleanpc:   { pos: [1.9, 1.3, -1.75], look: [1.9, 1.05, -3.05] },
};

function mat(color, { rough = .85, metal = .05, emissive = 0x000000, emissiveIntensity = 0 } = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, emissive, emissiveIntensity });
}

function makeCarpetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#78808a'; ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 16) {
    ctx.fillStyle = y % 32 ? 'rgba(255,255,255,.035)' : 'rgba(15,23,42,.045)';
    ctx.fillRect(0, y, 256, 8);
  }
  for (let i = 0; i < 950; i++) {
    ctx.fillStyle = i % 3 ? 'rgba(235,239,244,.12)' : 'rgba(24,34,48,.10)';
    ctx.fillRect((i * 73) % 256, (i * 139) % 256, 1, 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(9, 7);
  return texture;
}

function makeWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const wood = ctx.createLinearGradient(0, 0, 0, 128);
  wood.addColorStop(0, '#9a744f'); wood.addColorStop(.48, '#b18a61'); wood.addColorStop(1, '#79583c');
  ctx.fillStyle = wood; ctx.fillRect(0, 0, 512, 128);
  for (let i = 0; i < 28; i++) {
    const y = (i * 37) % 128;
    ctx.strokeStyle = i % 4 ? 'rgba(77,48,28,.10)' : 'rgba(239,207,159,.16)';
    ctx.lineWidth = i % 5 === 0 ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(0, y);
    ctx.bezierCurveTo(140, y + (i % 2 ? 4 : -4), 340, y - (i % 3), 512, y + 2);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.5, 1);
  return texture;
}

function makeWindowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 320;
  const ctx = canvas.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#b9d7ee'); sky.addColorStop(.62, '#edf2ed'); sky.addColorStop(1, '#e0c9a6');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  for (const [x, y, r] of [[94, 62, 32], [126, 60, 25], [345, 83, 30], [372, 80, 22]]) {
    ctx.beginPath(); ctx.ellipse(x, y, r, r * .35, 0, 0, Math.PI * 2); ctx.fill();
  }
  const buildings = [
    [0, 143, 72, 105, '#738797'], [62, 119, 88, 129, '#8a9baa'],
    [142, 158, 60, 90, '#677c8d'], [195, 105, 93, 143, '#8294a1'],
    [282, 135, 67, 113, '#6a7d8a'], [341, 122, 75, 126, '#91a0a7'],
    [408, 154, 65, 94, '#728696'], [466, 112, 68, 136, '#8596a0'],
  ];
  buildings.forEach(([x, y, w, h, color], b) => {
    ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(34,49,64,.28)';
    for (let wx = x + 5; wx < x + w; wx += 19) ctx.fillRect(wx, y, 2, h);
    ctx.fillStyle = 'rgba(246,220,161,.62)';
    for (let wx = x + 8; wx < x + w - 5; wx += 16) {
      for (let wy = y + 10; wy < y + h - 5; wy += 18) {
        if ((wx + wy + b) % 3) ctx.fillRect(wx, wy, 7, 9);
      }
    }
  });
  // A street-level café and neighboring shopfronts sit below the office skyline.
  ctx.fillStyle = '#d9c8ae'; ctx.fillRect(160, 205, 175, 52);
  ctx.fillStyle = '#7b4937'; ctx.fillRect(172, 211, 151, 13);
  ctx.fillStyle = '#f5e7cf'; ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('NORTHSTAR CAFÉ', 247, 221);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 ? '#f6eee0' : '#b66a4b';
    ctx.fillRect(168 + i * 16, 226, 16, 8);
  }
  ctx.fillStyle = '#8bb1ba'; ctx.fillRect(176, 239, 56, 18); ctx.fillRect(240, 239, 54, 18);
  ctx.strokeStyle = '#f0d4aa'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(202, 239); ctx.lineTo(202, 257); ctx.moveTo(266, 239); ctx.lineTo(266, 257); ctx.stroke();
  ctx.fillStyle = '#544c48'; ctx.fillRect(299, 233, 22, 24);
  ctx.fillStyle = '#d5c4ab'; ctx.fillRect(0, 250, 512, 12);
  ctx.fillStyle = '#8d9699'; ctx.fillRect(0, 262, 512, 5);
  ctx.fillStyle = '#303941'; ctx.fillRect(0, 267, 512, 53);
  ctx.fillStyle = 'rgba(228,220,190,.56)'; ctx.fillRect(0, 291, 512, 2);
  ctx.fillRect(24, 312, 86, 3); ctx.fillRect(402, 312, 86, 3);
  // Zebra crossing, seen at an angle across the foreground road.
  ctx.save(); ctx.translate(286, 274); ctx.rotate(-.12);
  ctx.fillStyle = 'rgba(244,244,232,.9)';
  for (let i = 0; i < 8; i++) ctx.fillRect(i * 27, 0, 15, 46);
  ctx.restore();
  // Compact parked car and streetlamp make the street read at window scale.
  ctx.fillStyle = '#273b4b'; ctx.fillRect(46, 253, 66, 17);
  ctx.fillStyle = '#374e60'; ctx.beginPath(); ctx.roundRect(56, 244, 43, 15, 5); ctx.fill();
  ctx.fillStyle = '#a8c8d2'; ctx.fillRect(62, 247, 13, 8); ctx.fillRect(79, 247, 13, 8);
  ctx.fillStyle = '#171f29';
  for (const x of [60, 98]) { ctx.beginPath(); ctx.arc(x, 270, 6, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = '#455562'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(386, 184); ctx.lineTo(386, 262); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(386, 184); ctx.lineTo(402, 184); ctx.stroke();
  ctx.fillStyle = '#f5e7b2'; ctx.beginPath(); ctx.ellipse(401, 187, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const M = {
  deskWood: () => mat(0x9a7b5a, { rough: .7 }),
  deskLeg: () => mat(0x3c4658, { rough: .5, metal: .4 }),
  wall: () => mat(0xdfe3ea, { rough: .95 }),
  floor: () => mat(0x9aa3b2, { rough: .95 }),
  dark: () => mat(0x111827, { rough: .6 }),
  plastic: () => mat(0x2b3444, { rough: .55 }),
  plasticL: () => mat(0xd7dce5, { rough: .6 }),
  screenOff: () => new THREE.MeshBasicMaterial({ color: 0x05070d }),
};

export class Env3D {
  constructor(canvas, interactionSystem) {
    this.mode = '3d';
    this.canvas = canvas;
    this.sys = interactionSystem;
    this.onActivate = (id) => interactionSystem.activate(id);
    this.interactiveMeshes = [];
    this._hoverMesh = null;
    this.interactionHighlights = {};
    this.draggableObjects = [];
    this._dragObject = null;
    this._dragOffset = new THREE.Vector3();
    this._orbitTarget = new THREE.Vector3(...VIEWS.establish.look);
    this._orbitSpherical = new THREE.Spherical();
    this._orbiting = false;
    this._orbitMoved = false;
    this._activeView = 'establish';
    this._suppressClick = false;
    this._camTween = null;
    this._shakeAmp = 0;
    this._ringing = false;
    this._clock = new THREE.Clock();
    this._disposed = false;
  }

  init() {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e1626);
    this.scene.fog = new THREE.Fog(0x0e1626, 14, 34);

    this.camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 60);
    this.camera.position.set(...VIEWS.establish.pos);
    this.camera.lookAt(new THREE.Vector3(...VIEWS.establish.look));
    this._lastLook = new THREE.Vector3(...VIEWS.establish.look);
    this._camLook = this._lastLook.clone();

    this._buildLights();
    this._buildRoom();
    this._buildAliceStation();
    this._buildCleanStation();
    this._buildBackground();
    this._buildOfficeProps();
    this._bindPointer();

    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
    this.resize();
    this._paintScreens();
    renderer.setAnimationLoop(() => this._frame());
    return this;
  }

  dispose() {
    this._disposed = true;
    this.renderer?.setAnimationLoop(null);
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('pointermove', this._pointerMove);
    this.canvas.removeEventListener('pointerdown', this._pointerDown);
    this.canvas.removeEventListener('pointerup', this._pointerUp);
    this.canvas.removeEventListener('pointercancel', this._pointerCancel);
    this.canvas.removeEventListener('click', this._pointerClick);
    this.canvas.removeEventListener('pointerleave', this._pointerLeave);
    this.canvas.removeEventListener('wheel', this._wheel);
    this.canvas.removeEventListener('keydown', this._keyDown);
    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();
    this.scene?.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      for (const material of (Array.isArray(object.material) ? object.material : [object.material])) {
        if (!material) continue;
        materials.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    this.renderer?.dispose();
  }

  /* ================= building ================= */

  _buildLights() {
    const hemi = new THREE.HemisphereLight(0xdfe8ff, 0x3a4252, 0.75);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff2dd, 1.15);
    sun.position.set(-3.5, 5.5, -5.8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -8; sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8; sun.shadow.camera.bottom = -8;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun);

    const fill = new THREE.PointLight(0xcfe0ff, 18, 16, 1.8);
    fill.position.set(-3, 3.4, 2.5);
    this.scene.add(fill);

    // Glow in front of the primary monitor — recolored as the story unfolds.
    this.monitorGlow = new THREE.PointLight(0x2dd4bf, 7, 4.5, 2);
    this.monitorGlow.position.set(-1.35, 1.3, -2.2);
    this.scene.add(this.monitorGlow);
  }

  _box(w, h, d, material, x, y, z, { cast = true, receive = true } = {}) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    this.scene.add(mesh);
    return mesh;
  }

  _buildRoom() {
    const floorMaterial = M.floor();
    floorMaterial.map = makeCarpetTexture();
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(15, 11), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const wallMat = M.wall();
    const back = this._box(15, 3.6, 0.2, wallMat, 0, 1.8, -5.4, { cast: false });
    this._box(0.2, 3.6, 11, wallMat, -7.6, 1.8, 0, { cast: false });
    this._box(0.2, 3.6, 11, wallMat, 7.6, 1.8, 0, { cast: false });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(15, 11), mat(0xc9d2df));
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 3.6;
    this.scene.add(ceiling);

    // Windows along the back wall with bright panes and thin frames.
    const paneMat = new THREE.MeshBasicMaterial({ map: makeWindowTexture() });
    const frameMat = mat(0xaeb8c8, { rough: .5, metal: .3 });
    for (let i = -1; i <= 1; i++) {
      const cx = i * 4.6;
      this._box(3.6, 2.3, 0.06, paneMat, cx, 1.8, -5.31, { cast: false, receive: false });
      this._box(3.8, 0.12, 0.14, frameMat, cx, 2.98, -5.28, { cast: false });
      this._box(3.8, 0.12, 0.14, frameMat, cx, 0.62, -5.28, { cast: false });
      this._box(0.12, 2.5, 0.14, frameMat, cx - 1.85, 1.8, -5.28, { cast: false });
      this._box(0.12, 2.5, 0.14, frameMat, cx + 1.85, 1.8, -5.28, { cast: false });
      this._box(3.8, 0.06, 0.12, frameMat, cx, 1.8, -5.27, { cast: false });
      this._box(0.055, 2.25, 0.09, frameMat, cx, 1.8, -5.25, { cast: false });
    }

    // Ceiling light panels (emissive slabs).
    for (const [x, z] of [[-4, -2], [0, -2], [4, -2], [-4, 1.5], [0, 1.5], [4, 1.5]]) {
      this._box(1.7, 0.06, 0.55, new THREE.MeshBasicMaterial({ color: 0xf3f7ff }), x, 3.55, z, { cast: false, receive: false });
    }

    // Wall décor: whiteboard + clock.
    const board = this._box(2.4, 1.3, 0.06, mat(0xf4f7fb), 4.2, 1.9, -5.32, { cast: false });
    this._box(2.5, 0.08, 0.1, mat(0x8a94a8), 4.2, 2.6, -5.31, { cast: false });
    this._box(2.5, 0.08, 0.1, mat(0x8a94a8), 4.2, 1.2, -5.31, { cast: false });
    for (let i = 0; i < 5; i++) {
      this._box(.7, .012, .012, mat(i % 2 ? 0x3b82f6 : 0x16a34a), 3.45 + i * .34, 2.28 - (i % 2) * .18, -5.265, { cast: false, receive: false });
    }
    this._box(14.8, .12, .12, mat(0xb6bec9, { rough: .55 }), 0, .08, -5.25, { cast: false });
    this._box(.12, .12, 10.8, mat(0xb6bec9, { rough: .55 }), -7.45, .08, 0, { cast: false });
    const clockRim = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .05, 24), mat(0x334155, { metal: .4, rough: .4 }));
    clockRim.rotation.x = Math.PI / 2;
    clockRim.position.set(-7.47, 2.2, 0);
    this.scene.add(clockRim);
    const clockFace = new THREE.Mesh(new THREE.CircleGeometry(.2, 24), new THREE.MeshBasicMaterial({ color: 0xf8fafc }));
    clockFace.position.set(-7.43, 2.2, 0);
    clockFace.rotation.y = Math.PI / 2;
    this.scene.add(clockFace);
  }

  _deskUnit(x, z, w = 2.0, d = .85) {
    const top = this._box(w, .05, d, this._deskMaterial(), x, .74, z);
    this._box(.05, .72, d - .1, M.deskLeg(), x - w / 2 + .08, .37, z);
    this._box(.05, .72, d - .1, M.deskLeg(), x + w / 2 - .08, .37, z);
    this._box(w - .3, .35, .04, M.plasticL(), x, .5, z - d / 2 + .05); // modesty panel
    return top;
  }

  _deskMaterial() {
    if (!this._deskSurfaceMaterial) {
      this._deskSurfaceMaterial = mat(0xffffff, { rough: .62 });
      this._deskSurfaceMaterial.map = makeWoodTexture();
    }
    return this._deskSurfaceMaterial;
  }

  _monitorUnit(x, z, screenW = .62, facing = 0) {
    const g = new THREE.Group();
    g.position.set(x, .765, z);
    g.rotation.y = facing;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.11, .13, .02, 20), M.plastic());
    base.position.y = .01;
    const neck = new THREE.Mesh(new THREE.BoxGeometry(.05, .3, .05), M.plastic());
    neck.position.y = .16;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(screenW + .05, screenW * .56 + .05, .04), M.plastic());
    frame.position.set(0, .44, .01);
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 288;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    if (facing) {
      // Rear-row monitors face the opposite direction. Flip the canvas UVs
      // so its text remains readable from the seated coworker's side.
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;
      texture.offset.x = 1;
    }
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(screenW, screenW * .56), new THREE.MeshBasicMaterial({ map: texture }));
    screen.position.set(0, .44, .035);
    const webcam = new THREE.Mesh(new THREE.SphereGeometry(.012, 10, 8), mat(0x111827, { metal: .3, rough: .25 }));
    webcam.position.set(0, .44 + screenW * .28 + .012, .036);
    for (const part of [base, neck, frame, webcam]) { part.castShadow = true; g.add(part); }
    g.add(screen);
    this.scene.add(g);
    return { group: g, frame, screen, canvas, texture };
  }

  _keyboardUnit(x, z) {
    const base = this._box(.49, .025, .17, M.plastic(), x, .78, z);
    const keyMat = mat(0xcbd5e1, { rough: .55 });
    const keyDark = mat(0x94a3b8, { rough: .6 });
    for (let row = 0; row < 4; row++) {
      const count = row === 3 ? 8 : 13;
      const gap = .006;
      const keyW = row === 3 ? .038 : .029;
      const totalW = count * keyW + (count - 1) * gap;
      for (let col = 0; col < count; col++) {
        const key = new THREE.Mesh(
          new THREE.BoxGeometry(keyW, .008, .024),
          row === 0 && col === count - 1 ? keyDark : keyMat
        );
        key.position.set(x - totalW / 2 + col * (keyW + gap) + keyW / 2, .797, z - .058 + row * .034);
        key.castShadow = true;
        this.scene.add(key);
      }
    }
    base.castShadow = true;
    return base;
  }

  _mouseUnit(x, z) {
    const shell = new THREE.Mesh(new THREE.SphereGeometry(.055, 18, 14), M.plasticL());
    shell.position.set(x, .795, z);
    shell.scale.set(.72, .27, 1.15);
    shell.castShadow = true;
    this.scene.add(shell);
    const wheel = this._box(.012, .008, .025, M.plastic(), x, .81, z - .01, { cast: false });
    return { shell, wheel };
  }

  _mugUnit(x, z) {
    const ceramic = mat(0xe2e8f0, { rough: .28 });
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(.045, .038, .105, 20, 1, true), ceramic);
    cup.position.set(x, .82, z);
    cup.castShadow = true;
    this.scene.add(cup);
    const inside = new THREE.Mesh(new THREE.CircleGeometry(.038, 20), mat(0x3f3328, { rough: .3 }));
    inside.rotation.x = -Math.PI / 2;
    inside.position.set(x, .873, z);
    this.scene.add(inside);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(.035, .009, 8, 18), ceramic);
    handle.position.set(x + .05, .83, z);
    handle.rotation.x = Math.PI / 2;
    this.scene.add(handle);
    return cup;
  }

  _paperStack(x, z) {
    const sheetMat = mat(0xf1f5f9, { rough: .92 });
    for (let i = 0; i < 3; i++) {
      const sheet = this._box(.28, .006, .34, sheetMat, x, .78 + i * .008, z, { cast: false });
      sheet.rotation.y = (i - 1) * .035;
    }
    const ink = mat(0x94a3b8, { rough: .9 });
    for (let i = 0; i < 4; i++) {
      this._box(.17 + (i % 2) * .04, .0015, .003, ink, x - .035, .805, z - .105 + i * .045, { cast: false, receive: false });
    }
  }

  _deskPlant(x, z) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(.075, .06, .12, 16), mat(0x9a5f46, { rough: .82 }));
    pot.position.set(x, .84, z);
    pot.castShadow = true;
    this.scene.add(pot);
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 10), mat(i % 2 ? 0x43875a : 0x2f7049, { rough: .9 }));
      const angle = (i / 5) * Math.PI * 2;
      leaf.position.set(x + Math.cos(angle) * .055, .98 + (i % 2) * .035, z + Math.sin(angle) * .055);
      leaf.scale.set(.42, 1.7, .5);
      leaf.rotation.z = Math.cos(angle) * .35;
      leaf.rotation.x = Math.sin(angle) * .35;
      leaf.castShadow = true;
      this.scene.add(leaf);
    }
  }

  _buildAliceStation() {
    this._deskUnit(-1.35, -3.1);
    this.chair = this._chairUnit(-1.25, -2.25, Math.PI, true);

    this.workstation = this._monitorUnit(-1.35, -3.32);

    // Keyboard, mouse, personal desk items, dock and phone.
    this._keyboardUnit(-1.42, -2.86);
    this._mouseUnit(-1.05, -2.86);
    this._paperStack(-.9, -2.72);
    this._mugUnit(-.62, -3.35);
    this._deskPlant(-.48, -3.34);
    for (const [x, y] of [[-1.95, .57], [-1.95, .39]]) {
      this._box(.58, .13, .58, mat(0x806548, { rough: .72 }), x, y, -3.08);
      this._box(.10, .018, .025, mat(0xc2a77f, { metal: .35, rough: .4 }), x, y, -2.78, { cast: false });
    }
    this._box(.17, .012, .13, mat(0xf3e6aa, { rough: .95 }), -.78, .78, -3.45, { cast: false });
    const dock = this._box(.34, .06, .22, M.plastic(), -2.0, .8, -3.05);
    this.dock = dock;
    const led = this._box(.03, .012, .03, new THREE.MeshBasicMaterial({ color: 0x2dd4bf }), -2.0, .833, -3.14, { cast: false, receive: false });
    this.dockLed = led;

    // Phone: small slab with emissive face; sits top-right of desk.
    const phoneG = new THREE.Group();
    phoneG.position.set(-0.62, .79, -2.95);
    const body = new THREE.Mesh(new THREE.BoxGeometry(.09, .015, .18), M.plastic());
    this.phoneScreenCanvas = document.createElement('canvas');
    this.phoneScreenCanvas.width = 256;
    this.phoneScreenCanvas.height = 512;
    this.phoneScreenTexture = new THREE.CanvasTexture(this.phoneScreenCanvas);
    this.phoneScreenTexture.colorSpace = THREE.SRGBColorSpace;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(.075, .16), new THREE.MeshBasicMaterial({ map: this.phoneScreenTexture }));
    face.rotation.x = -Math.PI / 2;
    face.position.y = .008;
    this._paintPhoneScreen(false);
    phoneG.add(body, face);
    body.castShadow = true;
    this.scene.add(phoneG);
    this.phone = phoneG;

    // Ethernet cable: dock → desk edge → floor port. Two variants, one visible.
    this.cablePlugged = this._cable(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.0, .80, -2.95),
        new THREE.Vector3(-2.05, .74, -2.55),
        new THREE.Vector3(-2.2, .06, -2.35),
        new THREE.Vector3(-2.32, .02, -2.5),
      ])
    );
    this.cableUnplugged = this._cable(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.0, .80, -2.95),
        new THREE.Vector3(-2.06, .55, -2.85),
        new THREE.Vector3(-2.05, .12, -2.9),
      ])
    );
    this.cableUnplugged.visible = false;

    // Floor network port the cable runs to.
    const port = this._box(.16, .04, .16, M.plastic(), -2.34, .02, -2.52, { cast: false });
    this.portLed = this._box(.05, .015, .05, new THREE.MeshBasicMaterial({ color: 0x4ade80 }), -2.34, .045, -2.52, { cast: false, receive: false });

    // Power button on the dock (glows soft white).
    this.powerBtn = this._box(.05, .012, .05, new THREE.MeshBasicMaterial({ color: 0xf8fafc }), -1.92, .833, -3.05, { cast: false, receive: false });

    // Invisible, enlarged targets make the important desk objects practical to
    // pick from the office camera, including on touch screens.
    this.interactMeshes = {
      // Cover the bezel and screen plane with a little depth tolerance so the
      // monitor remains easy to pick at different aspect ratios and angles.
      monitor: this._hitTarget('monitor', 1.65, 1.08, .72, -1.35, 1.2, -3.08),
      phone: this._hitTarget('phone', .34, .22, .38, -.62, .84, -2.95),
      cable: this._hitTarget('cable', .34, .86, .32, -2.12, .43, -2.72),
      power_button: this._hitTarget('power_button', .26, .24, .26, -1.92, .86, -3.05),
    };
  }

  _hitTarget(id, w, h, d, x, y, z) {
    const target = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshBasicMaterial({
        color: 0x2dd4bf, transparent: true, opacity: 0,
        colorWrite: false,
        depthWrite: false, side: THREE.DoubleSide,
      })
    );
    target.position.set(x, y, z);
    this.scene.add(target);

    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(target.geometry),
      new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: .9 })
    );
    outline.position.copy(target.position);
    outline.visible = false;
    outline.userData.objectId = id;
    this.scene.add(outline);
    this.interactionHighlights[id] = outline;
    return target;
  }

  _cable(curve) {
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, .012, 8), mat(0x1f2937, { rough: .5 }));
    tube.castShadow = true;
    const tip = new THREE.Mesh(new THREE.BoxGeometry(.03, .03, .05), M.plasticL());
    tip.position.copy(curve.getPoint(0));
    const grp = new THREE.Group();
    grp.add(tube, tip);
    this.scene.add(grp);
    return grp;
  }

  _chairUnit(x, z, rot, movable = false) {
    const g = new THREE.Group();
    const upholstery = mat(0x33445a, { rough: .82 });
    const seat = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), upholstery);
    seat.scale.set(.26, .075, .24);
    seat.position.y = .48;
    const back = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), upholstery);
    back.scale.set(.245, .31, .075);
    back.position.set(0, .81, -.2);
    const lumbar = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mat(0x3c5068, { rough: .86 }));
    lumbar.scale.set(.19, .105, .035);
    lumbar.position.set(0, .76, -.125);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .4, 10), M.deskLeg());
    pole.position.y = .26;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.045, .055, .045, 16), M.plastic());
    base.position.y = .07;
    for (const p of [seat, back, lumbar, pole, base]) { p.castShadow = true; g.add(p); }

    // Five-star rolling base with small casters and padded arm rests.
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const dx = Math.cos(angle), dz = Math.sin(angle);
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(.014, .019, .26, 8), M.plastic());
      spoke.position.set(dx * .13, .055, dz * .13);
      spoke.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, 0, dz));
      spoke.castShadow = true;
      g.add(spoke);
      const caster = new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 8), M.plastic());
      caster.scale.set(1.25, .62, .85);
      caster.position.set(dx * .27, .04, dz * .27);
      caster.castShadow = true;
      g.add(caster);
    }
    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(.014, .018, .2, 8), M.deskLeg());
      post.position.set(side * .22, .63, -.02);
      const armrest = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), mat(0x46566a, { rough: .72 }));
      armrest.scale.set(.12, .035, .16);
      armrest.position.set(side * .22, .74, -.04);
      g.add(post, armrest);
    }
    g.position.set(x, 0, z);
    g.rotation.y = rot;
    this.scene.add(g);
    if (movable) this._registerDraggable(g, 'Chair');
    return g;
  }

  _registerDraggable(object, label) {
    object.userData.draggableLabel = label;
    this.draggableObjects.push(object);
    return object;
  }

  _personUnit(x, z, rot, variant = 0) {
    // Simple seated coworkers, scaled and shaded to read clearly from the
    // opening camera without competing with the learner's workstation.
    const palettes = [
      [0x386f83, 0xc98f68, 0x30251f], [0x72527d, 0x8f5f47, 0x18191d],
      [0x547b58, 0xe0b18b, 0x604532], [0x9a6847, 0x75503d, 0x25252a],
    ];
    const [shirt, skin, hair] = palettes[variant % palettes.length];
    const g = new THREE.Group();
    const add = (geometry, material, position, scale) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      if (scale) mesh.scale.set(...scale);
      mesh.castShadow = true;
      g.add(mesh);
      return mesh;
    };
    add(new THREE.SphereGeometry(1, 14, 10), mat(shirt), [0, .94, -.02], [.23, .3, .17]);
    add(new THREE.SphereGeometry(1, 14, 10), mat(skin), [0, 1.38, -.055], [.145, .17, .14]);
    add(new THREE.SphereGeometry(1, 12, 8), mat(hair), [0, 1.48, -.065], [.15, .105, .145]);
    const limb = (from, to, radius, material) => {
      const start = new THREE.Vector3(...from), end = new THREE.Vector3(...to);
      const delta = end.clone().sub(start);
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius * .78, radius, delta.length(), 8), material);
      mesh.position.copy(start.add(end).multiplyScalar(.5));
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
      mesh.castShadow = true;
      g.add(mesh);
    };
    const top = mat(shirt), trousers = mat(0x394555), hands = mat(skin);
    for (const side of [-1, 1]) {
      // Bent legs sit on the chair with feet extending toward the desk.
      limb([side * .11, .72, .01], [side * .12, .53, -.27], .075, trousers);
      limb([side * .12, .53, -.27], [side * .12, .53, -.48], .055, trousers);
      // Arms angle forward to suggest coworkers typing at their screens.
      limb([side * .19, 1.08, -.04], [side * .27, .91, -.28], .055, top);
      limb([side * .27, .91, -.28], [side * .2, .79, -.5], .043, hands);
    }
    g.position.set(x, 0, z);
    g.rotation.y = rot;
    this.scene.add(g);
    return g;
  }

  _buildCleanStation() {
    this._deskUnit(1.9, -3.1, 1.5, .7);
    this._chairUnit(1.9, -2.35, Math.PI, true);

    // Laptop with its own little canvas screen.
    const g = new THREE.Group();
    g.position.set(1.9, .765, -3.02);
    g.rotation.y = -0.06;
    const base = new THREE.Mesh(new THREE.BoxGeometry(.44, .02, .3), M.plastic());
    base.position.y = .01;
    const lid = new THREE.Mesh(new THREE.BoxGeometry(.44, .3, .015), M.plastic());
    lid.position.set(0, .16, -.15);
    lid.rotation.x = -0.28;
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 144;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(.41, .27), new THREE.MeshBasicMaterial({ map: texture }));
    screen.position.set(0, .16, -.14);
    screen.rotation.x = -0.28 + Math.PI; // face the room
    screen.rotateY(Math.PI);
    base.castShadow = lid.castShadow = true;
    g.add(base, lid, screen);
    this.scene.add(g);
    this._keyboardUnit(1.9, -2.83);
    this._box(.09, .012, .12, M.plasticL(), 2.22, .79, -2.83, { cast: false });
    this.laptop = { group: g, canvas, texture, mesh: lid };
    this.interactMeshes.cleanpc = this._hitTarget('cleanpc', .9, .72, .58, 1.9, .98, -3.02);
  }

  _buildBackground() {
    // Two rows of non-interactive desks with active NOVA workspace screens.
    for (const [index, [x, z, rot]] of [[-4.4, -0.6, 0], [-1.6, -0.6, 0], [1.6, -0.6, 0], [4.4, -0.6, 0],
                               [-3.2, 1.8, Math.PI], [0, 1.8, Math.PI], [3.2, 1.8, Math.PI]].entries()) {
      this._deskUnit(x, z, 1.7, .75);
      const monitorZ = z + (rot === 0 ? -.18 : .18);
      const monitor = this._monitorUnit(x, monitorZ, .5, rot);
      this._paintCanvas(monitor, 'office', false);
      const chairZ = z + (rot === 0 ? .8 : -.8);
      this._chairUnit(x, chairZ, rot);
      this._personUnit(x, chairZ, rot, index);
      // Keyboard, mouse and occasional paperwork make the shared stations
      // read as active workspaces from the room camera.
      const workZ = z + (rot === 0 ? .16 : -.16);
      this._keyboardUnit(x, workZ);
      this._mouseUnit(x + (index % 2 ? .53 : -.53), workZ);
      if (index % 2 === 0) this._paperStack(x + (index % 2 ? -.52 : .52), workZ);
    }
    // Plants.
    for (const [x, z] of [[-6.6, -4.4], [6.6, -4.4], [-6.6, 3.9], [6.6, 3.9]]) {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(.22, .18, .35, 12), mat(0x8b5e46, { rough: .8 }));
      pot.position.set(x, .17, z);
      pot.castShadow = true;
      this.scene.add(pot);
      for (let i = 0; i < 3; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(.16, .8, 8), mat(0x2f7d4f, { rough: .9 }));
        leaf.position.set(x + (i - 1) * .1, .65 + i * .07, z);
        leaf.rotation.z = (i - 1) * .22;
        leaf.castShadow = true;
        this.scene.add(leaf);
      }
    }
  }

  _buildOfficeProps() {
    // Shared multifunction printer on a low cabinet beside the window wall.
    const px = 6.25, pz = -3.55;
    const cabinet = mat(0x596577, { rough: .76 });
    const printer = mat(0xd7dce4, { rough: .52 });
    this._box(.92, .76, .72, cabinet, px, .4, pz);
    this._box(.86, .38, .66, printer, px, .98, pz);
    this._box(.78, .045, .59, M.plasticL(), px, 1.2, pz - .015);
    this._box(.52, .035, .3, mat(0x303b4b, { rough: .62 }), px, .77, pz + .37);
    this._box(.2, .12, .018, mat(0x1d3347, { rough: .35 }), px + .22, 1.04, pz + .34, { cast: false });
    this._box(.13, .018, .012, new THREE.MeshBasicMaterial({ color: 0x5eead4 }), px + .22, 1.05, pz + .328, { cast: false, receive: false });
    for (let i = 0; i < 3; i++) {
      this._box(.28, .009, .36, mat(0xf1f5f9, { rough: .95 }), px - .2, .81 + i * .012, pz + .32, { cast: false });
    }
    this._box(.12, .018, .035, mat(0x64748b, { metal: .25 }), px - .25, .62, pz + .37, { cast: false });

    // Water cooler with a translucent bottle, tap and drip tray.
    const wx = -6.45, wz = -2.75;
    this._box(.48, .82, .42, mat(0xe6ebf0, { rough: .48 }), wx, .44, wz);
    this._box(.34, .08, .28, mat(0x596577, { rough: .58 }), wx, .87, wz);
    const bottleMat = new THREE.MeshStandardMaterial({ color: 0x69c7dc, roughness: .2, metalness: .04, transparent: true, opacity: .56 });
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(.17, .14, .43, 18), bottleMat);
    bottle.position.set(wx, 1.13, wz);
    bottle.castShadow = true;
    this.scene.add(bottle);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(.06, .09, .1, 16), bottleMat);
    neck.position.set(wx, 1.395, wz);
    this.scene.add(neck);
    this._box(.035, .11, .035, mat(0x64748b, { metal: .25 }), wx - .08, .77, wz + .225, { cast: false });
    this._box(.035, .11, .035, mat(0x64748b, { metal: .25 }), wx + .08, .77, wz + .225, { cast: false });
    this._box(.3, .035, .12, mat(0x64748b, { rough: .62 }), wx, .65, wz + .24, { cast: false });
    this._box(.32, .018, .28, mat(0x344357, { rough: .68 }), wx, .035, wz);

    // Matching recycling bins by the aisle, with contrasting colored rims.
    for (const [x, color] of [[-5.55, 0x4da4a0], [5.55, 0x64748b]]) {
      const binMat = mat(0x35465b, { rough: .82 });
      const group = new THREE.Group();
      const bin = new THREE.Mesh(new THREE.CylinderGeometry(.22, .19, .48, 18), binMat);
      bin.position.set(0, .26, 0);
      bin.castShadow = true;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(.21, .018, 8, 20), mat(color, { rough: .48 }));
      rim.rotation.x = Math.PI / 2;
      rim.position.set(0, .5, 0);
      const badge = new THREE.Mesh(new THREE.BoxGeometry(.13, .045, .012), mat(color, { rough: .45 }));
      badge.position.set(0, .29, .205);
      badge.castShadow = false;
      group.add(bin, rim, badge);
      group.position.set(x, 0, 2.8);
      this.scene.add(group);
      this._registerDraggable(group, 'Recycling bin');
    }
  }

  /* ================= runtime ================= */

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  setView(name, { instant = false } = {}) {
    const v = VIEWS[name];
    if (!v) return;
    this._activeView = name;
    const target = {
      pos: new THREE.Vector3(...v.pos),
      look: new THREE.Vector3(...v.look),
    };
    this._orbitTarget.copy(target.look);
    if (instant || a11y.reducedMotion()) {
      this.camera.position.copy(target.pos);
      this.camera.lookAt(target.look);
      this._lastLook = target.look.clone();
      this._camLook = target.look.clone();
      this._camTween = null;
      return;
    }
    this._camTween = {
      fromPos: this.camera.position.clone(),
      fromLook: this._lastLook ? this._lastLook.clone() : this._currentLookPoint(),
      toPos: target.pos,
      toLook: target.look,
      t: 0,
      dur: 1.25,
    };
  }

  _currentLookPoint() {
    if (this._camLook) return this._camLook.clone();
    if (this._lastLook) return this._lastLook.clone();
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    return this.camera.position.clone().add(dir.multiplyScalar(4));
  }

  shake() {
    if (a11y.reducedMotion()) return;
    this._shakeAmp = .05;
  }

  ringPhone(on) {
    this._ringing = on;
    this._paintPhoneScreen(on);
  }

  _paintPhoneScreen(ringing) {
    const canvas = this.phoneScreenCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#07111f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('9:41', 128, 34);
    if (ringing) {
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(128, 150, 43, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 43px system-ui, sans-serif';
      ctx.fillText('☎', 128, 165);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 25px system-ui, sans-serif';
      ctx.fillText('UNKNOWN', 128, 246);
      ctx.fillText('CALLER', 128, 278);
      ctx.fillStyle = '#fda4af';
      ctx.font = '19px system-ui, sans-serif';
      ctx.fillText('INCOMING CALL', 128, 320);
      ctx.fillStyle = '#64748b';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('Use the call prompt', 128, 440);
      ctx.fillText('to answer', 128, 464);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('NORTHSTAR', 128, 235);
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillText('Mobile', 128, 270);
    }
    this.phoneScreenTexture.needsUpdate = true;
  }

  setObjectState(id, st) {
    if (id === 'workstation') {
      this.paintMonitor(st === 'compromised' || st === 'isolated' ? 'ransom' : st === 'off' ? 'off' : 'desktop');
      if (st === 'compromised') this.monitorGlow.color.set(0xef4444);
      else if (st === 'isolated') this.monitorGlow.color.set(0xf59e0b);
      else if (st === 'off') this.monitorGlow.intensity = 0.5;
      else this.monitorGlow.color.set(0x2dd4bf);
    }
    if (id === 'cable') {
      this.cablePlugged.visible = st === 'plugged';
      this.cableUnplugged.visible = st === 'unplugged';
      this.portLed.material.color.set(st === 'unplugged' ? 0x64748b : 0x4ade80);
      this.dockLed.material.color.set(st === 'unplugged' ? 0xf59e0b : 0x2dd4bf);
    }
    if (id === 'cleanpc') {
      this._paintCanvas(this.laptop, st === 'login' ? 'login' : st === 'clean' ? 'clean' : 'off', true);
    }
  }

  /* ---- monitor screen painting (canvas textures) ---- */

  paintMonitor(state) {
    this._paintCanvas(this.workstation, state, false);
  }

  _paintCanvas(unit, state, isLaptop) {
    const c = unit.canvas;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    if (state === 'off') {
      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(148,163,184,.06)';
      ctx.beginPath(); ctx.moveTo(W * .1, H); ctx.lineTo(W * .5, 0); ctx.lineTo(W * .62, 0); ctx.lineTo(W * .22, H); ctx.fill();
      unit.texture.needsUpdate = true;
      return;
    }
    if (state === 'ransom') {
      const grad = ctx.createRadialGradient(W / 2, H * .35, 20, W / 2, H * .5, W * .7);
      grad.addColorStop(0, '#5c1116'); grad.addColorStop(1, '#160406');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#f87171'; ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, W - 16, H - 16);
      ctx.fillStyle = '#fca5a5';
      ctx.font = `800 ${W / 12}px system-ui`;
      ctx.textAlign = 'center';
      ctx.fillText('⚠ FILES ENCRYPTED', W / 2, H * .42);
      ctx.font = `600 ${W / 26}px system-ui`;
      ctx.fillStyle = '#fecaca';
      ctx.fillText('Do not shut down. Do not contact authorities.', W / 2, H * .56);
      unit.texture.needsUpdate = true;
      return;
    }
    // The primary workstation presents a Windows-style desktop; the clean
    // laptop presents Linux. Both run the same fictional Northstar training apps.
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#0d1a30'); grad.addColorStop(1, '#123a44');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(45,212,191,.12)';
    ctx.beginPath(); ctx.arc(W * .78, H * .2, W * .18, 0, 7); ctx.fill();
    const osName = isLaptop ? 'LINUX' : 'WINDOWS 11';
    ctx.fillStyle = isLaptop ? '#c4b5fd' : '#60a5fa';
    ctx.font = `800 ${W / 14}px system-ui`;
    ctx.textAlign = 'left';
    ctx.fillText(osName, 18, H * .22);
    ctx.font = `500 ${W / 34}px system-ui`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Secure Desktop', 19, H * .22 + W / 24);

    if (state === 'desktop' && !isLaptop) {
      // A bright, fictional status terminal makes Alice's workstation feel
      // active without showing a real OS shell or executing real commands.
      const x = W * .12, y = H * .31, w = W * .76, h = H * .57;
      ctx.fillStyle = '#e8f0f6';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 9);
      ctx.fill();
      ctx.fillStyle = isLaptop ? '#6d28d9' : '#2563eb';
      ctx.beginPath();
      ctx.roundRect(x, y, w, H * .11, [9, 9, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#f0fdfa';
      ctx.font = `700 ${W / 36}px system-ui`;
      ctx.fillText(`${osName}  /  NORTHSTAR WORKSPACE`, x + 12, y + H * .075);
      ctx.font = `600 ${W / 42}px ui-monospace, monospace`;
      ctx.fillStyle = '#334155';
      ctx.textAlign = 'left';
      ctx.fillText('Session: alice.chen  ·  Workstation ready', x + 14, y + H * .21);
      ctx.fillStyle = isLaptop ? '#6d28d9' : '#2563eb';
      ctx.fillText('Security services active', x + 14, y + H * .31);
      ctx.fillText('Workspace: Northstar Operations', x + 14, y + H * .41);
      ctx.fillStyle = '#64748b';
      ctx.fillText('Waiting for your next action  ▌', x + 14, y + H * .51);
    } else if (state === 'office') {
      // Background colleagues have active, luminous workspaces too.
      this._miniWindow(ctx, W, H, '#f8fafc');
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(W * .12, H * .24, W * .76, H * .10);
      ctx.fillStyle = '#f0fdfa';
      ctx.font = `700 ${W / 32}px system-ui`;
      ctx.textAlign = 'left';
      ctx.fillText('NOVA WORKSPACE', W * .16, H * .31);
      ctx.fillStyle = '#14b8a6';
      ctx.beginPath(); ctx.arc(W * .2, H * .49, W * .025, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.font = `600 ${W / 38}px system-ui`;
      ctx.fillText('Team services ready', W * .25, H * .51);
      ctx.fillStyle = '#cbd5e1';
      for (let i = 0; i < 3; i++) ctx.fillRect(W * .2, H * (.62 + i * .07), W * (.42 + (i % 2) * .12), H * .018);
    } else if (state === 'login') {
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.arc(W / 2, H * .38, W * .07, 0, 7); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = `700 ${W / 22}px system-ui`; ctx.textAlign = 'center';
      ctx.fillText('Alice', W / 2, H * .52);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(W * .35, H * .58, W * .3, H * .07);
      ctx.strokeStyle = '#2dd4bf'; ctx.strokeRect(W * .35, H * .58, W * .3, H * .07);
    } else if (state === 'email') {
      this._miniWindow(ctx, W, H, '#f8fafc');
      ctx.fillStyle = '#e6fbf7'; ctx.fillRect(W * .12, H * .3, W * .04, H * .4);
      ctx.fillStyle = '#0f172a';
      ctx.font = `700 ${W / 30}px system-ui`; ctx.textAlign = 'left';
      ctx.fillText('Mail — 1 new', W * .19, H * .38);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(W * .2, H * .5, W * .015, 0, 7); ctx.fill();
      ctx.fillStyle = '#94a3b8';
      for (let i = 0; i < 4; i++) ctx.fillRect(W * .19, H * (.46 + i * .07), W * .3, H * .02);
    } else if (state === 'warning') {
      this._miniWindow(ctx, W, H, '#ffffff');
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(W * .12, H * .28, W * .76, H * .1);
      ctx.fillStyle = '#fff';
      ctx.font = `800 ${W / 28}px system-ui`; ctx.textAlign = 'left';
      ctx.fillText('⚠ SECURITY WARNING', W * .15, H * .35);
      ctx.fillStyle = '#b91c1c';
      ctx.font = `600 ${W / 34}px system-ui`;
      ctx.fillText('Threat detected — Suspicious executable', W * .15, H * .5);
    } else if (state === 'clean') {
      this._miniWindow(ctx, W, H, '#f0fdfa');
      ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(W / 2, H * .45, W * .05, 0, 7);
      ctx.moveTo(W * .47, H * .45); ctx.lineTo(W * .495, H * .48);
      ctx.lineTo(W * .53, H * .41);
      ctx.stroke();
      ctx.fillStyle = '#0f766e';
      ctx.font = `700 ${W / 30}px system-ui`; ctx.textAlign = 'center';
      ctx.fillText('LINUX · CLEAN DEVICE VERIFIED', W / 2, H * .58);
    }
    unit.texture.needsUpdate = true;
  }

  _miniWindow(ctx, W, H, bg) {
    ctx.fillStyle = 'rgba(2,8,20,.35)';
    ctx.fillRect(W * .1, H * .22, W * .8, H * .62);
    ctx.fillStyle = bg;
    ctx.fillRect(W * .12, H * .24, W * .76, H * .58);
  }

  _paintScreens() {
    this.paintMonitor('desktop');
    this.setObjectState('cleanpc', 'clean');
  }

  /* ---- pointer interaction ---- */

  _bindPointer() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this._pointerMove = (e) => this._onPointerMove(e);
    this._pointerDown = (e) => this._onPointerDown(e);
    this._pointerUp = (e) => this._finishDrag(e);
    this._pointerCancel = (e) => this._finishDrag(e, true);
    this._pointerClick = (e) => this._onClick(e);
    this._pointerLeave = () => { if (!this._dragObject) this._clearHover(); };
    this._wheel = (e) => this._onWheel(e);
    this._keyDown = (e) => this._onCameraKeyDown(e);
    this.canvas.addEventListener('pointermove', this._pointerMove);
    this.canvas.addEventListener('pointerdown', this._pointerDown);
    this.canvas.addEventListener('pointerup', this._pointerUp);
    this.canvas.addEventListener('pointercancel', this._pointerCancel);
    this.canvas.addEventListener('click', this._pointerClick);
    this.canvas.addEventListener('pointerleave', this._pointerLeave);
    this.canvas.addEventListener('wheel', this._wheel, { passive: false });
    this.canvas.addEventListener('keydown', this._keyDown);
  }

  _activeMeshList() {
    const ids = this.sys.activeIds;
    return Object.entries(this.interactMeshes)
      .filter(([id]) => ids.includes(id))
      .map(([, mesh]) => mesh);
  }

  _pick(e) {
    this._setRayFromEvent(e);
    const hits = this.raycaster.intersectObjects(this._activeMeshList(), true);
    if (!hits.length) return null;
    let obj = hits[0].object;
    while (obj) {
      const entry = Object.entries(this.interactMeshes).find(([, m]) => m === obj);
      if (entry) return entry[0];
      obj = obj.parent;
    }
    return null;
  }

  _setRayFromEvent(e) {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return true;
  }

  _pickDraggable(e) {
    if (!this._setRayFromEvent(e)) return null;
    const hits = this.raycaster.intersectObjects(this.draggableObjects, true);
    if (!hits.length) return null;
    let object = hits[0].object;
    while (object && !this.draggableObjects.includes(object)) object = object.parent;
    return object || null;
  }

  _floorPoint(e) {
    if (!this._setRayFromEvent(e)) return null;
    const point = new THREE.Vector3();
    return this.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), point);
  }

  _onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    const object = this._pickDraggable(e);
    if (object) {
      const point = this._floorPoint(e);
      if (!point) return;
      this._dragObject = object;
      this._dragOffset.set(object.position.x - point.x, 0, object.position.z - point.z);
      this._suppressClick = true;
      this.canvas.style.cursor = 'grabbing';
      this.canvas.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      return;
    }
    // Keep click-to-interact hotspots working; orbit only from empty scene space.
    if (this._pick(e)) return;
    this._camTween = null;
    this._orbitTarget.copy(this._currentLookPoint());
    this._orbitSpherical.setFromVector3(this.camera.position.clone().sub(this._orbitTarget));
    this._orbiting = true;
    this._orbitMoved = false;
    this._orbitLast = { x: e.clientX, y: e.clientY };
    this.canvas.style.cursor = 'grabbing';
    this.canvas.focus?.({ preventScroll: true });
    this.canvas.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }

  _finishDrag(e, canceled = false) {
    if (this._orbiting) {
      this._orbiting = false;
      if (!canceled && this._orbitMoved) this._suppressClick = true;
      else if (canceled) this._suppressClick = false;
      this.canvas.releasePointerCapture?.(e.pointerId);
      this.canvas.style.cursor = 'grab';
      return;
    }
    if (!this._dragObject) return;
    if (!canceled) {
      this._suppressClick = true;
      this.canvas.releasePointerCapture?.(e.pointerId);
    } else {
      this._suppressClick = false;
    }
    this._dragObject = null;
    this.canvas.style.cursor = 'default';
  }

  _onPointerMove(e) {
    if (this._orbiting) {
      const dx = e.clientX - this._orbitLast.x;
      const dy = e.clientY - this._orbitLast.y;
      this._orbitLast = { x: e.clientX, y: e.clientY };
      if (dx || dy) this._orbitMoved = true;
      this._orbitSpherical.theta -= dx * 0.006;
      this._orbitSpherical.phi = THREE.MathUtils.clamp(
        this._orbitSpherical.phi - dy * 0.006,
        0.12,
        Math.PI - 0.12,
      );
      this._applyOrbit();
      e.preventDefault();
      return;
    }
    if (this._dragObject) {
      const point = this._floorPoint(e);
      if (point) {
        this._dragObject.position.x = THREE.MathUtils.clamp(point.x + this._dragOffset.x, -7.05, 7.05);
        this._dragObject.position.z = THREE.MathUtils.clamp(point.z + this._dragOffset.z, -4.95, 4.95);
      }
      this.canvas.style.cursor = 'grabbing';
      e.preventDefault();
      return;
    }
    const id = this._pick(e);
    if (!id) {
      const draggable = this._pickDraggable(e);
      if (draggable) {
        this._clearHover();
        this.canvas.style.cursor = 'grab';
        const rect = this.canvas.getBoundingClientRect();
        const label = this.sys.ensureLabel();
        label.textContent = `Drag ${draggable.userData.draggableLabel} to move`;
        label.style.display = 'block';
        this.sys.positionLabel(e.clientX - rect.left, e.clientY - rect.top - 16, '');
        return;
      }
      this._clearHover();
      this.canvas.style.cursor = 'grab';
      return;
    }
    this.canvas.style.cursor = 'pointer';
    if (id) {
      if (this._hoverMesh && this.interactionHighlights[this._hoverMesh]) {
        this.interactionHighlights[this._hoverMesh].visible = false;
      }
      if (this.interactionHighlights[id]) this.interactionHighlights[id].visible = true;
      this.sys.showHoverLabel(id);
      this._hoverMesh = id;
    } else {
      this._clearHover();
    }
  }

  _applyOrbit() {
    const offset = new THREE.Vector3().setFromSpherical(this._orbitSpherical);
    this.camera.position.copy(this._orbitTarget).add(offset);
    this.camera.lookAt(this._orbitTarget);
    this._lastLook = this._orbitTarget.clone();
    this._camLook = this._orbitTarget.clone();
  }

  _onWheel(e) {
    e.preventDefault();
    this._camTween = null;
    this._orbitTarget.copy(this._currentLookPoint());
    this._orbitSpherical.setFromVector3(this.camera.position.clone().sub(this._orbitTarget));
    this._orbitSpherical.radius = THREE.MathUtils.clamp(
      this._orbitSpherical.radius * Math.exp(e.deltaY * 0.001),
      2.5,
      18,
    );
    this._applyOrbit();
  }

  _onCameraKeyDown(e) {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', '+', '=', '-', '_'];
    if (!keys.includes(e.key)) return;
    if (e.key === 'Home') {
      this.setView(this._activeView);
      e.preventDefault();
      return;
    }
    this._camTween = null;
    this._orbitTarget.copy(this._currentLookPoint());
    this._orbitSpherical.setFromVector3(this.camera.position.clone().sub(this._orbitTarget));
    if (e.key === 'ArrowLeft') this._orbitSpherical.theta += 0.12;
    if (e.key === 'ArrowRight') this._orbitSpherical.theta -= 0.12;
    if (e.key === 'ArrowUp') this._orbitSpherical.phi = Math.max(0.12, this._orbitSpherical.phi - 0.12);
    if (e.key === 'ArrowDown') this._orbitSpherical.phi = Math.min(Math.PI - 0.12, this._orbitSpherical.phi + 0.12);
    if (e.key === '+' || e.key === '=') this._orbitSpherical.radius = Math.max(2.5, this._orbitSpherical.radius * 0.9);
    if (e.key === '-' || e.key === '_') this._orbitSpherical.radius = Math.min(18, this._orbitSpherical.radius * 1.1);
    this._applyOrbit();
    e.preventDefault();
  }

  _clearHover() {
    if (this._hoverMesh && this.interactionHighlights[this._hoverMesh]) {
      this.interactionHighlights[this._hoverMesh].visible = false;
    }
    this.canvas.style.cursor = 'default';
    this.sys.hideHoverLabel();
    this._hoverMesh = null;
  }

  _onClick(e) {
    if (this._suppressClick) {
      this._suppressClick = false;
      return;
    }
    const id = this._pick(e);
    if (id) this.sys.activate(id);
  }

  /* ---- frame loop ---- */

  _frame() {
    if (this._disposed) return;
    const dt = Math.min(this._clock.getDelta(), 0.05);
    const t = this._clock.elapsedTime;

    if (this._camTween) {
      const tw = this._camTween;
      tw.t += dt / tw.dur;
      const k = tw.t >= 1 ? 1 : (tw.t < .5 ? 2 * tw.t * tw.t : 1 - Math.pow(-2 * tw.t + 2, 2) / 2);
      this.camera.position.lerpVectors(tw.fromPos, tw.toPos, k);
      this._camLook = tw.fromLook.clone().lerp(tw.toLook, k);
      this.camera.lookAt(this._camLook);
      this._lastLook = tw.toLook.clone();
      if (tw.t >= 1) this._camTween = null;
    }

    if (this._ringing && !a11y.reducedMotion()) {
      this.phone.position.y = .79 + Math.sin(t * 34) * .006;
      this.phone.rotation.z = Math.sin(t * 30) * .05;
    } else {
      this.phone.position.y = .79;
      this.phone.rotation.z = 0;
    }

    if (this._shakeAmp > 0.0005) {
      this.camera.position.x += (Math.random() - .5) * this._shakeAmp;
      this.camera.position.y += (Math.random() - .5) * this._shakeAmp;
      this._shakeAmp *= .9;
    }

    // Hover label follows its object.
    if (this.sys.hoveredId && this.sys.labelEl?.style.display === 'block') {
      const mesh = this.interactMeshes[this.sys.hoveredId];
      if (mesh) {
        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3()).project(this.camera);
        const x = (center.x * .5 + .5) * this.canvas.clientWidth;
        const y = (-center.y * .5 + .5) * this.canvas.clientHeight;
        this.sys.positionLabel(x, y - 14, 'Click to interact');
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
