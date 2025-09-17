import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import getStarfield from './getStarfield.js';
import { getFresnelMat } from './getFresnelMat.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0xdddddd);
const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000); // camera fov, aspect, near, far
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true }); //antialias smooths edges - BEFORE OrbitControls
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180; // tilt to match real world
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement); // allow mouse to move camera
controls.update(); // must be called after any manual changes to the camera's transform

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 13); // radius, detail
const material = new THREE.MeshStandardMaterial({ // Dont need lights for MeshBasicMaterial
    map: loader.load('/earth.jpg'),
    emissive: new THREE.Color(0xffffff),      // enable emissive channel
    emissiveMap: loader.load('/earthlights.png'), // city lights
    emissiveIntensity: 1.2,                     // make lights brighter
    
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh); //Why not there? not infornt of caerma, no lights in scene, or mesh not added to scene

const lightsMat = new THREE.MeshBasicMaterial({
    //color: 0x00ff00,
    //transparent: true,
    //opacity: 0.5,
    map: loader.load('/earthlights.jpg'),
    blending: THREE.AdditiveBlending,
    //transparent: true,
    //depthWrite: false,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshBasicMaterial({
    map: loader.load('/bwclouds.jpg'),
    alphaMap: loader.load('/bwclouds.jpg'),
    //color: 0xffffff, 
    transparent: true,
    opacity: 0.5,                // alphaMap controls visibility
    blending: THREE.NormalBlending,
});
    
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.012); // make clouds slightly larger than earth
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.012);
earthGroup.add(glowMesh);


const stars = getStarfield({numStars: 10000});
scene.add(stars);

//const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1); //sky color, ground color, intensity
//scene.add(hemisphereLight);
const sunLight = new THREE.DirectionalLight(0xffffff);// color, intensity
sunLight.position.set(-2,0.5,1.5); //
scene.add(sunLight);

function animate() {
    requestAnimationFrame(animate);
    
    earthMesh.rotation.y += 0.01;
    lightsMesh.rotation.y += 0.01;
    cloudsMesh.rotation.y += 0.0025;
    glowMesh.rotation.y += 0.002;
    stars.rotation.y -= 0.0002;
    renderer.render(scene, camera);
}
animate();

function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', handleWindowResize, false);
