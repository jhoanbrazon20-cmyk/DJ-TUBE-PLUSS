import { useState } from 'react';
import {
  Music, Search, Heart, Share2, Trash2, Play, Clock,
  ListMusic, User, Disc, Folder, TrendingUp,
} from 'lucide-react';
import { useApp } from '@/store';
import type { LibraryTab } from '@/types';

export function MusicView() {
  const { musicLibrary, toggleFavorite, removeTrack, t, showToast, downloads, setSelectedContent, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<LibraryTab>('songs');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'album' | 'date' | 'plays'>('date');

  // Convert completed music downloads to library tracks
  const downloadedMusic = downloads
    .filter(d => d.status === 'completed' && d.type === 'music')
    .map(d => ({
      id: d.contentId,
      title: d.title,
      artist: settings.language === 'es' ? 'Artista desconocido' : 'Unknown artist',
      album: t('recentlyAdded'),
      duration: d.quality,
      durationSeconds: 0,
      thumbnail: d.thumbnail,
      favorite: musicLibrary.find(m => m.id === d.contentId)?.favorite || false,
      folder: 'DJ Tube/Music',
      addedAt: d.createdAt,
      plays: 0,
    }));

  const allTracks = [...musicLibrary, ...downloadedMusic.filter(d => !musicLibrary.some(m => m.id === d.id))];
  const favorites = allTracks.filter(t => t.favorite);

  const tabs: { key: LibraryTab; label: string; icon: typeof Music }[] = [
    { key: 'songs', label: t('songs'), icon: Music },
    { key: 'artists', label: t('artists'), icon: User },
    { key: 'albums', label: t('albums'), icon: Disc },
    { key: 'folders', label: t('folders'), icon: Folder },
    { key: 'recent', label: t('recent'), icon: Clock },
    { key: 'favorites', label: t('favorites'), icon: Heart },
  ];

  let displayTracks = allTracks;
  if (activeTab === 'favorites') displayTracks = favorites;
  if (activeTab === 'recent') displayTracks = [...allTracks].sort((a, b) => b.addedAt - a.addedAt);

  if (search) {
    displayTracks = displayTracks.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase())
    );
  }

  displayTracks = [...displayTracks].sort((a, b) => {
    switch (sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'artist': return a.artist.localeCompare(b.artist);
      case 'album': return a.album.localeCompare(b.album);
      case 'plays': return b.plays - a.plays;
      default: return b.addedAt - a.addedAt;
    }
  });

  // Group by artist/album/folder
  const grouped: Record<string, typeof displayTracks> = {};
  if (activeTab === 'artists') {
    displayTracks.forEach(t => {
      grouped[t.artist] = grouped[t.artist] || [];
      grouped[t.artist].push(t);
    });
  } else if (activeTab === 'albums') {
    displayTracks.forEach(t => {
      grouped[t.album] = grouped[t.album] || [];
      grouped[t.album].push(t);
    });
  } else if (activeTab === 'folders') {
    displayTracks.forEach(t => {
      grouped[t.folder] = grouped[t.folder] || [];
      grouped[t.folder].push(t);
    });
  }

  const handlePlay = (track: typeof displayTracks[0]) => {
    const content = downloads.find(d => d.contentId === track.id);
    if (content) {
      setSelectedContent({
        id: track.id,
        title: track.title,
        channel: track.artist,
        thumbnail: track.thumbnail,
        duration: track.duration,
        durationSeconds: 0,
        type: 'music',
        views: '0',
        publishedAt: '',
        description: '',
        qualities: [],
        audioFormats: [],
        downloadable: false,
        source: 'local',
      });
      navigate('player');
    } else {
      showToast(t('noMusic'), 'info');
    }
  };

  const handleShare = () => showToast(t('share'), 'info');

  const renderTrack = (track: typeof displayTracks[0], index: number) => (
    <div
      key={track.id}
      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all group animate-fadeInUp"
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      <div className="relative shrink-0">
        <img src={track.thumbnail} alt="" className="w-12 h-12 rounded-md object-cover" />
        <button
          onClick={() => handlePlay(track)}
          className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play size={16} fill="#00ff88" className="text-[#00ff88]" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{track.title}</p>
        <p className="text-xs text-gray-500 truncate">{track.artist} · {track.album}</p>
      </div>
      <span className="text-xs text-gray-500 hidden sm:block">{track.duration}</span>
      <button
        onClick={() => { toggleFavorite(track.id); showToast(track.favorite ? t('removedFromFavorites') : t('addedToFavorites'), 'success'); }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-colors"
      >
        <Heart size={16} fill={track.favorite ? '#00ff88' : 'none'} className={track.favorite ? 'text-[#00ff88]' : ''} />
      </button>
      <button onClick={handleShare} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-colors opacity-0 group-hover:opacity-100">
        <Share2 size={16} />
      </button>
      <button
        onClick={() => { removeTrack(track.id); showToast(t('delete'), 'info'); }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-6">
      <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2 mb-6">
        <Music size={24} className="text-[#00ff88]" />
        {t('myMusic')}
      </h1>

      {/* Search + sort */}
      <div className="flex gap-3 mb-4">
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
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="glass-card rounded-xl px-3 py-2.5 text-sm text-white outline-none cursor-pointer"
        >
          <option value="date">{t('sortDate')}</option>
          <option value="title">{t('sortTitle')}</option>
          <option value="artist">{t('sortArtist')}</option>
          <option value="album">{t('sortAlbum')}</option>
          <option value="plays">{t('sortPlays')}</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active ? 'neon-bg' : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {displayTracks.length === 0 ? (
        <div className="text-center py-20">
          <Music size={48} className="mx-auto text-gray-600 mb-4" />
          {activeTab === 'favorites' ? (
            <>
              <p className="text-gray-400 text-lg mb-2">{t('noFavorites')}</p>
              <p className="text-gray-500 text-sm">{t('noFavoritesDesc')}</p>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-lg mb-2">{t('noMusic')}</p>
              <p className="text-gray-500 text-sm">{t('noMusicDesc')}</p>
            </>
          )}
        </div>
      ) : activeTab === 'artists' || activeTab === 'albums' || activeTab === 'folders' ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([name, tracks]) => (
            <div key={name}>
              <div className="flex items-center gap-2 mb-3">
                {activeTab === 'artists' && <User size={18} className="text-[#00ff88]" />}
                {activeTab === 'albums' && <Disc size={18} className="text-[#00ff88]" />}
                {activeTab === 'folders' && <Folder size={18} className="text-[#00ff88]" />}
                <h3 className="font-display font-semibold text-sm text-white">{name}</h3>
                <span className="text-xs text-gray-500">({tracks.length})</span>
              </div>
              <div className="space-y-1">
                {tracks.map((track, i) => renderTrack(track, i))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {displayTracks.map((track, i) => renderTrack(track, i))}
        </div>
      )}
    </div>
  );
}
