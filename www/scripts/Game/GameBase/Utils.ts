import * as THREE from 'three'
import { CurvePath } from 'three';
export function genRandInt(min: number, max: number) : number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function genRandFloat(min: number, max: number) : number {
  return Math.random() * (max - min + 1) + min;
}
export function createBox(iRadii? : number, iColor?: THREE.Color) : THREE.Mesh {
  let radii = iRadii? iRadii : 1;
  let color = iColor? iColor : new THREE.Color(0x000000);
  let cubeGeometry = new THREE.BoxGeometry(radii, radii, radii);
  let cubeMaterial = new THREE.MeshLambertMaterial({color: color});
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  return cube;
}