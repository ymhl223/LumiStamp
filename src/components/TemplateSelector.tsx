import React, { useState } from 'react';
import { TEMPLATES, CATEGORY_LABELS } from '../constants/templates';
import { WatermarkTemplate } from '../types';
import { Sparkles, Camera, Layers, Film } from 'lucide-react';

interface TemplateSelectorProps {
  currentTemplateId: string;
  onSelectTemplate: (template: WatermarkTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  currentTemplateId,
  onSelectTemplate
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTemplates = TEMPLATES.filter(tpl => {
    if (activeCategory === 'all') return true;
    return tpl.category === activeCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'blur':
        return <Layers className="w-3.5 h-3.5 text-sky-500" />;
      case 'camera':
        return <Camera className="w-3.5 h-3.5 text-rose-500" />;
      case 'film':
        return <Film className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const getLogoBadge = (template: WatermarkTemplate) => {
    if (template.defaultLogoMode === 'none') {
      return (
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-sky-50/80 border border-sky-200/60 text-sky-700">
          纯文字 · 无Logo
        </span>
      );
    }
    if (template.defaultLogoMode === 'white') {
      return (
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-stone-900 text-stone-100">
          纯白 Logo
        </span>
      );
    }
    return (
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-rose-50/80 border border-rose-200/60 text-rose-700">
        原色 Logo
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-2.5 bg-stone-100/40 border-b border-stone-200/50 overflow-x-auto scrollbar-none shrink-0">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/70'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-white/60'
              }`}
            >
              {key !== 'all' && getCategoryIcon(key)}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {filteredTemplates.map(tpl => {
          const isSelected = tpl.id === currentTemplateId;

          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className={`group p-3.5 rounded-2xl border transition-all cursor-pointer relative backdrop-blur-md ${
                isSelected
                  ? 'bg-white border-rose-400/90 shadow-sm ring-2 ring-rose-400/20'
                  : 'bg-white/70 hover:bg-white border-stone-200/60 hover:border-stone-300 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: tpl.accentColor || '#E11D48' }}
                  />
                  <h4 className="text-xs font-bold text-stone-900">
                    {tpl.name}
                  </h4>
                </div>

                {getLogoBadge(tpl)}
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed mb-3 font-normal">
                {tpl.description}
              </p>

              {/* Minimal preview bar representation */}
              <div
                className="h-7 rounded-lg border border-stone-200/70 px-2.5 flex items-center justify-between text-[10px] font-mono tabular-nums shadow-inner overflow-hidden"
                style={{
                  backgroundColor: tpl.backgroundColor.startsWith('rgba') ? '#1c1917' : tpl.backgroundColor,
                  color: tpl.textColor
                }}
              >
                <span className="font-bold truncate max-w-[90px]">
                  {tpl.defaultLogoMode === 'none' ? 'NO LOGO' : tpl.defaultLogo.toUpperCase()}
                </span>
                <span className="opacity-80 text-[10px] truncate">
                  50mm · f/1.4 · 1/500s · ISO 100
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
