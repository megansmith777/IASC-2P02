import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/***********
 ** SCENE **
 ***********/
// Sizes 
const sizes = {
    width: window.innerWidth * 0.4, 
    height: window.innerHeight,
    aspectRatio: window.innerWidth * 0.4 / window.innerHeight
}
 // Canvas 
 const canvas = document.querySelector('.webgl')

 // Scene
 const scene = new THREE.Scene()
 scene.background = new THREE.Color(' #E7F0FF')

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

 //controls
 const controls =new OrbitControls(camera, canvas)
 controls.enableDamping = true 

 /************
  ** MESHES **
  ************/
 // Cave 
 const caveGeometry = new THREE.PlaneGemoetry(15.5, 7.5)
 const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
 })
 const cave = new THREE.Mesh(caveGeometry, caveMaterial)
 cave.rotation.y = Math.PI * 0.5
 cave,receiveShadow = true
 scene.add(cave)

 //Objects 
 const torusKnotGeometry = new THREE.torusKnotGeometry(1, 0.2)
 const torusKnotMaterial = new THREE.MeshNormalMaterial()
 const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
 torusKnot.position.set(15, 2.5, 0)
torusKnot.castShadow = true
scene.add(torusKnot)




