import { DisplayElement, Entity } from "./components/displayElement";
import { Size, Vector } from "./components/utils";
import "./style.css";

const canvasSize = new Size(400, 600);
const shooterSize = new Size(40, 40);
const bulletSize = new Size(8, 8);

class Shooter extends Entity {
  constructor() {
    super(
      new Vector(
        canvasSize.w / 2 - shooterSize.w / 2,
        canvasSize.h - shooterSize.h
      ),
      new Vector(0, 0)
    );

    document.body.addEventListener("mousemove", this.handleMove.bind(this));
    document.body.addEventListener("click", this.handleMove.bind(this));
    document.body.addEventListener("click", this.handleShoot.bind(this));

    Game.canvas.addEventListener("contextmenu", (e) => {
      this.handleShoot();
      e.preventDefault();
    });
  }

  private handleMove(e: MouseEvent) {
    this.pos.x = e.clientX - Game.rect.x - shooterSize.w / 2;
    this.pos.x = Math.max(this.pos.x, 0);
    this.pos.x = Math.min(this.pos.x, canvasSize.w - shooterSize.w);
  }

  private handleShoot() {
    Game.bullets.push(new Bullet(this.pos.x + shooterSize.w / 2));
  }

  public render() {
    Game.ctx.fillStyle = "#555";
    Game.ctx.fillRect(this.pos.x, this.pos.y, shooterSize.w, shooterSize.h);
  }
}

class Bullet extends Entity {
  constructor(x: number) {
    super(new Vector(x, shooter.pos.y), new Vector(0, -450));
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

class Crosshair extends DisplayElement {
  constructor(pos: Vector) {
    super(pos);
    document.addEventListener("mousemove", this.handleMove.bind(this));
  }
  render() {
    Game.ctx.strokeStyle = "#ff000022";
    Game.ctx.lineWidth = 1;
    Game.ctx.beginPath();
    Game.ctx.moveTo(this.pos.x, 0);
    Game.ctx.lineTo(this.pos.x, canvasSize.h);
    Game.ctx.stroke();

    Game.ctx.beginPath();
    Game.ctx.moveTo(0, this.pos.y);
    Game.ctx.lineTo(canvasSize.w, this.pos.y);
    Game.ctx.stroke();
  }

  private handleMove(e: MouseEvent) {
    this.pos.x = e.clientX - Game.rect.x;
    this.pos.y = e.clientY - Game.rect.y;
  }
}

class Game {
  static canvas: HTMLCanvasElement;
  static ctx: CanvasRenderingContext2D;
  static rect: DOMRect;
  static bullets: Bullet[] = [];

  lastPaint = 0;

  constructor() {
    Game.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    Game.ctx = Game.canvas.getContext("2d") as CanvasRenderingContext2D;

    window.addEventListener("resize", this.onResize.bind(this));
    this.onResize();
  }

  private onResize() {
    Game.rect = Game.canvas.getBoundingClientRect();
  }

  public render() {
    const now = performance.now();
    const dt = now - this.lastPaint;

    // background
    Game.ctx.fillStyle = "#eee";
    Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

    crosshair.render();

    // bullets
    Game.bullets.forEach((b, i) => {
      b.render();
      b.move(dt);
      if (b.pos.y < 0) Game.bullets.splice(i, 1);
    });

    shooter.render();

    this.lastPaint = now;
    requestAnimationFrame(this.render.bind(this));
  }
}

const game = new Game();
const crosshair = new Crosshair(new Vector(0, 0));
const shooter = new Shooter();
game.render();
