import { Play, Download, Clock, Eye } from 'lucide-react';
import type { ContentItem } from '@/types';
import { useApp } from '@/store';

export function ContentCard({ item, index = 0 }: { item: ContentItem; index?: number }) {
  const { setSelectedContent, navigate, t, addDownload, showToast, downloads, settings } = useApp();

  const handleClick = () => {
    setSelectedContent(item);
    navigate('detail');
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    addDownload({
      id,
      contentId: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      format: item.type === 'music' ? settings.defaultFormat === 'mp4' ? 'mp3' : settings.defaultFormat : settings.defaultFormat,
      quality: item.type === 'music' ? '320 kbps' : settings.defaultQuality,
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

  const typeBadge = {
    video: 'bg-red-500/20 text-red-400',
    music: 'bg-purple-500/20 text-purple-400',
    playlist: 'bg-blue-500/20 text-blue-400',
    channel: 'bg-orange-500/20 text-orange-400',
    short: 'bg-pink-500/20 text-pink-400',
  }[item.type];

  return (
    <div
      onClick={handleClick}
      className="glass-card rounded-xl overflow-hidden cursor-pointer group animate-fadeInUp transition-all duration-300 hover:scale-[1.02]"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[#141414]">
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-white flex items-center gap-1">
          <Clock size={10} />
          {item.duration}
        </div>

        {/* Type badge */}
        <div className={`absolute top-2 left-2 ${typeBadge} backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium uppercase`}>
          {item.type}
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full neon-bg flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
            <Play size={24} fill="black" className="text-black ml-1" />
          </div>
        </div>

        {/* Download button */}
        {item.downloadable && (
          <button
            onClick={handleDownload}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:neon-bg hover:text-black transition-all opacity-0 group-hover:opacity-100"
          >
            <Download size={14} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-white line-clamp-2 leading-snug mb-1.5">
          {item.title}
        </h3>
        <p className="text-xs text-gray-400 mb-2">{item.channel}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {item.views}
          </span>
          <span>·</span>
          <span>{item.publishedAt}</span>
        </div>
      </div>
    </div>
  );
}
