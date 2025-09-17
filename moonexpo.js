import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getMoon() {
    const loader = new THREE.TextureLoader();
    const moonGroup = new THREE.Group();
    moonGroup.rotation.z = -6.7 * Math.PI / 180; // tilt like real Moon

    const geometry = new THREE.IcosahedronGeometry(0.27, 13); // Moon radius ~0.27 of Earth

    const material = new THREE.MeshStandardMaterial({
        map: loader.load('/moon.jpg'),
        // optionally add emissive if you have night side texture
    });
    const moonMesh = new THREE.Mesh(geometry, material);
    moonGroup.add(moonMesh);

    // Optional glow around Moon
    const fresnelMat = getFresnelMat({ rimHex: 0xaaaaaa, facingHex: 0x555555 });
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);
    moonGroup.add(glowMesh);

    return {
        group: moonGroup,
        meshes: { moonMesh, glowMesh }
    };
}
