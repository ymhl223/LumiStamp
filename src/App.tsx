import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { PhotoItem, WatermarkTemplate, FrameSettings, ToastMessage, ExifData } from './types';
import { TEMPLATES } from './constants/templates';
import { SAMPLE_PHOTOS } from './constants/samples';
import { parsePhotoExif, isRawFile, isSupportedFormat } from './utils/exif';
import { renderPhotoCanvas } from './utils/renderer';
import { Header } from './components/Header';
import { PreviewCanvas } from './components/PreviewCanvas';
import { TemplateSelector } from './components/TemplateSelector';
import { ExifEditor } from './components/ExifEditor';
import { StyleControls } from './components/StyleControls';
import { BatchDrawer } from './components/BatchDrawer';
import { Toast } from './components/Toast';
import { ExportModal } from './components/ExportModal';
import { LayoutTemplate, Camera, Sliders, Layers, X, Plus, Trash2, CheckCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [photos, setPhotos] = useState<PhotoItem[]>(SAMPLE_PHOTOS);
  const [currentPhotoId, setCurrentPhotoId] = useState<string>(SAMPLE_PHOTOS[0].id);

  const [activeSidebarTab, setActiveSidebarTab] = useState<'templates' | 'exif' | 'styles'>('templates');
  const [mobileActiveSheet, setMobileActiveSheet] = useState<'templates' | 'exif' | 'styles' | 'photos' | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  // Export Modal state & quality preference (default 92% visual lossless)
  const [exportModalMode, setExportModalMode] = useState<'single' | 'batch' | null>(null);
  const [exportQuality, setExportQuality] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lumistamp_export_quality');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0.7 && val <= 1.0) return val;
      }
    } catch {
      // ignore
    }
    return 0.92;
  });

  const handleQualityChange = (q: number) => {
    setExportQuality(q);
    try {
      localStorage.setItem('lumistamp_export_quality', q.toString());
    } catch {
      // ignore
    }
  };

  const [isWindowDragOver, setIsWindowDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = (text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentPhoto = photos.find(p => p.id === currentPhotoId) || photos[0] || null;

  const currentTemplate =
    TEMPLATES.find(t => t.id === currentPhoto?.selectedTemplateId) || TEMPLATES[0];

  const currentSettings: FrameSettings = {
    ...currentTemplate.defaultSettings,
    ...(currentPhoto?.customSettings || {})
  };

  const handleUpdateSettings = (newSettings: Partial<FrameSettings>) => {
    if (!currentPhoto) return;
    setPhotos(prev =>
      prev.map(p => {
        if (p.id === currentPhoto.id) {
          return {
            ...p,
            customSettings: {
              ...(p.customSettings || {}),
              ...newSettings
            }
          };
        }
        return p;
      })
    );
  };

  const handleSelectTemplate = (template: WatermarkTemplate) => {
    if (!currentPhoto) return;
    setPhotos(prev =>
      prev.map(p => {
        if (p.id === currentPhoto.id) {
          return {
            ...p,
            selectedTemplateId: template.id,
            customSettings: {
              ...template.defaultSettings,
              watermarkOffsetX: 0,
              watermarkOffsetY: 0
            }
          };
        }
        return p;
      })
    );
  };

  const handleUpdateExif = (updated: Partial<ExifData>) => {
    if (!currentPhoto) return;
    setPhotos(prev =>
      prev.map(p => {
        if (p.id === currentPhoto.id) {
          return {
            ...p,
            exif: {
              ...p.exif,
              ...updated
            }
          };
        }
        return p;
      })
    );
  };

  const handleResetSettings = () => {
    if (!currentPhoto) return;
    setPhotos(prev =>
      prev.map(p => {
        if (p.id === currentPhoto.id) {
          return {
            ...p,
            customSettings: { ...currentTemplate.defaultSettings }
          };
        }
        return p;
      })
    );
    addToast('已恢复当前模板默认版式与位置', 'info');
  };

  const handleApplyCurrentToAll = () => {
    if (!currentPhoto) return;
    setPhotos(prev =>
      prev.map(p => ({
        ...p,
        selectedTemplateId: currentPhoto.selectedTemplateId,
        customSettings: { ...currentSettings }
      }))
    );
    addToast(`已将当前风格同步至全部 ${photos.length} 张照片`, 'success');
  };

  const handleLoadSamples = () => {
    setPhotos(SAMPLE_PHOTOS);
    setCurrentPhotoId(SAMPLE_PHOTOS[0].id);
    addToast('已载入精选样张，尽情体验各类边框与毛玻璃效果', 'success');
  };

  const handleAddFiles = async (files: FileList | File[]) => {
    const newItems: PhotoItem[] = [];
    let rawRejected = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (isRawFile(file)) {
        rawRejected++;
        continue;
      }
      if (!isSupportedFormat(file)) {
        continue;
      }

      const url = URL.createObjectURL(file);
      const exif = await parsePhotoExif(file);

      const img = new Image();
      img.src = url;
      await new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      newItems.push({
        id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        file,
        name: file.name,
        url,
        width: img.naturalWidth || 2048,
        height: img.naturalHeight || 1365,
        selectedTemplateId: currentTemplate.id,
        customSettings: { ...currentSettings },
        exif
      });
    }

    if (rawRejected > 0) {
      addToast(`已拦截 ${rawRejected} 个 RAW 格式文件，仅支持导入 JPG 和 PNG`, 'error');
    }

    if (newItems.length > 0) {
      setPhotos(prev => [...prev, ...newItems]);
      setCurrentPhotoId(newItems[0].id);
      addToast(`成功导入 ${newItems.length} 张照片，已自动读取相机参数`, 'success');
    }
  };

  const handleRemovePhoto = (id: string) => {
    const remaining = photos.filter(p => p.id !== id);
    setPhotos(remaining);
    if (currentPhotoId === id) {
      if (remaining.length > 0) {
        setCurrentPhotoId(remaining[0].id);
      }
    }
  };

  // Open Export Modal
  const handlePromptExportCurrent = () => {
    if (!currentPhoto) return;
    setExportModalMode('single');
  };

  const handlePromptExportBatch = () => {
    if (photos.length === 0) return;
    setExportModalMode('batch');
  };

  // Execute Single Export with chosen quality
  const executeExportCurrent = async (quality: number) => {
    if (!currentPhoto) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = currentPhoto.url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const result = await renderPhotoCanvas({
        img,
        template: currentTemplate,
        settings: currentSettings,
        exif: currentPhoto.exif,
        forExport: true,
        maxDimension: 0 // 100% full original resolution
      });

      const isPng = currentPhoto.name.toLowerCase().endsWith('.png');
      const mimeType = isPng ? 'image/png' : 'image/jpeg';
      const ext = isPng ? '.png' : '.jpg';

      result.canvas.toBlob(
        blob => {
          if (!blob) {
            addToast('导出图片生成失败', 'error');
            setIsProcessing(false);
            return;
          }

          const baseName = currentPhoto.name.replace(/\.[^/.]+$/, '');
          const downloadName = `${baseName}_LumiStamp_${currentTemplate.name}${ext}`;

          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = downloadName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);

          const qualityStr = isPng ? '无损' : `${Math.round(quality * 100)}%`;
          const sizeMB = (blob.size / (1024 * 1024)).toFixed(1);
          addToast(`导出成功: ${downloadName} (${qualityStr} · ${sizeMB} MB)`, 'success');
          setIsProcessing(false);
          setExportModalMode(null);
        },
        mimeType,
        quality
      );
    } catch (err) {
      console.error('Export error:', err);
      addToast('导出时发生异常，请重试', 'error');
      setIsProcessing(false);
      setExportModalMode(null);
    }
  };

  // Execute Batch Export to ZIP with chosen quality
  const executeExportBatch = async (quality: number) => {
    if (photos.length === 0) return;
    setIsProcessing(true);
    setBatchProgress(0);

    const zip = new JSZip();

    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const template = TEMPLATES.find(t => t.id === photo.selectedTemplateId) || TEMPLATES[0];
        const settings: FrameSettings = {
          ...template.defaultSettings,
          ...(photo.customSettings || {})
        };

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = photo.url;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const result = await renderPhotoCanvas({
          img,
          template,
          settings,
          exif: photo.exif,
          forExport: true,
          maxDimension: 0
        });

        const isPng = photo.name.toLowerCase().endsWith('.png');
        const mimeType = isPng ? 'image/png' : 'image/jpeg';
        const ext = isPng ? '.png' : '.jpg';

        const blob = await new Promise<Blob | null>(resolve => {
          result.canvas.toBlob(resolve, mimeType, quality);
        });

        if (blob) {
          const baseName = photo.name.replace(/\.[^/.]+$/, '');
          const filename = `${String(i + 1).padStart(2, '0')}_${baseName}_${template.name}${ext}`;
          zip.file(filename, blob);
        }

        setBatchProgress(Math.round(((i + 1) / photos.length) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `LumiStamp_Batch_Photos_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      const totalMB = (zipBlob.size / (1024 * 1024)).toFixed(1);
      addToast(`批量打包下载完成！共 ${photos.length} 张 (${totalMB} MB)`, 'success');
      setExportModalMode(null);
    } catch (err) {
      console.error('Batch export error:', err);
      addToast('批量打包导出失败，请重试', 'error');
    } finally {
      setIsProcessing(false);
      setBatchProgress(0);
    }
  };

  const handleWindowDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsWindowDragOver(true);
  };

  const handleWindowDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setIsWindowDragOver(false);
    }
  };

  const handleWindowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsWindowDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      className="flex flex-col h-[100dvh] w-screen bg-[#FBFBFA] text-stone-800 font-sans overflow-hidden select-none"
      onDragOver={handleWindowDragOver}
      onDragLeave={handleWindowDragLeave}
      onDrop={handleWindowDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={e => e.target.files && handleAddFiles(e.target.files)}
      />

      {/* Global Drag Overlay */}
      {isWindowDragOver && (
        <div className="absolute inset-0 z-50 bg-white/85 border-4 border-dashed border-rose-400/70 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-none transition-all">
          <div className="w-20 h-20 rounded-3xl bg-rose-50/90 border border-rose-200/60 flex items-center justify-center shadow-lg shadow-rose-500/10 mb-4 animate-bounce">
            <Camera className="w-10 h-10 text-rose-500" />
          </div>
          <p className="text-xl font-bold text-stone-900 tracking-tight">松开鼠标，立即导入照片</p>
          <p className="text-xs text-stone-500 mt-1.5 font-medium">支持 JPG / PNG 格式，超高保真无损解析 EXIF 相机参数</p>
        </div>
      )}

      {/* Header */}
      <Header
        photoCount={photos.length}
        isProcessing={isProcessing}
        onExportCurrent={handlePromptExportCurrent}
        onExportBatch={handlePromptExportBatch}
        onLoadSamples={handleLoadSamples}
        onTriggerUpload={() => fileInputRef.current?.click()}
        onResetSettings={handleResetSettings}
      />

      {/* Middle Studio Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Preview Canvas */}
        <PreviewCanvas
          currentPhoto={currentPhoto}
          template={currentTemplate}
          settings={currentSettings}
          onUpdateSettings={handleUpdateSettings}
          onTriggerUpload={() => fileInputRef.current?.click()}
        />

        {/* Right Studio Controls Sidebar (Desktop Only) */}
        <aside className="hidden md:flex w-80 md:w-96 border-l border-stone-200/60 bg-white/70 backdrop-blur-2xl flex-col shrink-0 z-10 shadow-[-6px_0_24px_rgba(0,0,0,0.015)]">
          {/* Sidebar Tab Navigation */}
          <div className="p-3 bg-stone-100/50 backdrop-blur-md border-b border-stone-200/50 shrink-0">
            <div className="flex items-center p-1 bg-stone-200/40 rounded-2xl gap-1">
              <button
                onClick={() => setActiveSidebarTab('templates')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSidebarTab === 'templates'
                    ? 'bg-white text-stone-900 shadow-sm shadow-stone-300/40 border border-stone-200/50'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-rose-500" />
                <span>边框模板</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('exif')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSidebarTab === 'exif'
                    ? 'bg-white text-stone-900 shadow-sm shadow-stone-300/40 border border-stone-200/50'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-amber-500" />
                <span>相机参数</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('styles')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSidebarTab === 'styles'
                    ? 'bg-white text-stone-900 shadow-sm shadow-stone-300/40 border border-stone-200/50'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                <span>版式微调</span>
              </button>
            </div>
          </div>

          {/* Active Sidebar Tab View */}
          <div className="flex-1 min-h-0 overflow-hidden bg-white/40">
            {activeSidebarTab === 'templates' && (
              <TemplateSelector
                currentTemplateId={currentTemplate.id}
                onSelectTemplate={handleSelectTemplate}
              />
            )}

            {activeSidebarTab === 'exif' && currentPhoto && (
              <ExifEditor
                exif={currentPhoto.exif}
                onChangeExif={handleUpdateExif}
              />
            )}

            {activeSidebarTab === 'styles' && (
              <StyleControls
                settings={currentSettings}
                template={currentTemplate}
                onUpdateSettings={handleUpdateSettings}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Desktop Bottom Batch Queue Drawer */}
      <div className="hidden md:block shrink-0">
        <BatchDrawer
          photos={photos}
          currentPhotoId={currentPhotoId}
          isProcessing={isProcessing}
          batchProgress={batchProgress}
          onSelectPhoto={setCurrentPhotoId}
          onRemovePhoto={handleRemovePhoto}
          onAddPhotos={handleAddFiles}
          onApplyCurrentToAll={handleApplyCurrentToAll}
          onLoadSamples={handleLoadSamples}
          onShowToast={addToast}
        />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden h-16 bg-white/95 backdrop-blur-2xl border-t border-stone-200/70 grid grid-cols-4 items-center shrink-0 z-30 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={() => setMobileActiveSheet(mobileActiveSheet === 'templates' ? null : 'templates')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] cursor-pointer ${
            mobileActiveSheet === 'templates' ? 'text-rose-500 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <LayoutTemplate className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">边框模板</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileActiveSheet(mobileActiveSheet === 'exif' ? null : 'exif')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] cursor-pointer ${
            mobileActiveSheet === 'exif' ? 'text-amber-500 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Camera className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">相机参数</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileActiveSheet(mobileActiveSheet === 'styles' ? null : 'styles')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] cursor-pointer ${
            mobileActiveSheet === 'styles' ? 'text-emerald-500 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sliders className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">版式微调</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileActiveSheet(mobileActiveSheet === 'photos' ? null : 'photos')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] cursor-pointer relative ${
            mobileActiveSheet === 'photos' ? 'text-rose-600 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5 mb-0.5" />
            {photos.length > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-2xs">
                {photos.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">照片管理</span>
        </button>
      </nav>

      {/* Mobile Bottom Sheet Drawer */}
      {mobileActiveSheet && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end animate-in fade-in duration-150">
          <div
            className="absolute inset-0 bg-stone-900/35 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileActiveSheet(null)}
          />
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-t-3xl border-t border-stone-200/80 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] max-h-[75dvh] flex flex-col z-10 animate-in slide-in-from-bottom duration-200 pb-[env(safe-area-inset-bottom)]">
            {/* Handle & Title Bar */}
            <div className="pt-2.5 pb-2 px-4 flex items-center justify-between border-b border-stone-200/60 shrink-0">
              <div className="w-8" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-1 bg-stone-300 rounded-full mb-1.5" />
                <span className="text-xs font-bold text-stone-800">
                  {mobileActiveSheet === 'templates' && '选择边框模板'}
                  {mobileActiveSheet === 'exif' && '修改相机拍摄参数'}
                  {mobileActiveSheet === 'styles' && '版式与水印微调'}
                  {mobileActiveSheet === 'photos' && `照片管理 (共 ${photos.length} 张)`}
                </span>
              </div>
              <button
                onClick={() => setMobileActiveSheet(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {mobileActiveSheet === 'templates' && (
                <TemplateSelector
                  currentTemplateId={currentTemplate.id}
                  onSelectTemplate={handleSelectTemplate}
                />
              )}

              {mobileActiveSheet === 'exif' && currentPhoto && (
                <ExifEditor
                  exif={currentPhoto.exif}
                  onChangeExif={handleUpdateExif}
                />
              )}

              {mobileActiveSheet === 'styles' && (
                <StyleControls
                  settings={currentSettings}
                  template={currentTemplate}
                  onUpdateSettings={handleUpdateSettings}
                />
              )}

              {mobileActiveSheet === 'photos' && (
                <div className="p-4 space-y-3.5">
                  {/* Actions in mobile photo manager */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-all cursor-pointer shadow-xs min-h-[44px]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>添加照片 (JPG/PNG)</span>
                    </button>
                    {photos.length > 1 && (
                      <button
                        onClick={handleApplyCurrentToAll}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer min-h-[44px]"
                      >
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                        <span>应用至全部</span>
                      </button>
                    )}
                  </div>

                  {/* Photo List */}
                  <div className="space-y-2">
                    {photos.map(photo => {
                      const isCurrent = photo.id === currentPhotoId;
                      return (
                        <div
                          key={photo.id}
                          onClick={() => {
                            setCurrentPhotoId(photo.id);
                            setMobileActiveSheet(null);
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-rose-50/70 border-rose-400 shadow-xs ring-1 ring-rose-400/20'
                              : 'bg-white border-stone-200/80 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/60 shadow-2xs">
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-stone-800 truncate">
                                {photo.name}
                              </p>
                              <p className="text-[10px] text-stone-500 font-mono truncate mt-0.5">
                                {photo.exif.model || photo.exif.make || 'Camera'} · {photo.width}×{photo.height}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleRemovePhoto(photo.id);
                            }}
                            className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Confirmation & Quality Settings Modal */}
      <ExportModal
        isOpen={exportModalMode !== null}
        mode={exportModalMode || 'single'}
        currentPhoto={currentPhoto}
        photoCount={photos.length}
        templateName={currentTemplate.name}
        quality={exportQuality}
        onQualityChange={handleQualityChange}
        onConfirm={q => {
          if (exportModalMode === 'batch') {
            executeExportBatch(q);
          } else {
            executeExportCurrent(q);
          }
        }}
        onClose={() => setExportModalMode(null)}
        isProcessing={isProcessing}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
