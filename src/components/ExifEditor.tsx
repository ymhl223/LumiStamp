import React from 'react';
import { ExifData } from '../types';
import { CAMERA_PRESETS } from '../constants/samples';
import { Camera, Calendar, User, SlidersHorizontal, MapPin } from 'lucide-react';

interface ExifEditorProps {
  exif: ExifData;
  onChangeExif: (updated: Partial<ExifData>) => void;
}

export const ExifEditor: React.FC<ExifEditorProps> = ({ exif, onChangeExif }) => {
  const handleApplyPreset = (preset: (typeof CAMERA_PRESETS)[0]) => {
    onChangeExif({
      make: preset.make,
      model: preset.model,
      lens: preset.lens,
      focalLength: preset.focalLength,
      aperture: preset.aperture,
      shutterSpeed: preset.shutterSpeed,
      iso: preset.iso
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-5 bg-transparent">
      {/* Quick Camera Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-rose-500" />
            <span>快速填充常用机型参数</span>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {CAMERA_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1.5 text-[11px] font-medium text-stone-700 bg-white/70 hover:bg-white border border-stone-200/70 rounded-xl text-left transition-all truncate cursor-pointer shadow-2xs hover:shadow-xs backdrop-blur-sm"
              title={preset.name}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[1px] bg-stone-200/50" />

      {/* Main Parameters Form */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span>相机与镜头参数 (实时同步编辑)</span>
          </label>
        </div>

        {/* Make & Model */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-stone-600 mb-1 block">品牌 (Make)</label>
            <input
              type="text"
              value={exif.make || ''}
              onChange={e => onChangeExif({ make: e.target.value })}
              placeholder="e.g. Canon, Sony"
              className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 font-medium transition-all shadow-2xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-stone-600 mb-1 block">机型名称 (Model)</label>
            <input
              type="text"
              value={exif.model || ''}
              onChange={e => onChangeExif({ model: e.target.value })}
              placeholder="e.g. EOS R5, A7M4"
              className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 font-medium transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Lens */}
        <div>
          <label className="text-[11px] font-medium text-stone-600 mb-1 block">镜头型号 (Lens Model)</label>
          <input
            type="text"
            value={exif.lens || ''}
            onChange={e => onChangeExif({ lens: e.target.value })}
            placeholder="e.g. RF 50mm F1.2 L USM"
            className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 font-medium transition-all shadow-2xs"
          />
        </div>

        {/* Shooting Parameters 4-Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-stone-600 mb-1 block">焦距 (Focal Length)</label>
            <input
              type="text"
              value={exif.focalLength || ''}
              onChange={e => onChangeExif({ focalLength: e.target.value })}
              placeholder="50mm"
              className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 font-mono placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 transition-all shadow-2xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-stone-600 mb-1 block">光圈 (Aperture)</label>
            <input
              type="text"
              value={exif.aperture || ''}
              onChange={e => onChangeExif({ aperture: e.target.value })}
              placeholder="f/1.4"
              className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 font-mono placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 transition-all shadow-2xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-stone-600 mb-1 block">快门速度 (Shutter)</label>
            <input
              type="text"
              value={exif.shutterSpeed || ''}
              onChange={e => onChangeExif({ shutterSpeed: e.target.value })}
              placeholder="1/500s"
              className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 font-mono placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 transition-all shadow-2xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-stone-600 mb-1 block">感光度 (ISO)</label>
            <input
              type="text"
              value={exif.iso || ''}
              onChange={e => onChangeExif({ iso: e.target.value })}
              placeholder="ISO 100"
              className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 font-mono placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Date Time */}
        <div>
          <label className="text-[11px] font-medium text-stone-600 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-stone-400" />
            <span>拍摄日期与时间 (Date & Time)</span>
          </label>
          <input
            type="text"
            value={exif.dateTime || ''}
            onChange={e => onChangeExif({ dateTime: e.target.value })}
            placeholder="2024.10.12 16:30"
            className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 font-mono placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 transition-all shadow-2xs"
          />
        </div>

        {/* Photographer Signature */}
        <div>
          <label className="text-[11px] font-medium text-stone-600 mb-1 flex items-center gap-1">
            <User className="w-3 h-3 text-stone-400" />
            <span>摄影师签名 / 自定义文案 (Signature)</span>
          </label>
          <input
            type="text"
            value={exif.photographer || ''}
            onChange={e => onChangeExif({ photographer: e.target.value })}
            placeholder="输入摄影师名称或个性签名"
            className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 transition-all shadow-2xs"
          />
        </div>

        {/* Location / Note */}
        <div>
          <label className="text-[11px] font-medium text-stone-600 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-stone-400" />
            <span>拍摄地点 / 备注 (Location)</span>
          </label>
          <input
            type="text"
            value={exif.location || ''}
            onChange={e => onChangeExif({ location: e.target.value })}
            placeholder="e.g. Shinjuku, Tokyo"
            className="w-full px-2.5 py-1.5 text-xs bg-white/80 border border-stone-200/80 rounded-xl text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200/40 transition-all shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};
