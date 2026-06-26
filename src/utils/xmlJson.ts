import { DataToolError, type DataToolResult } from './dataError'

export type XmlJsonDirection = 'xml-to-json' | 'json-to-xml'

function xmlNodeToJson(node: Node): unknown {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim() ?? ''
    return text || undefined
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return undefined

  const element = node as Element
  const childElements = Array.from(element.children)
  const textContent = Array.from(element.childNodes)
    .filter((child) => child.nodeType === Node.TEXT_NODE)
    .map((child) => child.textContent?.trim() ?? '')
    .join('')
    .trim()

  if (childElements.length === 0) {
    return textContent || ''
  }

  const record: Record<string, unknown> = {}
  for (const child of childElements) {
    const key = child.nodeName
    const value = xmlNodeToJson(child)
    if (value === undefined) continue

    if (key in record) {
      const current = record[key]
      record[key] = Array.isArray(current) ? [...current, value] : [current, value]
    } else {
      record[key] = value
    }
  }

  return record
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function jsonToXml(value: unknown, tagName = 'root', depth = 0): string {
  const indent = '  '.repeat(depth)

  if (value === null || value === undefined) {
    return `${indent}<${tagName}></${tagName}>`
  }

  if (typeof value !== 'object') {
    return `${indent}<${tagName}>${escapeXml(String(value))}</${tagName}>`
  }

  if (Array.isArray(value)) {
    return value
      .map((item, index) => jsonToXml(item, `${tagName.slice(0, -1) || 'item'}${index + 1}`, depth))
      .join('\n')
  }

  const entries = Object.entries(value as Record<string, unknown>)
  const inner = entries
    .map(([key, child]) => jsonToXml(child, key.replace(/[^a-zA-Z0-9_-]/g, '_'), depth + 1))
    .join('\n')

  return `${indent}<${tagName}>\n${inner}\n${indent}</${tagName}>`
}

export function convertXmlJson(input: string, direction: XmlJsonDirection): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole XML ou JSON para converter.')

  if (direction === 'xml-to-json') {
    const parser = new DOMParser()
    const doc = parser.parseFromString(trimmed, 'application/xml')
    const parseError = doc.querySelector('parsererror')
    if (parseError) throw new DataToolError('XML inválido.')

    const root = doc.documentElement
    const json = { [root.nodeName]: xmlNodeToJson(root) }
    return {
      output: JSON.stringify(json, null, 2),
      meta: `raiz: ${root.nodeName}`,
    }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new DataToolError('JSON inválido.')
  }

  const output = jsonToXml(parsed)
  return {
    output: `<?xml version="1.0" encoding="UTF-8"?>\n${output}`,
    meta: 'JSON → XML',
  }
}

export const xmlJsonSamples = {
  xml: `<pedido id="1">
  <cliente>Ana</cliente>
  <itens>
    <item>Notebook</item>
    <item>Mouse</item>
  </itens>
</pedido>`,
  json: `{
  "pedido": {
    "cliente": "Ana",
    "itens": {
      "item": ["Notebook", "Mouse"]
    }
  }
}`,
}
