import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Search, RotateCcw, Code2 } from 'lucide-react';
import { downloadTextFile } from '../utils/exportZip';
import { usePlatform } from '../contexts/PlatformContext';

interface CodeEditorPanelProps {
  code: string;
  language: string;
  fileName: string;
  readOnly?: boolean;
  onChange?: (nextCode: string) => void;
  onReset?: () => void;
  maxHeight?: string;
}

export function CodeEditorPanel({
  code,
  language,
  fileName,
  readOnly = false,
  onChange,
  onReset,
  maxHeight = '440px',
}: CodeEditorPanelProps) {
  const { notify } = usePlatform();
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const lines = useMemo(() => (code || '').split('\n'), [code]);

  const matchingLineCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase();
    return lines.filter((l) => l.toLowerCase().includes(q)).length;
  }, [lines, searchQuery]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      notify(`Copied ${fileName} to clipboard.`, 'success');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      notify('Clipboard access failed.', 'error');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-[#090B10] text-[#F5F7FA] overflow-hidden flex flex-col">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10 bg-[#141A24]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Code2 className="w-3.5 h-3.5 text-[#8B9CFF]" />
          <span className="font-semibold text-[#F5F7FA]">{fileName}</span>
          <span className="text-[#9BA6B5]">· {language}</span>
          <span className="text-[#9BA6B5] tabular-nums">· {lines.length} lines</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* In-File Search Input */}
          <div className="relative flex items-center">
            <Search className="w-3 h-3 text-[#9BA6B5] absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in code..."
              aria-label="Search in code"
              className="pl-7 pr-2.5 py-1 rounded-lg bg-[#090B10] border border-white/10 text-xs text-[#F5F7FA] placeholder-[#9BA6B5]/60 focus:outline-none focus:border-[#8B9CFF] w-36 sm:w-44"
            />
            {searchQuery.trim() && (
              <span className="ml-1.5 text-[11px] font-mono text-[#8B9CFF] tabular-nums">
                {matchingLineCount} hits
              </span>
            )}
          </div>

          {!readOnly && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-2.5 py-1 rounded-lg bg-[#090B10] border border-white/10 text-xs text-[#9BA6B5] hover:text-white flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-[#090B10] border border-white/10 text-xs text-[#F5F7FA] hover:border-[#8B9CFF]/60 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#8B9CFF]" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              downloadTextFile(fileName, code);
              notify(`Downloaded ${fileName}.`, 'success');
            }}
            className="px-2.5 py-1 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Viewport */}
      {readOnly ? (
        <div className="overflow-auto font-mono text-xs leading-relaxed p-4" style={{ maxHeight }}>
          {lines.map((line, idx) => {
            const isMatch =
              searchQuery.trim().length > 0 &&
              line.toLowerCase().includes(searchQuery.toLowerCase());
            return (
              <div
                key={idx}
                className={`grid grid-cols-[40px_1fr] gap-3 px-2 py-0.5 rounded ${
                  isMatch ? 'bg-[#8B9CFF]/20 text-white' : 'hover:bg-white/[0.02]'
                }`}
              >
                <span className="text-[#9BA6B5]/50 select-none text-right tabular-nums">
                  {idx + 1}
                </span>
                <pre className="whitespace-pre-wrap break-all font-mono m-0">{line || ' '}</pre>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-[44px_1fr] overflow-auto" style={{ maxHeight }}>
          <div className="bg-[#10141D] border-r border-white/10 py-3 px-2 text-right font-mono text-xs text-[#9BA6B5]/50 select-none tabular-nums leading-relaxed">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => onChange?.(e.target.value)}
            spellCheck={false}
            aria-label={`Code editor for ${fileName}`}
            className="w-full min-h-[300px] bg-[#090B10] text-[#F5F7FA] font-mono text-xs leading-relaxed p-3 focus:outline-none resize-y"
          />
        </div>
      )}
    </div>
  );
}
