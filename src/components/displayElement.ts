import { Size, Vector } from "./utils";
import { Game } from "../app";

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
  hpBarDPos: Vector;
}

interface HpBarConfig {
  hookElement: Hittable;
  dPos: Vector;
  hideTimeout?: number;
  size?: Size;
}
export abstract class DisplayElement {
  pos: Vector;
  constructor({ pos }: DisplayElementConfig) {
    this.pos = pos;
  }

  abstract render(): void;
}

export class HpBar extends DisplayElement {
  hookElement: Hittable;
  dPos: Vector;
  isShown = false;
  size: Size;
  hideTimeout: number;
  private unshowTimeout: NodeJS.Timeout | null = null;

  constructor({
    hookElement,
    dPos,
    size = new Size(40, 8),
    hideTimeout = 5000,
  }: HpBarConfig) {
    super({ pos: Vector.clone(hookElement.pos).add(dPos) });

    this.hookElement = hookElement;
    this.hideTimeout = hideTimeout;
    this.dPos = dPos;
    this.size = size;
  }

  show(): void {
    this.isShown = true;
    if (this.unshowTimeout) clearTimeout(this.unshowTimeout);
    setTimeout(() => {
      this.isShown = false;
      this.unshowTimeout = null;
    }, this.hideTimeout);
  }

  render(): void {
    if (this.isShown) {
      this.pos = Vector.clone(this.hookElement.pos).add(this.dPos);
      Game.ctx.fillStyle = "red";
      Game.ctx.fillRect(
        this.pos.x - this.size.w / 2,
        this.pos.y,
        this.size.w,
        this.size.h
      );

      Game.ctx.fillStyle = "lime";
      Game.ctx.fillRect(
        this.pos.x - this.size.w / 2,
        this.pos.y,
        this.size.w * (this.hookElement.hp / this.hookElement.maxHp),
        this.size.h
      );
    }
  }
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

  public move(dt: number): void {
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

  public includes(v: Vector): boolean {
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
  maxHp: number;
  hitbox: Hitbox[] = [];
  hpBar: HpBar;

  constructor({
    pos,
    vel,
    accl,
    maxVel,
    mass = 1,
    hp = 1,
    hpBarDPos,
  }: HittableConfig) {
    super({ pos, vel, accl, maxVel });
    this.m = mass;
    this.maxHp = hp;
    this.hp = hp;
    this.hpBar = new HpBar({ hookElement: this, dPos: hpBarDPos });
  }

  public collides(e: Entity): boolean {
    const relPos = Vector.clone(e.pos).sub(this.pos);
    return this.hitbox.some((hb) => hb.includes(relPos));
  }
}
