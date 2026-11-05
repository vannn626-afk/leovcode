import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Download,
  Copy,
  Save,
  Upload,
  BookOpen,
} from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { SandboxPreview } from '../components/SandboxPreview';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { downloadTextFile } from '../utils/exportZip';
import { slugify } from '../utils/security';

const DEFAULT_PLAYGROUND_HTML = `<div class="w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-6 text-[#F5F7FA] space-y-4">
  <div class="flex items-center justify-between">
    <span class="text-xs font-mono text-[#8B9CFF]">PLAYGROUND SANDBOX</span>
    <span id="counterBadge" class="text-xs font-mono px-2 py-0.5 rounded bg-white/5">Clicks: 0</span>
  </div>
  <h2 class="text-lg font-bold">Interactive Sandbox Runner</h2>
  <p class="text-xs text-[#9BA6B5]">Edit HTML, CSS, or JavaScript on the left and click Run to execute inside the isolated CSP iframe.</p>
  <button id="actionBtn" class="w-full py-2.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold">
    Trigger Sandbox Action
  </button>
</div>`;

const DEFAULT_PLAYGROUND_CSS = `body {
  background: #090B10;
}
#actionBtn:active {
  transform: scale(0.98);
}`;

const DEFAULT_PLAYGROUND_JS = `let count = 0;
const btn = document.getElementById('actionBtn');
const badge = document.getElementById('counterBadge');

if (btn && badge) {
  btn.addEventListener('click', () => {
    count += 1;
    badge.textContent = 'Clicks: ' + count;
    console.log('Sandbox button clicked:', count);
  });
}
console.log('Playground runtime initialized.');`;

