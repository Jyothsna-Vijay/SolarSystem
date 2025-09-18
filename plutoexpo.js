import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getPluto() {
    const loader = new THREE.TextureLoader();
    const plutoGroup = new THREE.Group();
    plutoGroup.rotation.z = -28.3 * Math.PI / 180;

    const geometry = new THREE.IcosahedronGeometry(0.77, 13); // radius, detail
    const material = new THREE.MeshStandardMaterial({ 
        map: loader.load('/pluto.jpg'),
    });
    const plutoMesh = new THREE.Mesh(geometry, material);
    plutoGroup.add(plutoMesh);

    const fresnelMat = getFresnelMat({
        rimHex: 0xC0C0C0,   
    });
    
    const pglowMesh = new THREE.Mesh(geometry, fresnelMat);
    pglowMesh.scale.setScalar(1.016);
    plutoGroup.add(pglowMesh);

    return { group: plutoGroup, meshes: { plutoMesh, pglowMesh, } };

}