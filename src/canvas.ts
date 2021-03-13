const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const canvasSize = {
  width: 400,
  height: 600,
};

const shooterSize = {
  width: 40,
  height: 40,
};

const bulletSize = {
  width: 8,
  height: 8,
};

let canvasRect = canvas.getBoundingClientRect();
let lastPaint = new Date();

const bullets: Bullet[] = [];

class Shooter {
  x = canvasSize.width / 2 - shooterSize.width / 2;
  y = canvasSize.height - shooterSize.height;

  constructor() {
    document.body.addEventListener("mousemove", this.handleMove.bind(this));
    document.body.addEventListener("click", this.handleMove.bind(this));
    document.body.addEventListener("click", this.handleShoot.bind(this));
  }

  public handleMove(e: MouseEvent) {
    this.x = e.clientX - canvasRect.x;
    this.x = Math.max(this.x, 0);
    this.x = Math.min(this.x, canvasSize.width - shooterSize.width);
    draw();
  }

  public handleShoot() {
    bullets.push(new Bullet(this.x + shooterSize.width / 2));
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
    const now = new Date();
    const dt = Number(now) - Number(lastPaint);

    // background
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // shooter
    ctx.fillStyle = "#555";
    ctx.fillRect(shooter.x, shooter.y, shooterSize.width, shooterSize.height);

    // bullets
    if (bullets.length) requestAnimationFrame(draw);

    bullets.forEach((b, i) => {
      ctx.strokeStyle = "#777";
      ctx.lineWidth = bulletSize.width;
      ctx.lineCap = "square";

      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      b.y += b.dy * (dt / 1000);

      if (b.y < 0) bullets.splice(i, 1);
    });

    lastPaint = now;
  }
}

const shooter = new Shooter();
draw();
