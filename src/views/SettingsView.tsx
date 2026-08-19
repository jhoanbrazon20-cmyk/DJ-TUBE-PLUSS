import { useState } from 'react';
import {
  Settings, Moon, Sun, Monitor, Folder, Wifi, Download, Play, Globe,
  HardDrive, Info, Shield, FileText, ChevronRight, Check, Trash2,
} from 'lucide-react';
import { useApp } from '@/store';
import type { ThemeMode, MediaFormat, Language } from '@/types';

export function SettingsView() {
  const { settings, setSettings, downloads, clearDownloads, t, showToast } = useApp();
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const totalSize = downloads.reduce((acc, d) => acc + d.sizeBytes, 0);
  const sizeMB = (totalSize / 1000000).toFixed(1);
  const usedPct = Math.min(100, (totalSize / 1000000000) * 100);

  const themeOptions: { key: ThemeMode; label: string; icon: typeof Moon }[] = [
    { key: 'dark', label: t('darkMode'), icon: Moon },
    { key: 'light', label: t('lightMode'), icon: Sun },
    { key: 'auto', label: t('autoMode'), icon: Monitor },
  ];

  const languages: { key: Language; label: string; flag: string }[] = [
    { key: 'es', label: t('spanish'), flag: 'ES' },
    { key: 'en', label: t('english'), flag: 'EN' },
  ];

  const qualities = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'];
  const formats: MediaFormat[] = ['mp4', 'webm', 'mp3', 'aac', 'wav', 'flac'];
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-6">
      <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2 mb-6">
        <Settings size={24} className="text-[#00ff88]" />
        {t('settings')}
      </h1>

      {/* Appearance */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{t('appearance')}</h2>
        <div className="glass-card rounded-xl divide-y divide-white/5">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Moon size={16} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('appearance')}</span>
            </div>
            <div className="flex gap-2">
              {themeOptions.map(opt => {
                const Icon = opt.icon;
                const active = settings.theme === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setSettings({ theme: opt.key })}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg text-xs font-medium transition-all ${
                      active ? 'neon-border neon-text bg-[#00ff88]/5' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{t('downloadSettings')}</h2>
        <div className="glass-card rounded-xl divide-y divide-white/5">
          {/* Download folder */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Folder size={18} className="text-[#00ff88]" />
              <div>
                <p className="text-sm text-white">{t('downloadFolder')}</p>
                <p className="text-xs text-gray-500">{settings.downloadFolder}</p>
              </div>
            </div>
            <button
              onClick={() => showToast(t('downloadFolder'), 'info')}
              className="text-xs text-[#00ff88] hover:underline"
            >
              {t('save')}
            </button>
          </div>

          {/* WiFi only */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('wifiOnly')}</span>
            </div>
            <button
              onClick={() => setSettings({ wifiOnly: !settings.wifiOnly })}
              className={`w-11 h-6 rounded-full transition-all relative ${settings.wifiOnly ? 'gradient-neon' : 'bg-white/10'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${settings.wifiOnly ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Concurrent downloads */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Download size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('concurrentDownloads')}</span>
              <span className="ml-auto text-sm font-mono neon-text">{settings.maxConcurrentDownloads}</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={settings.maxConcurrentDownloads}
              onChange={e => setSettings({ maxConcurrentDownloads: parseInt(e.target.value) })}
              className="w-full accent-[#00ff88]"
            />
          </div>

          {/* Default quality */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('defaultQuality')}</span>
            </div>
            <select
              value={settings.defaultQuality}
              onChange={e => setSettings({ defaultQuality: e.target.value })}
              className="glass-card rounded-lg px-3 py-1.5 text-sm text-white outline-none cursor-pointer"
            >
              {qualities.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>

          {/* Default format */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('defaultFormat')}</span>
            </div>
            <select
              value={settings.defaultFormat}
              onChange={e => setSettings({ defaultFormat: e.target.value as MediaFormat })}
              className="glass-card rounded-lg px-3 py-1.5 text-sm text-white outline-none cursor-pointer"
            >
              {formats.map(f => <option key={f} value={f} className="uppercase">{f.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Playback */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{t('playback')}</h2>
        <div className="glass-card rounded-xl divide-y divide-white/5">
          {/* Autoplay */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('autoplay')}</span>
            </div>
            <button
              onClick={() => setSettings({ autoplay: !settings.autoplay })}
              className={`w-11 h-6 rounded-full transition-all relative ${settings.autoplay ? 'gradient-neon' : 'bg-white/10'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${settings.autoplay ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Background playback */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('backgroundPlay')}</span>
            </div>
            <button
              onClick={() => setSettings({ backgroundPlayback: !settings.backgroundPlayback })}
              className={`w-11 h-6 rounded-full transition-all relative ${settings.backgroundPlayback ? 'gradient-neon' : 'bg-white/10'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${settings.backgroundPlayback ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Playback speed */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('playbackSpeed')}</span>
            </div>
            <select
              value={settings.playbackSpeed}
              onChange={e => setSettings({ playbackSpeed: parseFloat(e.target.value) })}
              className="glass-card rounded-lg px-3 py-1.5 text-sm text-white outline-none cursor-pointer"
            >
              {speeds.map(s => <option key={s} value={s}>{s}x</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Language */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{t('language')}</h2>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={18} className="text-[#00ff88]" />
            <span className="text-sm text-white">{t('language')}</span>
          </div>
          <div className="flex gap-2">
            {languages.map(lang => {
              const active = settings.language === lang.key;
              return (
                <button
                  key={lang.key}
                  onClick={() => setSettings({ language: lang.key })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                    active ? 'neon-border neon-text bg-[#00ff88]/5' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{lang.flag === 'ES' ? 'ES' : 'US'}</span>
                  {lang.label}
                  {active && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Storage */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{t('storage')}</h2>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <HardDrive size={18} className="text-[#00ff88]" />
            <span className="text-sm text-white">{t('storage')}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{t('spaceUsed')}</span>
              <span className="text-white font-mono">{sizeMB} MB</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full gradient-neon rounded-full" style={{ width: `${usedPct}%` }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{usedPct.toFixed(1)}% {t('storageUsed')}</span>
              <span className="text-gray-500">{(1000 - parseFloat(sizeMB)).toFixed(1)} MB {t('spaceFree')}</span>
            </div>
          </div>
          <button
            onClick={() => { clearDownloads(); showToast(t('clearDownloads'), 'info'); }}
            className="mt-4 w-full py-2.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            {t('clearDownloads')}
          </button>
        </div>
      </section>

      {/* About */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{t('about')}</h2>
        <div className="glass-card rounded-xl divide-y divide-white/5">
          <div className="p-4 flex items-center gap-3">
            <Info size={18} className="text-[#00ff88]" />
            <div className="flex-1">
              <p className="text-sm text-white">DJ Tube</p>
              <p className="text-xs text-gray-500">{t('appDescription')}</p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-white">{t('version')}</span>
            <span className="text-sm text-gray-400 font-mono">1.0.0</span>
          </div>
          <button onClick={() => setShowAbout(true)} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('licenses')}</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
          <button onClick={() => setShowPrivacy(true)} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('privacy')}</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
          <button onClick={() => setShowTerms(true)} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#00ff88]" />
              <span className="text-sm text-white">{t('terms')}</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>
      </section>

      {/* Modal overlays */}
      {showAbout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAbout(false)}>
          <div className="glass-card rounded-2xl p-6 max-w-md w-full animate-scaleIn" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-bold text-lg text-white mb-3">DJ Tube</h3>
            <p className="text-sm text-gray-400 mb-4">{t('appDescription')}</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>React 18, TypeScript, Tailwind CSS</p>
              <p>Lucide Icons, Media3/ExoPlayer (concept)</p>
              <p>Room, Coroutines, Material 3 (concept)</p>
            </div>
            <button onClick={() => setShowAbout(false)} className="mt-4 w-full neon-bg py-2.5 rounded-lg text-sm font-semibold">{t('close')}</button>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPrivacy(false)}>
          <div className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto custom-scroll animate-scaleIn" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-bold text-lg text-white mb-3">{t('privacyPolicy')}</h3>
            <div className="text-sm text-gray-400 space-y-3">
              <p>DJ Tube respects your privacy. We do not collect personal data without consent.</p>
              <p>All downloads, history, and preferences are stored locally on your device.</p>
              <p>No credentials are stored. No tracking. No ads.</p>
              <p>Content access uses only authorized APIs and permitted methods from each platform.</p>
            </div>
            <button onClick={() => setShowPrivacy(false)} className="mt-4 w-full neon-bg py-2.5 rounded-lg text-sm font-semibold">{t('close')}</button>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowTerms(false)}>
          <div className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto custom-scroll animate-scaleIn" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-bold text-lg text-white mb-3">{t('termsOfService')}</h3>
            <div className="text-sm text-gray-400 space-y-3">
              <p>By using DJ Tube, you agree to use the app responsibly and in accordance with applicable laws.</p>
              <p>DJ Tube only accesses content through authorized APIs and permitted methods.</p>
              <p>Download is only available for content where the source permits it.</p>
              <p>Users are responsible for ensuring they have the right to download and use any content.</p>
              <p>DJ Tube does not circumvent DRM, authentication, or platform restrictions.</p>
            </div>
            <button onClick={() => setShowTerms(false)} className="mt-4 w-full neon-bg py-2.5 rounded-lg text-sm font-semibold">{t('close')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
