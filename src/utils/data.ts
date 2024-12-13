import fs from 'node:fs/promises'
import { AocData, createAocData } from './AocData.js'

export async function readLines(filename: string): Promise<string[]> {
  const buf = await fs.readFile(filename, 'utf8')
  return buf.split(/\r?\n/)
}

export async function readAocData(filename: string): Promise<AocData> {
  const lines = await readLines(filename)
  return createAocData(lines)
}
