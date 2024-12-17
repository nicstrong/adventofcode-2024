import { Coord } from '../utils/coords.js'
import { readLines } from '../utils/data.js'
import { Direction } from '../utils/direction.js'
import { CellData, CellPred, Matrix } from '../utils/matrix.js'

type Cell = {
  antenna?: string
  antinode: boolean
}
type State = Matrix<Cell>
const DATA_FILE = 'data/2024/day8.in'

export async function day8() {
  const state = await load()

  const part1 = getAntinodeCount(state.clone(), setAntinodePart1, isAntinode)
  console.log('Part 1:', part1)

  const part2 = getAntinodeCount(
    state.clone(),
    setAntinodePart2,
    (cell, x, y) => cell.antinode || cell.antenna !== undefined,
    true,
  )
  console.log('Part 2:', part2)
}

type Match = {
  direction: Coord
  distance: number
  antenna: string
  coord: Coord
}

function getAntinodeCount(
  state: State,
  setAntinode: (
    state: State,
    a: CellData<Cell>,
    b: CellData<Cell>,
    deltaX: number,
    deltaY: number,
  ) => void,
  countFunc: CellPred<Cell>,
  debug = false,
): number {
  const antennas = state.filter(isAntenna)

  for (let a of antennas) {
    for (let b of antennas) {
      if (a.coord.equals(b.coord) || a.data.antenna !== b.data.antenna) {
        continue
      }

      const deltaY = b.coord.y - a.coord.y
      const deltaX = b.coord.x - a.coord.x
      setAntinode(state, a, b, deltaX, deltaY)
    }
  }
  if (debug) {
    state.console(renderCell, false)
  }
  const antinodes = state.filter(countFunc)

  return antinodes.length
}

function setAntinodePart2(
  state: State,
  a: CellData<Cell>,
  b: CellData<Cell>,
  deltaX: number,
  deltaY: number,
) {
  let cCol = a.coord.x - deltaX
  let cRow = a.coord.y - deltaY
  while (setAntinodeIfInBound(state, cCol, cRow)) {
    cCol -= deltaX
    cRow -= deltaY
  }
  let dRow = b.coord.y + deltaY
  let dCol = b.coord.x + deltaX
  while (setAntinodeIfInBound(state, dCol, dRow)) {
    dCol += deltaX
    dRow += deltaY
  }
}

function setAntinodePart1(
  state: State,
  a: CellData<Cell>,
  b: CellData<Cell>,
  deltaX: number,
  deltaY: number,
) {
  const cCol = a.coord.x - deltaX
  const cRow = a.coord.y - deltaY
  setAntinodeIfInBound(state, cCol, cRow)
  const dRow = b.coord.y + deltaY
  const dCol = b.coord.x + deltaX
  setAntinodeIfInBound(state, dCol, dRow)
}
function setAntinodeIfInBound(state: State, x: number, y: number) {
  if (state.inBounds(x, y)) {
    state.set(x, y, (prev) => ({
      ...prev,
      antinode: true,
    }))
    return true
  }
  return false
}

async function load(): Promise<State> {
  const lines = await await readLines(DATA_FILE)
  return Matrix.load(lines, (cell) => {
    if (cell == '.') {
      return { antinode: false } as Cell
    }
    if (cell == '#') {
      return { antinode: true } as Cell
    }
    return { antenna: cell, antinode: false } as Cell
  })
}

function renderCell(cell: Cell): string {
  if (cell.antinode) {
    return '#'
  }
  if (cell.antenna) {
    return cell.antenna
  }
  return '.'
}

function isAntenna(cell: Cell): boolean {
  return !!cell.antenna
}

function isAntinode(cell: Cell): boolean {
  return cell.antinode
}
