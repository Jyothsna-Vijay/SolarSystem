import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getJupiter() {
    const loader = new THREE.TextureLoader();
    const jupiterGroup = new THREE.Group();
    jupiterGroup.rotation.z = -3.1 * Math.PI / 180;

    const geometry = new THREE.IcosahedronGeometry(1, 13); // radius, detail
    const material = new THREE.MeshStandardMaterial({ 
        map: loader.load('/jupiter.jpg'),
    });
    const jupiterMesh = new THREE.Mesh(geometry, material);
    jupiterGroup.add(jupiterMesh);

    const fresnelMat = getFresnelMat({
        rimHex: 0xffa500,   
    });
    
    const jglowMesh = new THREE.Mesh(geometry, fresnelMat);
    jglowMesh.scale.setScalar(1.016);
    jupiterGroup.add(jglowMesh);

    return { group: jupiterGroup, meshes: { jupiterMesh, jglowMesh, } };

}