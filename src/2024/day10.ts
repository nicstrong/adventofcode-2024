import { Coord } from '../utils/coords.js'
import { readLines } from '../utils/data.js'
import { Direction } from '../utils/direction.js'
import { CellData, CellPred, Matrix } from '../utils/matrix.js'

type Cell = number

type State = Matrix<Cell>
const DATA_FILE = 'data/2024/day10.in'

export async function day10() {
  const state = await load()

  const part1 = trailheadSum(state, false)
  console.log('Part 1:', part1)

  const part2 = trailheadSum(state, true)
  console.log('Part 2:', part2)
}

function trailheadSum(state: State, allPaths: boolean): number {
  const trailheads = state.filter((cell) => cell === 0)

  let sum = 0
  for (let trailhead of trailheads) {
    const trails = findTrailBFS(state, trailhead.coord, allPaths)
    sum += trails.length
  }
  return sum
}

type Path = {
  current: Coord
  visited: Set<string>
  sequence: number[]
}

function findTrailBFS(
  grid: State,
  trailhead: Coord,
  allPaths: boolean,
): Coord[][] {
  const validPaths: Coord[][] = []
  const queue: Path[] = [
    {
      current: trailhead,
      visited: new Set([trailhead.toString()]),
      sequence: [grid.get(trailhead.x, trailhead.y)!],
    },
  ]

  const directions = [
    new Direction(0, 1), // South
    new Direction(0, -1), // North
    new Direction(1, 0), // East
    new Direction(-1, 0), // West
  ]

  while (queue.length > 0) {
    const path = queue.shift()!

    // Found complete path 0-9
    if (path.sequence.length === 10) {
      const last = Array.from(path.visited)[9]!
        .split(',')
        .map((val) => parseInt(val))

      // only add if level 9 has never been completed
      if (
        allPaths ||
        !validPaths.some(
          (trail) => trail[9]!.x === last[0] && trail[9]!.y === last[1],
        )
      ) {
        validPaths.push(
          [...path.visited].map((coord) => {
            const [x, y] = coord.split(',').map((val) => parseInt(val))
            return new Coord(x!, y!)
          }),
        )
      }

      continue
    }

    const expectedHeight = path.sequence.length

    // Try each direction
    for (const dir of directions) {
      const nextX = path.current.x + dir.dx
      const nextY = path.current.y + dir.dy
      const nextCoord = new Coord(nextX, nextY)
      const nextHeight = grid.get(nextX, nextY)

      if (
        nextHeight === expectedHeight &&
        !path.visited.has(nextCoord.toString())
      ) {
        queue.push({
          current: nextCoord,
          visited: new Set([...path.visited, nextCoord.toString()]),
          sequence: [...path.sequence, nextHeight],
        })
      }
    }
  }

  return validPaths
}

async function load(): Promise<State> {
  const lines = await await readLines(DATA_FILE)

  return Matrix.load(lines, (val) => (val === '.' ? -1 : parseInt(val)))
}

function drawTrail(rows: number, cols: number, trail: Coord[]) {
  const grid = Matrix.create(rows, cols, -1)

  for (let i = 0; i < trail.length; i++) {
    const coord = trail[i]!
    grid.set(coord.x, coord.y, i)
  }

  grid.console((cell) => (cell === -1 ? '.' : cell.toString()), false)
}
