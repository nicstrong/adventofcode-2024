import { readLines } from '../utils/utils.js'

type MulCommand = {
  type: 'mul'
  index: number
  x: number
  y: number
}
type DoCommand = {
  type: 'do'
  index: number
}
type DontCommand = {
  type: 'dont'
  index: number
}

type Command = DoCommand | DontCommand | MulCommand

export async function day3() {
  var data = await await readLines('data/2024/day3.in')

  const all = data.join('')

  const commands = extractCommands(all)

  let part1 = 0
  let part2 = 0

  let running = true
  for (const command of commands) {
    switch (command.type) {
      case 'do':
        running = true
        break
      case 'dont':
        running = false
        break
      case 'mul':
        part1 += command.x * command.y
        if (running) {
          part2 += command.x * command.y
        }
        break
    }
  }
  console.log('Part 1:', part1)
  console.log('Part 2:', part2)
}

function extractCommands(data: string): Command[] {
  // regex to extract the mul operator mul(x, y)
  const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g
  const muls = Array.from(data.matchAll(mulRegex)).map((match) => {
    const x = parseInt(match[1]!)
    const y = parseInt(match[2]!)
    return { type: 'mul', x, y, index: match.index } as MulCommand
  })
  const dos = Array.from(data.matchAll(/do\(\)/g)).map(
    (match) =>
      ({
        type: 'do',
        index: match.index,
      } as DoCommand),
  )
  const donts = Array.from(data.matchAll(/don't\(\)/g)).map(
    (match) =>
      ({
        type: 'dont',
        index: match.index,
      } as DontCommand),
  )
  return [...muls, ...dos, ...donts].sort((a, b) => a.index - b.index)
}
