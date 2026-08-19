import { TrendingUp, Sparkles, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '@/store';
import { ContentCard } from '@/components/ContentCard';

export function HomeView() {
  const { content, t, navigate } = useApp();

  const trending = content.slice(0, 8);
  const recent = content.slice(8, 16);
  const shorts = content.filter(c => c.type === 'short');
  const playlists = content.filter(c => c.type === 'playlist' || c.type === 'music').slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10 pb-20 md:pb-6">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden h-48 md:h-64 group">
        <img src={content[0].thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 max-w-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-[#00ff88]" />
            <span className="text-xs font-medium text-[#00ff88] uppercase tracking-wider">{t('recommended')}</span>
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2 leading-tight">
            {content[0].title}
          </h2>
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{content[0].description}</p>
          <button
            onClick={() => { navigate('detail'); }}
            className="self-start neon-bg px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
          >
            {t('play')}
          </button>
        </div>
      </div>

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-[#00ff88]" />
            {t('trending')}
          </h3>
          <button onClick={() => navigate('search')} className="text-xs text-[#00ff88] hover:underline flex items-center gap-1">
            {t('seeAll')} <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Shorts row */}
      {shorts.length > 0 && (
        <section>
          <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[#00ff88]" />
            {t('shorts')}
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {shorts.map((item, i) => (
              <div key={item.id} className="shrink-0 w-36">
                <ContentCard item={item} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Playlists / Music */}
      <section>
        <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
          <Clock size={18} className="text-[#00ff88]" />
          {t('recentlyAdded')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Recent */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg text-white">{t('recommended')}</h3>
          <button onClick={() => navigate('search')} className="text-xs text-[#00ff88] hover:underline flex items-center gap-1">
            {t('seeAll')} <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recent.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
