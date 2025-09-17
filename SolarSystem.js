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

function getOrbit(radius) {
    const geometry = new THREE.RingGeometry(radius - 0.01, radius + 0.01, 64); // innerRadius, outerRadius, thetaSegments
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2; // Rotate to lie flat in the XZ plane
    return mesh;
}

// Add stars
const stars = getStarfield({ numStars: 10000 });
scene.add(stars);

// Create the Sun
const { group: sunGroup, sunMesh, glowMesh } = getSun();
scene.add(sunGroup);

// Create Mercury 
const { group: mercuryGroup, meshes: { mercuryMesh, glowMesh: merglowMesh } } = getMercury();
mercuryGroup.position.x = 3;
scene.add(mercuryGroup, getOrbit(3)); // Add orbit ring
let mercuryRotation = 0;

// Create Venus
const { group: venusGroup, meshes: { venusMesh, glowMesh: vglowMesh } } = getVenus();
venusGroup.position.x = -5; // Move Venus away from the Sun
scene.add(venusGroup , getOrbit(5));
let venusRotation = 0;

// Create Earth
const { group: earthGroup, meshes: { earthMesh, cloudsMesh, eglowMesh, lightsMesh } } = getEarth();
earthGroup.position.x = 7; // Move Earth away from the Sun  
scene.add(earthGroup, getOrbit(7));
let earthRotation = 0;

// Create Moon
const {group: moonGroup, meshes: {moonMesh, glowMesh: mglowMesh}} = getMoon();
moonGroup.position.set(1, 0, 0) // Move Moon away from Earth ; // distance from Earth
earthGroup.add(moonGroup); // Add Moon to Earth group so it orbits Earth
let moonRotation = 0;

// Create Mars
const { group: marsGroup, meshes: { marsMesh, marglowMesh } } = getMars();
marsGroup.position.x = -10; // Move Mars away from the Sun
scene.add(marsGroup, getOrbit(10));
let marsRotation = 0;

// Astriod Belt
function getAstriodBelt({innerRadius = 20,
    outerRadius = 25,
    count  = 2000,} = {}) 
{
    const geometry = new THREE.IcosahedronGeometry(0.05, 0); // Small spheres for asteroids
    const material = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 }); // 0xa0522d

    const belt = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D(); // Temporary helper object for positioning

    const asteroidData = []; // Store orbit information for each asteroid

    for ( let i = 0; i < count; i++ ) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = innerRadius + Math.random() * (outerRadius - innerRadius); 
        const y = (Math.random() - 0.5) * 2; // Random height for thickness
        //const speed = 0.001 + Math.random() * 0.003; // Random speed for each asteroid

        asteroidData.push({ angle, radius, y, speed: 1 + Math.random() * 0.003 }); // speed: orbit 

        dummy.position.set(radius * Math.cos(angle), y, radius * Math.sin(angle)); // Position in circular belt
        dummy.updateMatrix();
        belt.setMatrixAt(i, dummy.matrix);
    }
    belt.userData.asteroidData = asteroidData; // How each asteroid should move over time
    belt.userData.dummy = dummy; // Attach dummy for reuse

    return belt;
}

const asteroidBelt = getAstriodBelt({innerRadius:13, outerRadius:15, count:2000});
scene.add(asteroidBelt);

//scene.add(getOrbit(13));

function animateAsteroidBelt(belt) {
    const { asteroidData, dummy } = belt.userData;
  
    asteroidData.forEach((asteroid, i) => {
      asteroid.angle += asteroid.speed; // update orbit
  
      dummy.position.set(
        asteroid.radius * Math.cos(asteroid.angle), // x-positon 
        asteroid.y, // vertical offset 
        asteroid.radius * Math.sin(asteroid.angle) // z-position
      );
  
      // optional: small rotation for tumbling
      dummy.rotation.x += 0.01;
      dummy.rotation.y += 0.01;
  
      dummy.updateMatrix(); // updates the dummy’s transformation
      belt.setMatrixAt(i, dummy.matrix); //copies this transform into the instanced asteroid
    });
  
    belt.instanceMatrix.needsUpdate = true;
  }

// light
const sunLight = new THREE.PointLight(0xffffff, 40, 100, 2); // color, intensity, distance, decay
sunLight.position.copy(sunGroup.position); // At Sun’s center
scene.add(sunLight);

// Animate everything
function animate() {
    requestAnimationFrame(animate);

    // Rotate Sun
    sunMesh.rotation.y += 0.002;

    // Rotate Mercury
    mercuryMesh.rotation.y += 0.00017;

    mercuryRotation += 0.021; // Mercury orbit speed
    mercuryGroup.position.x = 3 * Math.cos(mercuryRotation); 
    mercuryGroup.position.z = 3 * Math.sin(mercuryRotation); 

    // Rotate Venus
    venusMesh.rotation.y += -0.00007;

    venusRotation += 0.0081; // Venus orbit speed
    venusGroup.position.x = 5 * Math.cos(venusRotation); 
    venusGroup.position.z = 5 * Math.sin(venusRotation); 

    // Rotate Earth
    earthMesh.rotation.y += 0.01;
    cloudsMesh.rotation.y += 0.0025;
    lightsMesh.rotation.y += 0.01;

    earthRotation += 0.005; // Earth orbit speed
    earthGroup.position.x = 7 * Math.cos(earthRotation); 
    earthGroup.position.z = 7 * Math.sin(earthRotation); 

    // Rotate Moon
    moonMesh.rotation.y += 0.00037; //tidally locked

    moonRotation += 0.02; // Moon orbit speed
    moonGroup.position.x = 1.5 * Math.cos(moonRotation);
    moonGroup.position.z = 1.5 * Math.sin(moonRotation);

    // Rotate Mars
    marsMesh.rotation.y += 0.0097;

    marsRotation += 0.0026; // Mars orbit speed
    marsGroup.position.x = -10 * Math.cos(marsRotation); 
    marsGroup.position.z = -10 * Math.sin(marsRotation); 

    // Animate Asteroid Belt
    animateAsteroidBelt(asteroidBelt);


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