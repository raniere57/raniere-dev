export class DataToolError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DataToolError'
  }
}

export interface DataToolResult {
  output: string
  meta?: string
}
