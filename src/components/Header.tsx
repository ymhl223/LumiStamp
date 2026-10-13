import React from 'react';
import { Download, Archive, RefreshCw, Sparkles, Upload } from 'lucide-react';

interface HeaderProps {
  photoCount: number;
  isProcessing: boolean;
  onExportCurrent: () => void;
  onExportBatch: () => void;
  onLoadSamples: () => void;
  onTriggerUpload: () => void;
  onResetSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  photoCount,
  isProcessing,
  onExportCurrent,
  onExportBatch,
  onLoadSamples,
  onTriggerUpload,
  onResetSettings
}) => {
  return (
    <header className="h-14 border-b border-stone-200/50 bg-white/80 backdrop-blur-2xl px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-6 shrink-0 z-30 transition-all shadow-[0_1px_12px_rgba(0,0,0,0.015)]">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-300 flex items-center justify-center font-bold text-white text-xs shadow-sm shadow-rose-500/20 ring-1 ring-white/60">
          LS
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-stone-900 leading-none">
            拾光印相
          </span>
          <span className="hidden sm:inline text-[10px] font-medium tracking-wider text-stone-400 uppercase leading-tight mt-0.5">
            LumiStamp Studio
          </span>
        </div>
      </div>

      {/* Zone 2: Desktop Navigation & Quick Actions */}
      <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-stone-600">
        <button
          onClick={onTriggerUpload}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-stone-100/70 hover:text-stone-900 transition-all whitespace-nowrap cursor-pointer text-stone-600"
        >
          <Upload className="w-3.5 h-3.5 text-rose-500/80" />
          <span>导入照片</span>
        </button>

        <button
          onClick={onLoadSamples}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-stone-100/70 hover:text-stone-900 transition-all whitespace-nowrap cursor-pointer text-stone-600"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>精选样张</span>
        </button>

        <button
          onClick={onResetSettings}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-stone-100/70 hover:text-stone-900 transition-all whitespace-nowrap cursor-pointer text-stone-600"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
          <span>恢复默认版式</span>
        </button>

        <div className="flex items-center gap-2 text-stone-400 font-normal pl-2 border-l border-stone-200/60">
          <span className="text-[11px]">原画无损</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-[11px]">纯前端安全</span>
        </div>
      </nav>

      {/* Zone 3: Actions (Responsive for mobile & desktop) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Mobile Quick Upload & Sample Buttons */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={onTriggerUpload}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="导入照片"
          >
            <Upload className="w-4 h-4 text-rose-500" />
          </button>
          <button
            onClick={onLoadSamples}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="精选样张"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>
        </div>

        {photoCount > 1 && (
          <button
            onClick={onExportBatch}
            disabled={isProcessing}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white/90 hover:bg-white border border-stone-200/80 rounded-xl transition-all whitespace-nowrap disabled:opacity-50 cursor-pointer shadow-xs hover:shadow-sm backdrop-blur-md min-h-[38px]"
          >
            <Archive className="w-3.5 h-3.5 text-amber-600" />
            <span>打包 ({photoCount})</span>
          </button>
        )}

        <button
          onClick={onExportCurrent}
          disabled={isProcessing || photoCount === 0}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 rounded-xl transition-all shadow-sm shadow-rose-500/20 whitespace-nowrap disabled:opacity-50 cursor-pointer min-h-[38px]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isProcessing ? '生成中...' : '导出照片'}</span>
        </button>
      </div>
    </header>
  );
};
