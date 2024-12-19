import { Coord } from '../utils/coords.js'
import { readLines } from '../utils/data.js'
import { CellData, CellPred, Matrix } from '../utils/matrix.js'

type Cell = number | null

type State = Cell[]
const DATA_FILE = 'data/2024/day9.in'

export async function day9() {
  const state = await load()

  const part1 = compact([...state])
  console.log('Part 1:', part1)

  const part2 = compact2(state)
  console.log('Part 2:', part2)
}

function compact2(state: State): number {
  // console.log('State:', renderAddress(state))
  let blockId = state.reduce(
    (acc: number, val) => (val != null && val > acc ? val : acc),
    0,
  )
  while (blockId >= 0) {
    const file = getBlockAddress(state, blockId)
    if (file[0] === 0) {
      blockId--
      continue
    }
    const fileLen = file[1] - file[0] + 1
    let freeBlock = getNextFreeBlock(state, 0)

    if (freeBlock && freeBlock[0] > file[1]) {
      blockId--
      continue
    }
    while (freeBlock !== null) {
      const freeLen = freeBlock[1] - freeBlock[0] + 1
      if (freeLen >= fileLen) {
        setAddress(state, freeBlock[0], freeBlock[0] + fileLen - 1, blockId)
        setAddress(state, file[0], file[1], null)
        break
      }
      freeBlock = getNextFreeBlock(state, freeBlock[1] + 1)
      if (freeBlock && freeBlock[0] > file[1]) {
        break
      }
    }

    blockId--
  }

  return checksum(state)
}

function setAddress(state: State, start: number, end: number, cell: Cell) {
  for (let i = start; i <= end; i++) {
    state[i] = cell
  }
}

function getBlockAddress(
  state: State,
  blockId: number,
): readonly [number, number] {
  let index = state.length
  let end: number | null = null
  let start: number | null = null
  while (index >= 0 && start === null) {
    if (state[index] === blockId && end === null) {
      end = index
    } else if (state[index] !== blockId && end !== null) {
      start = index + 1
    }
    index--
  }
  if (start === null) {
    start = 0
  }
  const s = state[start!]
  const e = state[end!]
  if (s !== blockId || e !== blockId) {
    console.log('State: ', renderState(state))
    throw new Error(`Block ${blockId} not found at ${start} to ${end}`)
  }
  return [start!, end!]
}

function getNextFreeBlock(
  state: State,
  startIndex: number,
): readonly [number, number] | null {
  let index = startIndex
  let end: number | null = null
  let start: number | null = null

  while (end === null && index < state.length) {
    if (state[index] === null && start === null) {
      start = index
    } else if (state[index] !== null && start !== null) {
      end = index - 1
    }

    index++
  }

  if (end === null) {
    end = state.length - 1
  }

  return start === null ? null : [start, end]
}

function compact(state: State): number {
  while (!isCompact(state)) {
    const firstEmptyIndex = state.findIndex((cell) => cell === null)
    const lastBlockIndex = state.findLastIndex((cell) => cell !== null)
    state[firstEmptyIndex] = state[lastBlockIndex]!
    state[lastBlockIndex] = null
  }

  return checksum(state)
}

function checksum(state: State): number {
  let sum = 0
  for (let i = 0; i < state.length; i++) {
    sum += state[i]! * i
  }

  return sum
}

function isCompact(state: State): boolean {
  const nullIndex = state.findIndex((cell) => cell === null)
  if (nullIndex === -1) return true

  return state.every((cell, index) =>
    index < nullIndex ? cell !== null : cell === null,
  )
}

async function load(): Promise<State> {
  const lines = await await readLines(DATA_FILE)

  if (lines.length !== 1) {
    throw new Error('Invalid input')
  }

  let blockId = 0
  const data = lines[0]!.split('').reduce((acc, val, idx) => {
    if (idx % 2 == 0) {
      const file = Array.from(
        { length: parseInt(val) },
        (_, i) => blockId as Cell,
      )
      acc = acc.concat(file)
      blockId++
    } else {
      acc = acc.concat(Array.from({ length: parseInt(val) }, () => null))
    }
    return acc
  }, [] as Cell[])

  return data
}

function renderState(state: Cell[]): string {
  return state.map((c) => (c === null ? '.' : c)).join('')
}

function renderAddress(state: Cell[]): string {
  return state.map((c, i) => `${i}:${c !== null ? c : '*'}`).join(', ')
}
