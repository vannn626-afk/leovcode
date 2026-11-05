import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Download, Bookmark, Plus, Eye, BookOpen } from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { SandboxPreview } from '../components/SandboxPreview';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { downloadTextFile } from '../utils/exportZip';

export function TemplatesPage() {
  const {
    templates,
    lang,
    isFavorited,
    toggleFavorite,
    incrementMetric,
    notify,
  } = usePlatform();

  const isId = lang === 'id';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTemplateId, setActiveTemplateId] = useState<string>(templates[0]?.id || '');
  const [viewMode, setViewMode] = useState<'preview' | 'html' | 'react'>('preview');

  const categories = useMemo(() => {
    const set = new Set<string>(['All', 'Landing Page', 'Dashboard', 'Developer Portfolio', 'SaaS', 'Authentication']);
    templates.filter((t) => t.status === 'published').forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const list = templates.filter((t) => t.status === 'published');
    if (selectedCategory === 'All') return list;
    return list.filter((t) => t.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [templates, selectedCategory]);

  const selectedTemplate =
    filteredTemplates.find((t) => t.id === activeTemplateId) || filteredTemplates[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <div>
          <p className="text-xs font-mono text-[#8B9CFF]">
            {isId ? 'Pustaka Tata Letak Halaman Penuh' : 'Multi-Section Layout Library'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">
            {isId ? 'Template Landing Page & Workspace' : 'Landing Page & Workspace Templates'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9BA6B5] mt-1">
            {isId
              ? 'Koleksi tata letak halaman utuh yang responsif dengan pratinjau sandbox live serta kode HTML dan React TSX siap pakai.'
              : 'Full-page production layouts with responsive breakpoints, live sandboxed previews, and exportable HTML and React code.'}
          </p>
        </div>

        <Link
          to="/owner/templates"
          className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isId ? 'Buka Landing Builder' : 'Open Landing Builder'}</span>
        </Link>
      </div>

      {/* Arahan Penggunaan Template */}
      <div className="rounded-xl border border-[#8B9CFF]/25 bg-[#8B9CFF]/[0.06] px-4 py-3 flex items-center gap-3 text-xs text-slate-600 dark:text-[#9BA6B5]">
        <BookOpen className="w-4 h-4 text-[#8B9CFF] shrink-0" />
        <span>
          {isId
            ? 'Arahan: Klik tombol "Tampilkan di Bawah" pada kartu template yang diinginkan untuk melihat pratinjau halaman penuh dan menyalin kode HTML + Tailwind maupun React TSX.'
            : 'Guide: Click "Inspect Template" on any template card to view its full-page live sandbox preview and source code below.'}
        </span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-[#8B9CFF] text-[#090B10] font-semibold'
                : 'bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5]'
            }`}
          >
            {cat === 'All' && isId ? 'Semua Kategori' : cat}
          </button>
        ))}
      </div>

      {/* Template Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => {
          const isSelected = selectedTemplate?.id === tpl.id;
          const fav = isFavorited(tpl.id);
          return (
            <div
              key={tpl.id}
              className={`rounded-xl border p-5 flex flex-col justify-between transition ${
                isSelected
                  ? 'border-[#8B9CFF] bg-[#8B9CFF]/5 dark:bg-[#1A2230]'
                  : 'border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#9BA6B5]">
                  <span className="text-[#8B9CFF]">{tpl.category}</span>
                  <span>{tpl.technology}</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-[#F5F7FA]">
                  {tpl.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-[#9BA6B5] leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTemplateId(tpl.id);
                    incrementMetric('template', tpl.id, 'viewsCount');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {isSelected
                      ? isId
                        ? 'Aktif di Bawah'
                        : 'Active Below'
                      : isId
                      ? 'Tampilkan di Bawah'
                      : 'Inspect Template'}
                  </span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(tpl.htmlCode);
                      incrementMetric('template', tpl.id, 'copiesCount');
                      notify(
                        isId ? `Kode HTML ${tpl.name} disalin.` : `Copied ${tpl.name} HTML.`,
                        'success'
                      );
                    }}
                    aria-label={`Copy ${tpl.name} HTML`}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      downloadTextFile(`${tpl.slug}.html`, tpl.htmlCode, 'text/html');
                      incrementMetric('template', tpl.id, 'downloadsCount');
                      notify(
                        isId ? `Mengunduh ${tpl.slug}.html` : `Downloaded ${tpl.slug}.html`,
                        'success'
                      );
                    }}
                    aria-label={`Download ${tpl.name} HTML`}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5]"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite({
                        id: tpl.id,
                        type: 'template',
                        title: tpl.name,
                        slug: tpl.slug,
                        category: tpl.category,
                      })
                    }
                    aria-label="Toggle template favorite"
                    className={`p-1.5 rounded-lg border ${
                      fav
                        ? 'border-[#8B9CFF] text-[#8B9CFF]'
                        : 'border-slate-300 dark:border-white/10 text-slate-500 dark:text-[#9BA6B5]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Template Live Preview & Source Code */}
      {selectedTemplate && (
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/[0.09]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">{selectedTemplate.name}</h2>
              <p className="text-xs text-slate-500 dark:text-[#9BA6B5] font-mono">
                {selectedTemplate.category} · {selectedTemplate.technology} ·{' '}
                {selectedTemplate.viewsCount} {isId ? 'dilihat' : 'views'}
              </p>
            </div>

            <div className="inline-flex p-1 rounded-lg bg-slate-200/70 dark:bg-[#10141D] border border-slate-300/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                    : 'text-slate-600 dark:text-[#9BA6B5]'
                }`}
              >
                {isId ? 'Pratinjau Live' : 'Live Preview'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('html')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                  viewMode === 'html'
                    ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                    : 'text-slate-600 dark:text-[#9BA6B5]'
                }`}
              >
                HTML + Tailwind
              </button>
              <button
                type="button"
                onClick={() => setViewMode('react')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                  viewMode === 'react'
                    ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                    : 'text-slate-600 dark:text-[#9BA6B5]'
                }`}
              >
                React TSX
              </button>
            </div>
          </div>

          {viewMode === 'preview' ? (
            <SandboxPreview
              title={selectedTemplate.name}
              html={selectedTemplate.htmlCode}
              minHeight={480}
            />
          ) : viewMode === 'html' ? (
            <CodeEditorPanel
              code={selectedTemplate.htmlCode}
              language="HTML + Tailwind"
              fileName={`${selectedTemplate.slug}.html`}
              readOnly={true}
            />
          ) : (
            <CodeEditorPanel
              code={selectedTemplate.reactCode}
              language="React TSX"
              fileName={`${selectedTemplate.slug}.tsx`}
              readOnly={true}
            />
          )}
        </section>
      )}
    </div>
  );
}
