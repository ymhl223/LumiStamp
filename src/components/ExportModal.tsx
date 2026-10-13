import React from 'react';
import { PhotoItem } from '../types';
import { Download, Archive, X, Sparkles, Check, Info } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  mode: 'single' | 'batch';
  currentPhoto: PhotoItem | null;
  photoCount: number;
  templateName: string;
  quality: number; // 0.7 - 1.0
  onQualityChange: (q: number) => void;
  onConfirm: (quality: number) => void;
  onClose: () => void;
  isProcessing: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  mode,
  currentPhoto,
  photoCount,
  templateName,
  quality,
  onQualityChange,
  onConfirm,
  onClose,
  isProcessing
}) => {
  if (!isOpen) return null;

  const isPng = currentPhoto?.name.toLowerCase().endsWith('.png') || false;

  // Calculate estimated file size
  const getEstimatedSizeMB = (q: number): { sizeText: string; note: string } => {
    if (isPng) {
      return {
        sizeText: '约 6 ~ 12 MB',
        note: 'PNG 为无损压缩格式，画质参数不改变体积'
      };
    }

    if (!currentPhoto) return { sizeText: '未知', note: '' };

    // Estimation based on resolution and JPEG compression curve
    const megapixels = (currentPhoto.width * currentPhoto.height) / 1_000_000;
    
    // Non-linear JPEG file size multiplier by quality factor
    // At q=1.0: ~0.45MB per megapixel (e.g. 24MP -> 11~13MB)
    // At q=0.92: ~0.22MB per megapixel (e.g. 24MP -> 5~6MB)
    // At q=0.85: ~0.12MB per megapixel (e.g. 24MP -> 2.8~3.2MB)
    // At q=0.75: ~0.08MB per megapixel (e.g. 24MP -> 1.8~2.2MB)
    let bppMultiplier = 0.22;
    if (q >= 0.98) {
      bppMultiplier = 0.48;
    } else if (q >= 0.95) {
      bppMultiplier = 0.32;
    } else if (q >= 0.90) {
      bppMultiplier = 0.22 * Math.pow(q / 0.92, 3);
    } else if (q >= 0.80) {
      bppMultiplier = 0.13 * Math.pow(q / 0.85, 2.5);
    } else {
      bppMultiplier = 0.08 * Math.pow(q / 0.75, 2);
    }

    const singleEstimated = Math.max(0.5, megapixels * bppMultiplier);

    if (mode === 'batch') {
      const totalEstimated = singleEstimated * photoCount;
      return {
        sizeText: `约 ${totalEstimated.toFixed(1)} MB (共${photoCount}张)`,
        note: `单张平均约 ${singleEstimated.toFixed(1)} MB`
      };
    }

    return {
      sizeText: `约 ${singleEstimated.toFixed(1)} MB`,
      note: q >= 0.98 ? '高精度量化表，文件体积明显增大' : '视觉无损，对齐相机原生直出体积'
    };
  };

  const estimated = getEstimatedSizeMB(quality);
  const qualityPercent = Math.round(quality * 100);

  const presets = [
    {
      label: '92% 推荐',
      desc: '视觉无损 · 相机原生',
      value: 0.92,
      recommended: true
    },
    {
      label: '100% 极限',
      desc: '零量化 · 全细节',
      value: 1.0,
      recommended: false
    },
    {
      label: '85% 轻量',
      desc: '体积减半 · 社交发布',
      value: 0.85,
      recommended: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      {/* Frosted Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/35 backdrop-blur-md transition-opacity"
        onClick={!isProcessing ? onClose : undefined}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg max-h-[90dvh] flex flex-col bg-white/95 backdrop-blur-2xl border border-stone-200/80 rounded-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.18)] p-4 sm:p-6 overflow-hidden z-10 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-200/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-500 shadow-xs shrink-0">
              {mode === 'batch' ? (
                <Archive className="w-4 h-4 text-amber-600" />
              ) : (
                <Download className="w-4 h-4 text-rose-500" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                {mode === 'batch' ? `批量打包导出 (${photoCount} 张)` : '导出照片画质确认'}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                边框样式：<span className="font-medium text-stone-700">{templateName}</span>
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* Quality Presets */}
          {!isPng && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-800">
                  压缩画质与体积方案
                </label>
                <span className="text-xs font-mono font-bold text-rose-600 tabular-nums">
                  {qualityPercent}% 质量
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {presets.map(preset => {
                  const isSelected = Math.abs(quality - preset.value) < 0.015;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => onQualityChange(preset.value)}
                      className={`p-2 sm:p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative min-h-[60px] ${
                        isSelected
                          ? 'bg-rose-50/70 border-rose-400 text-stone-900 shadow-xs ring-1 ring-rose-400/25'
                          : 'bg-white/70 hover:bg-white border-stone-200/70 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-bold">{preset.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-rose-500" />}
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-stone-500 block mt-0.5 sm:mt-1 leading-snug">
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Slider */}
              <div className="mt-3 pt-2.5 border-t border-stone-100">
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5 font-medium">
                  <span>细致微调</span>
                  <span className="font-mono text-stone-700">{qualityPercent}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="100"
                  step="1"
                  value={qualityPercent}
                  onChange={e => onQualityChange(Number(e.target.value) / 100)}
                  className="w-full accent-rose-500 cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                  <span>70% 紧凑</span>
                  <span>85% 轻量</span>
                  <span className="text-rose-500 font-semibold">92% 推荐</span>
                  <span>100% 极限</span>
                </div>
              </div>
            </div>
          )}

          {/* Size Estimation Card */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 flex items-start gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center shrink-0 text-amber-500 shadow-2xs mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-stone-800">预估文件体积</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-stone-900 tabular-nums">
                  {estimated.sizeText}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                {estimated.note}
              </p>
            </div>
          </div>

          {/* Resolution & Specs note */}
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-stone-500 bg-white/60 p-2 sm:p-2.5 rounded-xl border border-stone-200/50">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <div className="truncate">
              <span>分辨率保持 100% 全画幅原始输出</span>
              {currentPhoto && (
                <span className="ml-1 font-mono text-stone-700 tabular-nums">
                  ({currentPhoto.width} × {currentPhoto.height} px 原片)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200/60 shrink-0">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all cursor-pointer disabled:opacity-50 min-h-[44px] flex items-center justify-center"
          >
            取消
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onConfirm(quality)}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 rounded-xl transition-all shadow-sm shadow-rose-500/25 cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            {isProcessing ? (
              <span>正在处理中...</span>
            ) : mode === 'batch' ? (
              <>
                <Archive className="w-3.5 h-3.5" />
                <span>确认打包 ZIP ({photoCount}张)</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>立即下载照片</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
