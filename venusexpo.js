import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getVenus() {
    const loader = new THREE.TextureLoader();
    const venusGroup = new THREE.Group();
    venusGroup.rotation.z = -177.3 * Math.PI / 180;

    const geometry = new THREE.IcosahedronGeometry(0.81, 13); // radius, detail
    const material = new THREE.MeshStandardMaterial({ 
        map: loader.load('/venus.jpg'),
    });
    const venusMesh = new THREE.Mesh(geometry, material);
    venusGroup.add(venusMesh);

    const fresnelMat = getFresnelMat({
        rimHex: 0xa0522d,   
    });
    
    const vglowMesh = new THREE.Mesh(geometry, fresnelMat);
    vglowMesh.scale.setScalar(1.015);
    venusGroup.add(vglowMesh);

    return { group: venusGroup, meshes: { venusMesh, vglowMesh, } };

}