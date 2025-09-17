// Sun.js
import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getSun() {
    const sunGroup = new THREE.Group();

    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(2, 13);

    const material = new THREE.MeshBasicMaterial({
        map: loader.load('/sun.jpg'),
    });
    const sunMesh = new THREE.Mesh(geometry, material);
    sunGroup.add(sunMesh);

    const fresnelMat = getFresnelMat({
        rimHex: 0xffa500,
        facingHex: 0xffa500,
    });
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.015);
    sunGroup.add(glowMesh);

    //const hemisphereLight = new THREE.HemisphereLight(0xff6600, 0xff4500, 1);
    //sunGroup.add(hemisphereLight);

    // Optional: return the Sun mesh and glow for rotation control
    return {
        group: sunGroup,
        sunMesh,
        glowMesh,
    };
}
