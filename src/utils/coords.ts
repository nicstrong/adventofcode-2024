export class Coord {
  constructor(readonly x: number, readonly y: number) {}

  static from([x, y]: readonly [number, number]): Coord {
    return new Coord(x, y)
  }

  equals(other: Coord): boolean {
    return this.x === other.x && this.y === other.y
  }

  equalsArray([x, y]: readonly [number, number]): boolean {
    return this.x === x && this.y === y
  }

  add(other: Coord): Coord {
    return new Coord(this.x + other.x, this.y + other.y)
  }

  multiply(scalar: number): Coord {
    return new Coord(this.x * scalar, this.y * scalar)
  }

  toString(): string {
    return `${this.x},${this.y}`
  }

  hash(): string {
    return `${this.x}_${this.y}`
  }

  toArray(): readonly [number, number] {
    return [this.x, this.y] as const
  }

  manhattan(other: Coord): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
  }

  euclidean(other: Coord): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2)
  }

  direction(other: Coord): Coord {
    return new Coord(Math.sign(other.x - this.x), Math.sign(other.y - this.y))
  }
}
