import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getEarth() {
    const loader = new THREE.TextureLoader();
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
  
    const geometry = new THREE.IcosahedronGeometry(0.84, 13); // radius, detail
    const material = new THREE.MeshStandardMaterial({ // Dont need lights for MeshBasicMaterial
        map: loader.load('/earth.jpg'),
        emissive: new THREE.Color(0xffffff),      // enable emissive channel
        emissiveMap: loader.load('/earthlights.png'), // city lights
        emissiveIntensity: 0.4,                     // make lights brighter
        
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh); //Why not there? not infornt of caerma, no lights in scene, or mesh not added to scene
    
    const lightsMat = new THREE.MeshBasicMaterial({
        map: loader.load('/earthlights.jpg'),
        blending: THREE.AdditiveBlending,
    });
    const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightsMesh);

    // Clouds
    const cloudsMat = new THREE.MeshBasicMaterial({
      map: loader.load("/bwclouds.jpg"),
      alphaMap: loader.load("/bwclouds.jpg"),
      transparent: true,
      opacity: 0.5,
    });
    const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.012);
    earthGroup.add(cloudsMesh);
  
    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.012);
    earthGroup.add(glowMesh);
  
    return { group: earthGroup, meshes: { earthMesh, cloudsMesh, glowMesh, lightsMesh } };
  }