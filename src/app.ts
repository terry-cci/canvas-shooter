import { Entity, Hitbox, Hittable } from "./components/displayElement";
import { Size, Vector } from "./components/utils";
import "./style.css";

const canvasSize = new Size(400, 600);
const shooterSize = new Size(40, 40);
const bulletSize = new Size(8, 8);
const enemySize = new Size(30, 30);

class Shooter extends Entity {
  constructor() {
    super({
      pos: new Vector(
        canvasSize.w / 2 - shooterSize.w / 2,
        canvasSize.h - shooterSize.h
      ),
    });
  }

  public render() {
    Game.ctx.fillStyle = "#555";
    Game.ctx.fillRect(this.pos.x, this.pos.y, shooterSize.w, shooterSize.h);
  }
}

class Enemy extends Hittable {
  constructor(pos: Vector) {
    super({
      pos,
      vel: new Vector(0, 50),
      accl: new Vector(0, 50),
      mass: 20,
      hp: 7,
      maxVel: 75,
      hpBarDPos: new Vector(enemySize.w / 2, enemySize.h + 2),
    });

    this.hitbox.push(
      new Hitbox(new Vector(0, 0), new Vector(enemySize.w, enemySize.h))
    );
  }

  public render() {
    Game.ctx.fillStyle = "#333";
    Game.ctx.fillRect(this.pos.x, this.pos.y, enemySize.w, enemySize.h);
  }
}

class Bullet extends Entity {
  hit = false;

  constructor(x: number) {
    super({ pos: new Vector(x, shooter.pos.y), vel: new Vector(0, -600) });
  }

  public render() {
    Game.ctx.strokeStyle = "#777";
    Game.ctx.lineWidth = bulletSize.w;
    Game.ctx.lineCap = "square";

    Game.ctx.beginPath();
    Game.ctx.moveTo(this.pos.x, this.pos.y);
    Game.ctx.lineTo(this.pos.x, this.pos.y);
    Game.ctx.stroke();
  }
}

export class Game {
  static canvas: HTMLCanvasElement;
  static ctx: CanvasRenderingContext2D;
  static rect: DOMRect;
  static bullets: Bullet[] = [];
  enemies: Enemy[] = [];

  lastPaint = 0;

  constructor() {
    Game.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    Game.ctx = Game.canvas.getContext("2d") as CanvasRenderingContext2D;

    window.addEventListener("resize", this.onResize.bind(this));
    document.addEventListener("mousemove", this.handleMove.bind(this));
    document.addEventListener("click", this.handleMove.bind(this));
    document.addEventListener("click", this.handleShoot.bind(this));
    document.addEventListener("keydown", this.handleShoot.bind(this));
    document.addEventListener("contextmenu", (e) => {
      this.handleShoot(e);
      e.preventDefault();
    });
    this.onResize();
  }

  private onResize() {
    Game.rect = Game.canvas.getBoundingClientRect();
  }

  private spawnEnemy() {
    this.enemies.push(
      new Enemy(
        new Vector(Math.random() * (canvasSize.w - enemySize.w), -enemySize.h)
      )
    );
  }

  private handleMove(e: MouseEvent) {
    shooter.pos.x = e.clientX - Game.rect.x - shooterSize.w / 2;
    shooter.pos.x = Math.max(shooter.pos.x, 0);
    shooter.pos.x = Math.min(shooter.pos.x, canvasSize.w - shooterSize.w);
  }

  private handleShoot(e: Event) {
    if (e instanceof KeyboardEvent && e.repeat) return;

    Game.bullets.push(new Bullet(shooter.pos.x + shooterSize.w / 2));
  }

  public render(): void {
    const now = performance.now();
    const dt = now - this.lastPaint;

    // background
    Game.ctx.fillStyle = "#eee";
    Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

    // crosshair.render();

    if (Math.random() > 0.985) this.spawnEnemy();

    // bullets
    Game.bullets.forEach((b) => {
      b.render();
      b.move(dt);
    });

    Game.bullets = Game.bullets.filter((b) => b.pos.y >= 0);

    // enemies
    this.enemies.forEach((e) => {
      e.render();
      e.hpBar.render();
      e.move(dt);

      Game.bullets.forEach((b, j) => {
        if (e.collides(b)) {
          e.vel = Vector.clone(e.vel)
            .mtp(e.m)
            .add(Vector.clone(b.vel))
            .mtp(1 / e.m);
          e.hp--;

          e.hpBar.show();

          b.hit = true;
        }
      });
    });

    this.enemies = this.enemies.filter(
      (e) => e.pos.y <= canvasSize.h && e.hp > 0
    );
    Game.bullets = Game.bullets.filter((b) => !b.hit);

    shooter.render();

    this.lastPaint = now;
    requestAnimationFrame(this.render.bind(this));
  }
}

const game = new Game();
// const crosshair = new Crosshair(new Vector(0, 0));
const shooter = new Shooter();

game.render();
