import { readLines } from '../utils/data.js'
import util from 'util'

const WORD = 'XMAS'

export async function day4() {
  var data = await await readLines('data/2024/day4.in')

  const matrix = data.map((line) => line.split(''))

  let part1 = countXmas(matrix)

  let part2 = countMasOnX(matrix)

  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
}

function countMasOnX(matrix: string[][]): number {
  let total = 0
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y]!.length; x++) {
      const xMatrix = getXMatrix(matrix, x, y)
      if (xMatrix && isMasOnX(xMatrix)) {
        total++
        //console.log(`xMatrix: [${x},${y}]`, dump(xMatrix))
      }
    }
  }

  return total
}

function getXMatrix(
  matrix: string[][],
  x: number,
  y: number,
): string[][] | null {
  if (
    x >= 1 &&
    x <= matrix[y]!.length - 2 &&
    y >= 1 &&
    y <= matrix.length - 2
  ) {
    // get a 3x3 matrix centered on x, y
    const xMatrix = Array.from({ length: 3 }, (_, i) =>
      matrix[y - 1 + i]!.slice(x - 1, x + 2),
    )

    return xMatrix
  }
  return null
}

function isMasOnX(matrix: string[][]): boolean {
  const WORD = 'MAS'
  const CENTER = 1 // center position in 3x3 matrix
  const DELTAS = [
    [-1, -1], // up-left
    [1, -1], // up-right
    [-1, 1], // down-left
    [1, 1], // down-right
  ] as const

  const checkDirection = (dx: number, dy: number): boolean => {
    if (matrix[CENTER]![CENTER] !== 'A') return false

    const first = matrix[CENTER + dy]?.[CENTER + dx]
    const last = matrix[CENTER - dy]?.[CENTER - dx]

    return (first === 'M' && last === 'S') || (first === 'S' && last === 'M')
  }

  const matches = DELTAS.filter(([dx, dy]) => checkDirection(dx, dy))
  return matches.length === 4
}

function countXmas(matrix: string[][]): number {
  let total = 0
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y]!.length; x++) {
      const count = countXmasFromPos2(matrix, x, y)
      total += count
    }
  }

  return total
}

const DELTAS = [
  [-1, 0], // left
  [1, 0], // right
  [0, 1], // down
  [0, -1], // up
  [-1, -1], // diagonal up-left
  [1, -1], // diagonal up-right
  [-1, 1], // diagonal down-left
  [1, 1], // diagonal down-right
] as const

function countXmasFromPos2(
  matrix: string[][],
  startX: number,
  startY: number,
): number {
  const checkDirection = (dx: number, dy: number): boolean => {
    if (
      startX + dx * (WORD.length - 1) < 0 ||
      startX + dx * (WORD.length - 1) >= matrix[0]!.length ||
      startY + dy * (WORD.length - 1) < 0 ||
      startY + dy * (WORD.length - 1) >= matrix.length
    ) {
      return false
    }

    const word = Array.from(
      { length: WORD.length },
      (_, i) => matrix[startY + dy * i]![startX + dx * i]!,
    ).join('')

    return word === WORD
  }

  return DELTAS.reduce(
    (count, [dx, dy]) => count + (checkDirection(dx, dy) ? 1 : 0),
    0,
  )
}

function dump(matrix: string[][]): string {
  return '\n' + matrix.map((line) => line.join('')).join('\n')
}
