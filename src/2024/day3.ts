import { readLines } from '../utils/utils.js'

export async function day3() {
  var data = await await readLines('data/2024/day3.in')

  const all = data.join('')

  const res = runMul(all)

  console.log('Part 1:', res)
}

function runMul(data: string) {
  const mul = extractMul(data)
  const res = mul.reduce((acc, [x, y]) => acc + x * y, 0)

  return res
}

function extractMul(data: string): (readonly [number, number])[] {
  // regex to extract the mul operator mul(x, y)
  const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g
  const matches = data.matchAll(mulRegex)
  const res = Array.from(matches).map(
    (m) => [parseInt(m[1]!), parseInt(m[2]!)] as const,
  )

  return res
}
