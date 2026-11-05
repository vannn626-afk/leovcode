import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  FolderKanban,
  Trash2,
  Plus,
  Copy,
  ArrowRight,
  User,
  ShieldCheck,
  Wrench,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';

export function CategoriesPage() {
  const { categories, components, templates, scrapes, lang } = usePlatform();

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <p className="text-xs font-mono text-[#8B9CFF]">
          {lang === 'id' ? 'Taksonomi Platform' : 'Platform Taxonomy'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
          {lang === 'id' ? 'Semua Kategori Resource' : 'All Resource Categories'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9BA6B5] mt-1">
          {lang === 'id'
            ? 'Jelajahi komponen UI, template landing page, snippet, dan arsip scrape yang dikelompokkan berdasarkan fungsi.'
            : 'Browse components, templates, snippets, and curated scrape archives organized by functional domain.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories
          .filter((c) => c.isVisible)
          .sort((a, b) => a.order - b.order)
          .map((cat) => {
            const count =
              components.filter((c) => c.category.toLowerCase() === cat.name.toLowerCase()).length +
              templates.filter((t) => t.category.toLowerCase() === cat.name.toLowerCase()).length +
              scrapes.filter((s) => s.category.toLowerCase() === cat.name.toLowerCase()).length;

            const dest =
              cat.section === 'scrapes'
                ? '/scrape'
                : cat.section === 'templates'
                ? '/templates'
                : `/components?category=${encodeURIComponent(cat.name)}`;

            return (
              <Link
                key={cat.id}
                to={dest}
                className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-5 hover:border-[#8B9CFF]/60 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8B9CFF] uppercase">{cat.section}</span>
                    <span className="text-slate-500 dark:text-[#9BA6B5] tabular-nums">
                      {count} {lang === 'id' ? 'item' : 'resources'}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-[#9BA6B5] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="text-xs font-mono text-[#8B9CFF] flex items-center gap-1">
                  <span>{lang === 'id' ? `Buka ${cat.name}` : `Open ${cat.name}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export function DeveloperToolsPage() {
  const { notify, lang } = usePlatform();
  const [toolTab, setToolTab] = useState<'html2jsx' | 'json'>('html2jsx');
  const [rawHtml, setRawHtml] = useState(
    `<div class="card-box" for="emailInput" tabindex="0">\n  <label for="emailInput">Email Address</label>\n  <input type="email" id="emailInput" readonly>\n</div>`
  );
  const [rawJson, setRawJson] = useState(
    `{"project":"LEOVANDYZ","version":2,"features":["components","scrapes","playground"]}`
  );
  const [jsonError, setJsonError] = useState('');

  const convertedJsx = rawHtml
    .replace(/\bclass=/g, 'className=')
    .replace(/\bfor=/g, 'htmlFor=')
    .replace(/\btabindex=/g, 'tabIndex=')
    .replace(/\breadonly\b/g, 'readOnly')
    .replace(/<input([^>]*[^/])>/g, '<input$1 />');

  const formatJson = () => {
    try {
      const parsed = JSON.parse(rawJson);
      setRawJson(JSON.stringify(parsed, null, 2));
      setJsonError('');
      notify(
        lang === 'id' ? 'JSON berhasil diformat dan valid.' : 'Formatted valid JSON payload.',
        'success'
      );
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON syntax.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <p className="text-xs font-mono text-[#8B9CFF]">
          {lang === 'id' ? 'Utilitas Developer' : 'Developer Utilities'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
          {lang === 'id' ? 'Konverter Kode & Utilitas' : 'Code Converter & Utilities'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9BA6B5] mt-1">
          {lang === 'id'
            ? 'Ubah atribut HTML mentah menjadi atribut React JSX secara instan, serta validasi dan rapikan struktur JSON.'
            : 'Convert raw HTML into React JSX attributes, validate and format JSON payloads, and inspect tokens.'}
        </p>
      </div>

      <div className="rounded-xl border border-[#8B9CFF]/25 bg-[#8B9CFF]/[0.05] p-3.5 flex items-start gap-2.5 text-xs text-slate-600 dark:text-[#9BA6B5]">
        <HelpCircle className="w-4 h-4 text-[#8B9CFF] shrink-0 mt-0.5" />
        <p>
          {lang === 'id'
            ? 'Arahan Konverter: Tempel kode HTML di kolom kiri untuk otomatis mengubah class menjadi className, for menjadi htmlFor, dan menutup tag <input /> agar siap dipakai di komponen React.'
            : 'Converter Guide: Paste HTML on the left to automatically transform class to className, for to htmlFor, and self-close <input /> tags for React.'}
        </p>
      </div>

      <div className="inline-flex p-1 rounded-lg bg-slate-200/70 dark:bg-[#10141D] border border-slate-300/60 dark:border-white/10">
        <button
          type="button"
          onClick={() => setToolTab('html2jsx')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium ${
            toolTab === 'html2jsx'
              ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
              : 'text-slate-600 dark:text-[#9BA6B5]'
          }`}
        >
          {lang === 'id' ? 'Konverter HTML ke React JSX' : 'HTML to React JSX Converter'}
        </button>
        <button
          type="button"
          onClick={() => setToolTab('json')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium ${
            toolTab === 'json'
              ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA]'
              : 'text-slate-600 dark:text-[#9BA6B5]'
          }`}
        >
          {lang === 'id' ? 'Validator & Pemformat JSON' : 'JSON Validator & Formatter'}
        </button>
      </div>

      {toolTab === 'html2jsx' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#9BA6B5]" htmlFor="rawHtmlArea">
              {lang === 'id' ? 'Input HTML Mentah' : 'Input Raw HTML'}
            </label>
            <textarea
              id="rawHtmlArea"
              rows={10}
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/10 p-4 font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#8B9CFF]">
                {lang === 'id' ? 'Hasil React JSX' : 'Output React JSX'}
              </span>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(convertedJsx);
                  notify(
                    lang === 'id' ? 'Kode JSX berhasil disalin.' : 'Copied converted JSX.',
                    'success'
                  );
                }}
                className="text-xs font-mono text-[#8B9CFF] hover:underline flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{lang === 'id' ? 'Salin JSX' : 'Copy JSX'}</span>
              </button>
            </div>
            <pre className="w-full min-h-[240px] rounded-xl bg-[#090B10] border border-white/10 p-4 font-mono text-xs text-emerald-300 overflow-auto">
              {convertedJsx}
            </pre>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          <textarea
            rows={10}
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            aria-label="JSON input"
            className="w-full rounded-xl bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/10 p-4 font-mono text-xs"
          />
          {jsonError && <p className="text-xs font-mono text-rose-400">{jsonError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={formatJson}
              className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>
                {lang === 'id' ? 'Rapikan & Validasi JSON' : 'Prettify & Validate JSON'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FavoritesPage() {
  const { favorites, toggleFavorite, user, lang } = usePlatform();

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <p className="text-xs font-mono text-[#8B9CFF]">
          {user
            ? lang === 'id'
              ? 'Favorit Akun Tersinkronisasi Cloud (Firebase)'
              : 'Cloud-Synchronized Account Favorites'
            : lang === 'id'
            ? 'Favorit Lokal Browser (Masuk dengan Google untuk sinkronisasi ke Cloud)'
            : 'Local Browser Favorites (Sign in to sync across devices)'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
          {lang === 'id' ? 'Daftar Favorit Tersimpan' : 'Saved Favorites'}
        </h1>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-12 text-center space-y-3">
          <Bookmark className="w-6 h-6 text-[#8B9CFF] mx-auto" />
          <p className="text-base font-semibold">
            {lang === 'id' ? 'Belum ada item favorit yang disimpan.' : 'No favorites saved yet.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
            {lang === 'id'
              ? 'Klik ikon Bookmark pada komponen, template, snippet, atau arsip scrape untuk menyimpannya di sini.'
              : 'Bookmark components, templates, snippets, or scrape archives to access them quickly here.'}
          </p>
          <Link
            to="/components"
            className="inline-block px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
          >
            {lang === 'id' ? 'Jelajahi Pustaka Komponen' : 'Browse Component Library'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav) => {
            const linkPath =
              fav.targetType === 'component'
                ? `/components/${fav.slug}`
                : fav.targetType === 'scrape'
                ? `/scrape/${fav.slug}`
                : fav.targetType === 'template'
                ? '/templates'
                : '/snippets';

            return (
              <div
                key={fav.id}
                className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="text-xs font-mono text-[#8B9CFF] uppercase">
                    {fav.targetType} · {fav.category}
                  </div>
                  <h2 className="text-base font-semibold mt-1">
                    <Link to={linkPath} className="hover:text-[#8B9CFF]">
                      {fav.title}
                    </Link>
                  </h2>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
                  <Link to={linkPath} className="text-xs font-mono text-[#8B9CFF] hover:underline">
                    {lang === 'id' ? 'Buka Resource' : 'Open Resource'}
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite({
                        id: fav.targetId,
                        type: fav.targetType,
                        title: fav.title,
                        slug: fav.slug,
                        category: fav.category,
                      })
                    }
                    aria-label={`Remove ${fav.title}`}
                    className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'id' ? 'Hapus' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CollectionsPage() {
  const { collections, components, scrapes, createCollection, deleteCollection, lang } =
    usePlatform();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createCollection(name, desc);
    setName('');
    setDesc('');
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <p className="text-xs font-mono text-[#8B9CFF]">
          {lang === 'id' ? 'Folder Proyek & Workspace' : 'Personal & Workspace Folders'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
          {lang === 'id' ? 'Koleksi Resource' : 'Resource Collections'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9BA6B5] mt-1">
          {lang === 'id'
            ? 'Kelompokkan komponen UI dan arsip scrape ke dalam folder paket proyek yang rapi.'
            : 'Organize UI components and scrape archives into reusable project kits.'}
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
      >
        <div className="md:col-span-4">
          <label className="block text-xs text-[#9BA6B5] mb-1" htmlFor="colName">
            {lang === 'id' ? 'Nama Koleksi' : 'Collection Name'}
          </label>
          <input
            id="colName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={lang === 'id' ? 'Contoh: Kit Dashboard Fintech' : 'e.g. Fintech Dashboard Kit'}
            className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs"
          />
        </div>
        <div className="md:col-span-6">
          <label className="block text-xs text-[#9BA6B5] mb-1" htmlFor="colDesc">
            {lang === 'id' ? 'Deskripsi' : 'Description'}
          </label>
          <input
            id="colDesc"
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={
              lang === 'id'
                ? 'Kumpulan komponen dan arsip untuk proyek berikutnya...'
                : 'Components and archives for upcoming sprint...'
            }
            className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-2 px-3 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Buat Koleksi' : 'Create'}</span>
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-5 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-[#8B9CFF]" />
                  <h2 className="text-base font-semibold">{col.name}</h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#9BA6B5] mt-1">
                  {col.description ||
                    (lang === 'id' ? 'Koleksi developer terkurasi.' : 'Curated developer collection.')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteCollection(col.id)}
                aria-label={`Delete collection ${col.name}`}
                className="text-xs text-rose-400 hover:underline"
              >
                {lang === 'id' ? 'Hapus' : 'Delete'}
              </button>
            </div>

            <div className="border-t border-slate-200 dark:border-white/10 pt-3 space-y-1.5">
              <p className="text-[11px] font-mono text-slate-400 dark:text-[#9BA6B5]">
                {lang === 'id'
                  ? `ITEM TERSIMPAN (${col.itemIds.length})`
                  : `SAVED ITEMS (${col.itemIds.length})`}
              </p>
              {col.itemIds.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
                  {lang === 'id'
                    ? `Belum ada item. Klik tombol "+ ${col.name}" pada halaman detail komponen.`
                    : `No items added yet. Click "Save to ${col.name}" on any component detail page.`}
                </p>
              ) : (
                col.itemIds.map((itemId) => {
                  const comp = components.find((c) => c.id === itemId);
                  const scr = scrapes.find((s) => s.id === itemId);
                  const label = comp?.name || scr?.name || itemId;
                  const path = comp
                    ? `/components/${comp.slug}`
                    : scr
                    ? `/scrape/${scr.slug}`
                    : '/components';
                  return (
                    <Link
                      key={itemId}
                      to={path}
                      className="block px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#090B10] text-xs font-mono hover:text-[#8B9CFF]"
                    >
                      {label}
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { user, profile, role, favorites, collections, signInWithGoogle, signOut, lang } =
    usePlatform();

  return (
    <div className="max-w-2xl space-y-8">
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <p className="text-xs font-mono text-[#8B9CFF]">
          {lang === 'id' ? 'Status Akun & Hak Akses' : 'Account & Role Status'}
        </p>
        <h1 className="text-2xl font-bold mt-1">
          {lang === 'id' ? 'Profil Developer' : 'Developer Profile'}
        </h1>
      </div>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 flex items-start gap-3 text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
            {lang === 'id'
              ? 'Database Cloud Aktif Otomatis (Tanpa Perlu Setup Supabase Manual)'
              : 'Cloud Database Automatically Active (No Manual Supabase Setup Needed)'}
          </p>
          <p className="text-slate-600 dark:text-[#9BA6B5] leading-relaxed">
            {lang === 'id'
              ? 'Platform ini sudah terhubung langsung ke Google Firebase Firestore & Authentication. Anda dapat masuk dengan akun Google (vannn626@gmail.com) untuk membuka akses penuh Owner Studio.'
              : 'This platform is directly connected to provisioned Google Firebase Firestore & Authentication. Sign in with Google to unlock Owner Studio.'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#8B9CFF]/15 border border-[#8B9CFF]/40 flex items-center justify-center text-[#8B9CFF]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {profile?.displayName ||
                  (lang === 'id' ? 'Sesi Pengunjung Publik' : 'Public Developer Session')}
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-[#9BA6B5]">
                {user?.email ||
                  profile?.email ||
                  (lang === 'id'
                    ? 'Mode publik aktif (tersimpan di browser lokal)'
                    : 'Local fallback mode active')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{role}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-mono tabular-nums">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10">
            <span className="text-slate-500 dark:text-[#9BA6B5] block">
              {lang === 'id' ? 'Favorit Tersimpan' : 'Saved Favorites'}
            </span>
            <strong className="text-lg text-slate-900 dark:text-[#F5F7FA]">{favorites.length}</strong>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10">
            <span className="text-slate-500 dark:text-[#9BA6B5] block">
              {lang === 'id' ? 'Koleksi Proyek' : 'Collections'}
            </span>
            <strong className="text-lg text-slate-900 dark:text-[#F5F7FA]">
              {collections.length}
            </strong>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          {user ? (
            <button
              type="button"
              onClick={signOut}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-white/10 text-xs font-semibold"
            >
              {lang === 'id' ? 'Keluar dari Sesi Akun' : 'Sign Out of Firebase Session'}
            </button>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
            >
              {lang === 'id'
                ? 'Masuk dengan Google (Sinkronisasi Cloud & Akses Owner)'
                : 'Sign In with Google to Sync Cloud Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
