import * as THREE from 'three';
import { getFresnelMat } from './getFresnelMat.js';

export default function getMercury() {
    const loader = new THREE.TextureLoader();
    const mercuryGroup = new THREE.Group();
    mercuryGroup.rotation.z = -23.4 * Math.PI / 180;

    const geometry = new THREE.IcosahedronGeometry(0.44, 13); // radius, detail
    const material = new THREE.MeshStandardMaterial({ // Dont need lights for MeshBasicMaterial
        map: loader.load('/mercury.jpg'),
        //color: 0x444444,   // golden brown tint
        //metalness: 0.2,    // slight metallic feel
        //roughness: 30,    // keep surface matte & rocky
    });
    const mercuryMesh = new THREE.Mesh(geometry, material);
    mercuryGroup.add(mercuryMesh); 
    
    const fresnelMat = getFresnelMat({
        rimHex: 0xa0522d,   // orange-red rim  0xa0522d
        //facingHex: 0xffa500 
    });
  
    const merglowMesh = new THREE.Mesh(geometry, fresnelMat);
    merglowMesh.scale.setScalar(1.015);
    mercuryGroup.add(merglowMesh);

    return { group: mercuryGroup, meshes: { mercuryMesh, merglowMesh, } };
  }