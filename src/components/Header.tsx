import { Search, Download, Settings, Globe, Music, Video, Home } from 'lucide-react';
import { useApp } from '@/store';
import type { ViewName } from '@/types';

export function Header() {
  const { navigate, currentView, t, settings, setSettings } = useApp();

  const navItems: { view: ViewName; icon: typeof Home; label: string }[] = [
    { view: 'home', icon: Home, label: t('home') },
    { view: 'search', icon: Search, label: t('search') },
    { view: 'downloads', icon: Download, label: t('downloads') },
    { view: 'music', icon: Music, label: t('music') },
    { view: 'videos', icon: Video, label: t('videos') },
    { view: 'settings', icon: Settings, label: t('settings') },
  ];

  const toggleLanguage = () => {
    setSettings({ language: settings.language === 'es' ? 'en' : 'es' });
  };

  return (
    <>
      {/* Top header */}
      <header className="sticky top-0 z-40 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-2xl neon-text tracking-tighter">DJ</span>
              <span className="font-display text-xs neon-text tracking-[0.3em] -mt-0.5">TUBE</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => navigate(item.view)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'neon-text bg-[#00ff88]/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-[#00ff88] hover:bg-white/5 transition-all shrink-0"
          >
            <Globe size={18} />
            <span className="hidden sm:inline">{settings.language === 'es' ? 'ES' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-white/5">
        <div className="flex items-center justify-around h-16">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => navigate(item.view)}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all ${
                  active ? 'neon-text' : 'text-gray-500'
                }`}
              >
                <Icon size={20} className={active ? 'drop-shadow-[0_0_4px_rgba(0,255,136,0.5)]' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
