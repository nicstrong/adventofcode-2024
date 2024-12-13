import { Direction } from './direction.js'

type CellAndCoords<T> = {
  cell: T
  row: number
  col: number
}

type CellPred<T> = (cell: T, row: number, col: number) => boolean

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

  console(renderCell: (cell: T) => string): void {
    for (let row of this.data) {
      console.log(row.map(renderCell).join(''))
    }
  }

  clone(): Matrix<T> {
    return new Matrix(this.data.map((row) => row.slice()))
  }

  inBounds(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.data.length &&
      col >= 0 &&
      col < this.data[row]!.length
    )
  }

  foreach(
    pred: CellPred<T>,
    fn: (cell: T, row: number, col: number) => void,
  ): void {
    for (let row = 0; row < this.data.length; row++) {
      for (let col = 0; col < this.data[row]!.length; col++) {
        const cell = this.data[row]![col]!
        if (pred(cell, row, col)) {
          fn(cell, row, col)
        }
      }
    }
  }

  count(pred: CellPred<T>): number {
    let count = 0
    this.foreach(pred, () => count++)
    return count
  }

  findCellsOnCardinal(
    startX: number,
    startY: number,
    direction: Direction,
    pred: CellPred<T>,
  ): CellAndCoords<T>[] {
    const results: CellAndCoords<T>[] = []
    let row = startY
    let col = startX

    while (this.inBounds(row, col)) {
      const cell = this.data[row]![col]!
      if (pred(cell, row, col)) {
        results.push({ cell, row, col })
      }
      row += direction.dx
      col += direction.dy
    }

    return results
  }

  get(row: number, col: number): T | undefined {
    return this.inBounds(row, col) ? this.data[row]![col] : undefined
  }

  set(row: number, col: number, value: T): void {
    if (this.inBounds(row, col)) {
      this.data[row]![col] = value
    }
  }
}
