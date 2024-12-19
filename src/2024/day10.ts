import { Coord } from '../utils/coords.js'
import { readLines } from '../utils/data.js'
import { Direction } from '../utils/direction.js'
import { CellData, CellPred, Matrix } from '../utils/matrix.js'

type Cell = number

type State = Matrix<Cell>
const DATA_FILE = 'data/2024/day10.sample.in'

export async function day10() {
  const state = await load()

  const part1 = trailheadSum(state)
  console.log('Part 1:', part1)

  const part2 = 0
  console.log('Part 2:', part2)
}

function trailheadSum(state: State): number {
  const trailheads = state.filter((cell) => cell === 0)

  let sum = 0
  for (let trailhead of trailheads) {
    const trails = findTrailBFS(state, trailhead.coord)
    console.log(`Trailhead ${trailhead.coord}: ${trails.length} valid`)
    for (let trail of trails) {
      drawTrail(state.numRows, state.numCols, trail)
      console.log()
    }
    sum += trails.length
  }
  return sum
}

type Path = {
  current: Coord
  visited: Set<string>
  sequence: number[]
}

function findTrailBFS(grid: State, trailhead: Coord): Coord[][] {
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
      validPaths.push(
        [...path.visited].map((coord) => {
          const cleaned = coord.replace(/[\(\)]/g, '') // Remove brackets
          const [x, y] = cleaned.split(',').map((val) => parseInt(val))
          return new Coord(x!, y!)
        }),
      )
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
