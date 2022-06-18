import * as THREE from "three";
import { GameEvent, EventTypes, MoveEvent } from "./GameBase/Event";
import {GameObject} from "./GameBase/GameObject"
import { AmmoPhysics, ExtendedMesh} from '@enable3d/ammo-physics'
import * as Utils from './GameBase/Utils'

export class Tubes extends GameObject {
  uid: number;
  //position of bottom (z = 0)
  passed: boolean = false;
  speed: number = 0.01;
  radius: number = 2;
  readonly position: THREE.Vector3 = new THREE.Vector3();
  meshes: Array<ExtendedMesh>;
  minHoleWidth: number = 7;
  maxHoleWidth: number = 10;
  constructor(iHeight: number, iPosition: THREE.Vector3, iPhysics: AmmoPhysics) {
    super();
    this.meshes = [];
    this.uid = 0;
    this.position.add(iPosition);
    let holeStart: number = Utils.genRandFloat(0, iHeight - this.minHoleWidth);
    let holeWidth: number = Utils.genRandFloat(this.minHoleWidth, this.maxHoleWidth);
    if (holeStart + holeWidth > iHeight)
      holeWidth = iHeight - holeStart;
    let holeEnd = holeStart + holeWidth;

    this.meshes.push(new ExtendedMesh(new THREE.CylinderGeometry(this.radius, this.radius, holeStart, 120), new THREE.MeshLambertMaterial({color: 0x00ff00})));
    this.meshes.push(new ExtendedMesh(new THREE.CylinderGeometry(this.radius, this.radius, iHeight - holeEnd, 120), new THREE.MeshLambertMaterial({color: 0x00ff00})));
    //init position and physics
    this.meshes[0].rotateX(Math.PI/2);
    this.meshes[1].rotateX(-Math.PI/2);
    this.meshes[0].position.set(this.position.x, this.position.y, this.position.z + holeStart/2);
    this.meshes[1].position.set(this.position.x, this.position.y, this.position.z + holeEnd + (iHeight - holeEnd)/2);
    iPhysics.add.existing(this.meshes[0] as any);
    iPhysics.add.existing(this.meshes[1] as any);
    this.meshes[0].body.setCollisionFlags(2);
    this.meshes[1].body.setCollisionFlags(2);
    this.meshes[0].body.checkCollisions = true;
    this.meshes[1].body.checkCollisions = true;
  }
  
  update(dt: number): void {
    let shift = new THREE.Vector3(-dt * this.speed, 0.0, 0.0);
    for (let idx = 0; idx < 2; idx++) {
      this.meshes[idx].position.add(shift);
      this.meshes[idx].body.needUpdate = true;
    }
    this.position.add(shift);
  }
  onEvent(event: GameEvent): void {
    
  }
}