import { Coord } from './coords.js'
import { Direction } from './direction.js'

export type CellData<T> = {
  data: T
  coord: Coord
}

export type CellPred<T> = (cell: T, x: number, y: number) => boolean

export class Matrix<T> {
  private data: T[][]

  constructor(data: T[][]) {
    this.data = data
  }

  static load<T>(
    lines: string[],
    getCellState: (cell: string) => T,
  ): Matrix<T> {
    const data = lines.map((line) =>
      line.split('').map((cell) => getCellState(cell)),
    )
    return new Matrix(data)
  }

  static create<T>(rows: number, cols: number, value: T): Matrix<T> {
    const data = Array.from({ length: rows }, () => Array(cols).fill(value))
    return new Matrix(data)
  }

  console(renderCell: (cell: T) => string, axisLabel: boolean): void {
    if (axisLabel) {
      console.log(
        ' ' +
          Array.from({ length: this.data[0]!.length }, (_, i) =>
            i.toString(16).toUpperCase(),
          ).join(''),
      )
    }
    let idx = 0
    for (let row of this.data) {
      console.log(
        `${axisLabel ? idx.toString(16).toUpperCase() : ''}${row
          .map(renderCell)
          .join('')}`,
      )
      idx++
    }
  }

  clone(): Matrix<T> {
    return new Matrix(this.data.map((row) => row.slice()))
  }

  inBounds(x: number, y: number): boolean {
    return y >= 0 && y < this.data.length && x >= 0 && x < this.data[y]!.length
  }

  foreach(pred: CellPred<T>, fn: (cell: T, coord: Coord) => void): void {
    for (let row = 0; row < this.data.length; row++) {
      for (let col = 0; col < this.data[row]!.length; col++) {
        const cell = this.data[row]![col]!
        if (pred(cell, col, row)) {
          fn(cell, new Coord(col, row))
        }
      }
    }
  }

  count(pred: CellPred<T>): number {
    let count = 0
    this.foreach(pred, () => count++)
    return count
  }

  filter(pred: CellPred<T>): CellData<T>[] {
    const results: CellData<T>[] = []
    this.foreach(pred, (cell, coord) => {
      results.push({ data: cell, coord })
    })
    return results
  }

  findCellsOnCardinal(
    startX: number,
    startY: number,
    direction: Direction,
    pred: CellPred<T>,
  ): CellData<T>[] {
    const results: CellData<T>[] = []
    let x = startX + direction.dx
    let y = startY + direction.dy

    const start = new Coord(startX, startY)

    while (this.inBounds(x, y)) {
      console.log(`Checking: (${x}, ${y}) on dir: (${direction}) from ${start}`)
      const cell = this.data[y]![x]!
      if (pred(cell, x, y)) {
        results.push({ data: cell, coord: new Coord(x, y) })
      }
      y += direction.dy
      x += direction.dx
    }

    return results
  }

  get(x: number, y: number): T | undefined {
    return this.inBounds(x, y) ? this.data[y]![x] : undefined
  }

  set(x: number, y: number, valueOrSetter: T | ((prev: T) => T)): void {
    if (this.inBounds(x, y)) {
      if (typeof valueOrSetter === 'function') {
        const fn = valueOrSetter as (prev: T) => T
        this.data[y]![x] = fn(this.data[y]![x]!)
      } else {
        this.data[y]![x] = valueOrSetter
      }
    }
  }
}
