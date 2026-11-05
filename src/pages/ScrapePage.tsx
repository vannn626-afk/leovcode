import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  LayoutGrid,
  List,
  Download,
  Bookmark,
  Plus,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { downloadScrapeProjectZip } from '../utils/exportZip';

export function ScrapePage() {
  const {
    scrapes,
    lang,
    isFavorited,
    toggleFavorite,
    incrementMetric,
    notify,
  } = usePlatform();

  const isId = lang === 'id';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortMode, setSortMode] = useState<'featured' | 'latest' | 'popular' | 'copied' | 'downloaded'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const scrapeCategories = useMemo(() => {
    const cats = new Set<string>([
      'All',
      'Login & Authentication',
      'Website Sections',
      'Dashboard UI',
      'Landing Pages',
      'React Components',
      'HTML Templates',
    ]);
    scrapes
      .filter((s) => s.status === 'published')
      .forEach((s) => cats.add(s.category));
    return Array.from(cats);
  }, [scrapes]);

  const filteredScrapes = useMemo(() => {
    let list = scrapes.filter((s) => s.status === 'published');

    if (selectedCategory !== 'All') {
      list = list.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.sourceAuthor.toLowerCase().includes(q) ||
          s.technologies.some((t) => t.toLowerCase().includes(q)) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortMode === 'featured') {
      list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    } else if (sortMode === 'latest') {
      list = [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } else if (sortMode === 'popular') {
      list = [...list].sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (sortMode === 'copied') {
      list = [...list].sort((a, b) => b.copiesCount - a.copiesCount);
    } else if (sortMode === 'downloaded') {
      list = [...list].sort((a, b) => b.downloadsCount - a.downloadsCount);
    }

    return list;
  }, [scrapes, selectedCategory, searchQuery, sortMode]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <div className="space-y-1">
          <p className="text-xs font-mono text-[#8B9CFF]">
            {isId
              ? 'Arsip Kode Publik · Koleksi Proyek Multi-File Hasil Kurasi Owner'
              : 'Public Code Archive · Curated Multi-File Source Collections'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F5F7FA]">
            Public Scrape Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9BA6B5] max-w-2xl">
            {isId
              ? 'Jelajahi koleksi kode sumber multi-file yang dipublikasikan oleh Owner lengkap dengan struktur folder, atribusi lisensi, pratinjau live, dan unduhan proyek ZIP utuh.'
              : 'Explore verified multi-file code archives published by the platform owner with preserved directory trees, license attribution, and live sandboxed previews.'}
          </p>
        </div>

        <Link
          to="/owner/scrapes"
          className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isId ? 'Publikasikan Scrape Baru' : 'Publish Scrape Archive'}</span>
        </Link>
      </div>

      {/* Arahan Penggunaan Scrape Library */}
      <div className="rounded-xl border border-[#8B9CFF]/25 bg-[#8B9CFF]/[0.06] px-4 py-3 flex items-center gap-3 text-xs text-slate-600 dark:text-[#9BA6B5]">
        <BookOpen className="w-4 h-4 text-[#8B9CFF] shrink-0" />
        <span>
          {isId
            ? 'Arahan: Klik "Lihat File & Pratinjau" pada salah satu proyek untuk membuka pohon direktori (index.html, style.css, script.js), menjalankan pratinjau live, atau mengunduh seluruh folder sebagai ZIP.'
            : 'Guide: Click "Inspect Files & Preview" on any archive to browse its directory tree, test the live sandbox, or download the full project ZIP.'}
        </span>
      </div>

      {/* Controls Bar: Search, Sort Tabs, Grid/List View */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#9BA6B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isId
                  ? 'Cari arsip berdasarkan nama proyek, teknologi, atau pembuat...'
                  : 'Search archives by project name, technology, author...'
              }
              aria-label="Search scrape library"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:border-[#8B9CFF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 rounded-lg bg-slate-200/70 dark:bg-[#10141D] border border-slate-300/60 dark:border-white/10">
              {[
                { id: 'featured', label: isId ? 'Unggulan' : 'Featured' },
                { id: 'latest', label: isId ? 'Terbaru' : 'Latest' },
                { id: 'popular', label: isId ? 'Populer' : 'Popular' },
                { id: 'copied', label: isId ? 'Sering Disalin' : 'Most Copied' },
                { id: 'downloaded', label: isId ? 'Sering Diunduh' : 'Most Downloaded' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSortMode(s.id as typeof sortMode)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                    sortMode === s.id
                      ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                      : 'text-slate-600 dark:text-[#9BA6B5]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="inline-flex p-1 rounded-lg bg-slate-200/70 dark:bg-[#10141D] border border-slate-300/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-1.5 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                    : 'text-slate-500 dark:text-[#9BA6B5]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-1.5 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                    : 'text-slate-500 dark:text-[#9BA6B5]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {scrapeCategories.map((cat) => (
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
      </div>

      {/* Results Display */}
      {filteredScrapes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-12 text-center space-y-3">
          <p className="text-base font-semibold">
            {isId
              ? 'Tidak ada arsip scrape yang cocok dengan kata kunci Anda.'
              : 'No scrape archives matched your query.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
            {isId
              ? 'Atur ulang filter di bawah atau unggah arsip baru di menu Kelola Scrape (Owner Studio).'
              : 'Clear active filters or upload a new source code archive in Scrape Manager.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSortMode('featured');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isId ? 'Atur Ulang Filter' : 'Reset Filters'}</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScrapes.map((scr) => {
            const fav = isFavorited(scr.id);
            return (
              <article
                key={scr.id}
                className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#9BA6B5]">
                    <span className="text-[#8B9CFF]">{scr.category}</span>
                    <span>{scr.license}</span>
                  </div>

                  <h2 className="text-base font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    <Link to={`/scrape/${scr.slug}`} className="hover:text-[#8B9CFF]">
                      {scr.name}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-[#9BA6B5] leading-relaxed line-clamp-3">
                    {scr.description}
                  </p>

                  {/* File Tree Preview */}
                  <div className="rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 p-3 font-mono text-[11px] space-y-1 text-slate-600 dark:text-[#9BA6B5]">
                    <div className="flex items-center justify-between text-[#8B9CFF]">
                      <span>Entry: {scr.entryFile}</span>
                      <span>{scr.files?.length || 0} file</span>
                    </div>
                    <div>
                      {(scr.files || []).map((f) => f.filePath).join(' · ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#9BA6B5] tabular-nums pt-1">
                    <span>
                      {isId ? 'Sumber:' : 'Author:'} {scr.sourceAuthor}
                    </span>
                    <span>
                      {scr.viewsCount}v · {scr.copiesCount}c · {scr.downloadsCount}d
                    </span>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-slate-200 dark:border-white/[0.09] bg-slate-50 dark:bg-[#10141D] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/scrape/${scr.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold hover:opacity-90 whitespace-nowrap"
                    >
                      {isId ? 'Lihat File & Pratinjau' : 'Inspect Files & Preview'}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (scr.files) {
                          downloadScrapeProjectZip(
                            scr.slug,
                            scr.name,
                            scr.license,
                            scr.sourceAuthor,
                            scr.sourceUrl,
                            scr.files
                          );
                          incrementMetric('scrape', scr.id, 'downloadsCount');
                          notify(
                            isId
                              ? `Mengunduh proyek ${scr.slug}-project.zip`
                              : `Downloaded ${scr.slug}-project.zip`,
                            'success'
                          );
                        }
                      }}
                      aria-label={`Download ZIP for ${scr.name}`}
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite({
                        id: scr.id,
                        type: 'scrape',
                        title: scr.name,
                        slug: scr.slug,
                        category: scr.category,
                      })
                    }
                    aria-label={fav ? `Remove ${scr.name} from favorites` : `Favorite ${scr.name}`}
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
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] divide-y divide-slate-200 dark:divide-white/[0.09]">
          {filteredScrapes.map((scr) => (
            <div
              key={scr.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#8B9CFF]">
                  {scr.category} · {scr.technologies.join(', ')} · {scr.license}
                </div>
                <h2 className="text-base font-semibold">
                  <Link to={`/scrape/${scr.slug}`} className="hover:text-[#8B9CFF]">
                    {scr.name}
                  </Link>
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#9BA6B5] max-w-2xl">
                  {scr.description}
                </p>
                <div className="text-[11px] font-mono text-slate-400 dark:text-[#9BA6B5] tabular-nums">
                  {isId ? 'Oleh' : 'By'} {scr.sourceAuthor} · {scr.files?.length || 0} file ·{' '}
                  {scr.viewsCount} {isId ? 'dilihat' : 'views'} · {scr.downloadsCount}{' '}
                  {isId ? 'unduhan' : 'downloads'}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/scrape/${scr.slug}`}
                  className="px-3.5 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
                >
                  {isId ? 'Buka Arsip' : 'Open Archive'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
