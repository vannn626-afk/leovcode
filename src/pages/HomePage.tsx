import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  TerminalSquare,
  Bookmark,
  Copy,
  Download,
  Wrench,
  BookOpen,
} from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { SandboxPreview } from '../components/SandboxPreview';
import { downloadComponentZip } from '../utils/exportZip';

export function HomePage() {
  const {
    user,
    role,
    components,
    templates,
    snippets,
    scrapes,
    categories,
    lang,
    toggleFavorite,
    isFavorited,
    notify,
    incrementMetric,
  } = usePlatform();

  const isId = lang === 'id';
  const canAccessOwnerStudio = Boolean(user) && (role === 'owner' || role === 'admin');
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [heroTab, setHeroTab] = useState<'preview' | 'code'>('preview');

  const publishedComponents = useMemo(
    () => components.filter((c) => c.status === 'published'),
    [components]
  );
  const featuredComponents = useMemo(
    () => publishedComponents.filter((c) => c.isFeatured).slice(0, 6),
    [publishedComponents]
  );
  const popularComponents = useMemo(
    () => [...publishedComponents].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 4),
    [publishedComponents]
  );
  const publishedScrapes = useMemo(
    () => scrapes.filter((s) => s.status === 'published').slice(0, 3),
    [scrapes]
  );
  const publishedTemplates = useMemo(
    () => templates.filter((t) => t.status === 'published').slice(0, 3),
    [templates]
  );
  const publishedSnippets = useMemo(
    () => snippets.filter((s) => s.status === 'published').slice(0, 4),
    [snippets]
  );

  const heroComponent = publishedComponents[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/components?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#10141D] p-6 sm:p-8">
          <div className="space-y-5">
            <div className="text-xs font-mono text-[#8B9CFF]">
              {isId
                ? 'Pusat Sumber Daya Developer · Pustaka Komponen UI · Arsip Kode Scrape'
                : 'Developer Resource Platform · Component Library · Scrape Archive'}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.12] text-slate-900 dark:text-[#F5F7FA]">
              Build Faster. Code Smarter.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#9BA6B5] leading-relaxed max-w-xl">
              {isId
                ? 'Temukan komponen UI siap pakai, kustomisasi desain login & landing page secara live, uji kode di playground, dan unduh arsip proyek multi-file dalam format ZIP.'
                : 'Discover reusable components, explore modern UI designs, and access ready-to-use code for your next project.'}
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/components"
                className="px-5 py-2.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs sm:text-sm font-semibold hover:opacity-95 transition whitespace-nowrap shrink-0"
              >
                {isId ? 'Jelajahi Komponen UI' : 'Explore Components'}
              </Link>
              <Link
                to="/scrape"
                className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-[#141A24] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-[#F5F7FA] text-xs sm:text-sm font-medium hover:border-[#8B9CFF]/50 transition whitespace-nowrap shrink-0"
              >
                {isId ? 'Buka Scrape Library' : 'Browse Scrapes'}
              </Link>
              <Link
                to="/playground"
                className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-mono text-slate-600 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0"
              >
                {isId ? 'Buka Playground' : 'Open Playground'}
              </Link>
            </div>
          </div>

          {/* 2. Integrated Quick Search & Actual Catalog Counts */}
          <div className="pt-8 mt-8 border-t border-slate-200 dark:border-white/[0.09] space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#9BA6B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    isId
                      ? 'Cari form login, tombol, modal, navbar, tabel harga...'
                      : 'Search authentication, buttons, modals, pricing...'
                  }
                  aria-label="Search components and archives"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#9BA6B5]/60 focus:outline-none focus:border-[#8B9CFF]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-[#1A2230] text-white text-xs font-semibold hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                {isId ? 'Cari Katalog' : 'Search Catalog'}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-[#9BA6B5] font-mono tabular-nums">
              <span>
                {publishedComponents.length} {isId ? 'Komponen Terpublikasi' : 'Published Components'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {publishedTemplates.length} {isId ? 'Template Halaman' : 'Full Templates'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {publishedSnippets.length} {isId ? 'Snippet Kode' : 'Code Snippets'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {publishedScrapes.length} {isId ? 'Arsip Scrape Multi-File' : 'Multi-File Scrapes'}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Live Preview / Code Card */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#10141D] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/[0.09] bg-slate-50 dark:bg-[#141A24]">
            <div className="text-xs font-mono text-slate-700 dark:text-[#F5F7FA]">
              {isId ? 'Pratinjau Interaktif' : 'Interactive Showcase'} · {heroComponent?.name || 'Modern Dark Login'}
            </div>
            <div className="inline-flex p-0.5 rounded-lg bg-slate-200 dark:bg-[#090B10] border border-slate-300 dark:border-white/10">
              <button
                type="button"
                onClick={() => setHeroTab('preview')}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  heroTab === 'preview'
                    ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                    : 'text-slate-500 dark:text-[#9BA6B5]'
                }`}
              >
                {isId ? 'Pratinjau Live' : 'Live Preview'}
              </button>
              <button
                type="button"
                onClick={() => setHeroTab('code')}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  heroTab === 'code'
                    ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
                    : 'text-slate-500 dark:text-[#9BA6B5]'
                }`}
              >
                {isId ? 'Kode Sumber' : 'Source Code'}
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col justify-center">
            {heroComponent && heroTab === 'preview' ? (
              <SandboxPreview
                title={heroComponent.name}
                html={heroComponent.htmlCode}
                css={heroComponent.cssCode}
                js={heroComponent.jsCode}
                minHeight={420}
              />
            ) : (
              <pre className="p-4 rounded-xl bg-[#090B10] text-xs font-mono text-[#F5F7FA] overflow-auto max-h-[360px] leading-relaxed border border-white/10">
                {heroComponent?.reactCode || heroComponent?.htmlCode}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Arahan Cepat Penggunaan Platform (Bahasa Indonesia / English) */}
      <section className="rounded-xl border border-[#8B9CFF]/25 bg-[#8B9CFF]/[0.06] p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#8B9CFF]">
            <BookOpen className="w-4 h-4" />
            <span>
              {isId
                ? 'ARAHAN CEPAT PENGGUNAAN PLATFORM (TANPA LOGIN WAJIB)'
                : 'QUICK PLATFORM USAGE GUIDE'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-[#9BA6B5]">
            {isId ? 'Database Firebase Aktif Otomatis' : 'Firebase Database Connected'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-600 dark:text-[#9BA6B5]">
          <div className="p-3 rounded-lg bg-white/80 dark:bg-[#10141D] border border-slate-200 dark:border-white/10">
            <p className="font-semibold text-slate-900 dark:text-[#F5F7FA] mb-1">
              {isId ? '1. Pilih & Kustomisasi Komponen' : '1. Inspect & Customize'}
            </p>
            <p>
              {isId
                ? 'Klik tombol "Buka & Kustomisasi" pada kartu komponen untuk mengubah warna, ukuran sudut, dan padding secara langsung.'
                : 'Click "Inspect & Customize" on any component card to adjust colors, border radius, and padding live.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/80 dark:bg-[#10141D] border border-slate-200 dark:border-white/10">
            <p className="font-semibold text-slate-900 dark:text-[#F5F7FA] mb-1">
              {isId ? '2. Salin Kode atau Unduh ZIP' : '2. Copy Code or Download ZIP'}
            </p>
            <p>
              {isId
                ? 'Salin kode dalam format React TSX, HTML, CSS, atau Tailwind, maupun unduh paket .zip siap pakai dengan 1 klik.'
                : 'Copy source code in React TSX, HTML, CSS, or Tailwind, or download a ready-to-use .zip bundle.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/80 dark:bg-[#10141D] border border-slate-200 dark:border-white/10">
            <p className="font-semibold text-slate-900 dark:text-[#F5F7FA] mb-1">
              {isId ? '3. Pelajari Arsip Scrape Multi-File' : '3. Explore Multi-File Scrapes'}
            </p>
            <p>
              {isId
                ? 'Buka menu Scrape Library untuk melihat proyek multi-file lengkap dengan struktur folder, pratinjau live, dan info lisensi.'
                : 'Open the Scrape Library to inspect multi-file projects with directory trees, live previews, and license metadata.'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/80 dark:bg-[#10141D] border border-slate-200 dark:border-white/10">
            <p className="font-semibold text-slate-900 dark:text-[#F5F7FA] mb-1">
              {isId ? '4. Simpan Favorit & Akses Akun' : '4. Save Favorites & Account Sync'}
            </p>
            <p>
              {isId
                ? 'Simpan favorit langsung di browser tanpa login, atau masuk dengan Google untuk sinkronisasi Cloud & akses Owner Studio.'
                : 'Bookmark components locally without signing in, or sign in with Google for Cloud sync and Owner Studio access.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Components Section */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.09] pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
              {isId ? 'Komponen UI Unggulan' : 'Featured UI Components'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9BA6B5] mt-1">
              {isId
                ? 'Koleksi portal login, tombol interaktif, header navigasi, dan kartu metrik dengan live sandbox terisolasi.'
                : 'Production-ready authentication portals, buttons, navigation headers, and telemetry cards with live sandboxes.'}
            </p>
          </div>
          <Link
            to="/components"
            className="text-xs font-mono text-[#8B9CFF] hover:underline whitespace-nowrap shrink-0"
          >
            {isId
              ? `Lihat semua ${publishedComponents.length} komponen`
              : `View all ${publishedComponents.length} components`}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredComponents.map((comp) => {
            const fav = isFavorited(comp.id);
            return (
              <article
                key={comp.id}
                className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="p-4 border-b border-slate-200 dark:border-white/[0.09] bg-[#090B10] h-48 overflow-hidden flex items-center justify-center">
                    <iframe
                      title={`Mini preview of ${comp.name}`}
                      srcDoc={`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><style>body{margin:0;background:#090B10;color:#F5F7FA;display:flex;align-items:center;justify-content:center;min-height:100vh;transform:scale(0.75);transform-origin:center;overflow:hidden;font-family:sans-serif;}${comp.cssCode}</style></head><body>${comp.htmlCode}</body></html>`}
                      sandbox="allow-scripts"
                      className="w-full h-full border-0 pointer-events-none"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#9BA6B5] font-mono">
                      <span>
                        {comp.category} · {comp.technology}
                      </span>
                      <span className="tabular-nums">
                        {comp.viewsCount} {isId ? 'dilihat' : 'views'}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-[#F5F7FA]">
                      <Link to={`/components/${comp.slug}`} className="hover:text-[#8B9CFF]">
                        {comp.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#9BA6B5] line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-slate-200 dark:border-white/[0.09] bg-slate-50 dark:bg-[#10141D] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/components/${comp.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold hover:opacity-90 whitespace-nowrap"
                    >
                      {isId ? 'Buka & Kustomisasi' : 'Inspect & Customize'}
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
                      aria-label={`Copy code for ${comp.name}`}
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
                          isId ? `Mengunduh paket ${comp.slug}.zip` : `Downloaded ${comp.slug}.zip`,
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
                    aria-label={fav ? `Remove ${comp.name} from favorites` : `Save ${comp.name} to favorites`}
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
      </section>

      {/* 4. UI Categories & Popular Ranking Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.09] pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
              {isId ? 'Kategori Komponen UI' : 'UI Component Categories'}
            </h2>
            <Link to="/categories" className="text-xs font-mono text-[#8B9CFF] hover:underline">
              {isId ? 'Lihat semua kategori' : 'Browse taxonomy'}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories
              .filter((c) => c.isVisible && c.section === 'components')
              .map((cat) => {
                const count = publishedComponents.filter(
                  (c) => c.category.toLowerCase() === cat.name.toLowerCase()
                ).length;
                return (
                  <Link
                    key={cat.id}
                    to={`/components?category=${encodeURIComponent(cat.name)}`}
                    className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] hover:border-[#8B9CFF]/60 transition flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 dark:text-[#F5F7FA]">
                        {cat.name}
                      </span>
                      <span className="text-xs font-mono text-[#8B9CFF] tabular-nums">
                        {count} {isId ? 'item' : 'items'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#9BA6B5] mt-1.5 line-clamp-2">
                      {cat.description}
                    </p>
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.09] pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
              {isId ? 'Paling Sering Disalin & Dilihat' : 'Most Copied & Viewed'}
            </h2>
            <Link to="/components?filter=popular" className="text-xs font-mono text-[#8B9CFF] hover:underline">
              {isId ? 'Peringkat lengkap' : 'Full leaderboard'}
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] divide-y divide-slate-200 dark:divide-white/[0.09]">
            {popularComponents.map((comp, index) => (
              <div key={comp.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-mono text-[#8B9CFF]">
                    0{index + 1}. {comp.category}
                  </div>
                  <Link
                    to={`/components/${comp.slug}`}
                    className="text-sm font-semibold text-slate-900 dark:text-[#F5F7FA] hover:text-[#8B9CFF] truncate block mt-0.5"
                  >
                    {comp.name}
                  </Link>
                </div>
                <div className="text-right font-mono text-xs text-slate-500 dark:text-[#9BA6B5] tabular-nums shrink-0">
                  <div>
                    {comp.copiesCount} {isId ? 'disalin' : 'copies'}
                  </div>
                  <div className="text-[11px]">{comp.downloadsCount} ZIP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Public Scrape Library Highlights */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.09] pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
              {isId
                ? 'Public Scrape Library (Arsip Proyek Multi-File)'
                : 'Public Scrape Library (Curated Source Archives)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9BA6B5] mt-1">
              {isId
                ? 'Koleksi kode sumber multi-file yang dipublikasikan oleh Owner lengkap dengan pohon folder, atribusi sumber, dan lisensi terbuka.'
                : 'Multi-file code collections published by the workspace owner with preserved folder trees, source attribution, and open licenses.'}
            </p>
          </div>
          <Link to="/scrape" className="text-xs font-mono text-[#8B9CFF] hover:underline whitespace-nowrap shrink-0">
            {isId ? 'Jelajahi Scrape Library' : 'Explore Scrape Library'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {publishedScrapes.map((scr) => (
            <article
              key={scr.id}
              className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#9BA6B5]">
                  <span className="text-[#8B9CFF]">{scr.category}</span>
                  <span>{scr.license}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-[#F5F7FA]">
                  <Link to={`/scrape/${scr.slug}`} className="hover:text-[#8B9CFF]">
                    {scr.name}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#9BA6B5] leading-relaxed">
                  {scr.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/[0.09] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#9BA6B5] tabular-nums">
                  <span>
                    {isId ? 'Sumber:' : 'Author:'} {scr.sourceAuthor}
                  </span>
                  <span>{scr.files?.length || 3} file</span>
                </div>
                <Link
                  to={`/scrape/${scr.slug}`}
                  className="block w-full text-center py-2 rounded-lg bg-slate-100 dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA] text-xs font-semibold hover:bg-[#8B9CFF] hover:text-[#090B10] transition"
                >
                  {isId ? 'Buka Arsip Multi-File' : 'Open Multi-File Archive'}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Templates & Snippets Dual Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.09] pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
              {isId ? 'Template Landing Page & Aplikasi' : 'Landing Page & App Templates'}
            </h2>
            <Link to="/templates" className="text-xs font-mono text-[#8B9CFF] hover:underline">
              {isId ? 'Buka Pustaka Template' : 'Open Template Library'}
            </Link>
          </div>
          <div className="space-y-3">
            {publishedTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-xs font-mono text-[#8B9CFF]">
                    {tpl.category} · {tpl.technology}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9BA6B5] line-clamp-1">
                    {tpl.description}
                  </p>
                </div>
                <Link
                  to="/templates"
                  className="px-3 py-1.5 rounded-lg bg-[#8B9CFF]/15 text-[#8B9CFF] text-xs font-mono whitespace-nowrap shrink-0"
                >
                  {isId ? 'Pratinjau' : 'Preview'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.09] pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
              {isId ? 'Snippet TypeScript & CSS Populer' : 'Popular TypeScript & CSS Snippets'}
            </h2>
            <Link to="/snippets" className="text-xs font-mono text-[#8B9CFF] hover:underline">
              {isId ? 'Lihat semua snippet' : 'View all snippets'}
            </Link>
          </div>
          <div className="space-y-3">
            {publishedSnippets.map((snip) => (
              <div
                key={snip.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-mono text-slate-500 dark:text-[#9BA6B5]">
                    {snip.language} · {snip.category}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F5F7FA] truncate">
                    {snip.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9BA6B5] truncate">
                    {snip.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(snip.code);
                    incrementMetric('snippet', snip.id, 'copiesCount');
                    notify(
                      isId ? `Snippet "${snip.name}" disalin.` : `Copied snippet "${snip.name}".`,
                      'success'
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1A2230] text-xs font-mono text-slate-800 dark:text-[#F5F7FA] hover:bg-[#8B9CFF] hover:text-[#090B10] transition whitespace-nowrap shrink-0"
                >
                  {isId ? 'Salin Snippet' : 'Copy Snippet'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Developer Tools & Workspace Call to Action */}
      <section className="rounded-2xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-2">
          <div className="text-xs font-mono text-[#8B9CFF]">
            {isId
              ? 'Utilitas Developer Terintegrasi & Owner Studio'
              : 'Integrated Developer Utilities & Owner Studio'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F7FA]">
            {isId
              ? 'Konversi HTML ke React JSX, uji kode di sandbox terisolasi, atau kelola seluruh konten platform.'
              : 'Convert HTML to React JSX, test code in an isolated sandbox, or manage platform content.'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9BA6B5]">
            {isId
              ? 'Semua alat berjalan langsung di browser tanpa jeda server dan mendukung ekspor proyek ZIP penuh.'
              : 'Every tool runs directly in the browser with zero server round-trip latency and full ZIP export support.'}
          </p>
        </div>
        <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
          <Link
            to="/tools"
            className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA] text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
          >
            <Wrench className="w-3.5 h-3.5 text-[#8B9CFF]" />
            <span>{isId ? 'Konverter Kode' : 'Code Converter'}</span>
          </Link>
          {canAccessOwnerStudio ? (
            <Link
              to="/owner"
              className="px-4 py-2.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <TerminalSquare className="w-3.5 h-3.5" />
              <span>{isId ? 'Buka Owner Studio' : 'Open Owner Studio'}</span>
            </Link>
          ) : (
            <Link
              to="/playground"
              className="px-4 py-2.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <TerminalSquare className="w-3.5 h-3.5" />
              <span>{isId ? 'Buka Code Playground' : 'Open Code Playground'}</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
