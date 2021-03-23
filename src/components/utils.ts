export class Size {
  w: number;
  h: number;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
  }
}

export class Vector {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  public static clone(v: Vector): Vector {
    return new Vector().clone(v);
  }

  private clone(v: Vector): Vector {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  public add(v: Vector): Vector {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  public mtp(a: number): Vector {
    this.x *= a;
    this.y *= a;

    return this;
  }

  public sub(v: Vector): Vector {
    this.add(Vector.clone(v).mtp(-1));

    return this;
  }

  public get size(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}
