export type Coord = readonly [number, number]

export const Direction = {
  UP: [0, -1] as Coord,
  DOWN: [0, 1] as Coord,
  LEFT: [-1, 0] as Coord,
  RIGHT: [1, 0] as Coord,
}

export const coordEqual = (a: Coord, b: Coord) => a[0] === b[0] && a[1] === b[1]
