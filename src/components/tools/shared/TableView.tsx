import type { TablePreviewData } from '../../../utils/tablePreview'

export function TableView({ data }: { data: TablePreviewData }) {
  if (data.headers.length === 0) {
    return <p className="tool-table__empty">Nenhuma linha para exibir.</p>
  }

  return (
    <div className="tool-table__wrap">
      <table className="tool-table">
        <thead>
          <tr>
            {data.headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
