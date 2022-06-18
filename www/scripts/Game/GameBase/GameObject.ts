import * as THREE from 'three'
import { GameEvent } from './Event';
import { AmmoPhysics, ExtendedMesh, PhysicsLoader } from '@enable3d/ammo-physics'
export abstract class GameObject {
  abstract uid: number;
  abstract position: THREE.Vector3;
  abstract meshes: Array<ExtendedMesh>;
  abstract update(dt: number): void;
  abstract onEvent(event: GameEvent) : void;
  addToScene(scene: THREE.Scene) : void {
    for (let idx = 0; idx < this.meshes.length; idx++) {
      scene.add(this.meshes[idx]);
    }
  }
  removeFromScene(scene: THREE.Scene): void {
    for (let idx = 0; idx < this.meshes.length; idx++) {
      scene.remove(this.meshes[idx]);
    }
  }
  destroyPhysics(physics: AmmoPhysics) {
    for (let idx = 0; idx < this.meshes.length; idx++) {
      physics.destroy(this.meshes[idx]);
    }
  }
}


