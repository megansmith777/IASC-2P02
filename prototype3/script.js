import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls} from "OrbitControls"

/*********
 **SETUP**
 *********/
//Sizes

const sizes ={
    width: window.innerWidth,
    height: window.innerHeight, 
    aspectRatio: window.innerWidth / window.innerHeight
}
/***********
 ** SCENE **
 ***********/
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100
)
scene.add(camera)
camera.posistion.set(10, 2, 7.5)

//Renderer 
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})
renderer.setSize (sizes.width, sizes.height)
renderer.shadowMap.enabled = true 
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/************
 ** MESHES **
 ************/

 //Cave
 const caveGeometry = new THREE.PlaneGemoetry(15.5, 7.5)
 const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('White'),
    side: THREE.DoubleSide
 })
 const cave = new THREE.Mesh(caveGeometry, caveMaterial)
 cave.rotation.y = Math.PI * 0.5
 cave.recieveShadow = true
 scene.add(cave)

 //Object 
 const torusKnotGeometry = new THREE.TorusKnotGemoetry(1, 0.2)
 const torusKnotMaterial = new THREE.MeshNormalMaterial()
 torusKnotGeometry.position.set(6, 1, 0)
 torusKnotGeometry.castShadow = true 
 scene.add(torusKnot)

 /************
  ** LIGHTS **
  ************/
 // Ambient Light
 // const ambientLight = new THREE.AmbientLight(0x404040)
 // const ambientLight = new THREE.AmbientLight(new THREE.Color('white))
 //scene.add(ambientLight)

 // Directional Light 
 const directionalLigght = new THREE.DirectionalLight(new THREE.Color('white'), 0.5)
 scene.add(directionalLight)
 directionalLight.position.set(20, 4.1, 0)
 directionalLight.target = cave 
 directionalLight.castShadow = true
 directionalLight.shadow.mapSize.Width = 2048
 directionalLight.shadow.mapSize.height = 2048

 // Directional Light Helper 
 const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
 // Scene.add(directionalLightHelper)

 /********
  ** UI **
  ********/
 //UI
const ui = new dat.GUI()

const lightPositionFolder = ui.addFolder('Light Position')
lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('y')

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('z')

/********************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock()

const animation = () =>{
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    //Animate objects
    torusKnot.rotation.y = elapsedTime()

    //Update directionalLightHelper
    directionalLightHelper.update()

    //Update OrbitControls
    controls.update()

    //Renderer
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation)
}

animation()
