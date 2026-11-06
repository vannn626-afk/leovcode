import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Upload,
  FolderGit2,
  FileCode2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  Eye,
} from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { SandboxPreview } from '../components/SandboxPreview';
import {
  slugify,
  validateFilePath,
  validateUploadExtension,
  detectLanguageFromPath,
  sanitizeSvgContent,
} from '../utils/security';
import { parseUploadedZipArchive } from '../utils/exportZip';
import type {
  ComponentItem,
  TemplateItem,
  ScrapedProject,
  ScrapedProjectFile,
  CategoryItem,
  LandingSectionBlock,
  UserRole,
} from '../types';

export function OwnerStudioPage() {
  const {
    user,
    role,
    lang,
    signInWithGoogle,
    components,
    templates,
    snippets,
    scrapes,
    categories,
    assets,
    usersList,
    settings,
    auditLogs,
    saveComponent,
    deleteComponent,
    saveTemplate,
    deleteTemplate,
    saveSnippet,
    deleteSnippet,
    saveScrape,
    deleteScrape,
    saveCategory,
    deleteCategory,
    saveAsset,
    deleteAsset,
    updateUserRole,
    updatePlatformSettings,
    resetPlatformSettings,
    notify,
  } = usePlatform();

  const isId = lang === 'id';
  const location = useLocation();
  const subPath = location.pathname.replace(/^\/owner\/?/, '') || 'dashboard';

  // Strict Gate: require authenticated Owner or Admin account
  if (!user || (role !== 'owner' && role !== 'admin')) {
    return (
      <div className="max-w-lg mx-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-8 text-center space-y-4 my-8">
        <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
        <h1 className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
          {!user
            ? isId
              ? 'Akses Owner Studio Memerlukan Login'
              : 'Owner Studio Requires Authentication'
            : isId
            ? 'Akses Ditolak (Bukan Akun Owner / Admin)'
            : 'Access Denied (Insufficient Role Permissions)'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#9BA6B5] leading-relaxed">
          {!user
            ? isId
              ? 'Halaman pengelolaan platform ini dikunci khusus untuk Owner dan Administrator terverifikasi. Silakan masuk dengan akun Google Owner untuk melanjutkan.'
              : 'This studio is strictly restricted to verified platform owners and administrators. Sign in with your Google Owner account to continue.'
            : isId
            ? `Akun ${user.email} terdaftar sebagai pengguna publik biasa (User) dan tidak memiliki izin membuka Owner Studio.`
            : `The account ${user.email} has standard user permissions and cannot access Owner Studio.`}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={signInWithGoogle}
            className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
          >
            {!user
              ? isId
                ? 'Masuk dengan Google (Akun Owner)'
                : 'Sign In with Google (Owner Account)'
              : isId
              ? 'Ganti Akun Google'
              : 'Switch Google Account'}
          </button>
          <Link
            to="/"
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]"
          >
            {isId ? 'Kembali ke Beranda' : 'Back to Overview'}
          </Link>
        </div>
      </div>
    );
  }

  // Real calculated metrics from actual state (Zero fake statistics)
  const metrics = useMemo(() => {
    const totalViews =
      components.reduce((acc, c) => acc + c.viewsCount, 0) +
      templates.reduce((acc, t) => acc + t.viewsCount, 0) +
      scrapes.reduce((acc, s) => acc + s.viewsCount, 0);
    const totalCopies =
      components.reduce((acc, c) => acc + c.copiesCount, 0) +
      templates.reduce((acc, t) => acc + t.copiesCount, 0) +
      snippets.reduce((acc, s) => acc + s.copiesCount, 0) +
      scrapes.reduce((acc, s) => acc + s.copiesCount, 0);
    const totalDownloads =
      components.reduce((acc, c) => acc + c.downloadsCount, 0) +
      templates.reduce((acc, t) => acc + t.downloadsCount, 0) +
      scrapes.reduce((acc, s) => acc + s.downloadsCount, 0);

    const publishedCount =
      components.filter((c) => c.status === 'published').length +
      templates.filter((t) => t.status === 'published').length +
      snippets.filter((s) => s.status === 'published').length +
      scrapes.filter((s) => s.status === 'published').length;

    const draftCount =
      components.filter((c) => c.status !== 'published').length +
      templates.filter((t) => t.status !== 'published').length +
      snippets.filter((s) => s.status !== 'published').length +
      scrapes.filter((s) => s.status !== 'published').length;

    return {
      totalViews,
      totalCopies,
      totalDownloads,
      publishedCount,
      draftCount,
    };
  }, [components, templates, snippets, scrapes]);

  // --- Component Builder State ---
  const [compForm, setCompForm] = useState({
    id: '',
    name: '',
    category: 'Authentication',
    subcategory: 'Login',
    technology: 'React + Tailwind',
    description: '',
    tags: 'auth, login, dark-ui',
    version: '1.0.0',
    status: 'published' as ComponentItem['status'],
    isFeatured: true,
    isPopular: false,
    htmlCode: `<div class="p-6 rounded-xl bg-[#141A24] border border-white/10 text-[#F5F7FA]">\n  <h3 class="text-base font-bold">New Custom Component</h3>\n  <p class="text-xs text-[#9BA6B5] mt-1">Created in LEOVANDYZ Owner Studio.</p>\n</div>`,
    cssCode: `.custom-box { border-radius: 12px; }`,
    jsCode: ``,
    reactCode: `export function CustomComponent() {\n  return <div className="p-6 rounded-xl bg-[#141A24]">New Custom Component</div>;\n}`,
  });

  // --- Scrape Builder State ---
  const [scrapeForm, setScrapeForm] = useState({
    id: '',
    name: '',
    category: 'Login & Authentication',
    description: '',
    technologies: 'HTML, CSS, JavaScript',
    tags: 'archive, multi-file, ui',
    sourceUrl: 'https://github.com/leovandyz-open/reference-bundle',
    sourceAuthor: 'Leovandyz Open Lab',
    license: 'MIT License',
    attributionNotes: 'Verified open-source reference published with attribution.',
    entryFile: 'index.html',
    status: 'published' as ScrapedProject['status'],
    isFeatured: true,
  });
  const [scrapeFiles, setScrapeFiles] = useState<ScrapedProjectFile[]>([
    {
      id: 'sf-init-1',
      projectId: 'draft-scrape',
      filePath: 'index.html',
      language: 'HTML',
      mimeType: 'text/html',
      fileSize: 184,
      isEntryFile: true,
      content: `<div class="archive-card">\n  <h2>Curated Scrape Project</h2>\n  <p>Multi-file bundle previewed in isolated sandbox.</p>\n</div>`,
      authorId: 'owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sf-init-2',
      projectId: 'draft-scrape',
      filePath: 'style.css',
      language: 'CSS',
      mimeType: 'text/css',
      fileSize: 132,
      isEntryFile: false,
      content: `.archive-card { background: #141A24; border: 1px solid rgba(255,255,255,0.12); padding: 24px; border-radius: 12px; color: #F5F7FA; }`,
      authorId: 'owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  const [newFilePath, setNewFilePath] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [zipRejectLogs, setZipRejectLogs] = useState<string[]>([]);

  // --- Landing Page Visual Builder State ---
  const [builderTitle, setBuilderTitle] = useState('Custom Cloud Platform Landing');
  const [builderCategory, setBuilderCategory] = useState('Landing Page');
  const [landingBlocks, setLandingBlocks] = useState<LandingSectionBlock[]>([
    {
      id: 'blk-nav',
      type: 'navbar',
      title: 'LEOVANDYZ CLOUD',
      subtitle: 'Regions · Security · Pricing',
      ctaText: 'Launch Console',
      backgroundHex: '#10141D',
      accentHex: '#8B9CFF',
      htmlContent: '',
    },
    {
      id: 'blk-hero',
      type: 'hero',
      title: 'Zero-Trust Edge Infrastructure for Modern Teams',
      subtitle: 'Deploy globally distributed Postgres and container sandboxes in seconds.',
      ctaText: 'Start Free Cluster',
      backgroundHex: '#090B10',
      accentHex: '#8B9CFF',
      htmlContent: '',
    },
    {
      id: 'blk-pricing',
      type: 'pricing',
      title: 'Predictable Resource Pricing',
      subtitle: '$29 / seat / month with 15,000 build minutes included.',
      ctaText: 'Provision Team Plan',
      backgroundHex: '#141A24',
      accentHex: '#8B9CFF',
      htmlContent: '',
    },
  ]);

  // --- Category Form State ---
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSection, setCatSection] = useState<CategoryItem['section']>('components');

  // --- Settings Form State ---
  const [settingsDraft, setSettingsDraft] = useState(settings);

  const studioTabs = [
    { id: 'dashboard', label: isId ? 'Ringkasan' : 'Dashboard', to: '/owner' },
    { id: 'components', label: isId ? 'Kelola Komponen' : 'Components', to: '/owner/components' },
    { id: 'templates', label: isId ? 'Template & Builder' : 'Templates & Builder', to: '/owner/templates' },
    { id: 'snippets', label: isId ? 'Kelola Snippet' : 'Snippets', to: '/owner/snippets' },
    { id: 'scrapes', label: isId ? 'Kelola Scrape' : 'Scrape Manager', to: '/owner/scrapes' },
    { id: 'categories', label: isId ? 'Kelola Kategori' : 'Categories', to: '/owner/categories' },
    { id: 'assets', label: isId ? 'Kelola Aset' : 'Assets', to: '/owner/assets' },
    { id: 'users', label: isId ? 'Kelola Pengguna' : 'Users', to: '/owner/users' },
    { id: 'settings', label: isId ? 'Pengaturan' : 'Settings', to: '/owner/settings' },
    { id: 'audit-logs', label: isId ? 'Log Audit' : 'Audit Logs', to: '/owner/audit-logs' },
  ];

  const studioGuideText: Record<string, string> = isId
    ? {
        dashboard:
          'Arahan Dashboard: Pantau metrik aktual komponen, unduhan ZIP, serta riwayat perubahan (Audit Trail). Gunakan tombol pintasan di sebelah kanan untuk mempublikasikan konten baru tanpa perlu mengubah kode aplikasi.',
        components:
          'Arahan Kelola Komponen: Isi nama, kategori, kode HTML/CSS/React TSX, lalu klik Simpan & Publikasikan. Anda juga dapat melihat pratinjau live sebelum menyimpan.',
        templates:
          'Arahan Template & Visual Builder: Susun blok halaman (Navbar, Hero, Pricing), ubah teks & warna aksen, atur urutan blok dengan panah Atas/Bawah, lalu simpan sebagai Template baru.',
        snippets:
          'Arahan Kelola Snippet: Tambahkan potongan fungsi TypeScript, React Hook, atau utilitas CSS agar mudah dicari dan disalin oleh developer.',
        scrapes:
          'Arahan Kelola Scrape: Unggah file arsip .zip (otomatis memvalidasi keamanan path & memblokir file .exe/.sh) atau tambahkan file satu per satu (index.html, style.css, script.js) beserta lisensi sumbernya.',
        categories:
          'Arahan Kelola Kategori: Tambah atau atur visibilitas kategori komponen, template, snippet, dan scrape. Kategori yang masih memiliki item aktif dilindungi agar tidak terhapus secara tidak sengaja.',
        assets:
          'Arahan Kelola Aset: Unggah ikon SVG atau gambar pendukung. File SVG otomatis dibersihkan dari tag <script> berbahaya sebelum disimpan.',
        users:
          'Arahan Kelola Pengguna: Atur role pengguna (Owner, Admin, User) serta status akun (Active / Suspended).',
        settings:
          'Arahan Pengaturan Platform: Ubah nama platform, warna aksen utama (#8B9CFF), tema default, atau aktifkan Mode Pemeliharaan secara langsung.',
        'audit-logs':
          'Arahan Log Audit: Catatan kronologis seluruh aktivitas administratif yang dilakukan oleh Owner maupun Admin.',
      }
    : {
        dashboard:
          'Dashboard Guide: Monitor real catalog telemetry and audit trails. Use the quick shortcuts on the right to publish new resources without editing application code.',
      };

  // Assemble HTML from Landing Builder blocks
  const assembledLandingHtml = useMemo(() => {
    return landingBlocks
      .map((blk) => {
        if (blk.type === 'navbar') {
          return `<header style="background:${blk.backgroundHex}" class="px-8 py-4 border-b border-white/10 flex items-center justify-between text-[#F5F7FA]">
  <span class="font-bold text-sm">${blk.title}</span>
  <span class="text-xs text-[#9BA6B5]">${blk.subtitle}</span>
  <button style="background:${blk.accentHex}" class="px-3.5 py-1.5 rounded-lg text-[#090B10] text-xs font-semibold">${blk.ctaText}</button>
</header>`;
        }
        return `<section style="background:${blk.backgroundHex}" class="px-8 py-12 border-b border-white/10 text-[#F5F7FA]">
  <div class="max-w-3xl mx-auto space-y-3">
    <span class="text-xs font-mono" style="color:${blk.accentHex}">${blk.type.toUpperCase()} SECTION</span>
    <h2 class="text-2xl font-bold">${blk.title}</h2>
    <p class="text-sm text-[#9BA6B5]">${blk.subtitle}</p>
    <button style="background:${blk.accentHex}" class="px-4 py-2 rounded-lg text-[#090B10] text-xs font-semibold mt-2">${blk.ctaText}</button>
  </div>
</section>`;
      })
      .join('\n');
  }, [landingBlocks]);

  const handleSaveComponentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compForm.name.trim()) return;
    const now = new Date().toISOString();
    const isNew = !compForm.id;
    const id = compForm.id || `comp-${Date.now()}`;
    const item: ComponentItem = {
      id,
      name: compForm.name.trim(),
      slug: slugify(compForm.name),
      description: compForm.description.trim() || 'Reusable UI component.',
      category: compForm.category,
      subcategory: compForm.subcategory || 'General',
      technology: compForm.technology,
      tags: compForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10),
      status: compForm.status,
      isFeatured: compForm.isFeatured,
      isPopular: compForm.isPopular,
      version: compForm.version,
      viewsCount: 1,
      copiesCount: 0,
      downloadsCount: 0,
      htmlCode: compForm.htmlCode,
      cssCode: compForm.cssCode,
      jsCode: compForm.jsCode,
      reactCode: compForm.reactCode,
      tailwindCode: compForm.htmlCode,
      tsCode: `export interface ComponentProps { className?: string; }`,
      authorId: 'owner-bootstrap-1',
      createdAt: now,
      updatedAt: now,
    };
    await saveComponent(item, isNew);
    setCompForm((prev) => ({ ...prev, id: '', name: '', description: '' }));
  };

  const handleAddScrapeFile = () => {
    const pathCheck = validateFilePath(newFilePath);
    if (!pathCheck.valid) {
      notify(pathCheck.reason || 'Invalid file path.', 'error');
      return;
    }
    const fileName = pathCheck.normalizedPath.split('/').pop() || '';
    const extCheck = validateUploadExtension(fileName);
    if (!extCheck.valid) {
      notify(extCheck.reason || 'Unsupported extension.', 'error');
      return;
    }
    const { language, mimeType } = detectLanguageFromPath(pathCheck.normalizedPath);
    const now = new Date().toISOString();
    const nextFile: ScrapedProjectFile = {
      id: `sf-${Date.now()}`,
      projectId: scrapeForm.id || 'draft-scrape',
      filePath: pathCheck.normalizedPath,
      language,
      mimeType,
      fileSize: newFileContent.length,
      isEntryFile: scrapeFiles.length === 0,
      content: newFileContent,
      authorId: 'owner-bootstrap-1',
      createdAt: now,
      updatedAt: now,
    };
    setScrapeFiles((prev) => [
      ...prev.filter((f) => f.filePath !== nextFile.filePath),
      nextFile,
    ]);
    setNewFilePath('');
    setNewFileContent('');
    notify(`Added ${nextFile.filePath} to archive file tree.`, 'success');
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await parseUploadedZipArchive(
        file,
        scrapeForm.id || 'draft-scrape',
        'owner-bootstrap-1',
        settings.maxUploadSizeMb
      );
      if (result.files.length > 0) {
        setScrapeFiles(result.files);
        setScrapeForm((prev) => ({ ...prev, entryFile: result.entryFile }));
      }
      setZipRejectLogs(result.rejected);
      notify(
        `Extracted ${result.files.length} safe files from ${file.name} (${result.rejected.length} rejected).`,
        'success'
      );
    } catch (err) {
      notify(err instanceof Error ? err.message : 'ZIP validation failed.', 'error');
    }
  };

  const handleSaveScrapeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeForm.name.trim() || scrapeFiles.length === 0) {
      notify('Project name and at least 1 valid source file are required.', 'error');
      return;
    }
    const now = new Date().toISOString();
    const id = scrapeForm.id || `scrape-${Date.now()}`;
    const item: ScrapedProject = {
      id,
      name: scrapeForm.name.trim(),
      slug: slugify(scrapeForm.name),
      description: scrapeForm.description.trim() || 'Curated multi-file code archive.',
      category: scrapeForm.category,
      technologies: scrapeForm.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      tags: scrapeForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      sourceUrl: scrapeForm.sourceUrl.trim(),
      sourceAuthor: scrapeForm.sourceAuthor.trim(),
      license: scrapeForm.license.trim(),
      attributionNotes: scrapeForm.attributionNotes.trim(),
      entryFile: scrapeForm.entryFile,
      status: scrapeForm.status,
      isFeatured: scrapeForm.isFeatured,
      isPopular: false,
      viewsCount: 1,
      copiesCount: 0,
      downloadsCount: 0,
      authorId: 'owner-bootstrap-1',
      createdAt: now,
      updatedAt: now,
      files: scrapeFiles.map((f) => ({ ...f, projectId: id })),
    };
    await saveScrape(item, !scrapeForm.id);
    setScrapeForm((prev) => ({ ...prev, id: '', name: '', description: '' }));
  };

  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const extCheck = validateUploadExtension(file.name);
    if (!extCheck.valid) {
      notify(extCheck.reason || 'Unsupported asset extension.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      let url = String(reader.result || '');
      if (file.name.toLowerCase().endsWith('.svg') && !url.startsWith('data:')) {
        const cleanSvg = sanitizeSvgContent(url);
        url = `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
      }
      await saveAsset({
        id: `asset-${Date.now()}`,
        name: file.name,
        mimeType: file.type || 'image/svg+xml',
        extension: extCheck.extension,
        sizeBytes: file.size,
        url,
        category: 'Uploaded',
        uploadedBy: 'owner-bootstrap-1',
        createdAt: new Date().toISOString(),
      });
    };
    if (file.name.toLowerCase().endsWith('.svg')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header & Navigation Bar */}
      <div className="border-b border-slate-200 dark:border-white/[0.09] pb-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-mono text-[#8B9CFF]">
              {isId
                ? 'OWNER STUDIO · PUSAT KENDALI KONTEN & KEAMANAN PLATFORM'
                : 'OWNER STUDIO · FULL PLATFORM CONTROL CENTER'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              {isId
                ? 'Administrasi Konten, Scrape Library & Keamanan'
                : 'Workspace Content & Security Administration'}
            </h1>
          </div>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono self-start sm:self-auto">
            Role: {role.toUpperCase()} ({isId ? 'Terverifikasi' : 'Verified'})
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {studioTabs.map((tab) => {
            const active =
              (tab.id === 'dashboard' && subPath === 'dashboard') ||
              (tab.id !== 'dashboard' && subPath.startsWith(tab.id));
            return (
              <Link
                key={tab.id}
                to={tab.to}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[#8B9CFF] text-[#090B10] font-semibold'
                    : 'bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Contextual Arahan Banner for active Owner Studio tab */}
        {(studioGuideText[subPath] || studioGuideText.dashboard) && (
          <div className="rounded-xl border border-[#8B9CFF]/25 bg-[#8B9CFF]/[0.06] px-4 py-3 text-xs text-slate-600 dark:text-[#9BA6B5]">
            {studioGuideText[subPath] || studioGuideText.dashboard}
          </div>
        )}
      </div>

      {/* 14.1 OWNER DASHBOARD */}
      {subPath === 'dashboard' && (
        <div className="space-y-8">
          {/* Primary Tabular Metric Strip */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10 font-mono tabular-nums">
            <div className="p-4">
              <span className="text-[11px] text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Komponen UI' : 'Components'}
              </span>
              <strong className="text-2xl text-slate-900 dark:text-[#F5F7FA]">{components.length}</strong>
            </div>
            <div className="p-4">
              <span className="text-[11px] text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Template' : 'Templates'}
              </span>
              <strong className="text-2xl text-slate-900 dark:text-[#F5F7FA]">{templates.length}</strong>
            </div>
            <div className="p-4">
              <span className="text-[11px] text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Snippet Kode' : 'Snippets'}
              </span>
              <strong className="text-2xl text-slate-900 dark:text-[#F5F7FA]">{snippets.length}</strong>
            </div>
            <div className="p-4">
              <span className="text-[11px] text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Arsip Scrape' : 'Scrape Archives'}
              </span>
              <strong className="text-2xl text-[#8B9CFF]">{scrapes.length}</strong>
            </div>
            <div className="p-4">
              <span className="text-[11px] text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Kategori' : 'Categories'}
              </span>
              <strong className="text-2xl text-slate-900 dark:text-[#F5F7FA]">{categories.length}</strong>
            </div>
            <div className="p-4">
              <span className="text-[11px] text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Pengguna' : 'Users'}
              </span>
              <strong className="text-2xl text-slate-900 dark:text-[#F5F7FA]">{usersList.length}</strong>
            </div>
          </div>

          {/* Secondary Telemetry Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono tabular-nums text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24]">
              <span className="text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Total Dilihat (Aktual)' : 'Actual Total Views'}
              </span>
              <strong className="text-xl text-slate-900 dark:text-[#F5F7FA]">{metrics.totalViews}</strong>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24]">
              <span className="text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Total Kode Disalin' : 'Actual Code Copies'}
              </span>
              <strong className="text-xl text-emerald-400">{metrics.totalCopies}</strong>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24]">
              <span className="text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Total Unduhan ZIP' : 'Actual ZIP Downloads'}
              </span>
              <strong className="text-xl text-[#8B9CFF]">{metrics.totalDownloads}</strong>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24]">
              <span className="text-slate-500 dark:text-[#9BA6B5] block">
                {isId ? 'Terpublikasi / Draf' : 'Published / Draft'}
              </span>
              <strong className="text-xl text-slate-900 dark:text-[#F5F7FA]">
                {metrics.publishedCount} / {metrics.draftCount}
              </strong>
            </div>
          </div>

          {/* Recent Audit Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">
                  {isId ? 'Riwayat Aktivitas Audit Terbaru' : 'Recent Administrative Audit Trail'}
                </h2>
                <Link to="/owner/audit-logs" className="text-xs font-mono text-[#8B9CFF] hover:underline">
                  {isId ? 'Lihat Semua Log' : 'Full Audit Log'}
                </Link>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-white/10 text-xs">
                {auditLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-[#8B9CFF] mr-2">{log.action}</span>
                      <span>{log.summary}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-[#9BA6B5] shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-5 space-y-3">
              <h2 className="text-base font-bold">
                {isId ? 'Pintasan Publikasi Cepat' : 'Quick Publishing Shortcuts'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
                {isId
                  ? 'Buka langsung modul pengelola untuk mempublikasikan komponen atau kode baru tanpa mengubah source code aplikasi.'
                  : 'Jump directly to a resource manager to publish new code without touching application source files.'}
              </p>
              <div className="space-y-2 pt-1">
                <Link
                  to="/owner/components"
                  className="block w-full px-3.5 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold text-center"
                >
                  {isId ? '+ Buat Komponen UI Baru' : '+ Create New UI Component'}
                </Link>
                <Link
                  to="/owner/scrapes"
                  className="block w-full px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-[#1A2230] text-xs font-medium text-center"
                >
                  {isId ? '+ Unggah Arsip Scrape Multi-File' : '+ Upload Multi-File Scrape Archive'}
                </Link>
                <Link
                  to="/owner/templates"
                  className="block w-full px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-[#1A2230] text-xs font-medium text-center"
                >
                  {isId ? '+ Buka Visual Landing Builder' : '+ Open Visual Landing Builder'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14.2 & 14.3 COMPONENT MANAGER & BUILDER */}
      {subPath.startsWith('components') && (
        <div className="space-y-8">
          <form
            onSubmit={handleSaveComponentSubmit}
            className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-6 space-y-5"
          >
            <h2 className="text-lg font-bold">
              {compForm.id ? `Edit Component: ${compForm.name}` : 'Create & Publish UI Component'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="cName">
                  Component Name
                </label>
                <input
                  id="cName"
                  type="text"
                  required
                  value={compForm.name}
                  onChange={(e) => setCompForm({ ...compForm, name: e.target.value })}
                  placeholder="e.g. Cyberpunk Auth Card"
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="cCategory">
                  Category
                </label>
                <input
                  id="cCategory"
                  type="text"
                  value={compForm.category}
                  onChange={(e) => setCompForm({ ...compForm, category: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="cTech">
                  Technology
                </label>
                <input
                  id="cTech"
                  type="text"
                  value={compForm.technology}
                  onChange={(e) => setCompForm({ ...compForm, technology: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block text-[#9BA6B5] mb-1" htmlFor="cDesc">
                  Description
                </label>
                <input
                  id="cDesc"
                  type="text"
                  required
                  value={compForm.description}
                  onChange={(e) => setCompForm({ ...compForm, description: e.target.value })}
                  placeholder="Explain component behavior, accessibility, and styling..."
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="cStatus">
                  Publication Status
                </label>
                <select
                  id="cStatus"
                  value={compForm.status}
                  onChange={(e) =>
                    setCompForm({ ...compForm, status: e.target.value as ComponentItem['status'] })
                  }
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono text-[#9BA6B5] mb-1" htmlFor="cHtml">
                    HTML + Tailwind Source
                  </label>
                  <textarea
                    id="cHtml"
                    rows={6}
                    value={compForm.htmlCode}
                    onChange={(e) => setCompForm({ ...compForm, htmlCode: e.target.value })}
                    className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 p-3 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[#9BA6B5] mb-1" htmlFor="cReact">
                    React TSX Source
                  </label>
                  <textarea
                    id="cReact"
                    rows={5}
                    value={compForm.reactCode}
                    onChange={(e) => setCompForm({ ...compForm, reactCode: e.target.value })}
                    className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 p-3 font-mono"
                  />
                </div>
              </div>

              <div>
                <SandboxPreview
                  title={compForm.name || 'Component Builder Live Preview'}
                  html={compForm.htmlCode}
                  css={compForm.cssCode}
                  js={compForm.jsCode}
                  minHeight={300}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={compForm.isFeatured}
                  onChange={(e) => setCompForm({ ...compForm, isFeatured: e.target.checked })}
                  className="accent-[#8B9CFF]"
                />
                <span>Feature on Homepage</span>
              </label>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{compForm.id ? 'Update Component' : 'Publish Component'}</span>
              </button>
            </div>
          </form>

          {/* Existing Components Table */}
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/10 font-semibold text-sm">
              Managed Components ({components.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-[#9BA6B5]">
                    <th className="py-3 px-4">Component</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Views / Copies</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {components.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-medium">
                        <Link to={`/components/${comp.slug}`} className="hover:text-[#8B9CFF]">
                          {comp.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#9BA6B5]">{comp.category}</td>
                      <td className="py-3 px-4 font-mono">
                        <span
                          className={
                            comp.status === 'published' ? 'text-emerald-400' : 'text-amber-400'
                          }
                        >
                          {comp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {comp.viewsCount} / {comp.copiesCount}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            setCompForm({
                              id: comp.id,
                              name: comp.name,
                              category: comp.category,
                              subcategory: comp.subcategory,
                              technology: comp.technology,
                              description: comp.description,
                              tags: comp.tags.join(', '),
                              version: comp.version,
                              status: comp.status,
                              isFeatured: comp.isFeatured,
                              isPopular: comp.isPopular,
                              htmlCode: comp.htmlCode,
                              cssCode: comp.cssCode,
                              jsCode: comp.jsCode,
                              reactCode: comp.reactCode,
                            })
                          }
                          className="text-[#8B9CFF] hover:underline font-mono"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            saveComponent(
                              {
                                ...comp,
                                id: `comp-copy-${Date.now()}`,
                                name: `${comp.name} (Copy)`,
                                slug: `${comp.slug}-copy-${Date.now().toString().slice(-3)}`,
                              },
                              true
                            )
                          }
                          className="text-slate-500 dark:text-[#9BA6B5] hover:underline font-mono"
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteComponent(comp.id)}
                          className="text-rose-400 hover:underline font-mono"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 14.5 & 14.6 TEMPLATE MANAGER & LANDING PAGE BUILDER */}
      {subPath.startsWith('templates') && (
        <div className="space-y-8">
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Visual Landing Page Builder</h2>
                <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
                  Add, reorder, and customize sections below, then publish directly to the Template Library.
                </p>
              </div>
              <div className="flex gap-2">
                {(['hero', 'features', 'pricing', 'cta', 'footer'] as const).map((secType) => (
                  <button
                    key={secType}
                    type="button"
                    onClick={() =>
                      setLandingBlocks((prev) => [
                        ...prev,
                        {
                          id: `blk-${Date.now()}`,
                          type: secType,
                          title: `New ${secType.toUpperCase()} Headline`,
                          subtitle: 'Configurable section copy and layout tokens.',
                          ctaText: 'Primary Action',
                          backgroundHex: '#10141D',
                          accentHex: '#8B9CFF',
                          htmlContent: '',
                        },
                      ])
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1A2230] text-xs font-mono hover:border-[#8B9CFF]"
                  >
                    + {secType}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="tplBuilderTitle">
                  Template Title
                </label>
                <input
                  id="tplBuilderTitle"
                  type="text"
                  value={builderTitle}
                  onChange={(e) => setBuilderTitle(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="tplBuilderCat">
                  Template Category
                </label>
                <input
                  id="tplBuilderCat"
                  type="text"
                  value={builderCategory}
                  onChange={(e) => setBuilderCategory(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-3">
              {landingBlocks.map((blk, idx) => (
                <div
                  key={blk.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
                >
                  <div className="md:col-span-2 font-mono text-[#8B9CFF] uppercase">
                    0{idx + 1}. {blk.type}
                  </div>
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={blk.title}
                      onChange={(e) =>
                        setLandingBlocks((prev) =>
                          prev.map((b) => (b.id === blk.id ? { ...b, title: e.target.value } : b))
                        )
                      }
                      aria-label="Section title"
                      className="w-full rounded bg-[#141A24] border border-white/10 px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={blk.subtitle}
                      onChange={(e) =>
                        setLandingBlocks((prev) =>
                          prev.map((b) => (b.id === blk.id ? { ...b, subtitle: e.target.value } : b))
                        )
                      }
                      aria-label="Section subtitle"
                      className="w-full rounded bg-[#141A24] border border-white/10 px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const copy = [...landingBlocks];
                        const temp = copy[idx - 1];
                        copy[idx - 1] = copy[idx];
                        copy[idx] = temp;
                        setLandingBlocks(copy);
                      }}
                      aria-label="Move section up"
                      className="p-1.5 rounded bg-[#141A24] border border-white/10"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === landingBlocks.length - 1}
                      onClick={() => {
                        const copy = [...landingBlocks];
                        const temp = copy[idx + 1];
                        copy[idx + 1] = copy[idx];
                        copy[idx] = temp;
                        setLandingBlocks(copy);
                      }}
                      aria-label="Move section down"
                      className="p-1.5 rounded bg-[#141A24] border border-white/10"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLandingBlocks((prev) => prev.filter((b) => b.id !== blk.id))
                      }
                      aria-label="Remove section"
                      className="p-1.5 rounded bg-rose-500/15 text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <SandboxPreview
              title={builderTitle}
              html={assembledLandingHtml}
              minHeight={360}
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const now = new Date().toISOString();
                  const item: TemplateItem = {
                    id: `tpl-${Date.now()}`,
                    name: builderTitle.trim() || 'Custom Landing Template',
                    slug: slugify(builderTitle),
                    description: `Built with the LEOVANDYZ Visual Landing Builder (${landingBlocks.length} sections).`,
                    category: builderCategory,
                    technology: 'HTML + Tailwind',
                    tags: ['landing-page', 'custom-builder'],
                    status: 'published',
                    isFeatured: true,
                    htmlCode: assembledLandingHtml,
                    reactCode: `export function CustomLanding() {\n  return (\n    <div>\n${assembledLandingHtml}\n    </div>\n  );\n}`,
                    viewsCount: 1,
                    copiesCount: 0,
                    downloadsCount: 0,
                    authorId: 'owner-bootstrap-1',
                    createdAt: now,
                    updatedAt: now,
                  };
                  saveTemplate(item, true);
                }}
                className="px-5 py-2.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
              >
                Publish Assembled Template
              </button>
            </div>
          </div>

          {/* Managed Templates List */}
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] divide-y divide-slate-200 dark:divide-white/10">
            {templates.map((tpl) => (
              <div key={tpl.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold">{tpl.name}</span>
                  <span className="text-[#9BA6B5] font-mono"> · {tpl.category}</span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTemplate(tpl.id)}
                  className="text-rose-400 hover:underline font-mono"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14.7 SNIPPET MANAGER */}
      {subPath.startsWith('snippets') && (
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] divide-y divide-slate-200 dark:divide-white/10">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-sm font-bold">Managed Snippets ({snippets.length})</h2>
            <Link to="/snippets" className="text-xs font-mono text-[#8B9CFF] hover:underline">
              Open Snippet Vault
            </Link>
          </div>
          {snippets.map((snip) => (
            <div key={snip.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold">{snip.name}</span>
                <span className="font-mono text-[#8B9CFF]"> · {snip.language}</span>
                <span className="text-[#9BA6B5]"> · {snip.copiesCount} copies</span>
              </div>
              <button
                type="button"
                onClick={() => deleteSnippet(snip.id)}
                className="text-rose-400 hover:underline font-mono"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 14.8 SCRAPE MANAGER (Multi-file + Safe ZIP Upload + Attribution) */}
      {subPath.startsWith('scrapes') && (
        <div className="space-y-8">
          <form
            onSubmit={handleSaveScrapeSubmit}
            className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-6 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold">
                  Publish New Scrape Source Archive
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
                  Add multi-file code directly or upload a project ZIP archive. Path traversal and executable extensions are automatically blocked.
                </p>
              </div>

              <label className="px-4 py-2 rounded-lg bg-[#1A2230] border border-[#8B9CFF]/40 text-[#8B9CFF] text-xs font-mono flex items-center gap-2 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Project ZIP Archive</span>
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleZipUpload}
                  className="hidden"
                />
              </label>
            </div>

            {zipRejectLogs.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 space-y-1">
                <div>Security Validator Rejected {zipRejectLogs.length} Entries:</div>
                {zipRejectLogs.map((r, i) => (
                  <div key={i}>- {r}</div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="scrName">
                  Project Name
                </label>
                <input
                  id="scrName"
                  type="text"
                  required
                  value={scrapeForm.name}
                  onChange={(e) => setScrapeForm({ ...scrapeForm, name: e.target.value })}
                  placeholder="e.g. Glass Command Dock Archive"
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="scrCat">
                  Category
                </label>
                <input
                  id="scrCat"
                  type="text"
                  value={scrapeForm.category}
                  onChange={(e) => setScrapeForm({ ...scrapeForm, category: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="scrTech">
                  Technologies (comma-separated)
                </label>
                <input
                  id="scrTech"
                  type="text"
                  value={scrapeForm.technologies}
                  onChange={(e) => setScrapeForm({ ...scrapeForm, technologies: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="scrAuthor">
                  Original Source Author
                </label>
                <input
                  id="scrAuthor"
                  type="text"
                  required
                  value={scrapeForm.sourceAuthor}
                  onChange={(e) => setScrapeForm({ ...scrapeForm, sourceAuthor: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="scrUrl">
                  Original Source URL
                </label>
                <input
                  id="scrUrl"
                  type="url"
                  required
                  value={scrapeForm.sourceUrl}
                  onChange={(e) => setScrapeForm({ ...scrapeForm, sourceUrl: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[#9BA6B5] mb-1" htmlFor="scrLicense">
                  License
                </label>
                <input
                  id="scrLicense"
                  type="text"
                  required
                  value={scrapeForm.license}
                  onChange={(e) => setScrapeForm({ ...scrapeForm, license: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#9BA6B5] mb-1" htmlFor="scrDesc">
                Project Description & Attribution Notes
              </label>
              <input
                id="scrDesc"
                type="text"
                required
                value={scrapeForm.description}
                onChange={(e) => setScrapeForm({ ...scrapeForm, description: e.target.value })}
                placeholder="Describe the project files, entry point, and usage permissions..."
                className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs"
              />
            </div>

            {/* File Tree & Add File Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#090B10] p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[#8B9CFF]">Project File Tree ({scrapeFiles.length})</span>
                    <span>Entry: {scrapeForm.entryFile}</span>
                  </div>
                  <div className="space-y-1.5">
                    {scrapeFiles.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between px-3 py-1.5 rounded bg-[#141A24] font-mono"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setScrapeForm((prev) => ({ ...prev, entryFile: f.filePath }))
                          }
                          className="text-left truncate hover:text-[#8B9CFF]"
                        >
                          {f.filePath}{' '}
                          {scrapeForm.entryFile === f.filePath && (
                            <span className="text-emerald-400">(entry)</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setScrapeFiles((prev) => prev.filter((x) => x.id !== f.id))
                          }
                          className="text-rose-400 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add / Replace Individual File */}
                <div className="rounded-xl border border-white/10 bg-[#090B10] p-4 space-y-3 text-xs">
                  <div className="font-semibold">Add File to Archive Tree</div>
                  <input
                    type="text"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    placeholder="e.g. src/app.js or style.css"
                    aria-label="New file path"
                    className="w-full rounded bg-[#141A24] border border-white/10 px-3 py-1.5 font-mono"
                  />
                  <textarea
                    rows={4}
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    placeholder="Paste file source code..."
                    aria-label="New file content"
                    className="w-full rounded bg-[#141A24] border border-white/10 p-2.5 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddScrapeFile}
                    className="w-full py-2 rounded-lg bg-[#1A2230] border border-white/10 font-mono text-[#8B9CFF]"
                  >
                    + Add Validated File to Tree
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7">
                <SandboxPreview
                  title={scrapeForm.name || 'Scrape Archive Pre-Publish Preview'}
                  html=""
                  files={scrapeFiles}
                  entryFile={scrapeForm.entryFile}
                  minHeight={360}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
              >
                Publish Scrape Archive to Public Library
              </button>
            </div>
          </form>

          {/* Existing Scrapes List */}
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] divide-y divide-slate-200 dark:divide-white/10">
            {scrapes.map((scr) => (
              <div key={scr.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <Link to={`/scrape/${scr.slug}`} className="font-semibold hover:text-[#8B9CFF]">
                    {scr.name}
                  </Link>
                  <span className="font-mono text-[#9BA6B5]">
                    {' '}
                    · {scr.files?.length || 0} files · {scr.license}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteScrape(scr.id)}
                  className="text-rose-400 hover:underline font-mono"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14.9 CATEGORY MANAGER */}
      {subPath.startsWith('categories') && (
        <div className="space-y-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!catName.trim()) return;
              const now = new Date().toISOString();
              await saveCategory(
                {
                  id: `cat-${Date.now()}`,
                  name: catName.trim(),
                  slug: slugify(catName),
                  description: catDesc.trim() || 'Platform resource category.',
                  section: catSection,
                  iconName: 'Layers',
                  order: categories.length + 1,
                  isVisible: true,
                  isFeatured: true,
                  createdAt: now,
                  updatedAt: now,
                },
                true
              );
              setCatName('');
              setCatDesc('');
            }}
            className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-end text-xs"
          >
            <div className="md:col-span-3">
              <label className="block text-[#9BA6B5] mb-1" htmlFor="newCatName">
                Category Name
              </label>
              <input
                id="newCatName"
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Data Charts"
                className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[#9BA6B5] mb-1" htmlFor="newCatSec">
                Target Section
              </label>
              <select
                id="newCatSec"
                value={catSection}
                onChange={(e) => setCatSection(e.target.value as CategoryItem['section'])}
                className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
              >
                <option value="components">Components</option>
                <option value="templates">Templates</option>
                <option value="snippets">Snippets</option>
                <option value="scrapes">Scrapes</option>
              </select>
            </div>
            <div className="md:col-span-4">
              <label className="block text-[#9BA6B5] mb-1" htmlFor="newCatDesc">
                Description
              </label>
              <input
                id="newCatDesc"
                type="text"
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Category overview..."
                className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-[#8B9CFF] text-[#090B10] font-semibold"
              >
                + Add Category
              </button>
            </div>
          </form>

          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] divide-y divide-slate-200 dark:divide-white/10">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold">{cat.name}</span>
                  <span className="font-mono text-[#8B9CFF] uppercase"> · {cat.section}</span>
                  <p className="text-slate-500 dark:text-[#9BA6B5] mt-0.5">{cat.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  className="text-rose-400 hover:underline font-mono shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14.10 ASSET MANAGER */}
      {subPath.startsWith('assets') && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Sanitized SVG & Image Asset Vault</h2>
              <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
                Uploaded SVGs are sanitized against inline scripts and event handlers before storage.
              </p>
            </div>
            <label className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Asset</span>
              <input
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.webp"
                onChange={handleAssetUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-4 space-y-3 text-xs"
              >
                <div className="h-28 rounded-lg bg-[#090B10] flex items-center justify-center p-4">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    width={64}
                    height={64}
                    referrerPolicy="no-referrer"
                    className="max-h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="truncate font-semibold">{asset.name}</span>
                  <span className="text-[#9BA6B5]">{asset.sizeBytes} B</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(asset.url);
                      notify(`Copied URL for ${asset.name}`, 'success');
                    }}
                    className="text-[#8B9CFF] hover:underline font-mono"
                  >
                    Copy Asset URL
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAsset(asset.id)}
                    className="text-rose-400 hover:underline font-mono"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14.11 USER MANAGEMENT */}
      {subPath.startsWith('users') && (
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/10 font-semibold text-sm">
            Platform Users & Role Authorization ({usersList.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-[#9BA6B5]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {usersList.map((u) => (
                  <tr key={u.uid}>
                    <td className="py-3 px-4 font-medium">{u.displayName}</td>
                    <td className="py-3 px-4 font-mono text-[#9BA6B5]">{u.email}</td>
                    <td className="py-3 px-4 font-mono uppercase text-[#8B9CFF]">{u.role}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className={u.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <select
                        aria-label={`Role for ${u.displayName}`}
                        value={u.role}
                        onChange={(e) =>
                          updateUserRole(u.uid, e.target.value as UserRole, u.status)
                        }
                        className="rounded bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-2 py-1 font-mono"
                      >
                        <option value="owner">owner</option>
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          updateUserRole(
                            u.uid,
                            u.role,
                            u.status === 'active' ? 'suspended' : 'active'
                          )
                        }
                        className="font-mono text-amber-400 hover:underline"
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 14.12 PLATFORM SETTINGS */}
      {subPath.startsWith('settings') && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await updatePlatformSettings(settingsDraft);
          }}
          className="max-w-2xl rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-6 space-y-5 text-xs"
        >
          <h2 className="text-lg font-bold">Global Platform Configuration</h2>

          <div>
            <label className="block text-[#9BA6B5] mb-1" htmlFor="setSiteName">
              Website Brand Name
            </label>
            <input
              id="setSiteName"
              type="text"
              value={settingsDraft.siteName}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, siteName: e.target.value })}
              className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-[#9BA6B5] mb-1" htmlFor="setSiteDesc">
              Website Description & SEO Meta
            </label>
            <input
              id="setSiteDesc"
              type="text"
              value={settingsDraft.siteDescription}
              onChange={(e) =>
                setSettingsDraft({ ...settingsDraft, siteDescription: e.target.value })
              }
              className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#9BA6B5] mb-1" htmlFor="setAccent">
                Brand Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="setAccent"
                  type="color"
                  value={settingsDraft.accentColor}
                  onChange={(e) =>
                    setSettingsDraft({ ...settingsDraft, accentColor: e.target.value })
                  }
                  className="w-9 h-9 rounded border border-white/10 bg-transparent"
                />
                <span className="font-mono">{settingsDraft.accentColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-[#9BA6B5] mb-1" htmlFor="setTheme">
                Default Workspace Theme
              </label>
              <select
                id="setTheme"
                value={settingsDraft.defaultTheme}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    defaultTheme: e.target.value as 'dark' | 'light',
                  })
                }
                className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2"
              >
                <option value="dark">Premium Dark (#090B10)</option>
                <option value="light">Clean Daylight (#F8FAFC)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settingsDraft.maintenanceMode}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, maintenanceMode: e.target.checked })
                }
                className="accent-[#8B9CFF]"
              />
              <span>Enable Maintenance Banner Mode</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settingsDraft.allowPublicPlayground}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, allowPublicPlayground: e.target.checked })
                }
                className="accent-[#8B9CFF]"
              />
              <span>Allow Public Access to Code Playground</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={async () => {
                await resetPlatformSettings();
              }}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-white/10 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] font-semibold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Platform Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* 14.13 AUDIT LOGS */}
      {subPath.startsWith('audit-logs') && (
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/10 font-semibold text-sm">
            Immutable Administrative Audit Logs ({auditLogs.length})
          </div>
          <div className="divide-y divide-slate-200 dark:divide-white/10 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-mono text-[#8B9CFF]">
                    {log.action} · [{log.resourceType}:{log.resourceId}]
                  </div>
                  <div className="text-slate-900 dark:text-[#F5F7FA]">{log.summary}</div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-[#9BA6B5]">
                    Actor: {log.actorName} ({log.actorUid})
                  </div>
                </div>
                <span className="font-mono text-[11px] text-slate-400 dark:text-[#9BA6B5] tabular-nums shrink-0">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
