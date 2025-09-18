import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getSaturn() {
    const loader = new THREE.TextureLoader();
    const saturnGroup = new THREE.Group();
    saturnGroup.rotation.z = -26.7 * Math.PI / 180;

    const geometry = new THREE.IcosahedronGeometry(0.86, 13); // radius, detail
    const material = new THREE.MeshStandardMaterial({ 
        map: loader.load('/saturn.jpg'),
    });
    const saturnMesh = new THREE.Mesh(geometry, material);
    saturnGroup.add(saturnMesh);

    const innerRadius = 1.2;
    const outerRadius = 2;
    const segments = 64;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
    ringGeometry.rotateX(- Math.PI / 2); // rotate so it lies around planet's equator
    
    const rings = new THREE.TextureLoader();
    const ringTexture = rings.load('/saturnringcolor.jpg');
    
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,
      transparent: true,
      side: THREE.DoubleSide,  // rings are visible from both sides
    });
    
    const sringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    // Position at planet's center
    sringMesh.position.set(0, 0, 0);
    saturnGroup.add(sringMesh)

    const fresnelMat = getFresnelMat({
        rimHex: 0xCD853F,   
    });
    
    const sglowMesh = new THREE.Mesh(geometry, fresnelMat);
    sglowMesh.scale.setScalar(1.016);
    saturnGroup.add(sglowMesh);

    return { group: saturnGroup, meshes: { saturnMesh, sglowMesh, sringMesh} };

}