import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import getStarfield from './getStarfield.js';

import getSun from './sunexpo.js';
import getMercury from './mercuryexpo.js';
import getVenus from './venusexpo.js';
import getEarth from './earthexpo.js';
import getMoon from './moonexpo.js';
import getMars from './marsexpo.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000); // camera fov, aspect, near, far
camera.position.set(0, 12, 0)
camera.position.z = 15;
//scene.background = new THREE.Color(0xdddddd);
const renderer = new THREE.WebGLRenderer({ antialias: true }); //antialias smooths edges - BEFORE OrbitControls
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update()


// Add stars
const stars = getStarfield({ numStars: 10000 });
scene.add(stars);

// Create the Sun
const { group: sunGroup, sunMesh, glowMesh } = getSun();
scene.add(sunGroup);

// Create Mercury 
const { group: mercuryGroup, meshes: { mercuryMesh, glowMesh: merglowMesh } } = getMercury();
mercuryGroup.position.x = 3;
scene.add(mercuryGroup);

// Create Venus
const { group: venusGroup, meshes: { venusMesh, glowMesh: vglowMesh } } = getVenus();
venusGroup.position.x = -5; // Move Venus away from the Sun
scene.add(venusGroup);

// Create Earth
const { group: earthGroup, meshes: { earthMesh, cloudsMesh, eglowMesh, lightsMesh } } = getEarth();
earthGroup.position.x = 7; // Move Earth away from the Sun  
scene.add(earthGroup);

// Create Moon
const {group: moonGroup, meshes: {moonMesh, glowMesh: mglowMesh}} = getMoon();
moonGroup.position.set(1, 1.45, 0) // Move Moon away from Earth ; // distance from Earth
earthGroup.add(moonGroup); // Add Moon to Earth group so it orbits Earth

// Create Mars
const { group: marsGroup, meshes: { marsMesh, marglowMesh } } = getMars();
marsGroup.position.x = -10; // Move Mars away from the Sun
scene.add(marsGroup);

// light
const sunLight = new THREE.PointLight(0xffffff, 40, 50, 2); // color, intensity, distance, decay
sunLight.position.copy(sunGroup.position); // At Sun’s center
scene.add(sunLight);

// Animate everything
function animate() {
    requestAnimationFrame(animate);

    // Rotate Sun
    sunMesh.rotation.y += 0.002;

    // Rotate Mercury
    mercuryMesh.rotation.y += 0.00017;


    // Rotate Venus
    venusMesh.rotation.y += -0.00007;

    // Rotate Earth
    earthMesh.rotation.y += 0.01;
    cloudsMesh.rotation.y += 0.0025;
    lightsMesh.rotation.y += 0.01;

    // Rotate Moon
    moonMesh.rotation.y += 0.00037;

    // Rotate Mars
    marsMesh.rotation.y += 0.0097;


    // Rotate starfield
    stars.rotation.y -= 0.0002;

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});