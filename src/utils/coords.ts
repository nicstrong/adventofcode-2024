export type Coord = readonly [number, number]

export const Direction = {
  N: [0, -1] as Coord,
  S: [0, 1] as Coord,
  W: [-1, 0] as Coord,
  E: [1, 0] as Coord,

  NE: [1, -1] as Coord,
  NW: [-1, -1] as Coord,
  SE: [1, 1] as Coord,
  SW: [-1, 1] as Coord,
}

export const Directions = Object.values(Direction)

export const coordEqual = (a: Coord, b: Coord) => a[0] === b[0] && a[1] === b[1]
