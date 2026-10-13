import React from 'react';
import { FrameSettings, WatermarkTemplate } from '../types';
import { Move, Eye, RotateCcw, Palette, Layers, Award } from 'lucide-react';

interface StyleControlsProps {
  settings: FrameSettings;
  template: WatermarkTemplate;
  onUpdateSettings: (newSettings: Partial<FrameSettings>) => void;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  settings,
  template,
  onUpdateSettings
}) => {
  const isBlur = template.layoutStyle === 'blur-bg' || template.layoutStyle === 'soft-focus';

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-5 bg-transparent">
      {/* 1. Logo Color Variant Selector */}
      <div>
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
          <Award className="w-3.5 h-3.5 text-rose-500" />
          <span>相机 Logo 色彩规则</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => onUpdateSettings({ logoColorMode: 'auto' })}
            className={`px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-sm ${
              (settings.logoColorMode === 'auto' || !settings.logoColorMode)
                ? 'bg-rose-50/90 border-rose-300/80 text-rose-700 font-semibold shadow-xs ring-1 ring-rose-400/20'
                : 'bg-white/70 border-stone-200/70 text-stone-700 hover:bg-white shadow-2xs'
            }`}
          >
            <span className="block font-medium">推荐模式</span>
            <span className="text-[10px] opacity-70">依当前模板智能匹配</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ logoColorMode: 'color', showLogo: true })}
            className={`px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-sm ${
              settings.logoColorMode === 'color'
                ? 'bg-rose-50/90 border-rose-300/80 text-rose-700 font-semibold shadow-xs ring-1 ring-rose-400/20'
                : 'bg-white/70 border-stone-200/70 text-stone-700 hover:bg-white shadow-2xs'
            }`}
          >
            <span className="block font-medium">彩色原标</span>
            <span className="text-[10px] opacity-70">红佳能 / 橙索尼 / 黄尼康</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ logoColorMode: 'white', showLogo: true })}
            className={`px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-sm ${
              settings.logoColorMode === 'white'
                ? 'bg-stone-900 border-stone-900 text-stone-100 font-semibold shadow-xs'
                : 'bg-white/70 border-stone-200/70 text-stone-700 hover:bg-white shadow-2xs'
            }`}
          >
            <span className="block font-medium">纯白徽标</span>
            <span className="text-[10px] opacity-70">适合黑底 / 夜行模板</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ logoColorMode: 'none', showLogo: false })}
            className={`px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-sm ${
              settings.logoColorMode === 'none' || !settings.showLogo
                ? 'bg-sky-50/90 border-sky-300/80 text-sky-700 font-semibold shadow-xs ring-1 ring-sky-400/20'
                : 'bg-white/70 border-stone-200/70 text-stone-700 hover:bg-white shadow-2xs'
            }`}
          >
            <span className="block font-medium">不使用 Logo</span>
            <span className="text-[10px] opacity-70">纯文字展示拍摄参数</span>
          </button>
        </div>
      </div>

      <div className="w-full h-[1px] bg-stone-200/50" />

      {/* 2. Drag & Position Micro-adjustment */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-rose-500" />
            <span>水印位置与拖拽偏移</span>
          </label>

          {(settings.watermarkOffsetX !== 0 || settings.watermarkOffsetY !== 0) && (
            <button
              onClick={() => onUpdateSettings({ watermarkOffsetX: 0, watermarkOffsetY: 0 })}
              className="flex items-center gap-1 text-[11px] text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>复位居中</span>
            </button>
          )}
        </div>

        <p className="text-[11px] text-stone-500 mb-3 leading-relaxed">
          可直接在画布预览上按住鼠标自由拖拽，也可使用下方滑块进行像素级微调。
        </p>

        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between text-[11px] text-stone-600 mb-1">
              <span>水平位移 (X 轴)</span>
              <span className="font-mono text-stone-900 font-semibold tabular-nums">{settings.watermarkOffsetX} px</span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="1"
              value={settings.watermarkOffsetX}
              onChange={e => onUpdateSettings({ watermarkOffsetX: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-stone-600 mb-1">
              <span>垂直位移 (Y 轴)</span>
              <span className="font-mono text-stone-900 font-semibold tabular-nums">{settings.watermarkOffsetY} px</span>
            </div>
            <input
              type="range"
              min="-150"
              max="150"
              step="1"
              value={settings.watermarkOffsetY}
              onChange={e => onUpdateSettings({ watermarkOffsetY: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-stone-200/50" />

      {/* 3. Border & Frame Geometry */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-500" />
          <span>边框留白与比例</span>
        </label>

        <div>
          <div className="flex justify-between text-[11px] text-stone-600 mb-1">
            <span>四周留白内边距</span>
            <span className="font-mono text-stone-900 font-semibold tabular-nums">{settings.paddingPercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="0.5"
            value={settings.paddingPercent}
            onChange={e => onUpdateSettings({ paddingPercent: Number(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-stone-600 mb-1">
            <span>底栏水印栏高度</span>
            <span className="font-mono text-stone-900 font-semibold tabular-nums">{settings.bottomHeightPercent}%</span>
          </div>
          <input
            type="range"
            min="6"
            max="26"
            step="0.5"
            value={settings.bottomHeightPercent}
            onChange={e => onUpdateSettings({ bottomHeightPercent: Number(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-stone-600 mb-1">
            <span>照片圆角弧度</span>
            <span className="font-mono text-stone-900 font-semibold tabular-nums">{settings.borderRadius} px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={settings.borderRadius}
            onChange={e => onUpdateSettings({ borderRadius: Number(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-stone-600 mb-1">
            <span>照片立体阴影</span>
            <span className="font-mono text-stone-900 font-semibold tabular-nums">{settings.shadowBlur} px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="2"
            value={settings.shadowBlur}
            onChange={e =>
              onUpdateSettings({
                shadowBlur: Number(e.target.value),
                shadowOpacity: Number(e.target.value) > 0 ? 0.35 : 0
              })
            }
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Gaussian Blur controls if blur-bg or soft-focus */}
      {isBlur && (
        <>
          <div className="w-full h-[1px] bg-stone-200/50" />
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              <span>毛玻璃背景调节</span>
            </label>

            <div>
              <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                <span>高斯模糊半径</span>
                <span className="font-mono text-stone-900 font-semibold tabular-nums">{settings.blurAmount} px</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="2"
                value={settings.blurAmount}
                onChange={e => onUpdateSettings({ blurAmount: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                <span>背景明暗亮度</span>
                <span className="font-mono text-stone-900 font-semibold tabular-nums">
                  {Math.round(settings.blurBrightness * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.4"
                step="0.05"
                value={settings.blurBrightness}
                onChange={e => onUpdateSettings({ blurBrightness: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </>
      )}

      <div className="w-full h-[1px] bg-stone-200/50" />

      {/* 5. Font & Logo Scaling */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-stone-800">字体与 Logo 缩放</label>

        <div>
          <div className="flex justify-between text-[11px] text-stone-600 mb-1">
            <span>文字大小比例</span>
            <span className="font-mono text-stone-900 font-semibold tabular-nums">
              {Math.round((settings.fontSizeScale || 1.0) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.5"
            step="0.05"
            value={settings.fontSizeScale || 1.0}
            onChange={e => onUpdateSettings({ fontSizeScale: Number(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-stone-600 mb-1">
            <span>品牌 Logo 大小</span>
            <span className="font-mono text-stone-900 font-semibold tabular-nums">
              {Math.round((settings.logoScale || 1.0) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.6"
            max="1.6"
            step="0.05"
            value={settings.logoScale || 1.0}
            onChange={e => onUpdateSettings({ logoScale: Number(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="w-full h-[1px] bg-stone-200/50" />

      {/* 6. Elements Visibility Switches */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-emerald-500" />
          <span>显示 / 隐藏元素</span>
        </label>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-stone-200/70 cursor-pointer hover:bg-white hover:border-stone-300 transition-all shadow-2xs">
            <input
              type="checkbox"
              checked={settings.showLogo}
              onChange={e => onUpdateSettings({ showLogo: e.target.checked })}
              className="accent-rose-500 rounded cursor-pointer"
            />
            <span className="text-stone-700 font-medium">相机 Logo</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-stone-200/70 cursor-pointer hover:bg-white hover:border-stone-300 transition-all shadow-2xs">
            <input
              type="checkbox"
              checked={settings.showModel}
              onChange={e => onUpdateSettings({ showModel: e.target.checked })}
              className="accent-rose-500 rounded cursor-pointer"
            />
            <span className="text-stone-700 font-medium">机身型号</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-stone-200/70 cursor-pointer hover:bg-white hover:border-stone-300 transition-all shadow-2xs">
            <input
              type="checkbox"
              checked={settings.showLens}
              onChange={e => onUpdateSettings({ showLens: e.target.checked })}
              className="accent-rose-500 rounded cursor-pointer"
            />
            <span className="text-stone-700 font-medium">镜头型号</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-stone-200/70 cursor-pointer hover:bg-white hover:border-stone-300 transition-all shadow-2xs">
            <input
              type="checkbox"
              checked={settings.showParams}
              onChange={e => onUpdateSettings({ showParams: e.target.checked })}
              className="accent-rose-500 rounded cursor-pointer"
            />
            <span className="text-stone-700 font-medium">光圈快门ISO</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-stone-200/70 cursor-pointer hover:bg-white hover:border-stone-300 transition-all shadow-2xs">
            <input
              type="checkbox"
              checked={settings.showDate}
              onChange={e => onUpdateSettings({ showDate: e.target.checked })}
              className="accent-rose-500 rounded cursor-pointer"
            />
            <span className="text-stone-700 font-medium">拍摄时间</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-stone-200/70 cursor-pointer hover:bg-white hover:border-stone-300 transition-all shadow-2xs">
            <input
              type="checkbox"
              checked={settings.showPhotographer}
              onChange={e => onUpdateSettings({ showPhotographer: e.target.checked })}
              className="accent-rose-500 rounded cursor-pointer"
            />
            <span className="text-stone-700 font-medium">作者签名</span>
          </label>
        </div>
      </div>
    </div>
  );
};
