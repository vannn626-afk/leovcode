import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Copy, Download, Bookmark, Plus, RotateCcw, BookOpen } from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { downloadComponentZip } from '../utils/exportZip';

export function ComponentsPage() {
  const {
    components,
    categories,
    lang,
    isFavorited,
    toggleFavorite,
    incrementMetric,
    notify,
  } = usePlatform();

  const isId = lang === 'id';
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialFilter = searchParams.get('filter') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [queryText, setQueryText] = useState<string>(initialQuery);

  const componentCategories = useMemo(() => {
    const names = new Set<string>(['All']);
    categories
      .filter((c) => c.section === 'components' && c.isVisible)
      .forEach((c) => names.add(c.name));
    components
      .filter((c) => c.status === 'published')
      .forEach((c) => names.add(c.category));
    return Array.from(names);
  }, [categories, components]);

  const filteredComponents = useMemo(() => {
    let list = components.filter((c) => c.status === 'published');

    if (selectedCategory !== 'All') {
      list = list.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (activeFilter === 'featured') {
      list = list.filter((c) => c.isFeatured);
    } else if (activeFilter === 'popular') {
      list = [...list].sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (activeFilter === 'latest') {
      list = [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }

    if (queryText.trim()) {
      const q = queryText.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.technology.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [components, selectedCategory, activeFilter, queryText]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setActiveFilter('all');
    setQueryText('');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <div>
          <p className="text-xs font-mono text-[#8B9CFF]">
            {isId ? 'Pustaka Komponen UI' : 'UI Component Library'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">
            {isId ? 'Koleksi Komponen UI Siap Pakai' : 'Reusable Developer Components'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9BA6B5] mt-1">
            {isId
              ? 'Lihat pratinjau live di dalam sandbox, ubah warna & ukuran melalui Kustomisasi Visual, lalu salin kode atau unduh paket ZIP.'
              : 'Inspect live sandboxed previews, customize CSS tokens visually, and export production HTML, React TSX, or ZIP bundles.'}
          </p>
        </div>

        <Link
          to="/owner/components"
          className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isId ? 'Tambah Komponen Baru' : 'Create Component'}</span>
        </Link>
      </div>

      {/* Arahan Singkat */}
      <div className="rounded-xl border border-[#8B9CFF]/25 bg-[#8B9CFF]/[0.06] px-4 py-3 flex items-center gap-3 text-xs text-slate-600 dark:text-[#9BA6B5]">
        <BookOpen className="w-4 h-4 text-[#8B9CFF] shrink-0" />
        <span>
          {isId
            ? 'Arahan: Pilih kategori di bawah, lalu klik "Buka & Kustomisasi" pada komponen yang diinginkan untuk mengedit tampilan visual sekaligus mengambil kodenya.'
            : 'Tip: Select a category below, then click "View & Customize" on any component to edit visual tokens and copy its source code.'}
        </span>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#9BA6B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={
                isId
                  ? 'Filter berdasarkan nama komponen, teknologi, atau tag...'
                  : 'Filter by component name, technology, or tag...'
              }
              aria-label="Filter components"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:border-[#8B9CFF]"
            />
          </div>

          <div className="inline-flex p-1 rounded-lg bg-slate-200/70 dark:bg-[#10141D] border border-slate-300/60 dark:border-white/10 self-start">
            {[
              { id: 'all', label: isId ? 'Semua' : 'All Items' },
              { id: 'featured', label: isId ? 'Unggulan' : 'Featured' },
              { id: 'popular', label: isId ? 'Populer' : 'Popular' },
              { id: 'latest', label: isId ? 'Terbaru' : 'Latest' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                    : 'text-slate-600 dark:text-[#9BA6B5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {componentCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#8B9CFF] text-[#090B10] font-semibold'
                  : 'bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'All' && isId ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filteredComponents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-12 text-center space-y-3">
          <p className="text-base font-semibold text-slate-900 dark:text-[#F5F7FA]">
            {isId
              ? 'Tidak ada komponen yang cocok dengan filter pencarian Anda.'
              : 'No components matched your current filter criteria.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-[#9BA6B5] max-w-md mx-auto">
            {isId
              ? 'Coba atur ulang filter kategori/kata kunci, atau tambahkan komponen baru di menu Owner Studio.'
              : 'Try clearing the category or search filter, or create a new custom component in Owner Studio.'}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isId ? 'Atur Ulang Filter' : 'Reset Filters'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((comp) => {
            const fav = isFavorited(comp.id);
            return (
              <article
                key={comp.id}
                className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="p-4 border-b border-slate-200 dark:border-white/[0.09] bg-[#090B10] h-52 overflow-hidden flex items-center justify-center">
                    <iframe
                      title={`Preview of ${comp.name}`}
                      srcDoc={`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><style>body{margin:0;background:#090B10;color:#F5F7FA;display:flex;align-items:center;justify-content:center;min-height:100vh;transform:scale(0.75);transform-origin:center;overflow:hidden;font-family:sans-serif;}${comp.cssCode}</style></head><body>${comp.htmlCode}</body></html>`}
                      sandbox="allow-scripts"
                      className="w-full h-full border-0 pointer-events-none"
                    />
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#9BA6B5]">
                      <span>
                        {comp.category} · {comp.technology}
                      </span>
                      <span className="tabular-nums">v{comp.version}</span>
                    </div>

                    <h2 className="text-base font-semibold text-slate-900 dark:text-[#F5F7FA]">
                      <Link to={`/components/${comp.slug}`} className="hover:text-[#8B9CFF]">
                        {comp.name}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-[#9BA6B5] line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>

                    <div className="pt-1 text-[11px] font-mono text-slate-400 dark:text-[#9BA6B5]">
                      {comp.tags.join(' · ')}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-slate-200 dark:border-white/[0.09] bg-slate-50 dark:bg-[#10141D] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/components/${comp.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold hover:opacity-90 whitespace-nowrap"
                    >
                      {isId ? 'Buka & Kustomisasi' : 'View & Customize'}
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(comp.reactCode || comp.htmlCode);
                        incrementMetric('component', comp.id, 'copiesCount');
                        notify(
                          isId ? `Kode ${comp.name} berhasil disalin.` : `Copied ${comp.name} code.`,
                          'success'
                        );
                      }}
                      aria-label={`Copy source code for ${comp.name}`}
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        downloadComponentZip(comp);
                        incrementMetric('component', comp.id, 'downloadsCount');
                        notify(
                          isId
                            ? `Mengunduh paket ${comp.slug}-bundle.zip`
                            : `Downloaded ${comp.slug}-bundle.zip`,
                          'success'
                        );
                      }}
                      aria-label={`Download ZIP for ${comp.name}`}
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite({
                        id: comp.id,
                        type: 'component',
                        title: comp.name,
                        slug: comp.slug,
                        category: comp.category,
                      })
                    }
                    aria-label={fav ? `Remove ${comp.name} from favorites` : `Add ${comp.name} to favorites`}
                    className={`p-1.5 rounded-lg border ${
                      fav
                        ? 'border-[#8B9CFF] text-[#8B9CFF] bg-[#8B9CFF]/10'
                        : 'border-slate-300 dark:border-white/10 text-slate-500 dark:text-[#9BA6B5]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
