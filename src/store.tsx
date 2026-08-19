import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AppSettings, DownloadItem, MusicTrack, VideoItem, ContentItem, ViewName } from './types';
import { defaultContent } from './data';
import { translations, type TranslationKey } from './i18n';

interface AppState {
  settings: AppSettings;
  setSettings: (partial: Partial<AppSettings>) => void;
  downloads: DownloadItem[];
  addDownload: (item: DownloadItem) => void;
  updateDownload: (id: string, updates: Partial<DownloadItem>) => void;
  removeDownload: (id: string) => void;
  clearDownloads: () => void;
  musicLibrary: MusicTrack[];
  toggleFavorite: (id: string) => void;
  removeTrack: (id: string) => void;
  videoLibrary: VideoItem[];
  removeVideo: (id: string) => void;
  content: ContentItem[];
  searchContent: ContentItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  performSearch: (q: string) => void;
  currentView: ViewName;
  navigate: (view: ViewName) => void;
  selectedContent: ContentItem | null;
  setSelectedContent: (c: ContentItem | null) => void;
  playingContent: ContentItem | null;
  setPlayingContent: (c: ContentItem | null) => void;
  toast: { message: string; type: 'info' | 'success' | 'error' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppState | null>(null);

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'es',
  downloadFolder: 'DJ Tube/Downloads',
  wifiOnly: false,
  maxConcurrentDownloads: 3,
  defaultQuality: '1080p',
  defaultFormat: 'mp4',
  autoplay: true,
  backgroundPlayback: true,
  playbackSpeed: 1.0,
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<AppSettings>(() =>
    loadFromStorage('djtube_settings', defaultSettings)
  );
  const [downloads, setDownloads] = useState<DownloadItem[]>(() =>
    loadFromStorage('djtube_downloads', [])
  );
  const [musicLibrary, setMusicLibrary] = useState<MusicTrack[]>(() =>
    loadFromStorage('djtube_music', [])
  );
  const [videoLibrary, setVideoLibrary] = useState<VideoItem[]>(() =>
    loadFromStorage('djtube_videos', [])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchContent, setSearchContent] = useState<ContentItem[]>([]);
  const [currentView, setCurrentView] = useState<ViewName>('splash');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [playingContent, setPlayingContent] = useState<ContentItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => { saveToStorage('djtube_settings', settings); }, [settings]);
  useEffect(() => { saveToStorage('djtube_downloads', downloads); }, [downloads]);
  useEffect(() => { saveToStorage('djtube_music', musicLibrary); }, [musicLibrary]);
  useEffect(() => { saveToStorage('djtube_videos', videoLibrary); }, [videoLibrary]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    if (settings.theme === 'light') root.classList.add('theme-light');
    else root.classList.add('theme-dark');
  }, [settings.theme]);

  const setSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettingsState(prev => ({ ...prev, ...partial }));
  }, []);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addDownload = useCallback((item: DownloadItem) => {
    setDownloads(prev => [item, ...prev]);
  }, []);

  const updateDownload = useCallback((id: string, updates: Partial<DownloadItem>) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  const removeDownload = useCallback((id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  }, []);

  const clearDownloads = useCallback(() => {
    setDownloads([]);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setMusicLibrary(prev => prev.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t));
  }, []);

  const removeTrack = useCallback((id: string) => {
    setMusicLibrary(prev => prev.filter(t => t.id !== id));
  }, []);

  const removeVideo = useCallback((id: string) => {
    setVideoLibrary(prev => prev.filter(v => v.id !== id));
  }, []);

  const performSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchContent([]);
      return;
    }
    const lower = q.toLowerCase();
    const results = defaultContent.filter(c =>
      c.title.toLowerCase().includes(lower) ||
      c.channel.toLowerCase().includes(lower) ||
      c.description.toLowerCase().includes(lower)
    );
    if (results.length === 0) {
      setSearchContent(defaultContent.slice(0, 6));
    } else {
      setSearchContent(results);
    }
  }, []);

  const navigate = useCallback((view: ViewName) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const tFn = useCallback((key: TranslationKey) => {
    return translations[settings.language][key] || translations.en[key] || key;
  }, [settings.language]);

  const value: AppState = {
    settings,
    setSettings,
    downloads,
    addDownload,
    updateDownload,
    removeDownload,
    clearDownloads,
    musicLibrary,
    toggleFavorite,
    removeTrack,
    videoLibrary,
    removeVideo,
    content: defaultContent,
    searchContent,
    searchQuery,
    setSearchQuery,
    performSearch,
    currentView,
    navigate,
    selectedContent,
    setSelectedContent,
    playingContent,
    setPlayingContent,
    toast,
    showToast,
    t: tFn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
