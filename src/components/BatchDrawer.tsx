import React, { useRef } from 'react';
import { PhotoItem } from '../types';
import { Plus, Trash2, CheckCheck, Sparkles } from 'lucide-react';
import { isRawFile, isSupportedFormat } from '../utils/exif';

interface BatchDrawerProps {
  photos: PhotoItem[];
  currentPhotoId: string;
  isProcessing: boolean;
  batchProgress: number;
  onSelectPhoto: (id: string) => void;
  onRemovePhoto: (id: string) => void;
  onAddPhotos: (files: FileList) => void;
  onApplyCurrentToAll: () => void;
  onLoadSamples: () => void;
  onShowToast: (text: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export const BatchDrawer: React.FC<BatchDrawerProps> = ({
  photos,
  currentPhotoId,
  isProcessing,
  batchProgress,
  onSelectPhoto,
  onRemovePhoto,
  onAddPhotos,
  onApplyCurrentToAll,
  onLoadSamples,
  onShowToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = e.target.files;
    let hasRaw = false;
    let hasValid = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (isRawFile(file)) {
        hasRaw = true;
      } else if (isSupportedFormat(file)) {
        hasValid = true;
      }
    }

    if (hasRaw) {
      onShowToast('本工具暂不支持 RAW 格式文件，仅支持导入 JPG 和 PNG 格式照片', 'error');
    }

    if (hasValid) {
      onAddPhotos(files);
    }

    e.target.value = '';
  };

  return (
    <div className="h-20 bg-white/80 backdrop-blur-2xl border-t border-stone-200/50 px-4 flex items-center justify-between gap-4 shrink-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.015)] transition-all">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Left: Queue Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-white/80 hover:bg-white border border-stone-200/80 rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          title="支持 JPG / PNG 格式"
        >
          <Plus className="w-3.5 h-3.5 text-rose-500" />
          <span>添加照片</span>
        </button>

        {photos.length > 1 && (
          <button
            onClick={onApplyCurrentToAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white/70 hover:bg-white border border-stone-200/70 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="将当前选中的边框模板与参数应用至队列中的所有照片"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>应用至全部</span>
          </button>
        )}

        {photos.length === 0 && (
          <button
            onClick={onLoadSamples}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/70 rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>载入示例样张</span>
          </button>
        )}
      </div>

      {/* Middle: Thumbnails List */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-thin">
        {photos.map(photo => {
          const isCurrent = photo.id === currentPhotoId;
          return (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo.id)}
              className={`group relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 max-w-[210px] backdrop-blur-sm ${
                isCurrent
                  ? 'bg-white border-rose-400 shadow-xs ring-2 ring-rose-400/20'
                  : 'bg-white/70 border-stone-200/70 hover:bg-white hover:border-stone-300 shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Thumbnail Image */}
              <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200/70 shadow-2xs">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Info */}
              <div className="min-w-0 pr-4">
                <p className="text-[11px] font-semibold text-stone-800 truncate leading-snug">
                  {photo.name}
                </p>
                <p className="text-[10px] text-stone-500 truncate font-mono">
                  {photo.exif.model || photo.exif.make || 'Camera'}
                </p>
              </div>

              {/* Remove button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  onRemovePhoto(photo.id);
                }}
                className="absolute top-1 right-1 p-1 text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-stone-100 cursor-pointer"
                title="移除此图片"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Right: Progress Indicator if batch processing */}
      {isProcessing && (
        <div className="flex items-center gap-2 shrink-0 bg-white/80 px-3 py-1.5 rounded-xl border border-stone-200/70 shadow-xs">
          <div className="w-20 h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-150"
              style={{ width: `${batchProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-stone-700 font-semibold tabular-nums">
            {batchProgress}%
          </span>
        </div>
      )}
    </div>
  );
};
