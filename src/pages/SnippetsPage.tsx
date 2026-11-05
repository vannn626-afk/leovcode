import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Copy, Download, Bookmark, Plus, X } from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { downloadTextFile } from '../utils/exportZip';
import { slugify } from '../utils/security';
import type { SnippetItem } from '../types';

export function SnippetsPage() {
  const {
    snippets,
    lang,
    isFavorited,
    toggleFavorite,
    incrementMetric,
    saveSnippet,
    profile,
    notify,
  } = usePlatform();

  const isId = lang === 'id';
  const [searchParams] = useSearchParams();
  const [queryText, setQueryText] = useState(searchParams.get('q') || '');
  const [selectedLang, setSelectedLang] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLang, setNewLang] = useState<SnippetItem['language']>('TypeScript');
  const [newCategory, setNewCategory] = useState('Utility');
  const [newCode, setNewCode] = useState('');

  const languages = ['All', 'TypeScript', 'JavaScript', 'React TSX', 'CSS', 'HTML', 'Tailwind'];

  const filteredSnippets = useMemo(() => {
    let list = snippets.filter((s) => s.status === 'published');
    if (selectedLang !== 'All') {
      list = list.filter((s) => s.language.toLowerCase() === selectedLang.toLowerCase());
    }
    if (queryText.trim()) {
      const q = queryText.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [snippets, selectedLang, queryText]);

  const handleCreateSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;
    const now = new Date().toISOString();
    const item: SnippetItem = {
      id: `snip-${Date.now()}`,
      name: newTitle.trim(),
      slug: slugify(newTitle),
      description: newDesc.trim() || 'Custom developer code snippet.',
      category: newCategory,
      language: newLang,
      tags: [newCategory.toLowerCase(), newLang.toLowerCase()],
      code: newCode,
      status: 'published',
      isPublic: true,
      authorId: profile?.uid || 'guest-user',
      authorName: profile?.displayName || 'Developer',
      copiesCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    await saveSnippet(item, true);
    setModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewCode('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.09] pb-5">
        <div>
          <p className="text-xs font-mono text-[#8B9CFF]">
            {isId ? 'Gudang Potongan Kode Developer' : 'Developer Code Vault'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">
            {isId ? 'Koleksi Snippet Kode Siap Pakai' : 'Reusable Code Snippets'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9BA6B5] mt-1">
            {isId
              ? 'Kumpulan React Hook TypeScript, fungsi validasi keamanan, helper HTTP retry, dan tata letak CSS Grid.'
              : 'Type-safe React hooks, security validators, exponential backoff helpers, and intrinsic CSS layouts.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isId ? 'Tambah Snippet Baru' : 'Add Code Snippet'}</span>
        </button>
      </div>

      {/* Search & Language Filter */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9BA6B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={
              isId
                ? 'Cari snippet berdasarkan judul, nama fungsi, atau tag...'
                : 'Search snippets by title, hook, or tag...'
            }
            aria-label="Search snippets"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-xs sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {languages.map((lItem) => (
            <button
              key={lItem}
              type="button"
              onClick={() => setSelectedLang(lItem)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                selectedLang.toLowerCase() === lItem.toLowerCase()
                  ? 'bg-[#8B9CFF] text-[#090B10] font-semibold'
                  : 'bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5]'
              }`}
            >
              {lItem === 'All' && isId ? 'Semua Bahasa' : lItem}
            </button>
          ))}
        </div>
      </div>

      {/* Snippets List */}
      <div className="space-y-6">
        {filteredSnippets.map((snip) => {
          const fav = isFavorited(snip.id);
          return (
            <article
              key={snip.id}
              className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-[#8B9CFF]">
                    {snip.language} · {snip.category} · {isId ? 'Oleh' : 'By'} {snip.authorName} ·{' '}
                    {snip.copiesCount} {isId ? 'disalin' : 'copies'}
                  </div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-[#F5F7FA] mt-0.5">
                    {snip.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#9BA6B5] mt-0.5">
                    {snip.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(snip.code);
                      incrementMetric('snippet', snip.id, 'copiesCount');
                      notify(
                        isId
                          ? `Snippet ${snip.name} berhasil disalin.`
                          : `Copied ${snip.name} to clipboard.`,
                        'success'
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isId ? 'Salin Kode' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      downloadTextFile(`${snip.slug}.ts`, snip.code);
                      notify(
                        isId ? `Mengunduh ${snip.slug}.ts` : `Downloaded ${snip.slug}.ts`,
                        'success'
                      );
                    }}
                    aria-label={`Download ${snip.name}`}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5]"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite({
                        id: snip.id,
                        type: 'snippet',
                        title: snip.name,
                        slug: snip.slug,
                        category: snip.category,
                      })
                    }
                    aria-label="Favorite snippet"
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

              <CodeEditorPanel
                code={snip.code}
                language={snip.language}
                fileName={`${snip.slug}.${snip.language === 'CSS' ? 'css' : 'ts'}`}
                readOnly={true}
                maxHeight="260px"
              />
            </article>
          );
        })}
      </div>

      {/* Add Snippet Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Create Code Snippet"
        >
          <form
            onSubmit={handleCreateSnippet}
            className="w-full max-w-lg rounded-xl bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/15 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">
                {isId ? 'Publikasikan Snippet Kode Baru' : 'Publish New Code Snippet'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close modal">
                <X className="w-4 h-4 text-[#9BA6B5]" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-[#9BA6B5] mb-1" htmlFor="snipTitle">
                {isId ? 'Judul Snippet' : 'Snippet Title'}
              </label>
              <input
                id="snipTitle"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. useLocalStorage State Sync Hook"
                className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#9BA6B5] mb-1" htmlFor="snipLang">
                  {isId ? 'Bahasa Pemrograman' : 'Language'}
                </label>
                <select
                  id="snipLang"
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value as SnippetItem['language'])}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="React TSX">React TSX</option>
                  <option value="CSS">CSS</option>
                  <option value="HTML">HTML</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#9BA6B5] mb-1" htmlFor="snipCat">
                  {isId ? 'Kategori' : 'Category'}
                </label>
                <input
                  id="snipCat"
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#9BA6B5] mb-1" htmlFor="snipDesc">
                {isId ? 'Deskripsi Fungsi' : 'Description'}
              </label>
              <input
                id="snipDesc"
                type="text"
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder={
                  isId
                    ? 'Penjelasan singkat kegunaan potongan kode ini...'
                    : 'Concise explanation of what this snippet solves...'
                }
                className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-[#9BA6B5] mb-1" htmlFor="snipCode">
                {isId ? 'Kode Sumber' : 'Source Code'}
              </label>
              <textarea
                id="snipCode"
                required
                rows={7}
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="export function example() { ... }"
                className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 p-3 text-xs font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-white/10 text-xs"
              >
                {isId ? 'Batal' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
              >
                {isId ? 'Simpan Snippet' : 'Save Snippet'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
