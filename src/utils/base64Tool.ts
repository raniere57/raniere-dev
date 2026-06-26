import { DataToolError, type DataToolResult } from './dataError'

export type Base64Direction = 'encode' | 'decode'

function encodeText(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function decodeText(encoded: string): string {
  const normalized = encoded.trim().replace(/\s+/g, '')
  try {
    const binary = atob(normalized)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    throw new DataToolError('Base64 inválido.')
  }
}

export function convertBase64(text: string, direction: Base64Direction): DataToolResult {
  const trimmed = text.trim()
  if (!trimmed) throw new DataToolError('Cole texto ou Base64 para converter.')

  if (direction === 'encode') {
    return {
      output: encodeText(text),
      meta: `${new TextEncoder().encode(text).length} bytes`,
    }
  }

  const output = decodeText(trimmed)
  return {
    output,
    meta: `${output.length} caracteres`,
  }
}

export async function fileToBase64(file: File): Promise<DataToolResult> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return {
    output: btoa(binary),
    meta: `${file.name} · ${bytes.length} bytes`,
  }
}

export const base64Sample = {
  text: 'Olá, raniere.dev!',
  encoded: 'T2zDoSwgcmFuaWVyZS5kZXYh',
}
