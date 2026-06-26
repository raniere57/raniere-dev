import type { ReactNode } from 'react'

interface ToolToolbarProps {
  children?: ReactNode
  /** Botão principal — alinhado à direita */
  action?: ReactNode
}

export function ToolToolbar({ children, action }: ToolToolbarProps) {
  return (
    <div className="tool-convert__toolbar">
      {children ? <div className="tool-convert__toolbar-group">{children}</div> : null}
      {action ? <div className="tool-convert__toolbar-group tool-convert__toolbar-group--end">{action}</div> : null}
    </div>
  )
}

/** Barra só de ação — mesmo visual da toolbar, conteúdo à direita */
export function ToolActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="tool-convert__toolbar tool-convert__toolbar--action">
      <div className="tool-convert__toolbar-group">{children}</div>
    </div>
  )
}
