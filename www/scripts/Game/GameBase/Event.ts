
import { Vector3 } from "three";
export enum EventTypes {
  MoveEvent,
  ColissionEvent
}

export abstract class GameEvent {
  abstract eventType: EventTypes
}

export class MoveEvent extends GameEvent {
  eventType: EventTypes = EventTypes.MoveEvent
  private vec3d: Vector3;
  constructor(vector: Vector3) {
    super();
    this.vec3d = vector;
  }
  get vector() {
    return this.vec3d;
  }
}