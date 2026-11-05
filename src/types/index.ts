export type UserRole = 'owner' | 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  section: 'components' | 'templates' | 'snippets' | 'scrapes';
  iconName: string;
  order: number;
  isVisible: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VisualCustomConfig {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: 'Plus Jakarta Sans' | 'DM Sans' | 'JetBrains Mono' | 'System UI';
  fontSizePx: number;
  fontWeight: '400' | '500' | '600' | '700';
  borderRadiusPx: number;
  borderWidthPx: number;
  borderColor: string;
  paddingPx: number;
  shadowLevel: 'none' | 'sm' | 'md' | 'lg';
  opacityPercent: number;
  layoutDirection: 'column' | 'row';
  alignItems: 'stretch' | 'center' | 'flex-start';
  transitionMs: number;
}

export interface ComponentItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  technology: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isPopular: boolean;
  version: string;
  viewsCount: number;
  copiesCount: number;
  downloadsCount: number;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  reactCode: string;
  tailwindCode: string;
  tsCode: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandingSectionBlock {
  id: string;
  type: 'navbar' | 'hero' | 'features' | 'pricing' | 'cta' | 'footer';
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundHex: string;
  accentHex: string;
  htmlContent: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  technology: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  htmlCode: string;
  reactCode: string;
  viewsCount: number;
  copiesCount: number;
  downloadsCount: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SnippetItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  language: 'TypeScript' | 'JavaScript' | 'React TSX' | 'CSS' | 'HTML' | 'Tailwind' | 'SQL' | 'JSON';
  tags: string[];
  code: string;
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  authorId: string;
  authorName: string;
  copiesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapedProjectFile {
  id: string;
  projectId: string;
  filePath: string;
  language: string;
  mimeType: string;
  fileSize: number;
  isEntryFile: boolean;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapedProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  tags: string[];
  sourceUrl: string;
  sourceAuthor: string;
  license: string;
  attributionNotes: string;
  entryFile: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isPopular: boolean;
  viewsCount: number;
  copiesCount: number;
  downloadsCount: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  files?: ScrapedProjectFile[];
}

export interface AssetItem {
  id: string;
  name: string;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  url: string;
  category: string;
  uploadedBy: string;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'component' | 'template' | 'snippet' | 'scrape';
  title: string;
  slug: string;
  category: string;
  createdAt: string;
}

export interface CollectionFolder {
  id: string;
  userId: string;
  name: string;
  description: string;
  itemIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  accentColor: string;
  defaultTheme: 'dark' | 'light';
  maintenanceMode: boolean;
  allowPublicPlayground: boolean;
  maxUploadSizeMb: number;
  updatedBy: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  actorUid: string;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  summary: string;
  createdAt: string;
}
