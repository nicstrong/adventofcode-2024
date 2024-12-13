import { readAocData, readLines } from '../utils/data.js'

export async function day1() {
  var data = await (await readAocData('data/2024/day1.in')).getTokens()

  const list1 = data.map((line) => parseInt(line[0]!)).sort()
  const list2 = data.map((line) => parseInt(line[1]!)).sort()

  console.log('Distances:', distances(list1, list2))

  const similar = list1.reduce((acc, value) => {
    const occurs = list2.filter((v) => v === value).length
    return acc + value * occurs
  }, 0)
  console.log('Similar:', similar)
}

function distances(list1: number[], list2: number[]): number {
  const distances = list1.reduce((acc, value, index) => {
    acc.push(Math.abs(value - list2[index]!))
    return acc
  }, [] as number[])

  const sum = distances.reduce((acc, value) => acc + value, 0)
  return sum
}
