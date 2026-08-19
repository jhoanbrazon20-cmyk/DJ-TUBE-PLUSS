import { useState, useEffect } from 'react';
import {
  Pause, Play, X, RotateCcw, FolderOpen, Share2, Trash2,
  Download, CheckCircle, AlertCircle, Loader,
} from 'lucide-react';
import { useApp } from '@/store';
import type { DownloadCategory, DownloadItem } from '@/types';

export function DownloadsView() {
  const { downloads, updateDownload, removeDownload, clearDownloads, t, showToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<DownloadCategory>('in_progress');

  // Simulate download progress
  useEffect(() => {
    const interval = setInterval(() => {
      downloads.forEach(d => {
        if (d.status === 'in_progress' && d.progress < 100) {
          const newProgress = Math.min(100, d.progress + Math.random() * 8 + 2);
          const speed = `${(Math.random() * 5 + 1).toFixed(1)} MB/s`;
          const remaining = ((100 - newProgress) / 100) * d.sizeBytes;
          const timeRem = remaining > 0
            ? `${Math.floor(remaining / 5000000)}:${String(Math.floor((remaining % 5000000) / 83333)).padStart(2, '0')}`
            : '0:00';
          updateDownload(d.id, {
            progress: newProgress,
            speed,
            timeRemaining: timeRem,
          });
          if (newProgress >= 100) {
            updateDownload(d.id, { status: 'completed', progress: 100, speed: '0 MB/s', timeRemaining: '0:00' });
            showToast(t('downloadCompleted'), 'success');
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [downloads, updateDownload, showToast, t]);

  const categories: { key: DownloadCategory; label: string; icon: typeof Download }[] = [
    { key: 'in_progress', label: t('inProgress'), icon: Loader },
    { key: 'completed', label: t('completed'), icon: CheckCircle },
    { key: 'paused', label: t('paused'), icon: Pause },
    { key: 'cancelled', label: t('cancelled'), icon: X },
    { key: 'failed', label: t('failed'), icon: AlertCircle },
  ];

  const filtered = downloads.filter(d => d.status === activeCategory);
  const counts = categories.reduce((acc, c) => {
    acc[c.key] = downloads.filter(d => d.status === c.key).length;
    return acc;
  }, {} as Record<DownloadCategory, number>);

  const handlePause = (d: DownloadItem) => {
    updateDownload(d.id, { status: 'paused' });
    showToast(t('downloadPaused'), 'info');
  };

  const handleResume = (d: DownloadItem) => {
    updateDownload(d.id, { status: 'in_progress' });
    showToast(t('downloadStarted'), 'info');
  };

  const handleCancel = (d: DownloadItem) => {
    updateDownload(d.id, { status: 'cancelled' });
    showToast(t('downloadCancelled'), 'info');
  };

  const handleRetry = (d: DownloadItem) => {
    updateDownload(d.id, { status: 'in_progress', progress: 0 });
    showToast(t('downloadStarted'), 'info');
  };

  const handleDelete = (d: DownloadItem) => {
    removeDownload(d.id);
    showToast(t('delete'), 'info');
  };

  const handleOpen = (d: DownloadItem) => {
    showToast(t('open'), 'info');
  };

  const handleShare = (d: DownloadItem) => {
    showToast(t('share'), 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Download size={24} className="text-[#00ff88]" />
          {t('myDownloads')}
        </h1>
        {downloads.length > 0 && (
          <button
            onClick={() => { clearDownloads(); showToast(t('clearAll'), 'info'); }}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <Trash2 size={14} />
            {t('clearAll')}
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {categories.map(c => {
          const Icon = c.icon;
          const active = activeCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'neon-bg'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {c.label}
              {counts[c.key] > 0 && (
                <span className={`text-xs px-1.5 rounded-full ${active ? 'bg-black/20' : 'bg-white/10'}`}>
                  {counts[c.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Download list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Download size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg mb-2">{t('noDownloads')}</p>
          <p className="text-gray-500 text-sm">{t('noDownloadsDesc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => (
            <div key={d.id} className="glass-card rounded-xl p-4 animate-fadeInUp">
              <div className="flex gap-3">
                {/* Thumbnail */}
                <img src={d.thumbnail} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white line-clamp-2 mb-1">{d.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="uppercase">{d.format}</span>
                    <span>·</span>
                    <span>{d.quality}</span>
                    <span>·</span>
                    <span>{d.size}</span>
                  </div>

                  {/* Progress bar */}
                  {d.status === 'in_progress' && (
                    <div className="mb-2">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-neon rounded-full transition-all duration-500"
                          style={{ width: `${d.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                        <span>{d.speed}</span>
                        <span>{Math.round(d.progress)}% · {d.timeRemaining}</span>
                      </div>
                    </div>
                  )}

                  {d.status === 'completed' && (
                    <div className="flex items-center gap-1.5 text-xs text-[#00ff88] mb-2">
                      <CheckCircle size={14} />
                      {t('completed')}
                    </div>
                  )}

                  {(d.status === 'paused' || d.status === 'cancelled' || d.status === 'failed') && (
                    <div className="text-xs text-gray-500 mb-2">
                      {d.status === 'paused' && t('paused')}
                      {d.status === 'cancelled' && t('cancelled')}
                      {d.status === 'failed' && t('failed')}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    {d.status === 'in_progress' && (
                      <button onClick={() => handlePause(d)} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-colors">
                        <Pause size={14} />
                      </button>
                    )}
                    {d.status === 'paused' && (
                      <button onClick={() => handleResume(d)} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-colors">
                        <Play size={14} />
                      </button>
                    )}
                    {(d.status === 'in_progress' || d.status === 'paused') && (
                      <button onClick={() => handleCancel(d)} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    )}
                    {(d.status === 'failed' || d.status === 'cancelled') && (
                      <button onClick={() => handleRetry(d)} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-colors">
                        <RotateCcw size={14} />
                      </button>
                    )}
                    {d.status === 'completed' && (
                      <>
                        <button onClick={() => handleOpen(d)} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-colors">
                          <FolderOpen size={14} />
                        </button>
                        <button onClick={() => handleShare(d)} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-[#00ff88] transition-colors">
                          <Share2 size={14} />
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(d)} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors ml-auto">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
