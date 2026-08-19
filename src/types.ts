export type ContentType = 'video' | 'music' | 'playlist' | 'channel' | 'short';
export type DownloadStatus = 'in_progress' | 'completed' | 'paused' | 'cancelled' | 'failed';
export type MediaFormat = 'mp4' | 'webm' | 'mp3' | 'aac' | 'wav' | 'flac';
export type ThemeMode = 'dark' | 'light' | 'auto';
export type Language = 'es' | 'en';
export type LibraryTab = 'songs' | 'artists' | 'albums' | 'folders' | 'recent' | 'favorites';
export type VideoSort = 'recent' | 'name' | 'size' | 'quality' | 'duration';
export type DownloadCategory = 'in_progress' | 'completed' | 'paused' | 'cancelled' | 'failed';

export interface MediaQuality {
  label: string;
  resolution: string;
  available: boolean;
}

export interface AudioFormat {
  format: MediaFormat;
  bitrate: string;
  available: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  channel: string;
  channelAvatar?: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  type: ContentType;
  views: string;
  publishedAt: string;
  description: string;
  qualities: MediaQuality[];
  audioFormats: AudioFormat[];
  downloadable: boolean;
  source: 'youtube' | 'tiktok' | 'facebook' | 'local';
  videoUrl?: string;
}

export interface DownloadItem {
  id: string;
  contentId: string;
  title: string;
  thumbnail: string;
  format: MediaFormat;
  quality: string;
  size: string;
  sizeBytes: number;
  speed: string;
  progress: number;
  timeRemaining: string;
  status: DownloadStatus;
  source: string;
  createdAt: number;
  type: ContentType;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  favorite: boolean;
  folder: string;
  addedAt: number;
  plays: number;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  size: string;
  sizeBytes: number;
  quality: string;
  duration: string;
  durationSeconds: number;
  addedAt: number;
  format: MediaFormat;
}

export interface AppSettings {
  theme: ThemeMode;
  language: Language;
  downloadFolder: string;
  wifiOnly: boolean;
  maxConcurrentDownloads: number;
  defaultQuality: string;
  defaultFormat: MediaFormat;
  autoplay: boolean;
  backgroundPlayback: boolean;
  playbackSpeed: number;
}

export type ViewName =
  | 'splash'
  | 'home'
  | 'search'
  | 'downloads'
  | 'music'
  | 'videos'
  | 'settings'
  | 'detail'
  | 'player';
