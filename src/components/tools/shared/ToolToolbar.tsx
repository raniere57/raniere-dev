import type { ReactNode } from 'react'

interface ToolToolbarProps {
  children?: ReactNode
  /** Botão principal — alinhado à direita quando separado do restante */
  action?: ReactNode
}

export function ToolToolbar({ children, action }: ToolToolbarProps) {
  if (!action) {
    return <div className="tool-convert__toolbar">{children}</div>
  }

  return (
    <div className="tool-convert__toolbar">
      {children ? <div className="tool-convert__toolbar-group">{children}</div> : null}
      <div className="tool-convert__toolbar-group tool-convert__toolbar-group--end">{action}</div>
    </div>
  )
}

export function ToolActionBar({ children }: { children: ReactNode }) {
  return <div className="tool-convert__action-bar">{children}</div>
}
