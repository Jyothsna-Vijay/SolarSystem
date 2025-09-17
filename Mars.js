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

const marsGroup = new THREE.Group();
marsGroup.rotation.z = -25.2 * Math.PI / 180; // tilt to match real world
scene.add(marsGroup);

const controls = new OrbitControls(camera, renderer.domElement); // allow mouse to move camera
controls.update(); // must be called after any manual changes to the camera's transform

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 13); // radius, detail
const material = new THREE.MeshStandardMaterial({ // Dont need lights for MeshBasicMaterial
    map: loader.load('/mars.jpg'),
    //emissive: new THREE.Color(0xffffff),      // enable emissive channel
});
const marsMesh = new THREE.Mesh(geometry, material);
marsGroup.add(marsMesh); //Why not there? not infornt of caerma, no lights in scene, or mesh not added to scene

const fresnelMat = getFresnelMat({
    rimHex: 0xa0522d,   // orange-red rim  0xa0522d
    //facingHex: 0x000000 // keep the core black
});

const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.012);
marsGroup.add(glowMesh);

const stars = getStarfield({numStars: 10000});
scene.add(stars);

//const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1); //sky color, ground color, intensity
//scene.add(hemisphereLight);
const sunLight = new THREE.DirectionalLight(0xffffff);// color, intensity
sunLight.position.set(-2,0.5,1.3); //
scene.add(sunLight);

function animate() {
    requestAnimationFrame(animate);
    
    marsMesh.rotation.y += 0.0097;
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

  // 0xff3300