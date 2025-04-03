import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "OrbitControls";

/**********
** SETUP **
***********/
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspectRatio: window.innerWidth / window.innerHeight,
};

// Resizing
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.aspectRatio = window.innerWidth / window.innerHeight;

  // Update camera
  camera.aspect = sizes.aspectRatio;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/***********
 ** SCENE **
 ***********/
// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#E7F0FF");

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
scene.add(camera);
camera.position.set(0, 12, -20);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/***********
** LIGHTS **
***********/
// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100);
scene.add(directionalLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Add ambient light
scene.add(ambientLight);

/***********
** MESHES **
************/
// Triangle Geometry
const triangleGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  0, 0.5, 0,
  -0.5, -0.5, 0,
  0.5, -0.5, 0,
]);
triangleGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// Ring Geometry
const ringGeometry = new THREE.TorusGeometry(0.3, 0.1, 32, 100);

// Heart geometry
const heartShape = new THREE.Shape();
const x = 0, y = 0;
heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

const extrudeSettings = {
  depth: 0.15,
  bevelEnabled: false,
};

const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

const drawMesh = (height, params) => {
  // Create mesh material
  let material;
  if (params.triangle) {
    material = new THREE.MeshPhongMaterial({ color: new THREE.Color(params.color), flatShading: true }); // Use MeshPhongMaterial for triangles
  } else if (params.heart) {
    material = new THREE.MeshStandardMaterial({ color: new THREE.Color(params.color) });
  }
   else if (params.ring) {
    material = new THREE.MeshStandardMaterial({ color: new THREE.Color(params.color) });
  }
  else {
    material = new THREE.MeshStandardMaterial({ color: params.color }); // Use MeshStandardMaterial and set color
  }

  // Create mesh
  let mesh;
  if (params.triangle) {
    mesh = new THREE.Mesh(triangleGeometry, material);
  } else if (params.ring) {
    mesh = new THREE.Mesh(ringGeometry, material);
  } else if (params.heart) {
    mesh = new THREE.Mesh(heartGeometry, material);
  } else {
    mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16), material); // TorusKnotGeometry
  }

  // Position mesh
  let xOffset = 0;
  let zOffset = 0;

  if (params.triangle) {
    xOffset = -2;
    zOffset = -2;
  } else if (params.ring) {
    xOffset = 0;
    zOffset = 0;
  } else if (params.heart) {
    xOffset = 2;
    zOffset = 2;
  }

  mesh.position.x = (Math.random() - 0.5) * params.diameter * 2 + xOffset;
  mesh.position.z = (Math.random() - 0.5) * params.diameter * 2 + zOffset;
  mesh.position.y = height * 1.5 - 10; // Increased height separation

  // Scale mesh
  let scale = params.scale;
  if (params.heart) {
    scale = 0.5;
  }
  mesh.scale.x = scale;
  mesh.scale.y = scale;
  mesh.scale.z = scale;

  // Randomize mesh
  if (params.randomized) {
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
  }

  // Add mesh to group
  params.group.add(mesh);
};

/*******
** UI **
********/
// UI
const ui = new dat.GUI();

let preset = {};

// Groups
const group1 = new THREE.Group();
scene.add(group1);
const group2 = new THREE.Group();
scene.add(group2);
const group3 = new THREE.Group();
scene.add(group3);

const uiObj = {
  sourceText: "",
  saveSourceText() {
    saveSourceText();
  },
  term1: {
    term: "pride",
    color: "#aa00ff",
    diameter: 10,
    group: group1,
    nCubes: 100,
    randomized: true,
    scale: 1,
    triangle: true,
    ring: false,
    heart: false,
  },
  term2: {
    term: "ardently",
    color: "#ffd700",
    diameter: 10,
    group: group2,
    nCubes: 100,
    randomized: true,
    scale: 1,
    triangle: false,
    ring: true,
    heart: false,
  },
  term3: {
    term: "love",
    color: "#e21212",
    diameter: 10,
    group: group3,
    nCubes: 100,
    randomized: true,
    scale: 1,
    triangle: false,
    ring: false,
    heart: false,
  },
  saveTerms() {
    saveTerms();
  },
  rotateCamera: false,
};

// UI Functions
const saveSourceText = () => {
  preset = ui.save();
  textFolder.hide();
  termsFolder.show();
  visualizeFolder.show();
  tokenizeSourceText(uiObj.sourceText);
};

const saveTerms = () => {
  preset = ui.save;
  visualizeFolder.hide();
  cameraFolder.show();
  findSearchTermInTokenizedText(uiObj.term1);
  findSearchTermInTokenizedText(uiObj.term2);
  findSearchTermInTokenizedText(uiObj.term3);
};

// UI Folders
const textFolder = ui.addFolder("Source Text");
textFolder.add(uiObj, "sourceText").name("Source Text");
textFolder.add(uiObj, "saveSourceText").name("Save");

const termsFolder = ui.addFolder("Search Terms");
const visualizeFolder = ui.addFolder("Visualize");
const cameraFolder = ui.addFolder("Camera");

termsFolder.add(uiObj.term1, "term").name("Term 1");
termsFolder.add(group1, "visible").name("Term 1 Visibility");
termsFolder.addColor(uiObj.term1, "color").name("Term 1 Color");

termsFolder.add(uiObj.term2, "term").name("Term 2");
termsFolder.add(group2, "visible").name("Term 2 Visibility");
termsFolder.addColor(uiObj.term2, "color").name("Term 2 Color");

termsFolder.add(uiObj.term3, "term").name("Term 3");
termsFolder.add(group3, "visible").name("Term 3 Visibility");
termsFolder.addColor(uiObj.term3, "color").name("Term 3 Color");

visualizeFolder.add(uiObj, "saveTerms").name("Visualize");
cameraFolder.add(uiObj, "rotateCamera").name("Turntable");

termsFolder.hide();
visualizeFolder.hide();
cameraFolder.hide();

/******************
** TEXT ANALYSIS **
******************/
let parsedText, tokenizedText;
const tokenizeSourceText = (sourceText) => {
  parsedText = sourceText.replaceAll(".", "").toLowerCase();
  tokenizedText = parsedText.split(/[^\w']+/);
};

const findSearchTermInTokenizedText = (params) => {
  for (let i = 0; i < tokenizedText.length; i++) {
    if (tokenizedText[i] === params.term) {
      const height = (100 / tokenizedText.length) * i * 0.2;
      for (let a = 0; a < params.nCubes; a++) {
        drawMesh(height, params);
      }
    }
  }
};

/*******************
** ANIMATION LOOP **
********************/
const clock = new THREE.Clock();
const animation = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  if (uiObj.rotateCamera) {
    camera.position.x = Math.sin(elapsedTime * 0.1) * 20;
    camera.position.z = Math.cos(elapsedTime * 0.1) * 20;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(animation);
};

animation();

