import React, { useState, useEffect, useMemo } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Maximize2,
  Minimize2,
  Terminal,
  ZoomIn,
} from 'lucide-react';
import { buildSandboxDocument } from '../utils/security';
import type { ScrapedProjectFile } from '../types';

interface SandboxPreviewProps {
  title: string;
  html: string;
  css?: string;
  js?: string;
  files?: ScrapedProjectFile[];
  entryFile?: string;
  minHeight?: number;
  showConsoleByDefault?: boolean;
}

export interface ConsoleEntry {
  id: string;
  type: 'log' | 'warn' | 'error';
  text: string;
  timestamp: string;
}

export function SandboxPreview({
  title,
  html,
  css = '',
  js = '',
  files,
  entryFile,
  minHeight = 360,
  showConsoleByDefault = false,
}: SandboxPreviewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [canvasBg, setCanvasBg] = useState<string>('#090B10');
  const [zoom, setZoom] = useState<number>(100);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState<boolean>(showConsoleByDefault);
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'leovandyz-sandbox') {
        setLogs((prev) => [
          ...prev.slice(-39),
          {
            id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: event.data.type || 'log',
            text: String(event.data.payload || ''),
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const srcDoc = useMemo(
    () =>
      buildSandboxDocument({
        html,
        css,
        js,
        canvasBg,
        files,
        entryFile,
      }),
    [html, css, js, canvasBg, files, entryFile]
  );

  const viewportWidth =
    viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '390px';

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#090B10] flex flex-col p-4'
          : 'rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#10141D] overflow-hidden flex flex-col'
      }
    >
      {/* Sandbox Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#141A24]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-700 dark:text-[#F5F7FA] truncate max-w-[200px]">
            {title}
          </span>
          <span className="text-[11px] font-mono text-slate-400 dark:text-[#9BA6B5]">
            · Isolated CSP Sandbox
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Responsive Viewport Switcher */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-200/70 dark:bg-[#090B10] border border-slate-300/60 dark:border-white/10">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              aria-label="Desktop viewport"
              className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                viewport === 'desktop'
                  ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                  : 'text-slate-600 dark:text-[#9BA6B5]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              aria-label="Tablet viewport"
              className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                viewport === 'tablet'
                  ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                  : 'text-slate-600 dark:text-[#9BA6B5]'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              aria-label="Mobile viewport"
              className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                viewport === 'mobile'
                  ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                  : 'text-slate-600 dark:text-[#9BA6B5]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Canvas Background Selector */}
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-200/70 dark:bg-[#090B10] border border-slate-300/60 dark:border-white/10">
            {[
              { hex: '#090B10', label: 'Obsidian' },
              { hex: '#141A24', label: 'Slate' },
              { hex: '#F8FAFC', label: 'Daylight' },
            ].map((bg) => (
              <button
                key={bg.hex}
                type="button"
                onClick={() => setCanvasBg(bg.hex)}
                aria-label={`Set preview background to ${bg.label}`}
                style={{ backgroundColor: bg.hex }}
                className={`w-4 h-4 rounded-full border ${
                  canvasBg === bg.hex
                    ? 'ring-2 ring-[#8B9CFF] border-white'
                    : 'border-slate-400 dark:border-white/20'
                }`}
              />
            ))}
          </div>

          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setZoom((z) => (z === 100 ? 85 : 100))}
            aria-label="Toggle preview zoom"
            className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-[#090B10] border border-slate-300/60 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>{zoom}%</span>
          </button>

          {/* Console Toggle */}
          <button
            type="button"
            onClick={() => setShowConsole((s) => !s)}
            aria-label="Toggle sandbox console"
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              showConsole
                ? 'bg-[#8B9CFF]/15 border-[#8B9CFF]/40 text-[#8B9CFF]'
                : 'bg-slate-200/70 dark:bg-[#090B10] border-slate-300/60 dark:border-white/10 text-slate-700 dark:text-[#9BA6B5]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console ({logs.length})</span>
          </button>

          {/* Reload Sandbox */}
          <button
            type="button"
            onClick={() => {
              setLogs([]);
              setRefreshKey((k) => k + 1);
            }}
            aria-label="Refresh sandbox preview"
            className="p-1.5 rounded-lg bg-slate-200/70 dark:bg-[#090B10] border border-slate-300/60 dark:border-white/10 text-slate-700 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            aria-label={isFullscreen ? 'Exit fullscreen preview' : 'Enter fullscreen preview'}
            className="p-1.5 rounded-lg bg-slate-200/70 dark:bg-[#090B10] border border-slate-300/60 dark:border-white/10 text-slate-700 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Iframe Canvas Container */}
      <div
        className="flex-1 flex justify-center items-stretch overflow-auto bg-[#090B10]/90 p-3"
        style={{ minHeight: isFullscreen ? 'calc(100vh - 140px)' : `${minHeight}px` }}
      >
        <div
          className="transition-all duration-150 rounded-lg overflow-hidden border border-white/10 shadow-inner bg-[#090B10]"
          style={{
            width: viewportWidth,
            maxWidth: '100%',
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          <iframe
            key={refreshKey}
            title={`Preview: ${title}`}
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            className="w-full h-full border-0"
            style={{ minHeight: `${minHeight - 24}px` }}
          />
        </div>
      </div>

      {/* Optional Console Output Drawer */}
      {showConsole && (
        <div className="border-t border-slate-200 dark:border-white/10 bg-[#090B10] text-[#F5F7FA] p-3 font-mono text-xs max-h-44 overflow-y-auto">
          <div className="flex items-center justify-between text-[11px] text-[#9BA6B5] mb-2">
            <span>Sandbox Execution Console</span>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="hover:text-white underline"
            >
              Clear output
            </button>
          </div>
          {logs.length === 0 ? (
            <p className="text-[#9BA6B5]/60">No console messages emitted during this run.</p>
          ) : (
            <div className="space-y-1">
              {logs.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-start gap-2 py-0.5 ${
                    entry.type === 'error'
                      ? 'text-rose-400'
                      : entry.type === 'warn'
                      ? 'text-amber-400'
                      : 'text-emerald-300'
                  }`}
                >
                  <span className="text-[#9BA6B5] shrink-0">[{entry.timestamp}]</span>
                  <span className="break-all">{entry.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
