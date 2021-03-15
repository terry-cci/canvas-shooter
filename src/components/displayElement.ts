import { Vector } from "./utils";

interface DisplayElementConfig {
  pos: Vector;
}
interface EntityConfig extends DisplayElementConfig {
  vel?: Vector;
  maxVel?: number;
  accl?: Vector;
}
interface HittableConfig extends EntityConfig {
  mass?: number;
  hp?: number;
}
export abstract class DisplayElement {
  pos: Vector;
  constructor({ pos }: DisplayElementConfig) {
    this.pos = pos;
  }

  abstract render(): void;
}

export abstract class Entity extends DisplayElement {
  vel: Vector;
  accl: Vector;
  maxVel: number;

  constructor({
    pos,
    vel = new Vector(),
    accl = new Vector(),
    maxVel = -1,
  }: EntityConfig) {
    super({ pos });
    this.vel = vel;
    this.accl = accl;
    this.maxVel = maxVel;
  }

  public move(dt: number) {
    this.pos.add(Vector.clone(this.vel).mtp(dt / 1000));
    this.vel.add(Vector.clone(this.accl).mtp(dt / 1000));

    if (this.maxVel !== -1 && this.vel.size > this.maxVel) {
      this.vel.mtp(this.maxVel / this.vel.size);
    }
  }
}

export class Hitbox {
  a: Vector;
  b: Vector;

  constructor(a: Vector, b: Vector) {
    this.a = a;
    this.b = b;
  }

  public includes(v: Vector) {
    return (
      Math.min(this.a.x, this.b.x) <= v.x &&
      v.x <= Math.max(this.a.x, this.b.x) &&
      Math.min(this.a.y, this.b.y) <= v.y &&
      v.y <= Math.max(this.a.y, this.b.y)
    );
  }
}

export abstract class Hittable extends Entity {
  m: number;
  hp: number;
  hitbox: Hitbox[] = [];

  constructor({ pos, vel, accl, maxVel, mass = 1, hp = 1 }: HittableConfig) {
    super({ pos, vel, accl, maxVel });
    this.m = mass;
    this.hp = hp;
  }

  public collides(e: Entity) {
    const relPos = Vector.clone(e.pos).sub(this.pos);
    return this.hitbox.some((hb) => hb.includes(relPos));
  }
}
