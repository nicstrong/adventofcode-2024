import { readLines } from '../utils/data.js'

type OrderingType = (readonly [number, number])[]
type Update = {
  ordering: OrderingType
  updates: number[][]
}

export async function day5() {
  var lines = await await readLines('data/2024/day5.in')

  const data = load(lines)

  const part1 = validUpdates(data)

  console.log('Part 1:', part1)

  const part2 = orderUpdates(data)
  console.log('Part 2:', part2)
}

function orderUpdates(data: Update): number {
  let sum = 0
  for (let i = 0; i < data.updates.length; ++i) {
    let update = data.updates[i]!
    if (!checkOrdering(update, data.ordering)) {
      for (let j = 0; j < update.length; ++j) {
        const page = update[j]!
        const { before, after } = matchingRules(page, data.ordering)
        const notBefore = before.filter(
          (rule) => !isBeforeOrAfter(page, rule[1], update, true),
        )
        if (notBefore.length > 0) {
          swapPages(notBefore[0]!, update)
          j--
          continue
        }
        const notAfter = after.filter(
          (rule) => !isBeforeOrAfter(page, rule[0], update, false),
        )
        if (notAfter.length > 0) {
          swapPages(notAfter[0]!, update)
          j--
          continue
        }
      }
      const middle = Math.trunc(update.length / 2)
      sum += update[middle]!
    }
  }
  return sum
}

function swapPages(rule: readonly [number, number], update: number[]) {
  const [before, after] = rule
  const beforeIndex = update.indexOf(before)
  const afterIndex = update.indexOf(after)
  update[beforeIndex] = after
  update[afterIndex] = before
}

function validUpdates(data: Update): number {
  let validMiddles: number[] = []
  for (const update of data.updates) {
    const valid = checkOrdering(update, data.ordering)
    if (valid) {
      const middle = Math.trunc(update.length / 2)
      validMiddles.push(update[middle]!)
    }
  }
  return validMiddles.reduce((acc, curr) => acc + curr, 0)
}
function checkOrdering(updates: number[], orderingRuls: OrderingType): boolean {
  for (const page of updates) {
    const { before, after } = matchingRules(page, orderingRuls)
    if (
      !before.every((rule) => isBeforeOrAfter(page, rule[1], updates, true))
    ) {
      return false
    }
    if (
      !after.every((rule) => isBeforeOrAfter(page, rule[0], updates, false))
    ) {
      return false
    }
  }
  return true
}
function matchingRules(page: number, rules: OrderingType) {
  return {
    before: rules.filter((rule) => rule[0] === page),
    after: rules.filter((rule) => rule[1] === page),
  }
}
function isBeforeOrAfter(
  page: number,
  target: number,
  updates: number[],
  before: boolean,
): boolean {
  const targetIndex = updates.indexOf(target)
  const pageIndex = updates.indexOf(page)
  if (targetIndex === -1) return true
  const res = before ? pageIndex < targetIndex : pageIndex > targetIndex
  return res
}

function load(lines: string[]): Update {
  let ordering = true
  let update: Update = { ordering: [], updates: [] }
  for (const line of lines) {
    if (line === '') {
      ordering = false
    } else if (ordering) {
      const [p1, p2] = line.split('|')
      update.ordering.push([parseInt(p1!), parseInt(p2!)])
    } else {
      const data = line.split(',').map((x) => parseInt(x))
      update.updates.push(data)
    }
  }

  return update
}
