import { readLines } from '../utils/data.js'

type Equation = {
  result: number
  operands: number[]
}

type SolutionFn = (operands: number[], ops: string[], target: number) => boolean

const DATA_FILE = 'data/2024/day7.in'

export async function day7() {
  const equations = await load()
  //console.log('Equations:', equations)

  const part1 = solvable(equations, ['+', '*'], isSolutionPart1)
  console.log('Part 1:', part1)

  const part2 = solvable(equations, ['+', '*', '||'], isSolutionPart2)
  console.log('Part 2:', part2)
}

function solvable(
  equations: Equation[],
  ops: string[],
  solnFn: SolutionFn,
): number {
  let sum = 0
  let idx = 0
  for (let equation of equations) {
    console.log(
      `Finding solutions for equation ${idx + 1} of ${equations.length}`,
    )
    const solutions = findSolutionBFS(
      equation.operands,
      equation.result,
      ops,
      solnFn,
    )
    if (solutions.length > 0) {
      sum += equation.result
    }

    idx++
  }

  return sum
}

type SearchState = {
  operators: string[]
  result: number
}

function findSolutionBFS(
  operands: number[],
  target: number,
  ops: string[],
  solnFn: SolutionFn,
): string[][] {
  const queue: SearchState[] = [{ operators: [], result: 0 }]
  const visited = new Set<string>()
  const solutions: string[][] = []

  while (queue.length > 0) {
    const current = queue.shift()!

    if (current.operators.length === operands.length - 1) {
      //console.log('Trying:', current.operators)
      if (solnFn(operands, current.operators, target)) {
        solutions.push([...current.operators])
      }
      continue
    }

    for (const op of ops) {
      const newOps = [...current.operators, op]
      const key = newOps.join('')

      if (!visited.has(key)) {
        visited.add(key)
        queue.push({ operators: newOps, result: 0 })
      }
    }
  }

  return solutions
}

function isSolutionPart1(
  operands: number[],
  ops: string[],
  target: number,
): boolean {
  let total = operands[0]!
  for (let i = 1; i < operands.length; i++) {
    if (ops[i - 1] === '+') {
      total += operands[i]!
    } else {
      total *= operands[i]!
    }
  }
  return total === target
}

function isSolutionPart2(
  operands: number[],
  ops: string[],
  target: number,
): boolean {
  let total = operands[0]!
  for (let i = 1; i < operands.length; i++) {
    if (ops[i - 1] === '+') {
      total += operands[i]!
    } else if (ops[i - 1] === '*') {
      total *= operands[i]!
    } else {
      total = parseInt(`${total}${operands[i]}`)
    }
  }
  return total === target
}

async function load(): Promise<Equation[]> {
  const lines = await await readLines(DATA_FILE)

  return lines.map((line) => {
    const [result, operands] = line.split(':')
    return {
      result: parseInt(result!),
      operands: operands!
        .split(' ')
        .filter((x) => x != '')
        .map((op) => parseInt(op)),
    }
  })
}
