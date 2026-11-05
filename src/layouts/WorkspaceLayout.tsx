import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  LayoutTemplate,
  Code2,
  TerminalSquare,
  FolderGit2,
  Compass,
  Star,
  TrendingUp,
  Clock,
  Wrench,
  Bookmark,
  FolderKanban,
  User,
  ShieldAlert,
  Sliders,
  FileCode2,
  FolderTree,
  Image,
  Users,
  Settings,
  ClipboardList,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  LogOut,
  ChevronRight,
  BookOpen,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const {
    user,
    profile,
    role,
    theme,
    toggleTheme,
    lang,
    toggleLang,
    settings,
    components,
    templates,
    snippets,
    scrapes,
    toasts,
    dismissToast,
    signInWithGoogle,
    signOut,
    enableWorkspaceOwnerPreview,
  } = usePlatform();

  const isId = lang === 'id';
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Global keyboard shortcuts: Cmd/Ctrl+K for Command Palette, Escape to close modals
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((open) => !open);
      } else if (e.key === 'Escape') {
        setCommandOpen(false);
        setGuideOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const searchResults = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();
    const publishedComps = components.filter((c) => c.status === 'published');
    const publishedTpls = templates.filter((t) => t.status === 'published');
    const publishedSnips = snippets.filter((s) => s.status === 'published');
    const publishedScrapes = scrapes.filter((s) => s.status === 'published');

    if (!q) {
      return {
        components: publishedComps.slice(0, 4),
        templates: publishedTpls.slice(0, 2),
        snippets: publishedSnips.slice(0, 3),
        scrapes: publishedScrapes.slice(0, 3),
      };
    }

    return {
      components: publishedComps.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      ),
      templates: publishedTpls.filter(
        (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      ),
      snippets: publishedSnips.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.language.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      ),
      scrapes: publishedScrapes.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      ),
    };
  }, [cmdQuery, components, templates, snippets, scrapes]);

  const breadcrumbSegments = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const labelMap: Record<string, string> = isId
      ? {
          components: 'Komponen UI',
          templates: 'Template Halaman',
          snippets: 'Snippet Kode',
          playground: 'Code Playground',
          scrape: 'Scrape Library',
          categories: 'Kategori UI',
          tools: 'Alat Developer',
          favorites: 'Favorit Saya',
          collections: 'Koleksi Pribadi',
          profile: 'Profil Saya',
          owner: 'Owner Studio',
          scrapes: 'Kelola Scrape',
          assets: 'Kelola Aset',
          users: 'Kelola Pengguna',
          settings: 'Pengaturan Platform',
          'audit-logs': 'Log Audit',
        }
      : {};

    if (parts.length === 0) return [{ label: isId ? 'Beranda' : 'Overview', path: '/' }];
    return [
      { label: isId ? 'Beranda' : 'Workspace', path: '/' },
      ...parts.map((part, index) => ({
        label: labelMap[part] || part.replace(/-/g, ' '),
        path: '/' + parts.slice(0, index + 1).join('/'),
      })),
    ];
  }, [location.pathname, isId]);

  const navGroups = [
    {
      title: isId ? 'MENU UTAMA' : 'MAIN',
      items: [
        { label: isId ? 'Beranda & Ringkasan' : 'Overview', to: '/', icon: LayoutDashboard },
        { label: isId ? 'Komponen UI' : 'Components', to: '/components', icon: Layers },
        { label: isId ? 'Template Halaman' : 'Templates', to: '/templates', icon: LayoutTemplate },
        { label: isId ? 'Snippet Kode' : 'Snippets', to: '/snippets', icon: Code2 },
        { label: 'Code Playground', to: '/playground', icon: TerminalSquare },
        { label: 'Scrape Library', to: '/scrape', icon: FolderGit2 },
      ],
    },
    {
      title: isId ? 'EKSPLORASI' : 'DISCOVER',
      items: [
        { label: isId ? 'Kategori UI' : 'Categories', to: '/categories', icon: Compass },
        { label: isId ? 'Komponen Unggulan' : 'Featured', to: '/components?filter=featured', icon: Star },
        { label: isId ? 'Paling Populer' : 'Popular', to: '/components?filter=popular', icon: TrendingUp },
        { label: isId ? 'Terbaru Dirilis' : 'Latest', to: '/components?filter=latest', icon: Clock },
      ],
    },
    {
      title: isId ? 'ALAT DEVELOPER' : 'TOOLS',
      items: [
        { label: isId ? 'Konverter Kode' : 'Code Converter', to: '/tools', icon: Wrench },
        { label: isId ? 'Utilitas Tema & CSS' : 'Utilities', to: '/tools?tab=utilities', icon: Sliders },
      ],
    },
    {
      title: isId ? 'AKUN & KOLEKSI' : 'ACCOUNT',
      items: [
        { label: isId ? 'Favorit Saya' : 'Favorites', to: '/favorites', icon: Bookmark },
        { label: isId ? 'Koleksi Pribadi' : 'Collections', to: '/collections', icon: FolderKanban },
        { label: isId ? 'Profil Saya' : 'My Profile', to: '/profile', icon: User },
      ],
    },
  ];

  const ownerItems = [
    { label: isId ? 'Dashboard Owner' : 'Owner Dashboard', to: '/owner', icon: ShieldAlert },
    { label: isId ? 'Kelola Komponen' : 'Component Manager', to: '/owner/components', icon: Layers },
    { label: isId ? 'Kelola Template' : 'Template Manager', to: '/owner/templates', icon: LayoutTemplate },
    { label: isId ? 'Kelola Snippet' : 'Snippet Manager', to: '/owner/snippets', icon: FileCode2 },
    { label: isId ? 'Kelola Scrape' : 'Scrape Manager', to: '/owner/scrapes', icon: FolderGit2 },
    { label: isId ? 'Kelola Kategori' : 'Category Manager', to: '/owner/categories', icon: FolderTree },
    { label: isId ? 'Kelola Aset' : 'Asset Manager', to: '/owner/assets', icon: Image },
    { label: isId ? 'Kelola Pengguna' : 'User Management', to: '/owner/users', icon: Users },
    { label: isId ? 'Pengaturan Platform' : 'Platform Settings', to: '/owner/settings', icon: Settings },
    { label: isId ? 'Log Audit' : 'Audit Logs', to: '/owner/audit-logs', icon: ClipboardList },
  ];

  const isRouteActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    if (to.includes('?')) {
      return location.pathname + location.search === to;
    }
    return location.pathname === to || (to !== '/owner' && location.pathname.startsWith(to + '/'));
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#090B10] text-slate-900 dark:text-[#F5F7FA]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-68 shrink-0 flex-col border-r border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#10141D] sticky top-0 h-screen overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-white/[0.09] flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] whitespace-nowrap"
          >
            {settings.siteName}
          </Link>
          <span className="text-[11px] font-mono text-[#8B9CFF]">v2.4</span>
        </div>

        <nav aria-label="Sidebar Navigation" className="flex-1 px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-2.5 text-[11px] font-mono text-slate-400 dark:text-[#9BA6B5] mb-1.5">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#8B9CFF]/15 text-[#8B9CFF]'
                          : 'text-slate-600 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#141A24]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {(role === 'owner' || role === 'admin') && (
            <div>
              <p className="px-2.5 text-[11px] font-mono text-[#8B9CFF] mb-1.5">OWNER STUDIO</p>
              <div className="space-y-0.5">
                {ownerItems.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#8B9CFF]/15 text-[#8B9CFF]'
                          : 'text-slate-600 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#141A24]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Bottom Role & Auth Status Card */}
        <div className="p-3 border-t border-slate-200 dark:border-white/[0.09] bg-slate-50 dark:bg-[#090B10]/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium truncate max-w-[140px]">
              {profile?.displayName || (role === 'owner' ? 'Leovandyz (Owner)' : isId ? 'Pengunjung Publik' : 'Public Guest')}
            </span>
            <span className="font-mono text-[11px] text-[#8B9CFF] uppercase">{role}</span>
          </div>
          {user ? (
            <button
              type="button"
              onClick={signOut}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-200 dark:bg-[#141A24] border border-slate-300 dark:border-white/10 text-xs flex items-center justify-center gap-1.5 hover:border-white/25"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isId ? 'Keluar Akun' : 'Sign Out'}</span>
            </button>
          ) : (
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={signInWithGoogle}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#8B9CFF] text-[#090B10] font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isId ? 'Masuk Google' : 'Google Sign In'}</span>
              </button>
              {role !== 'owner' && (
                <button
                  type="button"
                  onClick={enableWorkspaceOwnerPreview}
                  className="py-1.5 px-2 rounded-lg bg-[#141A24] border border-white/10 text-[11px] font-mono text-[#8B9CFF]"
                >
                  Owner
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-white dark:bg-[#10141D] h-full overflow-y-auto p-4 flex flex-col border-r border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <span className="text-sm font-bold">{settings.siteName}</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile navigation"
                className="p-2 rounded-lg text-slate-500 dark:text-[#9BA6B5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-5 flex-1">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-[11px] font-mono text-slate-400 dark:text-[#9BA6B5] mb-1.5">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#141A24]"
                        >
                          <Icon className="w-4 h-4 text-[#8B9CFF]" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              {(role === 'owner' || role === 'admin') && (
                <div>
                  <p className="text-[11px] font-mono text-[#8B9CFF] mb-1.5">OWNER STUDIO</p>
                  <div className="space-y-1">
                    {ownerItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#141A24]"
                        >
                          <Icon className="w-4 h-4 text-[#8B9CFF]" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract: 3 Zones separated by gap-8 */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 py-3.5 border-b border-slate-200 dark:border-white/[0.09] bg-white/95 dark:bg-[#090B10]/95 backdrop-blur-xs">
          {/* Zone 1: Mobile Menu Trigger + Contextual Breadcrumb Trail */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation drawer"
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#F5F7FA]"
            >
              <Menu className="w-4 h-4" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs truncate">
              {breadcrumbSegments.map((seg, idx) => (
                <React.Fragment key={seg.path}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#9BA6B5] shrink-0" />}
                  <Link
                    to={seg.path}
                    className={`capitalize truncate whitespace-nowrap ${
                      idx === breadcrumbSegments.length - 1
                        ? 'font-semibold text-slate-900 dark:text-[#F5F7FA]'
                        : 'text-slate-500 dark:text-[#9BA6B5] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {seg.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Zone 2: Quick Top Navigation Links */}
          <nav aria-label="Primary Quick Links" className="hidden xl:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-[#9BA6B5]">
            <Link to="/components" className="hover:text-slate-900 dark:hover:text-[#F5F7FA] whitespace-nowrap shrink-0">
              {isId ? 'Komponen UI' : 'Components'}
            </Link>
            <Link to="/templates" className="hover:text-slate-900 dark:hover:text-[#F5F7FA] whitespace-nowrap shrink-0">
              {isId ? 'Template' : 'Templates'}
            </Link>
            <Link to="/scrape" className="hover:text-slate-900 dark:hover:text-[#F5F7FA] whitespace-nowrap shrink-0">
              Scrape Library
            </Link>
            <Link to="/playground" className="hover:text-slate-900 dark:hover:text-[#F5F7FA] whitespace-nowrap shrink-0">
              Playground
            </Link>
            <Link to="/owner" className="hover:text-[#8B9CFF] text-[#8B9CFF] whitespace-nowrap shrink-0">
              Owner Studio
            </Link>
          </nav>

          {/* Zone 3: Command Search + Guide Button + Language Toggle + Theme Switch */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Open command search"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-[#9BA6B5] hover:border-[#8B9CFF]/50 whitespace-nowrap shrink-0"
            >
              <Search className="w-3.5 h-3.5 text-[#8B9CFF]" />
              <span className="hidden sm:inline">{isId ? 'Cari kode & komponen...' : 'Search resources...'}</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#090B10] text-slate-700 dark:text-[#F5F7FA]">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              aria-label={isId ? 'Buka panduan penggunaan platform' : 'Open platform guide'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#8B9CFF]/15 border border-[#8B9CFF]/30 text-xs font-medium text-[#8B9CFF] hover:bg-[#8B9CFF]/25 whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isId ? 'Panduan & Arahan' : 'Guide'}</span>
            </button>

            <button
              type="button"
              onClick={toggleLang}
              aria-label={isId ? 'Ganti bahasa ke Inggris' : 'Switch language to Indonesian'}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-xs font-mono font-semibold text-slate-700 dark:text-[#F5F7FA] hover:border-[#8B9CFF]/50"
            >
              <Globe className="w-3.5 h-3.5 text-[#8B9CFF]" />
              <span>{lang.toUpperCase()}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-lg bg-slate-100 dark:bg-[#141A24] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#F5F7FA] hover:border-[#8B9CFF]/50"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </header>

        {/* Maintenance Mode Banner if enabled */}
        {settings.maintenanceMode && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2 text-xs text-amber-300 flex items-center justify-between">
            <span>
              {isId
                ? 'Mode Pemeliharaan (Maintenance Mode) sedang aktif. Pengunjung publik hanya dapat melihat katalog, sedangkan Owner Studio tetap aktif.'
                : 'Maintenance Mode is currently active. Public modifications are paused; Owner Studio remains accessible.'}
            </span>
            <Link to="/owner/settings" className="underline font-mono">
              {isId ? 'Atur Pengaturan' : 'Manage Settings'}
            </Link>
          </div>
        )}

        {/* Main Viewport Content */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1440px] w-full mx-auto">
          {children}
        </main>

        {/* Quiet Semantic Footer */}
        <footer className="border-t border-slate-200 dark:border-white/[0.09] px-4 sm:px-8 py-6 mt-12 text-xs text-slate-500 dark:text-[#9BA6B5]">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-semibold text-slate-900 dark:text-[#F5F7FA]">{settings.siteName}</span>
              <span>
                {' '}
                ·{' '}
                {isId
                  ? 'Pusat sumber daya developer modern untuk mencari, mengkustomisasi, melakukan live preview, dan mengunduh source code.'
                  : settings.siteDescription}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Link to="/components" className="hover:text-slate-900 dark:hover:text-white">
                {isId ? 'Komponen UI' : 'Components'}
              </Link>
              <Link to="/scrape" className="hover:text-slate-900 dark:hover:text-white">
                Scrape Library
              </Link>
              <Link to="/playground" className="hover:text-slate-900 dark:hover:text-white">
                Playground
              </Link>
              <Link to="/owner" className="hover:text-slate-900 dark:hover:text-white">
                Owner Studio
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Panduan & Arahan Penggunaan Platform Modal (Bahasa Indonesia / English) */}
      {guideOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Panduan Penggunaan Platform"
        >
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#10141D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#8B9CFF]" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">
                  {isId
                    ? 'Panduan & Arahan Penggunaan LEOVANDYZ CODEBASE'
                    : 'LEOVANDYZ CODEBASE Platform Guide'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                aria-label="Close guide modal"
                className="p-1.5 rounded-lg text-slate-500 dark:text-[#9BA6B5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-600 dark:text-[#9BA6B5]">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">
                    {isId
                      ? 'Database & Autentikasi Sudah Aktif Otomatis (Tanpa Perlu Supabase)'
                      : 'Database & Authentication Active Automatically'}
                  </p>
                  <p className="mt-0.5">
                    {isId
                      ? 'Aplikasi ini sudah terhubung langsung ke database Firebase Firestore dan Google Sign-In milik Anda. Anda tidak perlu mengisi environment variable Supabase apa pun.'
                      : 'This workspace is connected directly to your provisioned Firebase Firestore and Google Sign-In. No external environment variables are needed.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090B10]/80 border border-slate-200 dark:border-white/10 space-y-1.5">
                  <p className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    1. {isId ? 'Komponen UI & Kustomisasi Visual' : 'UI Components & Visual Customizer'}
                  </p>
                  <p>
                    {isId
                      ? 'Buka menu Komponen UI, pilih salah satu komponen, lalu gunakan panel Kustomisasi Visual di sebelah kanan untuk mengubah warna, radius sudut, padding, dan ukuran font. Perubahan langsung memperbarui Live Preview sekaligus kode React TSX/HTML/CSS yang siap disalin atau diunduh sebagai ZIP.'
                      : 'Browse UI Components and use the Visual Customizer panel to adjust colors, border radius, padding, and font size. Changes mutate both the live preview and exported code.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090B10]/80 border border-slate-200 dark:border-white/10 space-y-1.5">
                  <p className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    2. {isId ? 'Scrape Library (Proyek Multi-File)' : 'Scrape Library (Multi-File Projects)'}
                  </p>
                  <p>
                    {isId
                      ? 'Menu Scrape Library berisi arsip kode sumber multi-file (index.html, style.css, script.js, README.md). Klik nama file di pohon folder kiri untuk membaca isi tiap file, atau klik Unduh Proyek ZIP untuk mengunduh seluruh folder beserta lisensinya.'
                      : 'The Scrape Library hosts multi-file code archives. Click any file in the left directory tree to inspect its source code, or download the full project ZIP preserving folder hierarchy.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090B10]/80 border border-slate-200 dark:border-white/10 space-y-1.5">
                  <p className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    3. {isId ? 'Code Playground & Konverter Kode' : 'Code Playground & Code Converter'}
                  </p>
                  <p>
                    {isId
                      ? 'Gunakan Code Playground untuk menguji kode HTML, Tailwind CSS, dan JavaScript secara langsung di dalam iframe sandbox yang aman. Gunakan menu Konverter Kode untuk mengubah kode HTML biasa menjadi komponen React TSX secara instan.'
                      : 'Use the Code Playground to write and test HTML, Tailwind CSS, and JS inside an isolated CSP sandbox, or convert raw HTML into React TSX in Tools.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090B10]/80 border border-slate-200 dark:border-white/10 space-y-1.5">
                  <p className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    4. {isId ? 'Owner Studio (Kelola Semua Konten)' : 'Owner Studio (Full Content Control)'}
                  </p>
                  <p>
                    {isId
                      ? 'Sebagai Owner, buka menu Owner Studio di sidebar kiri untuk menambah/mengedit komponen, membuat halaman dengan Visual Landing Builder, mengunggah file ZIP ke Scrape Library, mengatur warna aksen platform, serta memantau Log Audit tanpa perlu mengubah kode aplikasi.'
                      : 'Open Owner Studio from the sidebar to publish components, upload multi-file ZIP archives to the Scrape Library, customize platform theme tokens, and review audit logs.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#10141D] flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#9BA6B5]">
                {isId
                  ? 'Tips: Tekan Ctrl+K / ⌘K kapan saja untuk pencarian cepat.'
                  : 'Tip: Press Ctrl+K / ⌘K anytime for instant search.'}
              </span>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
              >
                {isId ? 'Mengerti, Tutup Panduan' : 'Got It, Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Command Palette Modal */}
      {commandOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Global Command Search"
        >
          <div className="w-full max-w-xl rounded-xl bg-white dark:bg-[#141A24] border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 flex items-center gap-3">
              <Search className="w-4 h-4 text-[#8B9CFF]" />
              <input
                type="text"
                autoFocus
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder={
                  isId
                    ? 'Ketik nama komponen, kategori, scrape, template, atau snippet...'
                    : 'Search components, scrapes, templates, snippets...'
                }
                aria-label="Command search input"
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#9BA6B5] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setCommandOpen(false)}
                aria-label="Close command palette"
                className="text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-[#090B10] text-slate-600 dark:text-[#9BA6B5]"
              >
                ESC
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
              {searchResults.components.length > 0 && (
                <div>
                  <p className="px-2 pb-1 text-[11px] font-mono text-slate-400 dark:text-[#9BA6B5]">
                    {isId ? 'KOMPONEN UI' : 'UI COMPONENTS'} ({searchResults.components.length})
                  </p>
                  <div className="space-y-1">
                    {searchResults.components.map((comp) => (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          setCommandOpen(false);
                          navigate(`/components/${comp.slug}`);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A2230] text-left"
                      >
                        <div>
                          <span className="font-medium text-slate-900 dark:text-[#F5F7FA]">{comp.name}</span>
                          <span className="text-slate-500 dark:text-[#9BA6B5]"> · {comp.category}</span>
                        </div>
                        <span className="font-mono text-[11px] text-[#8B9CFF]">{comp.technology}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.scrapes.length > 0 && (
                <div>
                  <p className="px-2 pb-1 text-[11px] font-mono text-slate-400 dark:text-[#9BA6B5]">
                    {isId ? 'ARSIP SCRAPE MULTI-FILE' : 'PUBLIC SCRAPE ARCHIVES'} ({searchResults.scrapes.length})
                  </p>
                  <div className="space-y-1">
                    {searchResults.scrapes.map((scr) => (
                      <button
                        key={scr.id}
                        type="button"
                        onClick={() => {
                          setCommandOpen(false);
                          navigate(`/scrape/${scr.slug}`);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A2230] text-left"
                      >
                        <div>
                          <span className="font-medium text-slate-900 dark:text-[#F5F7FA]">{scr.name}</span>
                          <span className="text-slate-500 dark:text-[#9BA6B5]"> · {scr.license}</span>
                        </div>
                        <span className="font-mono text-[11px] text-emerald-400">
                          {scr.files?.length || 3} file
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.snippets.length > 0 && (
                <div>
                  <p className="px-2 pb-1 text-[11px] font-mono text-slate-400 dark:text-[#9BA6B5]">
                    {isId ? 'SNIPPET KODE' : 'SNIPPETS'} ({searchResults.snippets.length})
                  </p>
                  <div className="space-y-1">
                    {searchResults.snippets.map((snip) => (
                      <button
                        key={snip.id}
                        type="button"
                        onClick={() => {
                          setCommandOpen(false);
                          navigate(`/snippets?q=${encodeURIComponent(snip.name)}`);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A2230] text-left"
                      >
                        <span className="font-medium text-slate-900 dark:text-[#F5F7FA]">{snip.name}</span>
                        <span className="font-mono text-[11px] text-[#9BA6B5]">{snip.language}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.components.length === 0 &&
                searchResults.scrapes.length === 0 &&
                searchResults.snippets.length === 0 && (
                  <p className="text-center py-6 text-slate-500 dark:text-[#9BA6B5]">
                    {isId
                      ? `Tidak ditemukan komponen atau kode untuk kata kunci "${cmdQuery}".`
                      : `No matching developer resources found for "${cmdQuery}".`}
                  </p>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#141A24] border border-white/15 text-xs text-[#F5F7FA] shadow-xl"
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#9BA6B5] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
