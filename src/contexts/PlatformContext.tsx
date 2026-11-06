import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  BOOTSTRAPPED_OWNER_EMAIL,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  INITIAL_CATEGORIES,
  INITIAL_COMPONENTS,
  INITIAL_TEMPLATES,
  INITIAL_SNIPPETS,
  INITIAL_SCRAPES,
  INITIAL_SETTINGS,
  INITIAL_ASSETS,
} from '../data/seedData';
import type {
  CategoryItem,
  ComponentItem,
  TemplateItem,
  SnippetItem,
  ScrapedProject,
  AssetItem,
  FavoriteItem,
  CollectionFolder,
  PlatformSettings,
  AuditLogItem,
  UserProfile,
  UserRole,
} from '../types';

export interface ToastNotice {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface PlatformContextValue {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  authLoading: boolean;
  dataLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lang: 'id' | 'en';
  toggleLang: () => void;
  settings: PlatformSettings;
  categories: CategoryItem[];
  components: ComponentItem[];
  templates: TemplateItem[];
  snippets: SnippetItem[];
  scrapes: ScrapedProject[];
  assets: AssetItem[];
  favorites: FavoriteItem[];
  collections: CollectionFolder[];
  usersList: UserProfile[];
  auditLogs: AuditLogItem[];
  toasts: ToastNotice[];
  notify: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleFavorite: (item: { id: string; type: FavoriteItem['targetType']; title: string; slug: string; category: string }) => Promise<void>;
  isFavorited: (targetId: string) => boolean;
  createCollection: (name: string, description: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  toggleItemInCollection: (collectionId: string, itemId: string) => Promise<void>;
  incrementMetric: (resourceType: 'component' | 'template' | 'snippet' | 'scrape', id: string, metric: 'viewsCount' | 'copiesCount' | 'downloadsCount') => void;
  saveComponent: (item: ComponentItem, isNew: boolean) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  saveTemplate: (item: TemplateItem, isNew: boolean) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  saveSnippet: (item: SnippetItem, isNew: boolean) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  saveScrape: (item: ScrapedProject, isNew: boolean) => Promise<void>;
  deleteScrape: (id: string) => Promise<void>;
  saveCategory: (item: CategoryItem, isNew: boolean) => Promise<void>;
  deleteCategory: (id: string) => Promise<{ ok: boolean; reason?: string }>;
  saveAsset: (item: AssetItem) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  updateUserRole: (uid: string, nextRole: UserRole, nextStatus: 'active' | 'suspended') => Promise<void>;
  updatePlatformSettings: (next: PlatformSettings) => Promise<void>;
  resetPlatformSettings: () => Promise<void>;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

const LS_FAVORITES_KEY = 'lv_codebase_favorites_v1';
const LS_COLLECTIONS_KEY = 'lv_codebase_collections_v1';
const LS_THEME_KEY = 'lv_codebase_theme_v1';
const LS_LANG_KEY = 'lv_codebase_lang_v1';

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(LS_THEME_KEY);
    return saved === 'light' ? 'light' : 'dark';
  });

  const [lang, setLang] = useState<'id' | 'en'>(() => {
    const saved = localStorage.getItem(LS_LANG_KEY);
    return saved === 'en' ? 'en' : 'id';
  });

  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [components, setComponents] = useState<ComponentItem[]>(INITIAL_COMPONENTS);
  const [templates, setTemplates] = useState<TemplateItem[]>(INITIAL_TEMPLATES);
  const [snippets, setSnippets] = useState<SnippetItem[]>(INITIAL_SNIPPETS);
  const [scrapes, setScrapes] = useState<ScrapedProject[]>(INITIAL_SCRAPES);
  const [assets, setAssets] = useState<AssetItem[]>(INITIAL_ASSETS);

  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [collections, setCollections] = useState<CollectionFolder[]>(() => {
    try {
      const raw = localStorage.getItem(LS_COLLECTIONS_KEY);
      return raw
        ? JSON.parse(raw)
        : [
            {
              id: 'col-auth-kit',
              userId: 'guest-local',
              name: 'Production Auth Kit',
              description: 'Curated authentication portals and OTP verification components.',
              itemIds: ['comp-modern-dark-login', 'comp-otp-verification', 'scrape-saas-glass-auth-portal'],
              createdAt: '2026-11-05T04:00:00.000Z',
              updatedAt: '2026-11-05T04:00:00.000Z',
            },
          ];
    } catch {
      return [];
    }
  });

