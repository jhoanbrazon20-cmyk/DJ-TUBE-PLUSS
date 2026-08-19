import { useState } from 'react';
import { Video, Search, Share2, Trash2, Play, Grid, List } from 'lucide-react';
import { useApp } from '@/store';
import type { VideoSort } from '@/types';

export function VideosView() {
  const { downloads, removeVideo, t, showToast, setSelectedContent, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<VideoSort>('recent');
  const [gridView, setGridView] = useState(true);

  const videos = downloads
    .filter(d => d.status === 'completed' && d.type === 'video')
    .map(d => ({
      id: d.id,
      title: d.title,
      thumbnail: d.thumbnail,
      size: d.size,
      sizeBytes: d.sizeBytes,
      quality: d.quality,
      duration: d.quality,
      durationSeconds: 0,
      addedAt: d.createdAt,
      format: d.format,
      contentId: d.contentId,
    }));

  let display = videos;
  if (search) {
    display = display.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));
  }

  display = [...display].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.title.localeCompare(b.title);
      case 'size': return b.sizeBytes - a.sizeBytes;
      case 'quality': return parseInt(b.quality) - parseInt(a.quality);
      case 'duration': return b.durationSeconds - a.durationSeconds;
      default: return b.addedAt - a.addedAt;
    }
  });

  const handlePlay = (video: typeof display[0]) => {
    setSelectedContent({
      id: video.contentId,
      title: video.title,
      channel: 'Local',
      thumbnail: video.thumbnail,
      duration: video.duration,
      durationSeconds: 0,
      type: 'video',
      views: '0',
      publishedAt: '',
      description: '',
      qualities: [],
      audioFormats: [],
      downloadable: false,
      source: 'local',
    });
    navigate('player');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Video size={24} className="text-[#00ff88]" />
          {t('myVideos')}
        </h1>
        {videos.length > 0 && (
          <div className="flex gap-1">
            <button
              onClick={() => setGridView(true)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${gridView ? 'neon-bg' : 'glass-card text-gray-400'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${!gridView ? 'neon-bg' : 'glass-card text-gray-400'}`}
            >
              <List size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Search + sort */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full glass-card rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00ff88]/40"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as VideoSort)}
          className="glass-card rounded-xl px-3 py-2.5 text-sm text-white outline-none cursor-pointer"
        >
          <option value="recent">{t('sortRecent')}</option>
          <option value="name">{t('sortName')}</option>
          <option value="size">{t('sortSize')}</option>
          <option value="quality">{t('sortQuality')}</option>
          <option value="duration">{t('sortDuration')}</option>
        </select>
      </div>

      {/* Content */}
      {display.length === 0 ? (
        <div className="text-center py-20">
          <Video size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg mb-2">{t('noVideos')}</p>
          <p className="text-gray-500 text-sm">{t('noVideosDesc')}</p>
        </div>
      ) : gridView ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {display.map((v, i) => (
            <div
              key={v.id}
              className="glass-card rounded-xl overflow-hidden group cursor-pointer animate-fadeInUp"
              style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
              onClick={() => handlePlay(v)}
            >
              <div className="relative aspect-video">
                <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full neon-bg flex items-center justify-center">
                    <Play size={20} fill="black" className="text-black ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-medium text-[#00ff88]">
                  {v.quality}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-white line-clamp-2 mb-1">{v.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{v.size}</span>
                  <span className="uppercase">{v.format}</span>
                </div>
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); showToast(t('share'), 'info'); }}
                    className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-[#00ff88]"
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeVideo(v.id); showToast(t('delete'), 'info'); }}
                    className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {display.map((v, i) => (
            <div
              key={v.id}
              className="flex items-center gap-3 p-3 glass-card rounded-xl group cursor-pointer animate-fadeInUp"
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              onClick={() => handlePlay(v)}
            >
              <div className="relative shrink-0">
                <img src={v.thumbnail} alt="" className="w-24 h-14 rounded-md object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={18} fill="#00ff88" className="text-[#00ff88]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">{v.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="text-[#00ff88]">{v.quality}</span>
                  <span>·</span>
                  <span>{v.size}</span>
                  <span>·</span>
                  <span className="uppercase">{v.format}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); showToast(t('share'), 'info'); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#00ff88]"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeVideo(v.id); showToast(t('delete'), 'info'); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
