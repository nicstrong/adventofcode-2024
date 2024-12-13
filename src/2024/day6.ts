import { readLines } from '../utils/utils.js'
import { coordEqual, Direction, type Coord } from '../utils/coords.js'

type State = {
  obstructions: Coord[]
  startPos: Coord
  numRows: number
  numCols: number
  direction: Coord
  visited: boolean[][]
}
const DATA_FILE = 'data/2024/day6.sample.in'

export async function day6() {
  const state = await load()

  //console.log('State:', state)
  console.log('Max:', state.numCols, state.numRows)

  const part1 = findUniqueVisits(state)

  console.log('Part 1:', part1)

  const part2 = findLoopObstructions(state)

  console.log('Part 2:', part2)
}

function findLoopObstructions(state: State): number {
  let loopCount = 0

  for (let y = 0; y < state.numRows; y++) {
    for (let x = 0; x < state.numCols; x++) {
      if (isObstruction([x, y], state) || coordEqual([x, y], state.startPos)) {
        continue
      }

      state.obstructions.push([x, y])

      const loop = isLoop(state)
      if (loop) {
        loopCount++
      }

      state.obstructions.pop()
      state.visited = newVisited(state.numRows, state.numCols)
      state.direction = Direction.N
    }
    console.log(`Obstruction: row: ${y} done. count=${loopCount}`)
  }
  return loopCount
}
function isLoop(state: State): boolean {
  if (findUniqueVisits(state) === false) {
    return true
  }
  return false
}

function findUniqueVisits(state: State): number | false {
  const { startPos, visited } = state

  let pos = startPos
  let uniqueVisits = 0
  let gridCells = state.numCols * state.numRows
  let loopDetected = 0

  while (pos) {
    const [x, y] = pos

    const debug = true // coordEqual(pos, [3, 6])

    if (!visited[y]![x]) {
      visited[y]![x] = true
      uniqueVisits++
      loopDetected = 0
    }

    const nextPos = getNextPos(pos, state)
    //if (debug) console.log('Next:', nextPos)
    if (!nextPos) {
      break
    }

    loopDetected++
    if (loopDetected > gridCells) {
      return false
    }

    pos = nextPos
  }

  return uniqueVisits
}

function getNextPos(pos: Coord, state: State): Coord | undefined {
  let [x, y] = pos

  while (true) {
    const nextX = x + state.direction[0]
    const nextY = y + state.direction[1]

    //console.log('Testing:', [nextX, nextY])

    if (
      nextX < 0 ||
      nextX >= state.numCols ||
      nextY < 0 ||
      nextY >= state.numRows
    ) {
      // off the grid
      //console.log('Off grid:', [nextX, nextY])
      return undefined
    }

    if (isObstruction([nextX, nextY], state)) {
      //console.log('Obstruction:', [nextX, nextY])
      // change direction and try again
      if (coordEqual(state.direction, Direction.N)) {
        state.direction = Direction.E
      } else if (coordEqual(state.direction, Direction.E)) {
        state.direction = Direction.S
      } else if (coordEqual(state.direction, Direction.S)) {
        state.direction = Direction.W
      } else if (coordEqual(state.direction, Direction.W)) {
        state.direction = Direction.N
      }
      continue
    }

    return [nextX, nextY]
  }
}

function isObstruction(coord: Coord, state: State): boolean {
  return state.obstructions.some(([x, y]) => x === coord[0] && y === coord[1])
}

async function load(): Promise<State> {
  const lines = await await readLines(DATA_FILE)

  let y = 0
  const obstructions: Coord[] = []
  let startPos: Coord | undefined = undefined
  for (const line of lines) {
    let x = 0
    for (const token of line.split('')) {
      if (token === '#') {
        obstructions.push([x, y])
      }
      if (token === '^') {
        startPos = [x, y]
      }
      x++
    }
    y++
  }

  if (!startPos) {
    throw new Error('Start position not found')
  }

  const numRows = lines.length
  const numCols = lines.reduce((acc, l) => (l.length > acc ? l.length : acc), 0)

  const visited = newVisited(numRows, numCols)

  return {
    obstructions,
    startPos,
    direction: Direction.N,
    visited,
    numRows,
    numCols,
  }
}

function newVisited(row: number, col: number): boolean[][] {
  return Array.from({ length: row }, () =>
    Array.from(
      {
        length: col,
      },
      () => false,
    ),
  )
}
