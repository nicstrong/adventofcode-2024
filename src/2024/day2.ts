import { readAocData, readLines } from '../utils/utils.js'

export async function day2() {
  var data = await (await readAocData('data/2024/day2.in')).getTokens()

  const safe = safeCount(data)
  console.log('Safe:', safe)

  const safeDamp = safeCountDampener(data)

  console.log('Safe Damp:', safeDamp)
}

function safeCount(data: string[][]): number {
  return data.reduce((count, line) => {
    const report = line.map((tok) => parseInt(tok))
    const safe = isSafe(report)
    return count + (safe ? 1 : 0)
  }, 0)
}

function safeCountDampener(data: string[][]): number {
  return data.reduce((count, line) => {
    const report = line.map((tok) => parseInt(tok))

    if (isSafe(report)) {
      return count + 1
    }

    for (let i = 0; i < report.length; i++) {
      // remove the ith element
      const dampended = report.slice(0, i).concat(report.slice(i + 1))
      if (isSafe(dampended)) {
        return count + 1
      }
    }

    return count
  }, 0)
}

function isSafe(report: number[]): boolean {
  const deltas = report.reduce(
    (acc, curr, idx) => (idx === 0 ? acc : [...acc, curr - report[idx - 1]!]),
    [] as number[],
  )

  const safe =
    deltas.length > 0 &&
    deltas.every((d) => Math.abs(d) <= 3 && d !== 0) &&
    (deltas.every((d) => d > 0) || deltas.every((d) => d < 0))

  return safe
}
