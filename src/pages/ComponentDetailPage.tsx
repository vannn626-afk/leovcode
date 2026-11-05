import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Bookmark,
  RotateCcw,
  Sliders,
  Copy,
  FolderPlus,
  BookOpen,
} from 'lucide-react';
import { usePlatform } from '../contexts/PlatformContext';
import { SandboxPreview } from '../components/SandboxPreview';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import {
  DEFAULT_CUSTOM_CONFIG,
  generateCustomizedCode,
} from '../utils/security';
import { downloadComponentZip } from '../utils/exportZip';
import type { VisualCustomConfig } from '../types';

export function ComponentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    components,
    collections,
    lang,
    isFavorited,
    toggleFavorite,
    toggleItemInCollection,
    incrementMetric,
    notify,
  } = usePlatform();

  const isId = lang === 'id';

  const component = useMemo(
    () => components.find((c) => c.slug === slug || c.id === slug),
    [components, slug]
  );

  const [customConfig, setCustomConfig] = useState<VisualCustomConfig>(DEFAULT_CUSTOM_CONFIG);
  const [hasCustomized, setHasCustomized] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'react' | 'html' | 'css' | 'js' | 'tailwind' | 'ts'>('react');
  const [editableHtml, setEditableHtml] = useState('');
  const [editableCss, setEditableCss] = useState('');

  useEffect(() => {
    if (component) {
      setEditableHtml(component.htmlCode);
      setEditableCss(component.cssCode);
      setCustomConfig(DEFAULT_CUSTOM_CONFIG);
      setHasCustomized(false);
      incrementMetric('component', component.id, 'viewsCount');
    }
  }, [component?.id]);

  if (!component) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141A24] p-12 text-center space-y-4">
        <h1 className="text-xl font-bold">
          {isId ? 'Komponen Tidak Ditemukan' : 'Component Not Found'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
          {isId
            ? `Komponen dengan alamat "${slug}" tidak ditemukan atau telah diarsipkan.`
            : `The requested component slug "${slug}" does not exist or has been archived.`}
        </p>
        <Link
          to="/components"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isId ? 'Kembali ke Pustaka Komponen' : 'Back to Component Library'}</span>
        </Link>
      </div>
    );
  }

  const customizedBundle = useMemo(() => {
    if (!hasCustomized) {
      return {
        html: editableHtml,
        css: editableCss,
        react: component.reactCode,
      };
    }
    return generateCustomizedCode(editableHtml, editableCss, component.reactCode, customConfig);
  }, [editableHtml, editableCss, component.reactCode, customConfig, hasCustomized]);

  const availableTabs = useMemo(() => {
    const tabs: { id: 'react' | 'html' | 'css' | 'js' | 'tailwind' | 'ts'; label: string; ext: string; code: string }[] = [];
    if (customizedBundle.react) tabs.push({ id: 'react', label: 'React TSX', ext: 'tsx', code: customizedBundle.react });
    if (customizedBundle.html) tabs.push({ id: 'html', label: 'HTML', ext: 'html', code: customizedBundle.html });
    if (customizedBundle.css) tabs.push({ id: 'css', label: 'CSS', ext: 'css', code: customizedBundle.css });
    if (component.jsCode) tabs.push({ id: 'js', label: 'JavaScript', ext: 'js', code: component.jsCode });
    if (component.tailwindCode) tabs.push({ id: 'tailwind', label: 'Tailwind CSS', ext: 'html', code: component.tailwindCode });
    if (component.tsCode) tabs.push({ id: 'ts', label: 'TypeScript', ext: 'ts', code: component.tsCode });
    return tabs;
  }, [customizedBundle, component]);

  const currentTabObj = availableTabs.find((t) => t.id === activeCodeTab) || availableTabs[0];

  const relatedComponents = useMemo(
    () =>
      components
        .filter((c) => c.id !== component.id && c.status === 'published' && c.category === component.category)
        .slice(0, 3),
    [components, component]
  );

  const updateCustomField = <K extends keyof VisualCustomConfig>(key: K, value: VisualCustomConfig[K]) => {
    setHasCustomized(true);
    setCustomConfig((prev) => ({ ...prev, [key]: value }));
  };

  const fav = isFavorited(component.id);

  return (
    <div className="space-y-8">
      {/* Top Header & Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.09] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-[#9BA6B5]">
            <Link to="/components" className="text-[#8B9CFF] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isId ? 'Komponen UI' : 'Components'}</span>
            </Link>
            <span>/</span>
            <span>{component.category}</span>
            <span>·</span>
            <span>{component.technology}</span>
            <span>·</span>
            <span>v{component.version}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#F5F7FA]">
            {component.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9BA6B5] max-w-2xl">
            {component.description}
          </p>
          <div className="text-xs font-mono text-slate-400 dark:text-[#9BA6B5] pt-1">
            Tags: {component.tags.join(' · ')}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start">
          <button
            type="button"
            onClick={() =>
              toggleFavorite({
                id: component.id,
                type: 'component',
                title: component.name,
                slug: component.slug,
                category: component.category,
              })
            }
            className={`px-3.5 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${
              fav
                ? 'border-[#8B9CFF] bg-[#8B9CFF]/15 text-[#8B9CFF]'
                : 'border-slate-300 dark:border-white/10 bg-white dark:bg-[#141A24]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>
              {fav
                ? isId
                  ? 'Tersimpan di Favorit'
                  : 'Favorited'
                : isId
                ? 'Simpan ke Favorit'
                : 'Add to Favorites'}
            </span>
          </button>

          {collections.length > 0 && (
            <button
              type="button"
              onClick={() => toggleItemInCollection(collections[0].id, component.id)}
              className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#141A24] text-xs font-medium flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#8B9CFF]" />
              <span>
                {isId ? `Simpan ke ${collections[0].name}` : `Save to ${collections[0].name}`}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              downloadComponentZip(
                component,
                customizedBundle.html,
                customizedBundle.css,
                customizedBundle.react
              );
              incrementMetric('component', component.id, 'downloadsCount');
              notify(
                isId
                  ? `Berhasil mengunduh ${component.slug}-bundle.zip beserta hasil kustomisasi.`
                  : `Exported ${component.slug}-bundle.zip with active customizations.`,
                'success'
              );
            }}
            className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isId ? 'Unduh Paket ZIP' : 'Download ZIP Bundle'}</span>
          </button>
        </div>
      </div>

      {/* Arahan Penggunaan Kustomisasi & Ekspor */}
      <div className="rounded-xl border border-[#8B9CFF]/25 bg-[#8B9CFF]/[0.06] px-4 py-3 flex items-center gap-3 text-xs text-slate-600 dark:text-[#9BA6B5]">
        <BookOpen className="w-4 h-4 text-[#8B9CFF] shrink-0" />
        <span>
          {isId
            ? 'Arahan Kustomisasi: Gunakan panel Kustomisasi Visual di sebelah kanan untuk mengatur warna latar, teks, jenis font, radius sudut, dan padding. Perubahan langsung diterapkan ke Pratinjau Live sekaligus memperbarui Kode Sumber dan file unduhan ZIP.'
            : 'Customization Guide: Adjust tokens in the right Visual Customizer panel. Changes immediately update both the Live Sandbox Preview and exported source code.'}
        </span>
      </div>

      {/* Main Split: Live Sandboxed Preview (Left 8 cols) + Visual Customizer (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <SandboxPreview
            title={component.name}
            html={customizedBundle.html}
            css={customizedBundle.css}
            js={component.jsCode}
            minHeight={420}
          />

          {/* Source Code Viewer & Live Editor */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex flex-wrap p-1 rounded-lg bg-slate-200/70 dark:bg-[#10141D] border border-slate-300/60 dark:border-white/10">
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCodeTab(tab.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                      currentTabObj?.id === tab.id
                        ? 'bg-white dark:bg-[#1A2230] text-slate-900 dark:text-[#F5F7FA] font-semibold'
                        : 'text-slate-600 dark:text-[#9BA6B5]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!currentTabObj) return;
                    await navigator.clipboard.writeText(currentTabObj.code);
                    incrementMetric('component', component.id, 'copiesCount');
                    notify(
                      isId
                        ? `Kode ${currentTabObj.label} berhasil disalin.`
                        : `Copied ${currentTabObj.label} source code.`,
                      'success'
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#141A24] border border-slate-300 dark:border-white/10 text-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-[#8B9CFF]" />
                  <span>
                    {isId ? `Salin ${currentTabObj?.label}` : `Copy ${currentTabObj?.label}`}
                  </span>
                </button>
              </div>
            </div>

            {currentTabObj && (
              <CodeEditorPanel
                code={currentTabObj.code}
                language={currentTabObj.label}
                fileName={`${component.slug}.${currentTabObj.ext}`}
                readOnly={currentTabObj.id !== 'html' && currentTabObj.id !== 'css'}
                onChange={(val) => {
                  if (currentTabObj.id === 'html') setEditableHtml(val);
                  if (currentTabObj.id === 'css') setEditableCss(val);
                }}
                onReset={() => {
                  setEditableHtml(component.htmlCode);
                  setEditableCss(component.cssCode);
                  setHasCustomized(false);
                }}
              />
            )}
          </div>
        </div>

        {/* Visual Customizer Panel (Directly mutates CSS variables & exported source code) */}
        <aside className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8B9CFF]" />
              <h2 className="text-sm font-semibold">
                {isId ? 'Kustomisasi Visual' : 'Visual Customizer'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setCustomConfig(DEFAULT_CUSTOM_CONFIG);
                setHasCustomized(false);
                notify(
                  isId
                    ? 'Pengaturan visual dikembalikan ke bawaan komponen.'
                    : 'Reset visual customizer to component defaults.',
                  'info'
                );
              }}
              className="text-xs font-mono text-[#8B9CFF] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isId ? 'Atur Ulang' : 'Reset'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-[#9BA6B5]">
            {isId
              ? 'Atur properti di bawah ini. Setiap perubahan langsung memperbarui Pratinjau Live serta kode ekspor HTML, CSS, dan React TSX.'
              : 'Adjust tokens below. Changes update both the live sandbox preview and the exported HTML, CSS, and React TSX code.'}
          </p>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 dark:text-[#9BA6B5] mb-1" htmlFor="custBg">
                  {isId ? 'Warna Latar' : 'Surface Background'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="custBg"
                    type="color"
                    value={customConfig.backgroundColor}
                    onChange={(e) => updateCustomField('backgroundColor', e.target.value)}
                    className="w-8 h-8 rounded border border-white/10 bg-transparent"
                  />
                  <span className="font-mono">{customConfig.backgroundColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-[#9BA6B5] mb-1" htmlFor="custText">
                  {isId ? 'Warna Teks Utama' : 'Primary Text Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="custText"
                    type="color"
                    value={customConfig.textColor}
                    onChange={(e) => updateCustomField('textColor', e.target.value)}
                    className="w-8 h-8 rounded border border-white/10 bg-transparent"
                  />
                  <span className="font-mono">{customConfig.textColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-[#9BA6B5] mb-1" htmlFor="custFont">
                {isId ? 'Jenis Huruf (Font Family)' : 'Typography Family'}
              </label>
              <select
                id="custFont"
                value={customConfig.fontFamily}
                onChange={(e) =>
                  updateCustomField('fontFamily', e.target.value as VisualCustomConfig['fontFamily'])
                }
                className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-3 py-2 text-xs"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="DM Sans">DM Sans</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
                <option value="System UI">System UI</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="custRadius" className="text-slate-500 dark:text-[#9BA6B5]">
                  {isId ? 'Radius Sudut (Border Radius)' : 'Border Radius'}
                </label>
                <span className="font-mono tabular-nums">{customConfig.borderRadiusPx}px</span>
              </div>
              <input
                id="custRadius"
                type="range"
                min={0}
                max={32}
                value={customConfig.borderRadiusPx}
                onChange={(e) => updateCustomField('borderRadiusPx', Number(e.target.value))}
                className="w-full accent-[#8B9CFF]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="custPad" className="text-slate-500 dark:text-[#9BA6B5]">
                  {isId ? 'Jarak Dalam (Padding)' : 'Container Padding'}
                </label>
                <span className="font-mono tabular-nums">{customConfig.paddingPx}px</span>
              </div>
              <input
                id="custPad"
                type="range"
                min={8}
                max={48}
                value={customConfig.paddingPx}
                onChange={(e) => updateCustomField('paddingPx', Number(e.target.value))}
                className="w-full accent-[#8B9CFF]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="custFontSz" className="text-slate-500 dark:text-[#9BA6B5]">
                  {isId ? 'Ukuran Teks Dasar' : 'Base Font Size'}
                </label>
                <span className="font-mono tabular-nums">{customConfig.fontSizePx}px</span>
              </div>
              <input
                id="custFontSz"
                type="range"
                min={12}
                max={22}
                value={customConfig.fontSizePx}
                onChange={(e) => updateCustomField('fontSizePx', Number(e.target.value))}
                className="w-full accent-[#8B9CFF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 dark:text-[#9BA6B5] mb-1" htmlFor="custShadow">
                  {isId ? 'Bayangan (Shadow)' : 'Elevation Shadow'}
                </label>
                <select
                  id="custShadow"
                  value={customConfig.shadowLevel}
                  onChange={(e) =>
                    updateCustomField('shadowLevel', e.target.value as VisualCustomConfig['shadowLevel'])
                  }
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-2.5 py-2 text-xs"
                >
                  <option value="none">{isId ? 'Datar (Tanpa Bayangan)' : 'Flat (None)'}</option>
                  <option value="sm">{isId ? 'Halus (SM)' : 'Subtle (SM)'}</option>
                  <option value="md">{isId ? 'Sedang (MD)' : 'Elevated (MD)'}</option>
                  <option value="lg">{isId ? 'Tegas (LG)' : 'Deep (LG)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-[#9BA6B5] mb-1" htmlFor="custBorderW">
                  {isId ? 'Ketebalan Garis Tepi' : 'Border Width'}
                </label>
                <select
                  id="custBorderW"
                  value={customConfig.borderWidthPx}
                  onChange={(e) => updateCustomField('borderWidthPx', Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-50 dark:bg-[#090B10] border border-slate-200 dark:border-white/10 px-2.5 py-2 text-xs"
                >
                  <option value={0}>0px</option>
                  <option value={1}>1px Hairline</option>
                  <option value={2}>2px Bold</option>
                  <option value={4}>4px Brutalist</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="custOpacity" className="text-slate-500 dark:text-[#9BA6B5]">
                  {isId ? 'Transparansi Permukaan' : 'Surface Opacity'}
                </label>
                <span className="font-mono tabular-nums">{customConfig.opacityPercent}%</span>
              </div>
              <input
                id="custOpacity"
                type="range"
                min={40}
                max={100}
                value={customConfig.opacityPercent}
                onChange={(e) => updateCustomField('opacityPercent', Number(e.target.value))}
                className="w-full accent-[#8B9CFF]"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Related Components */}
      {relatedComponents.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/[0.09]">
          <h2 className="text-lg font-bold">
            {isId ? `Komponen Terkait di ${component.category}` : `Related in ${component.category}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedComponents.map((rel) => (
              <Link
                key={rel.id}
                to={`/components/${rel.slug}`}
                className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.09] bg-white dark:bg-[#141A24] hover:border-[#8B9CFF]/50 transition space-y-1.5"
              >
                <div className="text-xs font-mono text-[#8B9CFF]">{rel.technology}</div>
                <div className="text-sm font-semibold">{rel.name}</div>
                <p className="text-xs text-slate-500 dark:text-[#9BA6B5] line-clamp-2">
                  {rel.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
