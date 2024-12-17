import { Coord } from './coords.js'

export class Direction {
  static N = new Direction(0, -1)
  static S = new Direction(0, 1)
  static W = new Direction(-1, 0)
  static E = new Direction(1, 0)
  static NE = new Direction(1, -1)
  static NW = new Direction(-1, -1)
  static SE = new Direction(1, 1)
  static SW = new Direction(-1, 1)

  dx: number
  dy: number

  constructor(readonly x: number, readonly y: number) {
    this.dx = x
    this.dy = y
  }
  opposite(): Direction {
    return new Direction(
      this.dx === 0 ? 0 : -this.dx,
      this.dy === 0 ? 0 : -this.dy,
    )
  }

  rotateClockwise90(): Direction {
    if (this.coord.equals(Direction.N.coord)) return Direction.E
    if (this.coord.equals(Direction.E.coord)) return Direction.S
    if (this.coord.equals(Direction.S.coord)) return Direction.W
    if (this.coord.equals(Direction.W.coord)) return Direction.N
    if (this.coord.equals(Direction.NE.coord)) return Direction.SE
    if (this.coord.equals(Direction.SE.coord)) return Direction.SW
    if (this.coord.equals(Direction.SW.coord)) return Direction.NW
    if (this.coord.equals(Direction.NW.coord)) return Direction.NE
    throw new Error('Invalid direction')
  }

  get coord(): Coord {
    return new Coord(this.dx, this.dy)
  }

  toString(): string {
    return `(${this.dx > 0 ? '+' : ''}${this.dx},${this.dy > 0 ? '+' : ''}${
      this.dy
    })`
  }
}

export const Directions = [
  Direction.N,
  Direction.S,
  Direction.W,
  Direction.E,
  Direction.NE,
  Direction.NW,
  Direction.SE,
  Direction.SW,
]
