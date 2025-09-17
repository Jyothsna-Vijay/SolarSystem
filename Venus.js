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

const venusGroup = new THREE.Group();
venusGroup.rotation.z = -177.3 * Math.PI / 180; // tilt to match real world
scene.add(venusGroup);

const controls = new OrbitControls(camera, renderer.domElement); // allow mouse to move camera
controls.update(); // must be called after any manual changes to the camera's transform

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 13); // radius, detail

const material = new THREE.MeshStandardMaterial({ // Dont need lights for MeshBasicMaterial
    map: loader.load('/venus.jpg'),
});
const venusMesh = new THREE.Mesh(geometry, material);
venusGroup.add(venusMesh); //Why not there? not infornt of caerma, no lights in scene, or mesh not added to scene

const fresnelMat = getFresnelMat({
    rimHex: 0xffa500,   // orange-red rim  0xa0522d
   //facingHex: 0xffa500 
});

const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.015);
//venusGroup.add(glowMesh);

const stars = getStarfield({numStars: 10000});
scene.add(stars);

//const hemisphereLight = new THREE.HemisphereLight(0xff6600, 0xff4500, 10); //sky color, ground color, intensity
//scene.add(hemisphereLight);
const venusLight = new THREE.DirectionalLight(0xffffff);// color, intensity
venusLight.position.set(-2,0.5,1000); //
scene.add(venusLight);

function animate() {
    requestAnimationFrame(animate);
    
    venusMesh.rotation.y += -0.00007;
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