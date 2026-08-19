import { useState } from 'react';
import { ArrowLeft, Play, Download, Eye, Clock, Calendar, Share2, Heart, ChevronDown } from 'lucide-react';
import { useApp } from '@/store';
import type { MediaFormat } from '@/types';

export function DetailView() {
  const { selectedContent, navigate, t, addDownload, showToast, downloads, settings, musicLibrary, toggleFavorite } = useApp();
  const [selectedQuality, setSelectedQuality] = useState(settings.defaultQuality);
  const [selectedFormat, setSelectedFormat] = useState<MediaFormat>(selectedContent?.type === 'music' ? 'mp3' : settings.defaultFormat);
  const [showQualities, setShowQualities] = useState(false);
  const [showFormats, setShowFormats] = useState(false);

  if (!selectedContent) {
    navigate('home');
    return null;
  }

  const item = selectedContent;
  const isFav = musicLibrary.some(m => m.id === item.id && m.favorite);

  const handlePlay = () => {
    navigate('player');
  };

  const handleDownload = () => {
    if (!item.downloadable) {
      showToast(t('downloadDisabled'), 'error');
      return;
    }
    const existing = downloads.find(d => d.contentId === item.id);
    if (existing) {
      showToast(t('downloadStarted'), 'info');
      return;
    }
    const id = `dl-${Date.now()}-${item.id}`;
    const format = item.type === 'music' ? selectedFormat : selectedFormat;
    const quality = item.type === 'music'
      ? item.audioFormats.find(a => a.format === selectedFormat)?.bitrate || '320 kbps'
      : selectedQuality;
    addDownload({
      id,
      contentId: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      format,
      quality,
      size: item.type === 'music' ? '8.2 MB' : '245 MB',
      sizeBytes: item.type === 'music' ? 8200000 : 245000000,
      speed: '0 MB/s',
      progress: 0,
      timeRemaining: '--:--',
      status: 'in_progress',
      source: item.source,
      createdAt: Date.now(),
      type: item.type,
    });
    showToast(t('downloadStarted'), 'success');
  };

  const handleShare = () => {
    showToast(t('share'), 'info');
  };

  const handleFavorite = () => {
    toggleFavorite(item.id);
    showToast(isFav ? t('removedFromFavorites') : t('addedToFavorites'), 'success');
  };

  const availableQualities = item.qualities.filter(q => q.available);
  const availableFormats = item.audioFormats.filter(a => a.available);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-6">
      {/* Back button */}
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">{t('home')}</span>
      </button>

      {/* Hero thumbnail */}
      <div className="relative rounded-2xl overflow-hidden aspect-video mb-6 group">
        <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full neon-bg flex items-center justify-center scale-90 hover:scale-100 transition-transform">
            <Play size={32} fill="black" className="text-black ml-1" />
          </div>
        </button>
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-sm font-medium text-white flex items-center gap-1.5">
          <Clock size={12} />
          {item.duration}
        </div>
      </div>

      {/* Title and channel */}
      <h1 className="font-display font-bold text-xl md:text-2xl text-white mb-3 leading-tight">
        {item.title}
      </h1>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full gradient-neon flex items-center justify-center text-black font-bold text-sm shrink-0">
          {item.channel.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white text-sm truncate">{item.channel}</p>
          <p className="text-xs text-gray-500">{item.views} {t('views')}</p>
        </div>
        <button onClick={handleFavorite} className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-colors">
          <Heart size={18} fill={isFav ? '#00ff88' : 'none'} className={isFav ? 'text-[#00ff88]' : ''} />
        </button>
        <button onClick={handleShare} className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-colors">
          <Share2 size={18} />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handlePlay}
          className="flex-1 neon-bg py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Play size={18} fill="black" />
          {t('play')}
        </button>
        <button
          onClick={handleDownload}
          disabled={!item.downloadable}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            item.downloadable
              ? 'glass-card text-white hover:neon-border hover:neon-text'
              : 'glass-card text-gray-600 cursor-not-allowed'
          }`}
        >
          <Download size={18} />
          {item.downloadable ? t('download') : t('notAvailable')}
        </button>
      </div>

      {!item.downloadable && (
        <div className="glass-card rounded-xl p-3 mb-6 border border-yellow-500/20">
          <p className="text-xs text-yellow-400/80 text-center">{t('downloadDisabled')}</p>
        </div>
      )}

      {/* Meta info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass-card rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">{t('views')}</p>
          <p className="text-sm font-medium text-white">{item.views}</p>
        </div>
        <div className="glass-card rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">{t('duration')}</p>
          <p className="text-sm font-medium text-white">{item.duration}</p>
        </div>
        <div className="glass-card rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">{t('published')}</p>
          <p className="text-sm font-medium text-white">{item.publishedAt}</p>
        </div>
        <div className="glass-card rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">{t('format')}</p>
          <p className="text-sm font-medium text-white uppercase">{item.source}</p>
        </div>
      </div>

      {/* Description */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <h3 className="font-display font-semibold text-sm text-white mb-2">{t('description')}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
      </div>

      {/* Quality selector */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <button
          onClick={() => setShowQualities(!showQualities)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="font-display font-semibold text-sm text-white">{t('availableQualities')}</h3>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${showQualities ? 'rotate-180' : ''}`} />
        </button>
        {showQualities && (
          <div className="mt-3 space-y-2 animate-fadeIn">
            {item.qualities.map(q => (
              <div
                key={q.label}
                onClick={() => q.available && setSelectedQuality(q.label)}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                  selectedQuality === q.label
                    ? 'neon-border bg-[#00ff88]/5'
                    : q.available
                      ? 'hover:bg-white/5'
                      : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${q.available ? 'text-white' : 'text-gray-600'}`}>
                    {q.label}
                  </span>
                  <span className="text-xs text-gray-500">{q.resolution}</span>
                </div>
                {!q.available && (
                  <span className="text-xs text-gray-600">{t('notAvailable')}</span>
                )}
                {q.available && selectedQuality === q.label && (
                  <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audio format selector */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <button
          onClick={() => setShowFormats(!showFormats)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="font-display font-semibold text-sm text-white">{t('availableFormats')}</h3>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${showFormats ? 'rotate-180' : ''}`} />
        </button>
        {showFormats && (
          <div className="mt-3 space-y-2 animate-fadeIn">
            {item.audioFormats.map(a => (
              <div
                key={`${a.format}-${a.bitrate}`}
                onClick={() => a.available && setSelectedFormat(a.format)}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                  selectedFormat === a.format
                    ? 'neon-border bg-[#00ff88]/5'
                    : a.available
                      ? 'hover:bg-white/5'
                      : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium uppercase ${a.available ? 'text-white' : 'text-gray-600'}`}>
                    {a.format}
                  </span>
                  <span className="text-xs text-gray-500">{a.bitrate}</span>
                </div>
                {!a.available && (
                  <span className="text-xs text-gray-600">{t('notAvailable')}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
