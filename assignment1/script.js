import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
** SETUP **
***********/
// Sizes
const sizes = {
   width: window.innerWidth * 0.4,
   height: window.innerHeight,
   aspectRatio: window.innerWidth * 0.4 / window.innerHeight
}

/***********
** SCENE **
***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
   75,
   sizes.aspectRatio,
   0.1,
   100
)
scene.add(camera)
camera.position.set(10, 2, 7.5)

// Renderer
const renderer = new THREE.WebGLRenderer({
   canvas: canvas,
   antialias: true,
   alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** MESHES **
************/
// Cave
const caveGeometry = new THREE.PlaneGeometry(15.5, 7.5)
const caveMaterial = new THREE.MeshStandardMaterial({
   color: new THREE.Color('white'),
   side: THREE.DoubleSide
})
const cave = new THREE.Mesh(caveGeometry, caveMaterial)
cave.rotation.y = Math.PI * 0.5
cave.receiveShadow = true
scene.add(cave)

// Objects
const torusGeometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(15, 2.5, 0);
torus.castShadow = true;
scene.add(torus);

/*************
** LIGHTS **
************/
// Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
  )
  scene.add(directionalLight)
  directionalLight.position.set(20, 4.1, 0)
  directionalLight.target = cave
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048

// Moving Light (For Dynamic Shadows)
const movingLight = new THREE.PointLight(0xffffff, 0.5)
movingLight.position.set(15, 3, 0)
movingLight.castShadow = true
scene.add(movingLight)

// Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLightHelper)

/*********************
** DOM INTERACTIONS **
**********************/
const domObject = {
   part: 1,
   firstChange: false,
   secondChange: false,
   thirdChange: false,
   fourthChange: false
}

// part-one
document.querySelector('#part-one').onclick = function() {
   domObject.part = 1
}

// part-two
document.querySelector('#part-two').onclick = function() {
   domObject.part = 2
}

// first-change (Shadow moves up/down)
document.querySelector('#first-change').onclick = function() {
   domObject.firstChange = true
}

// second-change (Shadow stretches/shrinks)
document.querySelector('#second-change').onclick = function() {
   domObject.secondChange = true
}

// third-change (Sun sets, changing shadow position)
document.querySelector('#third-change').onclick = function() {
   domObject.thirdChange = true
}

// fourth-change (Object moves, changing shadow shape)
document.querySelector('#fourth-change').onclick = function() {
   domObject.fourthChange = true
}

/*******************
** ANIMATION LOOP **
********************/
const clock = new THREE.Clock()
const animateShadowUpDown = () => {
    movingLight.position.y = 3 + Math.sin(clock.getElapsedTime()) * 2;
  };

  const animateShadowSideways = () => {
    movingLight.position.x = 5 + Math.sin(clock.getElapsedTime()) * 3;
  };

  const animation = () =>
    {
      // Return elapsedTime
      const elapsedTime = clock.getElapsedTime()

   // part-one (Camera inside the cave, facing the wall)
   if(domObject.part === 1) {
       camera.position.set(6, 0, 0)
       camera.lookAt(0, 0, 0)
   }

   // part-two (Camera outside the cave, showing objects & shadows)
   if(domObject.part === 2) {
       camera.position.set(25, 1, 0)
       camera.lookAt(0, 0, 0)
   }

   // first-change (Move shadow up/down)
   if(domObject.firstChange) {
    torus.rotation.x = elapsedTime
   }

   // second-change (Stretch/shrink shadow)
   if(domObject.secondChange) {
    torus.rotation.y = elapsedTime
   }

   // third-change (Sun setting - Light moves down, shadow moves up)
   if(domObject.thirdChange) {
    torus.position.y = (Math.sin(elapsedTime) + 1) * 2
   }

   // fourth-change (Object moves, changing shadow shape)
   if(domObject.fourthChange) {
    torus.position.z = Math.sin(elapsedTime)
   }

   // Update directionalLightHelper
   directionalLightHelper.update()

   // Update OrbitControls
   controls.update()
  
   // Renderer
   renderer.render(scene, camera)

   // Request next frame
   window.requestAnimationFrame(animation)
}

animation()