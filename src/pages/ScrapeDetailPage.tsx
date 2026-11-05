import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FolderGit2,
  FileCode2,
  Download,
  Copy,
  Bookmark,
  ExternalLink,
  Flag,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { SandboxPreview } from '../components/SandboxPreview';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { downloadScrapeProjectZip } from '../utils/exportZip';

export function ScrapeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    scrapes,
    lang,
    isFavorited,
    toggleFavorite,
    incrementMetric,
    deleteScrape,
    role,
    notify,
  } = usePlatform();

  const isId = lang === 'id';

  const project = useMemo(
    () => scrapes.find((s) => s.slug === slug || s.id === slug),
    [scrapes, slug]
  );

  const files = useMemo(() => project?.files || [], [project]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    if (project) {
      setSelectedFilePath(project.entryFile || files[0]?.filePath || 'index.html');
      incrementMetric('scrape', project.id, 'viewsCount');
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-12 text-center space-y-4">
        <h1 className="text-xl font-bold">
          {isId ? 'Arsip Scrape Tidak Ditemukan' : 'Scrape Archive Not Found'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
          {isId
            ? `Arsip proyek dengan alamat "${slug}" tidak ditemukan atau telah dihapus.`
            : `The requested scrape archive "${slug}" does not exist or has been removed.`}
        </p>
        <Link
          to="/scrape"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isId ? 'Kembali ke Scrape Library' : 'Back to Scrape Library'}</span>
        </Link>
      </div>
    );
  }

  const activeFile = files.find((f) => f.filePath === selectedFilePath) || files[0];
  const fav = isFavorited(project.id);

  const relatedScrapes = scrapes
    .filter((s) => s.id !== project.id && s.status === 'published')
    .slice(0, 3);

  const handleCopyAllFiles = async () => {
    const bundleText = files
      .map((f) => `/* --- FILE: ${f.filePath} (${f.language}) --- */\n${f.content}`)
      .join('\n\n');
    await navigator.clipboard.writeText(bundleText);
    incrementMetric('scrape', project.id, 'copiesCount');
    notify(
      isId
        ? `Berhasil menyalin seluruh ${files.length} file ke clipboard.`
        : `Copied all ${files.length} files to clipboard.`,
      'success'
    );
  };

  const handleCopyJsonBundle = async () => {
    const jsonPayload = JSON.stringify(
      {
        name: project.name,
        slug: project.slug,
        license: project.license,
        sourceAuthor: project.sourceAuthor,
        sourceUrl: project.sourceUrl,
        entryFile: project.entryFile,
        files: files.map((f) => ({ path: f.filePath, language: f.language, content: f.content })),
      },
      null,
      2
    );
    await navigator.clipboard.writeText(jsonPayload);
    incrementMetric('scrape', project.id, 'copiesCount');
    notify(
      isId
        ? 'Bundel JSON proyek berhasil disalin ke clipboard.'
        : 'Copied Scrape JSON bundle to clipboard.',
      'success'
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.09] pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#9BA6B5]">
            <Link to="/scrape" className="text-[#8B9CFF] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Scrape Library</span>
            </Link>
            <span>/</span>
            <span>{project.category}</span>
            <span>·</span>
            <span>{project.technologies.join(', ')}</span>
            <span>·</span>
            <span className="text-emerald-400">{project.license}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F5F7FA]">
            {project.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9BA6B5] max-w-2xl">
            {project.description}
          </p>
          <div className="text-xs font-mono text-slate-400 dark:text-[#9BA6B5] tabular-nums">
            Tags: {project.tags.join(' · ')} · {project.viewsCount} {isId ? 'dilihat' : 'views'} ·{' '}
            {project.copiesCount} {isId ? 'disalin' : 'copies'} · {project.downloadsCount}{' '}
            {isId ? 'unduhan' : 'downloads'}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start">
          <button
            type="button"
            onClick={handleCopyAllFiles}
            className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#141A24] text-xs font-medium flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-[#8B9CFF]" />
            <span>{isId ? 'Salin Semua Kode' : 'Copy All Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyJsonBundle}
            className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#141A24] text-xs font-mono flex items-center gap-1.5"
          >
            <span>{isId ? 'Salin JSON' : 'Copy JSON'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              downloadScrapeProjectZip(
                project.slug,
                project.name,
                project.license,
                project.sourceAuthor,
                project.sourceUrl,
                files
              );
              incrementMetric('scrape', project.id, 'downloadsCount');
              notify(
                isId
                  ? `Berhasil mengunduh ${project.slug}-project.zip lengkap dengan struktur folder.`
                  : `Downloaded ${project.slug}-project.zip preserving folder tree.`,
                'success'
              );
            }}
            className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isId ? 'Unduh Proyek ZIP' : 'Download Project ZIP'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              toggleFavorite({
                id: project.id,
                type: 'scrape',
                title: project.name,
                slug: project.slug,
                category: project.category,
              })
            }
            aria-label="Toggle favorite"
            className={`p-2 rounded-lg border ${
              fav
                ? 'border-[#8B9CFF] bg-[#8B9CFF]/15 text-[#8B9CFF]'
                : 'border-slate-300 dark:border-white/10 bg-white dark:bg-[#141A24]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arahan Inspeksi Multi-File */}
      <div className="rounded-xl border border-[#8B9CFF]/25 bg-[#8B9CFF]/[0.06] px-4 py-3 flex items-center gap-3 text-xs text-slate-600 dark:text-[#9BA6B5]">
        <BookOpen className="w-4 h-4 text-[#8B9CFF] shrink-0" />
        <span>
          {isId
            ? 'Arahan: Pratinjau di bawah menggabungkan seluruh file proyek (HTML, CSS, dan JS) secara otomatis. Gulir ke bawah lalu klik nama file di pohon direktori sebelah kiri untuk membaca atau menyalin isi masing-masing file.'
            : 'Guide: The sandbox below automatically bundles all linked HTML, CSS, and JS files. Click any file in the left directory tree below to inspect its source code.'}
        </span>
      </div>

      {/* Live Multi-File Preview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            {isId ? 'Pratinjau Sandbox Multi-File Live' : 'Multi-File Live Sandbox Preview'} (Entry:{' '}
            <code className="text-[#8B9CFF]">{project.entryFile}</code>)
          </h2>
          <span className="text-xs font-mono text-slate-500 dark:text-[#9BA6B5]">
            {files.length} {isId ? 'file terhubung' : 'linked project files'}
          </span>
        </div>

        <SandboxPreview
          title={project.name}
          html={activeFile?.content || ''}
          files={files}
          entryFile={project.entryFile}
          minHeight={480}
        />
      </section>

      {/* File Tree + Source Code Viewer Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Project Directory File Tree + Source Attribution */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#10141D] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                <FolderGit2 className="w-4 h-4 text-[#8B9CFF]" />
                <span>{project.slug}/</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#9BA6B5]">
                {files.length} file
              </span>
            </div>

            <div className="p-2 space-y-1">
              {files.map((file) => {
                const isSelected = activeFile?.filePath === file.filePath;
                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setSelectedFilePath(file.filePath)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors text-left ${
                      isSelected
                        ? 'bg-[#8B9CFF]/15 text-[#8B9CFF] font-semibold'
                        : 'text-slate-700 dark:text-[#9BA6B5] hover:bg-slate-100 dark:hover:bg-[#1A2230]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{file.filePath}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-[11px]">
                      {file.filePath === project.entryFile && (
                        <span className="text-emerald-400">entry</span>
                      )}
                      <span className="text-slate-400 dark:text-[#9BA6B5]/60 tabular-nums">
                        {file.fileSize} B
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Attribution & Licensing Card */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-[#F5F7FA]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isId ? 'Atribusi Sumber & Lisensi' : 'Source Attribution & Licensing'}</span>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-[#9BA6B5]">
              <div className="flex justify-between">
                <span>{isId ? 'Pembuat Asli:' : 'Original Author:'}</span>
                <span className="font-mono text-slate-900 dark:text-[#F5F7FA]">
                  {project.sourceAuthor}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isId ? 'Lisensi:' : 'License:'}</span>
                <span className="font-mono text-emerald-400">{project.license}</span>
              </div>
              <div className="pt-1">
                <span className="block mb-1">{isId ? 'URL Sumber Asli:' : 'Original Source URL:'}</span>
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[#8B9CFF] hover:underline break-all inline-flex items-center gap-1"
                >
                  <span>{project.sourceUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
              <p className="pt-2 border-t border-slate-200 dark:border-white/10 leading-relaxed">
                {project.attributionNotes}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
              >
                <Flag className="w-3 h-3" />
                <span>
                  {isId ? 'Laporkan Masalah Lisensi / Takedown' : 'Report License / Takedown Issue'}
                </span>
              </button>

              {(role === 'owner' || role === 'admin') && (
                <button
                  type="button"
                  onClick={() => deleteScrape(project.id)}
                  className="text-[11px] font-mono text-amber-400 hover:underline"
                >
                  {isId ? 'Tarik Publikasi' : 'Unpublish Archive'}
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right: Active File Source Code Viewer */}
        <div className="lg:col-span-8">
          {activeFile ? (
            <CodeEditorPanel
              code={activeFile.content}
              language={activeFile.language}
              fileName={activeFile.filePath}
              readOnly={true}
              maxHeight="520px"
            />
          ) : (
            <div className="rounded-xl border border-white/10 p-8 text-center text-xs text-[#9BA6B5]">
              {isId
                ? 'Pilih salah satu file di pohon direktori sebelah kiri untuk membaca kodenya.'
                : 'Select a file from the project tree to inspect its source code.'}
            </div>
          )}
        </div>
      </section>

      {/* Related Scrapes */}
      {relatedScrapes.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/[0.09]">
          <h2 className="text-lg font-bold">
            {isId ? 'Arsip Scrape Terkait Lainnya' : 'Related Scrape Archives'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedScrapes.map((rel) => (
              <Link
                key={rel.id}
                to={`/scrape/${rel.slug}`}
                className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] hover:border-[#8B9CFF]/50 transition space-y-1.5"
              >
                <div className="text-xs font-mono text-[#8B9CFF]">
                  {rel.category} · {rel.license}
                </div>
                <div className="text-sm font-semibold">{rel.name}</div>
                <p className="text-xs text-slate-500 dark:text-[#9BA6B5] line-clamp-2">
                  {rel.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Report / Takedown Modal */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Report Attribution or License Issue"
        >
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/15 p-6 space-y-4">
            <h3 className="text-base font-bold">
              {isId
                ? 'Laporkan Masalah Lisensi atau Atribusi'
                : 'Report License or Attribution Concern'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
              {isId
                ? 'Kirim laporan jika arsip ini memiliki masalah hak cipta, atribusi yang kurang tepat, atau kredensial yang terekspos.'
                : 'Submit a notice if this archive contains proprietary code, missing attribution, or exposed credentials.'}
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder={
                isId
                  ? 'Jelaskan detail kendala lisensi atau permintaan takedown...'
                  : 'Describe the license or attribution issue...'
              }
              rows={3}
              className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 p-3 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/10 text-xs"
              >
                {isId ? 'Batal' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setReportModalOpen(false);
                  setReportReason('');
                  notify(
                    isId
                      ? 'Laporan berhasil dikirim ke Owner Studio untuk ditinjau.'
                      : 'Submitted attribution review ticket to Owner Studio.',
                    'info'
                  );
                }}
                className="px-4 py-2 rounded-lg bg-rose-500 text-white text-xs font-semibold"
              >
                {isId ? 'Kirim Laporan' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