export function PlaygroundPage() {
  const { saveSnippet, profile, lang, notify } = usePlatform();
  const isId = lang === 'id';

  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlInput, setHtmlInput] = useState(DEFAULT_PLAYGROUND_HTML);
  const [cssInput, setCssInput] = useState(DEFAULT_PLAYGROUND_CSS);
  const [jsInput, setJsInput] = useState(DEFAULT_PLAYGROUND_JS);

  const [compiledState, setCompiledState] = useState({
    html: DEFAULT_PLAYGROUND_HTML,
    css: DEFAULT_PLAYGROUND_CSS,
    js: DEFAULT_PLAYGROUND_JS,
  });

  const handleRun = () => {
    setCompiledState({
      html: htmlInput,
      css: cssInput,
      js: jsInput,
    });
    notify(
      isId
        ? 'Kode berhasil dijalankan di dalam sandbox terisolasi.'
        : 'Executed code in isolated sandbox.',
      'info'
    );
  };

  const handleReset = () => {
    setHtmlInput(DEFAULT_PLAYGROUND_HTML);
    setCssInput(DEFAULT_PLAYGROUND_CSS);
    setJsInput(DEFAULT_PLAYGROUND_JS);
    setCompiledState({
      html: DEFAULT_PLAYGROUND_HTML,
      css: DEFAULT_PLAYGROUND_CSS,
      js: DEFAULT_PLAYGROUND_JS,
    });
    notify(
      isId
        ? 'Playground dikembalikan ke template awal.'
        : 'Playground reset to starter template.',
      'info'
    );
  };

  const handleSaveAsSnippet = async () => {
    const now = new Date().toISOString();
    await saveSnippet(
      {
        id: `snip-pg-${Date.now()}`,
        name: `Playground Experiment (${new Date().toLocaleTimeString()})`,
        slug: slugify(`playground-${Date.now()}`),
        description: 'Saved directly from the LEOVANDYZ isolated Code Playground.',
        category: 'Playground',
        language: 'HTML',
        tags: ['playground', 'sandbox', 'custom'],
        code: `<!-- HTML -->\n${htmlInput}\n\n<style>\n${cssInput}\n</style>\n\n<script>\n${jsInput}\n</script>`,
        status: 'published',
        isPublic: true,
        authorId: profile?.uid || 'guest-user',
        authorName: profile?.displayName || 'Developer',
        copiesCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      true
    );
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      if (file.name.endsWith('.css')) {
        setCssInput(content);
        setActiveTab('css');
      } else if (file.name.endsWith('.js') || file.name.endsWith('.ts')) {
        setJsInput(content);
        setActiveTab('js');
      } else {
        setHtmlInput(content);
        setActiveTab('html');
      }
      notify(
        isId ? `File ${file.name} berhasil diimpor ke editor.` : `Imported ${file.name} into editor.`,
        'success'
      );
    };
    reader.readAsText(file);
  };

  const currentCode =
    activeTab === 'html' ? htmlInput : activeTab === 'css' ? cssInput : jsInput;

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <div>
          <p className="text-xs font-mono text-[#8B9CFF]">
            {isId
              ? 'Lingkungan Eksekusi Terisolasi · Sandbox CSP Ketat'
              : 'Isolated Execution Environment · Strict CSP Sandbox'}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">
            Interactive Code Playground
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#9BA6B5] mt-0.5">
            {isId
              ? 'Tulis kode HTML, Tailwind CSS, dan JavaScript. Kode dijalankan di dalam iframe terisolasi yang aman.'
              : 'Write HTML, Tailwind CSS, and JavaScript. Code executes inside a sandboxed iframe without access to host storage or tokens.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRun}
            className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isId ? 'Jalankan Kode (Run)' : 'Run Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#141A24] text-xs font-medium flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isId ? 'Atur Ulang' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAsSnippet}
            className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#141A24] text-xs font-medium flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-[#8B9CFF]" />
            <span>{isId ? 'Simpan ke Snippet' : 'Save to Snippets'}</span>
          </button>

          <label className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#141A24] text-xs font-medium flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isId ? 'Impor File' : 'Import File'}</span>
            <input
              type="file"
              accept=".html,.css,.js,.txt"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              const bundle = `<!DOCTYPE html>\n<html>\n<head>\n<script src="https://cdn.tailwindcss.com"></script>\n<style>\n${cssInput}\n</style>\n</head>\n<body>\n${htmlInput}\n<script>\n${jsInput}\n</script>\n</body>\n</html>`;
              downloadTextFile('playground-export.html', bundle, 'text/html');
              notify(
                isId
                  ? 'Berhasil mengunduh file playground-export.html'
                  : 'Exported standalone playground-export.html',
                'success'
              );
            }}
            className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#141A24] text-xs font-medium flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isId ? 'Unduh HTML' : 'Export HTML'}</span>
          </button>
        </div>
      </div>

      {/* Arahan Penggunaan Playground */}
      <div className="rounded-xl border border-[#8B9CFF]/25 bg-[#8B9CFF]/[0.06] px-4 py-3 flex items-center gap-3 text-xs text-slate-600 dark:text-[#9BA6B5]">
        <BookOpen className="w-4 h-4 text-[#8B9CFF] shrink-0" />
        <span>
          {isId
            ? 'Arahan: Pilih tab index.html, style.css, atau script.js di panel kiri untuk menulis kode, lalu klik tombol "Jalankan Kode (Run)" di kanan atas untuk melihat hasilnya beserta log konsol.'
            : 'Guide: Switch between index.html, style.css, and script.js on the left, then click "Run Code" to execute and inspect console output.'}
        </span>
      </div>

      {/* Editor & Live Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex p-1 rounded-lg bg-slate-200/70 dark:bg-[#10141D] border border-slate-300/60 dark:border-white/10">
              {[
                { id: 'html', label: 'index.html (HTML + Tailwind)' },
                { id: 'css', label: 'style.css' },
                { id: 'js', label: 'script.js' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as typeof activeTab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono ${
                    activeTab === t.id
                      ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA] font-semibold'
                      : 'text-slate-600 dark:text-[#9BA6B5]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(currentCode);
                notify(
                  isId
                    ? `Kode ${activeTab.toUpperCase()} berhasil disalin.`
                    : `Copied ${activeTab.toUpperCase()} buffer.`,
                  'success'
                );
              }}
              className="text-xs font-mono text-[#8B9CFF] hover:underline flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{isId ? 'Salin Kode' : 'Copy Buffer'}</span>
            </button>
          </div>

          <CodeEditorPanel
            code={currentCode}
            language={activeTab.toUpperCase()}
            fileName={`playground.${activeTab}`}
            readOnly={false}
            onChange={(val) => {
              if (activeTab === 'html') setHtmlInput(val);
              else if (activeTab === 'css') setCssInput(val);
              else setJsInput(val);
            }}
            onReset={handleReset}
            maxHeight="460px"
          />
        </div>

        <div className="lg:col-span-6">
          <SandboxPreview
            title={isId ? 'Hasil Eksekusi Playground' : 'Live Playground Output'}
            html={compiledState.html}
            css={compiledState.css}
            js={compiledState.js}
            minHeight={460}
            showConsoleByDefault={true}
          />
        </div>
      </div>
    </div>
  );
}
