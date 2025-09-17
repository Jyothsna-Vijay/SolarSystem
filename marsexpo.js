import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getMars() {
    const loader = new THREE.TextureLoader();
    const marsGroup = new THREE.Group();
    marsGroup.rotation.z = -177.3 * Math.PI / 180;

    const geometry = new THREE.IcosahedronGeometry(0.54, 13); // radius, detail
    const material = new THREE.MeshStandardMaterial({ 
        map: loader.load('/mars.jpg'),
    });
    const marsMesh = new THREE.Mesh(geometry, material);
    marsGroup.add(marsMesh);

    const fresnelMat = getFresnelMat({
        rimHex: 0xa0522d,   
    });
    
    const marglowMesh = new THREE.Mesh(geometry, fresnelMat);
    marglowMesh.scale.setScalar(1.015);
    marsGroup.add(marglowMesh);

    return { group: marsGroup, meshes: { marsMesh, marglowMesh, } };

}