  const [usersList, setUsersList] = useState<UserProfile[]>([
    {
      uid: 'owner-bootstrap-1',
      email: BOOTSTRAPPED_OWNER_EMAIL,
      displayName: 'Leovandyz (Platform Owner)',
      role: 'owner',
      status: 'active',
      createdAt: '2026-11-01T10:00:00.000Z',
      updatedAt: '2026-11-05T04:00:00.000Z',
    },
    {
      uid: 'admin-curator-2',
      email: 'curator@leovandyz.dev',
      displayName: 'Raka Pratama (UI Curator)',
      role: 'admin',
      status: 'active',
      createdAt: '2026-11-02T14:20:00.000Z',
      updatedAt: '2026-11-05T02:10:00.000Z',
    },
    {
      uid: 'user-member-3',
      email: 'nadia.systems@example.dev',
      displayName: 'Nadia Kusuma',
      role: 'user',
      status: 'active',
      createdAt: '2026-11-03T09:15:00.000Z',
      updatedAt: '2026-11-04T18:00:00.000Z',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-init-1',
      actorUid: 'owner-bootstrap-1',
      actorName: 'Leovandyz (Platform Owner)',
      action: 'PLATFORM_BOOTSTRAP',
      resourceType: 'settings',
      resourceId: 'global',
      summary: 'Initialized LEOVANDYZ CODEBASE workspace and verified security rules.',
      createdAt: '2026-11-05T04:00:00.000Z',
    },
    {
      id: 'log-init-2',
      actorUid: 'owner-bootstrap-1',
      actorName: 'Leovandyz (Platform Owner)',
      action: 'PUBLISH_SCRAPE',
      resourceType: 'scrape',
      resourceId: 'scrape-saas-glass-auth-portal',
      summary: 'Published multi-file SaaS Authentication Archive with MIT license attribution.',
      createdAt: '2026-11-05T04:05:00.000Z',
    },
  ]);

  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const notify = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const appendAuditLog = useCallback(
    async (action: string, resourceType: string, resourceId: string, summary: string) => {
      const actorUid = user?.uid || profile?.uid || 'anonymous';
      const actorName = user?.displayName || profile?.displayName || user?.email || 'Authenticated User';
      const logId = `log-${Date.now()}`;
      const newEntry: AuditLogItem = {
        id: logId,
        actorUid,
        actorName,
        action,
        resourceType,
        resourceId,
        summary: summary.slice(0, 480),
        createdAt: new Date().toISOString(),
      };
      setAuditLogs((prev) => [newEntry, ...prev]);

      if (user && (role === 'owner' || role === 'admin')) {
        try {
          await setDoc(doc(db, 'audit_logs', logId), {
            ...newEntry,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `audit_logs/${logId}`);
        }
      }
    },
    [user, profile, role]
  );

  // Sync theme & accent color with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(LS_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
  }, [settings.accentColor]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(LS_LANG_KEY, lang);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  }, []);

  // Listen to Firebase Auth state: strictly resolve role from verified user session & Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        const isBootstrappedOwner =
          Boolean(fbUser.emailVerified) &&
          fbUser.email?.toLowerCase() === BOOTSTRAPPED_OWNER_EMAIL.toLowerCase();

        let resolvedRole: UserRole = isBootstrappedOwner ? 'owner' : 'user';

        // Check if user has a stored role in Firestore users/{uid}
        try {
          const userDocSnap = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDocSnap.exists()) {
            const storedData = userDocSnap.data();
            if (storedData.status === 'active') {
              if (isBootstrappedOwner) {
                resolvedRole = 'owner';
              } else if (storedData.role === 'admin' || storedData.role === 'owner') {
                resolvedRole = storedData.role;
              }
            }
          }
        } catch {
          // Fallback to bootstrapped check if user doc doesn't exist yet
        }

        setRole(resolvedRole);
        const userProf: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Developer',
          role: resolvedRole,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProfile(userProf);

        // Fetch user's Firestore favorites if signed in
        try {
          const favQuery = query(collection(db, 'favorites'), where('userId', '==', fbUser.uid));
          const snap = await getDocs(favQuery);
          if (!snap.empty) {
            const loaded: FavoriteItem[] = [];
            snap.forEach((d) => {
              const data = d.data();
              loaded.push({
                id: data.id,
                userId: data.userId,
                targetId: data.targetId,
                targetType: data.targetType,
                title: data.title,
                slug: data.slug,
                category: data.category,
                createdAt: new Date().toISOString(),
              });
            });
            setFavorites(loaded);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'favorites');
        }
      } else {
        // Unauthenticated / Incognito / Signed Out: strictly public guest ('user' role, null profile)
        setProfile(null);
        setRole('user');
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Load published Firestore documents on startup and merge with initial seed catalog
  useEffect(() => {
    let active = true;
    async function loadPublishedCatalog() {
      setDataLoading(true);
      try {
        const compQuery = query(collection(db, 'components'), where('status', '==', 'published'));
        const compSnap = await getDocs(compQuery);
        if (active && !compSnap.empty) {
          const remoteComps: ComponentItem[] = [];
          compSnap.forEach((d) => {
            const data = d.data() as ComponentItem;
            remoteComps.push({
              ...data,
              createdAt: String(data.createdAt || ''),
              updatedAt: String(data.updatedAt || ''),
            });
          });
          setComponents((prev) => {
            const map = new Map(prev.map((c) => [c.id, c]));
            remoteComps.forEach((rc) => map.set(rc.id, rc));
            return Array.from(map.values());
          });
        }
      } catch {
        // Keep deterministic seed catalog when offline or unseeded
      } finally {
        if (active) setDataLoading(false);
      }
    }
    loadPublishedCatalog();
    return () => {
      active = false;
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const isOwnerAccount =
        cred.user.email?.toLowerCase() === BOOTSTRAPPED_OWNER_EMAIL.toLowerCase();
      notify(
        isOwnerAccount
          ? 'Berhasil masuk sebagai Owner (Leovandyz). Menu Owner Studio kini aktif.'
          : 'Berhasil masuk dengan akun Google.',
        'success'
      );
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Login Google dibatalkan.', 'info');
    }
  }, [notify]);

  const signOut = useCallback(async () => {
    try {
      await fbSignOut(auth);
      setRole('user');
      setProfile(null);
      notify('Berhasil keluar dari sesi akun.', 'info');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Gagal keluar dari akun.', 'error');
    }
  }, [notify]);

  const isFavorited = useCallback(
    (targetId: string) => favorites.some((f) => f.targetId === targetId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (item: { id: string; type: FavoriteItem['targetType']; title: string; slug: string; category: string }) => {
      const existing = favorites.find((f) => f.targetId === item.id);
      if (existing) {
        const next = favorites.filter((f) => f.targetId !== item.id);
        setFavorites(next);
        localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(next));
        notify(`Removed "${item.title}" from Favorites.`, 'info');
        if (user) {
          try {
            await deleteDoc(doc(db, 'favorites', existing.id));
          } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, `favorites/${existing.id}`);
          }
        }
      } else {
        const favId = `fav-${Date.now()}`;
        const newFav: FavoriteItem = {
          id: favId,
          userId: user?.uid || 'guest-local',
          targetId: item.id,
          targetType: item.type,
          title: item.title,
          slug: item.slug,
          category: item.category,
          createdAt: new Date().toISOString(),
        };
        const next = [newFav, ...favorites];
        setFavorites(next);
        localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(next));
        notify(`Saved "${item.title}" to Favorites.`, 'success');
        if (user) {
          try {
            await setDoc(doc(db, 'favorites', favId), {
              ...newFav,
              createdAt: serverTimestamp(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, `favorites/${favId}`);
          }
        }
      }
    },
    [favorites, user, notify]
  );

  const createCollection = useCallback(
    async (name: string, description: string) => {
      const colId = `col-${Date.now()}`;
      const newCol: CollectionFolder = {
        id: colId,
        userId: user?.uid || 'guest-local',
        name: name.trim(),
        description: description.trim(),
        itemIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const next = [newCol, ...collections];
      setCollections(next);
      localStorage.setItem(LS_COLLECTIONS_KEY, JSON.stringify(next));
      notify(`Created collection "${name}".`, 'success');
      if (user) {
        try {
          await setDoc(doc(db, 'collections', colId), {
            ...newCol,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `collections/${colId}`);
        }
      }
    },
    [collections, user, notify]
  );

  const deleteCollection = useCallback(
    async (id: string) => {
      const next = collections.filter((c) => c.id !== id);
      setCollections(next);
      localStorage.setItem(LS_COLLECTIONS_KEY, JSON.stringify(next));
      notify('Deleted collection.', 'info');
      if (user) {
        try {
          await deleteDoc(doc(db, 'collections', id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `collections/${id}`);
        }
      }
    },
    [collections, user, notify]
  );

  const toggleItemInCollection = useCallback(
    async (collectionId: string, itemId: string) => {
      const next = collections.map((col) => {
        if (col.id !== collectionId) return col;
        const exists = col.itemIds.includes(itemId);
        const updatedIds = exists ? col.itemIds.filter((i) => i !== itemId) : [...col.itemIds, itemId].slice(0, 50);
        return { ...col, itemIds: updatedIds, updatedAt: new Date().toISOString() };
      });
      setCollections(next);
      localStorage.setItem(LS_COLLECTIONS_KEY, JSON.stringify(next));
      notify('Updated collection items.', 'success');
    },
    [collections, notify]
  );

  const incrementMetric = useCallback(
    (
      resourceType: 'component' | 'template' | 'snippet' | 'scrape',
      id: string,
      metric: 'viewsCount' | 'copiesCount' | 'downloadsCount'
    ) => {
      if (resourceType === 'component') {
        setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, [metric]: c[metric] + 1 } : c)));
      } else if (resourceType === 'template') {
        setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, [metric]: t[metric] + 1 } : t)));
      } else if (resourceType === 'snippet' && metric === 'copiesCount') {
        setSnippets((prev) => prev.map((s) => (s.id === id ? { ...s, copiesCount: s.copiesCount + 1 } : s)));
      } else if (resourceType === 'scrape') {
        setScrapes((prev) => prev.map((s) => (s.id === id ? { ...s, [metric]: s[metric] + 1 } : s)));
      }
    },
    []
  );

  const saveComponent = useCallback(
    async (item: ComponentItem, isNew: boolean) => {
      setComponents((prev) => {
        const exists = prev.some((c) => c.id === item.id);
        return exists ? prev.map((c) => (c.id === item.id ? item : c)) : [item, ...prev];
      });
      await appendAuditLog(
        isNew ? 'CREATE_COMPONENT' : 'UPDATE_COMPONENT',
        'component',
        item.id,
        `${isNew ? 'Created' : 'Updated'} component "${item.name}" (${item.status}).`
      );
      if (user && (role === 'owner' || role === 'admin')) {
        try {
          await setDoc(doc(db, 'components', item.id), {
            ...item,
            authorId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `components/${item.id}`);
        }
      }
      notify(`Saved component "${item.name}".`, 'success');
    },
    [user, role, appendAuditLog, notify]
  );

  const deleteComponent = useCallback(
    async (id: string) => {
      const target = components.find((c) => c.id === id);
      setComponents((prev) => prev.filter((c) => c.id !== id));
      await appendAuditLog('DELETE_COMPONENT', 'component', id, `Deleted component "${target?.name || id}".`);
      if (user && (role === 'owner' || role === 'admin')) {
        try {
          await deleteDoc(doc(db, 'components', id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `components/${id}`);
        }
      }
      notify('Deleted component.', 'info');
    },
    [components, user, role, appendAuditLog, notify]
  );

  const saveTemplate = useCallback(
    async (item: TemplateItem, isNew: boolean) => {
      setTemplates((prev) => {
        const exists = prev.some((t) => t.id === item.id);
        return exists ? prev.map((t) => (t.id === item.id ? item : t)) : [item, ...prev];
      });
      await appendAuditLog(
        isNew ? 'CREATE_TEMPLATE' : 'UPDATE_TEMPLATE',
        'template',
        item.id,
        `${isNew ? 'Created' : 'Updated'} template "${item.name}" (${item.status}).`
      );
      if (user && (role === 'owner' || role === 'admin')) {
        try {
          await setDoc(doc(db, 'templates', item.id), {
            ...item,
            authorId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `templates/${item.id}`);
        }
      }
      notify(`Saved template "${item.name}".`, 'success');
    },
    [user, role, appendAuditLog, notify]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      await appendAuditLog('DELETE_TEMPLATE', 'template', id, `Deleted template ${id}.`);
      notify('Deleted template.', 'info');
    },
    [appendAuditLog, notify]
  );

  const saveSnippet = useCallback(
    async (item: SnippetItem, isNew: boolean) => {
      setSnippets((prev) => {
        const exists = prev.some((s) => s.id === item.id);
        return exists ? prev.map((s) => (s.id === item.id ? item : s)) : [item, ...prev];
      });
      await appendAuditLog(
        isNew ? 'CREATE_SNIPPET' : 'UPDATE_SNIPPET',
        'snippet',
        item.id,
        `${isNew ? 'Created' : 'Updated'} snippet "${item.name}".`
      );
      if (user) {
        try {
          await setDoc(doc(db, 'snippets', item.id), {
            ...item,
            authorId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `snippets/${item.id}`);
        }
      }
      notify(`Saved snippet "${item.name}".`, 'success');
    },
    [user, appendAuditLog, notify]
  );

  const deleteSnippet = useCallback(
    async (id: string) => {
      setSnippets((prev) => prev.filter((s) => s.id !== id));
      await appendAuditLog('DELETE_SNIPPET', 'snippet', id, `Deleted snippet ${id}.`);
      notify('Deleted snippet.', 'info');
    },
    [appendAuditLog, notify]
  );

  const saveScrape = useCallback(
    async (item: ScrapedProject, isNew: boolean) => {
      setScrapes((prev) => {
        const exists = prev.some((s) => s.id === item.id);
        return exists ? prev.map((s) => (s.id === item.id ? item : s)) : [item, ...prev];
      });
      await appendAuditLog(
        isNew ? 'CREATE_SCRAPE' : 'UPDATE_SCRAPE',
        'scrape',
        item.id,
        `${isNew ? 'Published' : 'Updated'} scrape archive "${item.name}" with ${item.files?.length || 0} files.`
      );
      if (user && (role === 'owner' || role === 'admin')) {
        try {
          const { files, ...projectMeta } = item;
          await setDoc(doc(db, 'scrapes', item.id), {
            ...projectMeta,
            authorId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          if (files) {
            for (const f of files) {
              await setDoc(doc(db, 'scrapes', item.id, 'files', f.id), {
                ...f,
                projectId: item.id,
                authorId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            }
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `scrapes/${item.id}`);
        }
      }
      notify(`Saved scrape archive "${item.name}".`, 'success');
    },
    [user, role, appendAuditLog, notify]
  );

  const deleteScrape = useCallback(
    async (id: string) => {
      setScrapes((prev) => prev.filter((s) => s.id !== id));
      await appendAuditLog('DELETE_SCRAPE', 'scrape', id, `Removed scrape archive ${id}.`);
      notify('Removed scrape archive.', 'info');
    },
    [appendAuditLog, notify]
  );

  const saveCategory = useCallback(
    async (item: CategoryItem, isNew: boolean) => {
      setCategories((prev) => {
        const exists = prev.some((c) => c.id === item.id);
        return exists ? prev.map((c) => (c.id === item.id ? item : c)) : [...prev, item];
      });
      await appendAuditLog(
        isNew ? 'CREATE_CATEGORY' : 'UPDATE_CATEGORY',
        'category',
        item.id,
        `${isNew ? 'Added' : 'Updated'} category "${item.name}".`
      );
      notify(`Saved category "${item.name}".`, 'success');
    },
    [appendAuditLog, notify]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<{ ok: boolean; reason?: string }> => {
      const cat = categories.find((c) => c.id === id);
      if (!cat) return { ok: false, reason: 'Category not found.' };
      const inUseCount =
        components.filter((c) => c.category.toLowerCase() === cat.name.toLowerCase()).length +
        templates.filter((t) => t.category.toLowerCase() === cat.name.toLowerCase()).length +
        scrapes.filter((s) => s.category.toLowerCase() === cat.name.toLowerCase()).length;

      if (inUseCount > 0) {
        notify(`Cannot delete "${cat.name}": ${inUseCount} items still reference this category.`, 'error');
        return { ok: false, reason: `Referenced by ${inUseCount} items.` };
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      await appendAuditLog('DELETE_CATEGORY', 'category', id, `Deleted category "${cat.name}".`);
      notify(`Deleted category "${cat.name}".`, 'info');
      return { ok: true };
    },
    [categories, components, templates, scrapes, appendAuditLog, notify]
  );

  const saveAsset = useCallback(
    async (item: AssetItem) => {
      setAssets((prev) => [item, ...prev]);
      await appendAuditLog('UPLOAD_ASSET', 'asset', item.id, `Uploaded asset "${item.name}" (${item.mimeType}).`);
      notify(`Uploaded asset "${item.name}".`, 'success');
    },
    [appendAuditLog, notify]
  );

  const deleteAsset = useCallback(
    async (id: string) => {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      await appendAuditLog('DELETE_ASSET', 'asset', id, `Deleted asset ${id}.`);
      notify('Deleted asset.', 'info');
    },
    [appendAuditLog, notify]
  );

  const updateUserRole = useCallback(
    async (uid: string, nextRole: UserRole, nextStatus: 'active' | 'suspended') => {
      const target = usersList.find((u) => u.uid === uid);
      if (target?.role === 'owner' && role !== 'owner') {
        notify('Only the platform owner can modify an owner account.', 'error');
        return;
      }
      setUsersList((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, role: nextRole, status: nextStatus, updatedAt: new Date().toISOString() } : u))
      );
      await appendAuditLog(
        'UPDATE_USER_ROLE',
        'user',
        uid,
        `Updated user ${target?.displayName || uid} to role=${nextRole}, status=${nextStatus}.`
      );
      notify(`Updated permissions for ${target?.displayName || uid}.`, 'success');
    },
    [usersList, role, appendAuditLog, notify]
  );

  const updatePlatformSettings = useCallback(
    async (next: PlatformSettings) => {
      setSettings(next);
      setTheme(next.defaultTheme);
      await appendAuditLog(
        'UPDATE_SETTINGS',
        'settings',
        'global',
        `Updated platform settings (accent=${next.accentColor}, theme=${next.defaultTheme}).`
      );
      if (user && role === 'owner') {
        try {
          await setDoc(doc(db, 'settings', 'global'), {
            ...next,
            updatedBy: user.uid,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'settings/global');
        }
      }
      notify('Saved platform settings.', 'success');
    },
    [user, role, appendAuditLog, notify]
  );

  const resetPlatformSettings = useCallback(async () => {
    setSettings(INITIAL_SETTINGS);
    setTheme('dark');
    await appendAuditLog('RESET_SETTINGS', 'settings', 'global', 'Reset platform configuration to factory defaults.');
    notify('Platform settings reset to defaults.', 'info');
  }, [appendAuditLog, notify]);

  return (
    <PlatformContext.Provider
      value={{
        user,
        profile,
        role,
        authLoading,
        dataLoading,
        theme,
        toggleTheme,
        lang,
        toggleLang,
        settings,
        categories,
        components,
        templates,
        snippets,
        scrapes,
        assets,
        favorites,
        collections,
        usersList,
        auditLogs,
        toasts,
        notify,
        dismissToast,
        signInWithGoogle,
        signOut,
        toggleFavorite,
        isFavorited,
        createCollection,
        deleteCollection,
        toggleItemInCollection,
        incrementMetric,
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
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within a PlatformProvider');
  return ctx;
}
