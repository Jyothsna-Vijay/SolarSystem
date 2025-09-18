import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getUranus() {
    const loader = new THREE.TextureLoader();
    const uranusGroup = new THREE.Group();
    uranusGroup.rotation.z = -97.8 * Math.PI / 180;

    const geometry = new THREE.IcosahedronGeometry(0.79, 13); // radius, detail
    const material = new THREE.MeshStandardMaterial({ 
        map: loader.load('/uranus.jpg'),
    });
    const uranusMesh = new THREE.Mesh(geometry, material);
    uranusGroup.add(uranusMesh);

    const innerRadius = 1.2;
    const outerRadius = 2;
    const segments = 64;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
    ringGeometry.rotateX(- Math.PI / 2); // rotate so it lies around planet's equator
    
    const rings = new THREE.TextureLoader();
    const ringTexture = rings.load('/uranusringcolour.jpg');
    
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,
      transparent: true,
      side: THREE.DoubleSide,  // rings are visible from both sides
    });
    
    const uringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    // Position at planet's center
    uringMesh.position.set(0, 0, 0);
    uranusGroup.add(uringMesh)

    const fresnelMat = getFresnelMat({
        rimHex: 0x808080,   
    });
    
    const sglowMesh = new THREE.Mesh(geometry, fresnelMat);
    sglowMesh.scale.setScalar(1.016);
    uranusGroup.add(sglowMesh);

    return { group: uranusGroup, meshes: { uranusMesh, sglowMesh, uringMesh} };

}