import { Size } from "./components/utils";
import "./style.css";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const canvasSize = new Size(400, 600);
const shooterSize = new Size(40, 40);
const bulletSize = new Size(8, 8);

let canvasRect = canvas.getBoundingClientRect();
let lastPaint = 0;
const bullets: Bullet[] = [];

let mouseDebug = { x: 0, y: 0 };

class Shooter {
  x = canvasSize.w / 2 - shooterSize.w / 2;
  y = canvasSize.h - shooterSize.h;

  constructor() {
    document.body.addEventListener("mousemove", this.handleMove.bind(this));
    document.body.addEventListener("click", this.handleMove.bind(this));
    document.body.addEventListener("click", this.handleShoot.bind(this));
    canvas.addEventListener("contextmenu", (e) => {
      this.handleShoot();
      e.preventDefault();
    });
  }

  public handleMove(e: MouseEvent) {
    mouseDebug.x = e.clientX - canvasRect.x;
    mouseDebug.y = e.clientY - canvasRect.y;

    this.x = e.clientX - canvasRect.x - shooterSize.w / 2;
    this.x = Math.max(this.x, 0);
    this.x = Math.min(this.x, canvasSize.w - shooterSize.w);
    requestAnimationFrame(draw);
  }

  public handleShoot() {
    bullets.push(new Bullet(this.x + shooterSize.w / 2));
    requestAnimationFrame(draw);
  }
}

class Bullet {
  x: number;
  y = shooter.y;
  dy: number = -400;

  constructor(x: number) {
    this.x = x;
  }
}

window.addEventListener("resize", () => {
  canvasRect = canvas.getBoundingClientRect();
});

function draw() {
  if (ctx) {
    const now = performance.now();
    const dt = now - lastPaint;

    // background
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // shooter
    ctx.fillStyle = "#555";
    ctx.fillRect(shooter.x, shooter.y, shooterSize.w, shooterSize.h);

    // bullets
    bullets.forEach((b, i) => {
      ctx.strokeStyle = "#777";
      ctx.lineWidth = bulletSize.w;
      ctx.lineCap = "square";

      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      b.y += b.dy * (dt / 1000);

      if (b.y < 0) bullets.splice(i, 1);
    });

    //  mouse debug
    ctx.strokeStyle = "#ff000022";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mouseDebug.x, 0);
    ctx.lineTo(mouseDebug.x, canvasSize.h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, mouseDebug.y);
    ctx.lineTo(canvasSize.w, mouseDebug.y);
    ctx.stroke();

    lastPaint = now;
    requestAnimationFrame(draw);
  }
}

const shooter = new Shooter();
draw();
