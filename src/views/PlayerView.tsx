import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, Minimize, Gauge, Repeat, Shuffle,
} from 'lucide-react';
import { useApp } from '@/store';

export function PlayerView() {
  const { selectedContent, navigate, t, settings, content, setPlayingContent } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [speed, setSpeed] = useState(settings.playbackSpeed);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const controlsTimer = useRef<number | undefined>(undefined);

  const item = selectedContent;

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }
  }, [playing]);

  const skip = (delta: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * duration;
  };

  const handleVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pct);
    v.volume = pct;
    setMuted(pct === 0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(speed);
    const next = speeds[(idx + 1) % speeds.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onDur = () => setDuration(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('durationchange', onDur);
    v.addEventListener('loadedmetadata', onDur);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('playing', onPlaying);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('durationchange', onDur);
      v.removeEventListener('loadedmetadata', onDur);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('playing', onPlaying);
    };
  }, []);

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const showControlsTemp = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = window.setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  if (!item) {
    navigate('home');
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-6">
      <button
        onClick={() => navigate('detail')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">{t('close')}</span>
      </button>

      {/* Player */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden bg-black aspect-video group"
        onMouseMove={showControlsTemp}
        onMouseLeave={() => playing && setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={item.thumbnail}
          onClick={togglePlay}
          autoPlay={settings.autoplay}
          playsInline
        >
          <source src={item.videoUrl || ''} type="video/mp4" />
        </video>

        {/* Buffering spinner */}
        {buffering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 border-3 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin-slow" />
          </div>
        )}

        {/* Center play/pause */}
        {!playing && !buffering && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full neon-bg flex items-center justify-center scale-90 hover:scale-100 transition-transform">
              <Play size={32} fill="black" className="text-black ml-1" />
            </div>
          </button>
        )}

        {/* Controls overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top gradient */}
          <div className="bg-gradient-to-b from-black/70 to-transparent p-4">
            <h3 className="text-white text-sm font-medium line-clamp-1">{item.title}</h3>
            <p className="text-gray-400 text-xs">{item.channel}</p>
          </div>

          {/* Bottom controls */}
          <div className="bg-gradient-to-t from-black/80 to-transparent p-4 space-y-3">
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white font-mono w-12 text-right">{formatTime(currentTime)}</span>
              <div
                onClick={handleSeek}
                className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer group/bar relative"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-[#00ff88] rounded-full"
                  style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(0,255,136,0.5)' }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#00ff88] rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity"
                  style={{ left: `${progress}%`, marginLeft: '-6px', boxShadow: '0 0 6px rgba(0,255,136,0.6)' }}
                />
              </div>
              <span className="text-xs text-gray-400 font-mono w-12">{formatTime(duration)}</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => skip(-10)} className="text-white hover:text-[#00ff88] transition-colors" title={t('skipBack')}>
                  <SkipBack size={20} fill="currentColor" />
                </button>
                <button onClick={togglePlay} className="text-white hover:text-[#00ff88] transition-colors">
                  {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button onClick={() => skip(10)} className="text-white hover:text-[#00ff88] transition-colors" title={t('skipForward')}>
                  <SkipForward size={20} fill="currentColor" />
                </button>
                <button onClick={() => setMuted(!muted)} className="text-white hover:text-[#00ff88] transition-colors">
                  {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                {/* Volume bar */}
                <div
                  onClick={handleVolume}
                  className="hidden sm:block w-20 h-1.5 bg-white/20 rounded-full cursor-pointer"
                >
                  <div
                    className="h-full bg-[#00ff88] rounded-full"
                    style={{ width: `${muted ? 0 : volume * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setShowSpeed(!showSpeed)}
                    className="text-white hover:text-[#00ff88] transition-colors flex items-center gap-1"
                  >
                    <Gauge size={18} />
                    <span className="text-xs font-mono">{speed}x</span>
                  </button>
                  {showSpeed && (
                    <div className="absolute bottom-8 right-0 glass-card rounded-lg p-2 space-y-1 animate-scaleIn">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            setSpeed(s);
                            if (videoRef.current) videoRef.current.playbackRate = s;
                            setShowSpeed(false);
                          }}
                          className={`block w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                            speed === s ? 'neon-text' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="text-white hover:text-[#00ff88] transition-colors hidden sm:block">
                  <Repeat size={18} />
                </button>
                <button className="text-white hover:text-[#00ff88] transition-colors hidden sm:block">
                  <Shuffle size={18} />
                </button>
                <button onClick={toggleFullscreen} className="text-white hover:text-[#00ff88] transition-colors">
                  {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Now playing info */}
      <div className="mt-6 glass-card rounded-xl p-4">
        <div className="flex items-start gap-4">
          <img src={item.thumbnail} alt="" className="w-24 h-24 rounded-lg object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#00ff88] uppercase tracking-wider mb-1">{t('nowPlaying')}</p>
            <h2 className="font-display font-semibold text-lg text-white mb-1 line-clamp-2">{item.title}</h2>
            <p className="text-sm text-gray-400">{item.channel}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>{item.views} {t('views')}</span>
              <span>·</span>
              <span>{item.duration}</span>
              <span>·</span>
              <span className="uppercase">{item.source}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
