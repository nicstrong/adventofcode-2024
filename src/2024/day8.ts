import { Coord } from '../utils/coords.js'
import { readLines } from '../utils/data.js'
import { Direction } from '../utils/direction.js'
import { Matrix } from '../utils/matrix.js'

type Cell = {
  antenna?: string
  antinode: boolean
}
type State = Matrix<Cell>
const DATA_FILE = 'data/2024/day8.in'

export async function day8() {
  const state = await load()

  state.console(renderCell, true)
  const part1 = getAntinodeCount(state.clone())
  console.log('Part 1:', part1)

  const part2 = 0
  console.log('Part 2:', part2)
}

type Match = {
  direction: Coord
  distance: number
  antenna: string
  coord: Coord
}

function getAntinodeCount(state: State): number {
  const antennas = state.filter(isAntenna)

  for (let a of antennas) {
    for (let b of antennas) {
      if (a.coord.equals(b.coord) || a.data.antenna !== b.data.antenna) {
        continue
      }

      const deltaRow = b.coord.y - a.coord.y
      const deltaCol = b.coord.x - a.coord.x
      const cCol = a.coord.x - deltaCol
      const cRow = a.coord.y - deltaRow
      if (state.inBounds(cCol, cRow)) {
        state.set(cCol, cRow, (prev) => ({
          ...prev,
          antinode: true,
        }))
      }
      const dRow = b.coord.y + deltaRow
      const dCol = b.coord.x + deltaCol
      if (state.inBounds(dCol, dRow)) {
        state.set(dCol, dRow, (prev) => ({
          ...prev,
          antinode: true,
        }))
      }
    }
  }
  state.console(renderCell, true)
  const antinodes = state.filter(isAntinode)

  return antinodes.length
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
