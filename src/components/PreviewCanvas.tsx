import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PhotoItem, WatermarkTemplate, FrameSettings } from '../types';
import { renderPhotoCanvas, RenderResult } from '../utils/renderer';
import { Maximize2, Move, RotateCcw } from 'lucide-react';

interface PreviewCanvasProps {
  currentPhoto: PhotoItem | null;
  template: WatermarkTemplate;
  settings: FrameSettings;
  onUpdateSettings: (newSettings: Partial<FrameSettings>) => void;
  onTriggerUpload: () => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  currentPhoto,
  template,
  settings,
  onUpdateSettings,
  onTriggerUpload
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState<'fit' | '100'>('fit');
  const [isRendering, setIsRendering] = useState(false);
  const [canvasResolution, setCanvasResolution] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; initialOffsetX: number; initialOffsetY: number }>({
    x: 0,
    y: 0,
    initialOffsetX: 0,
    initialOffsetY: 0
  });

  const imageElementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!currentPhoto) {
      imageElementRef.current = null;
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentPhoto.url;
    img.onload = () => {
      imageElementRef.current = img;
      renderCurrent();
    };
  }, [currentPhoto?.url]);

  const renderCurrent = useCallback(async () => {
    if (!imageElementRef.current || !currentPhoto || !canvasRef.current) return;

    setIsRendering(true);
    try {
      const result: RenderResult = await renderPhotoCanvas({
        img: imageElementRef.current,
        template,
        settings,
        exif: currentPhoto.exif,
        forExport: false,
        maxDimension: 1920
      });

      const targetCanvas = canvasRef.current;
      targetCanvas.width = result.canvas.width;
      targetCanvas.height = result.canvas.height;
      const ctx = targetCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
        ctx.drawImage(result.canvas, 0, 0);
      }

      setCanvasResolution({
        width: result.canvas.width,
        height: result.canvas.height
      });
    } catch (err) {
      console.error('Render preview error:', err);
    } finally {
      setIsRendering(false);
    }
  }, [currentPhoto, template, settings]);

  useEffect(() => {
    renderCurrent();
  }, [renderCurrent]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialOffsetX: settings.watermarkOffsetX || 0,
      initialOffsetY: settings.watermarkOffsetY || 0
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleFactor = canvasRef.current.width / rect.width;

    const deltaClientX = (e.clientX - dragStart.x) * scaleFactor;
    const deltaClientY = (e.clientY - dragStart.y) * scaleFactor;

    onUpdateSettings({
      watermarkOffsetX: Math.round(dragStart.initialOffsetX + deltaClientX),
      watermarkOffsetY: Math.round(dragStart.initialOffsetY + deltaClientY)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
      initialOffsetX: settings.watermarkOffsetX || 0,
      initialOffsetY: settings.watermarkOffsetY || 0
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleFactor = canvasRef.current.width / rect.width;

    const deltaClientX = (touch.clientX - dragStart.x) * scaleFactor;
    const deltaClientY = (touch.clientY - dragStart.y) * scaleFactor;

    onUpdateSettings({
      watermarkOffsetX: Math.round(dragStart.initialOffsetX + deltaClientX),
      watermarkOffsetY: Math.round(dragStart.initialOffsetY + deltaClientY)
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleResetPosition = () => {
    onUpdateSettings({
      watermarkOffsetX: 0,
      watermarkOffsetY: 0
    });
  };

  if (!currentPhoto) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center bg-[#FAF9F5] border border-dashed border-stone-200/80 rounded-3xl m-3 md:m-6 backdrop-blur-sm">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-stone-200/60 flex items-center justify-center text-stone-400 mb-4 shadow-sm shadow-stone-200/40">
          <Move className="w-6 h-6 md:w-7 md:h-7 text-stone-400" />
        </div>
        <h3 className="text-sm md:text-base font-semibold text-stone-900 mb-1">
          尚未选择或导入照片
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mb-5 leading-relaxed">
          导入 JPG / PNG 格式照片，自动读取 EXIF 相机参数；或点击加载样张立即体验。
        </p>
        <button
          onClick={onTriggerUpload}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm shadow-rose-500/20 transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
        >
          导入照片 (JPG / PNG)
        </button>
      </div>
    );
  }

  const hasOffset = settings.watermarkOffsetX !== 0 || settings.watermarkOffsetY !== 0;

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col min-h-0 relative bg-[#F7F6F2] overflow-hidden select-none transition-colors"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-2.5 md:top-4 left-3 md:left-6 right-3 md:right-6 z-20 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
        {/* Photo Info Banner */}
        <div className="pointer-events-auto flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-xl bg-white/90 border border-white/80 backdrop-blur-2xl text-[11px] md:text-xs text-stone-700 shadow-sm shadow-stone-300/30 max-w-[220px] sm:max-w-none">
          <span className="font-semibold text-stone-900 truncate max-w-[100px] sm:max-w-[180px]">{currentPhoto.name}</span>
          <span className="text-stone-300" aria-hidden="true">·</span>
          <span className="font-mono text-stone-500 tabular-nums text-[10px] sm:text-xs">
            {currentPhoto.width} × {currentPhoto.height}
          </span>
          {canvasResolution.width > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1">
              <span className="text-stone-300" aria-hidden="true">→</span>
              <span className="font-mono text-rose-600 font-semibold tabular-nums text-[10px] sm:text-xs">
                {canvasResolution.width} × {canvasResolution.height}
              </span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1 p-0.5 md:p-1 rounded-xl bg-white/90 border border-white/80 backdrop-blur-2xl shadow-sm shadow-stone-300/30">
          {hasOffset && (
            <button
              onClick={handleResetPosition}
              className="flex items-center gap-1 px-2 py-1 text-[11px] md:text-xs font-medium text-amber-900 bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 rounded-lg transition-colors cursor-pointer mr-0.5"
              title="复位水印到模板默认位置"
            >
              <RotateCcw className="w-3 h-3 text-amber-600" />
              <span className="hidden sm:inline">复位位置</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-0.5 text-xs text-stone-500 px-1 font-mono">
            <Move className="w-3.5 h-3.5 text-stone-400 mr-1" />
            <span className="text-[11px] text-stone-500">可拖拽水印</span>
          </div>

          <div className="hidden sm:block w-[1px] h-3 bg-stone-200/70 mx-1" />

          <button
            onClick={() => setZoomLevel('fit')}
            className={`px-2 md:px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer min-h-[32px] flex items-center justify-center ${
              zoomLevel === 'fit' ? 'bg-stone-200/70 text-stone-900 font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
            title="适应视图"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(zoomLevel === '100' ? 'fit' : '100')}
            className={`px-2 md:px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer min-h-[32px] flex items-center justify-center ${
              zoomLevel === '100' ? 'bg-stone-200/70 text-stone-900 font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
          >
            100%
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-auto relative">
        {/* Warm daylight studio grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#d1cfc9_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        <div className="relative flex items-center justify-center max-w-full max-h-full">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{
              maxHeight: zoomLevel === 'fit' ? 'calc(100dvh - 200px)' : 'none',
              maxWidth: zoomLevel === 'fit' ? '100%' : 'none',
              width: zoomLevel === 'fit' ? 'auto' : zoomLevel === '100' ? `${canvasResolution.width}px` : 'auto',
              touchAction: 'none'
            }}
            className={`shadow-[0_16px_50px_-10px_rgba(0,0,0,0.10)] rounded-sm transition-transform duration-75 block select-none bg-white ${
              isDragging ? 'cursor-grabbing ring-2 ring-rose-400/60' : 'cursor-grab'
            }`}
          />

          {/* Dragging guide hint */}
          {hasOffset && (
            <div className="absolute bottom-2 left-2 md:bottom-3 md:left-4 text-[10px] md:text-[11px] font-mono text-amber-900 bg-white/95 px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg border border-amber-300/80 shadow-sm backdrop-blur-md pointer-events-none tabular-nums">
              X: {settings.watermarkOffsetX > 0 ? `+${settings.watermarkOffsetX}` : settings.watermarkOffsetX}px · Y:{' '}
              {settings.watermarkOffsetY > 0 ? `+${settings.watermarkOffsetY}` : settings.watermarkOffsetY}px
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
