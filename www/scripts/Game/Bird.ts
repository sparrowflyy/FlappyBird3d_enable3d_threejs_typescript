import * as THREE from "three";
import { GameEvent, EventTypes, MoveEvent } from "./GameBase/Event";
import {GameObject} from "./GameBase/GameObject"
import { AmmoPhysics, ExtendedMesh} from '@enable3d/ammo-physics'

export class Bird extends GameObject {
  uid: number;
  position: THREE.Vector3;
  meshes: Array<ExtendedMesh>;
  velocity: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
  constructor(iPosition: THREE.Vector3, iPhysics: AmmoPhysics) {
    super();
    this.meshes = [];
    this.uid = 0;
    this.position = iPosition;
    let sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    this.meshes.push(new ExtendedMesh(sphereGeometry, sphereMaterial));
    this.meshes[0].position.add(this.position);
    iPhysics.add.existing(this.meshes[0] as any);
    this.meshes[0].body.setCollisionFlags(0);
    this.meshes[0].body.checkCollisions = true;
  }
  update(dt: number): void {
    if (this.velocity.length() > 0) {
      this.meshes[0].body.applyForce(this.velocity.x * dt, this.velocity.y * dt, this.velocity.z * dt)
      this.velocity.setLength(0.0);
      this.meshes[0].body.needUpdate = true;
    }
  };
  onEvent(event: GameEvent): void {
    switch (event.eventType) {
      case (EventTypes.MoveEvent): 
        let motionEvent = event as MoveEvent;
        this.velocity.set(motionEvent.vector.x, motionEvent.vector.y, motionEvent.vector.z);
        break;
      default:
        //unrecognized event
        break;
    }
  }
 }