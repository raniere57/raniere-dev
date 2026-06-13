import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

interface SqlEditorProps {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
}

// Keyword highlight categories
const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "IS", "NULL",
  "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "FULL", "CROSS", "ON", "USING",
  "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET",
  "WITH", "AS", "UNION", "ALL", "DISTINCT",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
  "CREATE", "TABLE", "VIEW", "INDEX", "DROP", "ALTER",
  "CASE", "WHEN", "THEN", "ELSE", "END",
  "SUM", "COUNT", "AVG", "MIN", "MAX", "ROUND", "COALESCE", "LEAST", "GREATEST",
  "INTERVAL", "CURRENT_DATE", "CURRENT_TIMESTAMP", "DATE", "TIMESTAMP",
  "read_parquet", "read_csv_auto", "read_json_auto",
  "PARTITION", "OVER", "ROW_NUMBER", "RANK", "DENSE_RANK",
  "CAST", "TRY_CAST", "TYPEOF",
];

function highlightSQL(code: string): string {
  // Escape HTML
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments
  escaped = escaped.replace(
    /(--[^\n]*)/g,
    '<span style="color:#64748b;font-style:italic">$1</span>'
  );

  // Strings
  escaped = escaped.replace(
    /('(?:[^'\\]|\\.)*')/g,
    '<span style="color:#86efac">$1</span>'
  );

  // Numbers
  escaped = escaped.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    '<span style="color:#fdba74">$1</span>'
  );

  // Keywords
  const kwPattern = new RegExp(`\\b(${SQL_KEYWORDS.join("|")})\\b`, "gi");
  escaped = escaped.replace(
    kwPattern,
    (match) =>
      `<span style="color:#60a5fa;font-weight:600">${match.toUpperCase()}</span>`
  );

  // Functions / identifiers with parens
  escaped = escaped.replace(
    /\b([a-z_][a-z0-9_]*)\s*\(/gi,
    (_, fn) =>
      `<span style="color:#c084fc">${fn}</span>(`
  );

  return escaped;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = "320px",
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalVal, setInternalVal] = useState(value);

  useEffect(() => {
    setInternalVal(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalVal(e.target.value);
    onChange?.(e.target.value);
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal =
        internalVal.substring(0, start) + "  " + internalVal.substring(end);
      setInternalVal(newVal);
      onChange?.(newVal);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      }, 0);
    }
  };

  const lines = internalVal.split("\n");

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{
        background: "#030b18",
        border: "1px solid rgba(59,130,246,0.15)",
        fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace",
        fontSize: "12.5px",
        lineHeight: "1.65",
        height,
      }}
    >
      {/* Header bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-blue-500/10 bg-black/20">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-[10px] text-slate-500 uppercase tracking-widest">SQL</span>
      </div>

      <div className="flex overflow-auto" style={{ height: `calc(${height} - 36px)` }}>
        {/* Line numbers */}
        <div
          className="flex-shrink-0 select-none px-3 py-3 text-right"
          style={{ color: "#334155", minWidth: 48, borderRight: "1px solid rgba(59,130,246,0.07)" }}
        >
          {lines.map((_, i) => (
            <div key={i} style={{ lineHeight: "1.65" }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editor area */}
        <div className="relative flex-1">
          {/* Highlighted overlay */}
          <pre
            aria-hidden
            className="absolute inset-0 px-4 py-3 pointer-events-none overflow-visible whitespace-pre"
            style={{ color: "#cbd5e1", margin: 0, lineHeight: "1.65" }}
            dangerouslySetInnerHTML={{ __html: highlightSQL(internalVal) }}
          />
          {/* Actual textarea (transparent) */}
          {!readOnly && (
            <textarea
              ref={textareaRef}
              value={internalVal}
              onChange={handleChange}
              onKeyDown={handleTab}
              spellCheck={false}
              className="absolute inset-0 w-full h-full px-4 py-3 resize-none bg-transparent caret-blue-400 outline-none"
              style={{ color: "transparent", caretColor: "#60a5fa", lineHeight: "1.65" }}
            />
          )}
          {readOnly && (
            <pre
              className="absolute inset-0 px-4 py-3 overflow-visible whitespace-pre"
              style={{ color: "transparent", margin: 0, lineHeight: "1.65" }}
            >
              {internalVal}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
