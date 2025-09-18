import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getNeptune() {
    const loader = new THREE.TextureLoader();
    const neptuneGroup = new THREE.Group();
    neptuneGroup.rotation.z = -28.3 * Math.PI / 180;

    const geometry = new THREE.IcosahedronGeometry(0.77, 13); // radius, detail
    const material = new THREE.MeshStandardMaterial({ 
        map: loader.load('/neptune.jpg'),
    });
    const neptuneMesh = new THREE.Mesh(geometry, material);
    neptuneGroup.add(neptuneMesh);

    const fresnelMat = getFresnelMat({
        rimHex: 0xB0E0E6,   
    });
    
    const nglowMesh = new THREE.Mesh(geometry, fresnelMat);
    nglowMesh.scale.setScalar(1.016);
    neptuneGroup.add(nglowMesh);

    return { group: neptuneGroup, meshes: { neptuneMesh, nglowMesh, } };

}