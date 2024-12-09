export type AocData = {
  lines: string[]
  getTokens(): string[][]
}

export function createAocData(lines: string[]): AocData {
  return {
    lines: lines,
    getTokens: function (): string[][] {
      return lines.map((line) => line.split(new RegExp('\\s+')))
    },
  }
}
