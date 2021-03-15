import { Vector } from "./utils";

export abstract class DisplayElement {
  pos: Vector;
  constructor(pos: Vector) {
    this.pos = pos;
  }

  abstract render(): void;
}

export abstract class Entity extends DisplayElement {
  speed: Vector;

  constructor(pos: Vector, speed: Vector) {
    super(pos);
    this.speed = speed;
  }

  public move(dt: number) {
    this.pos.add(Vector.clone(this.speed).mtp(dt / 1000));
  }
}
