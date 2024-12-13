import { readLines } from '../utils/data.js'
import { Direction } from '../utils/direction.js'
import { Matrix } from '../utils/matrix.js'

type Cell = {
  antenna?: string
  antinode: boolean
}
type State = Matrix<Cell>
const DATA_FILE = 'data/2024/day8.sample.in'

export async function day8() {
  const state = await load()

  state.console(renderCell)
  const part1 = getAntinodeCount(state.clone())
  console.log('Part 1:', part1)

  const part2 = 0
  console.log('Part 2:', part2)
}

const SEARCH_DIRECTIONS = [
  Direction.NE,
  Direction.SE,
  Direction.SW,
  Direction.NW,
]

function getAntinodeCount(state: State): number {
  let count = 0
  state.foreach(isAntenna, (cell, row, col) => {
    for (let direction of SEARCH_DIRECTIONS) {
      const cells = state.findCellsOnCardinal(
        row,
        col,
        direction,
        (c) => cell.antenna === c.antenna,
      )
      if (cells.length > 0) {
      }
    }
  })
  return count
}

async function load(): Promise<State> {
  const lines = await await readLines(DATA_FILE)
  return Matrix.load(lines, (cell) => {
    if (cell == '.') {
      return { antinode: false }
    }
    if (cell == '#') {
      return { antinode: true }
    }
    return { antenna: cell, antinode: false }
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
