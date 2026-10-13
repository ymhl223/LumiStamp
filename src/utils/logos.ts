// Camera brand logos with multiple color variants (Color, White, Dark)

export interface BrandLogoVariants {
  id: string;
  name: string;
  aspectRatio: number;
  colorSvg: string;
  whiteSvg: string;
  darkSvg: string;
}

export const BRAND_LOGOS: Record<string, BrandLogoVariants> = {
  canon: {
    id: 'canon',
    name: 'Canon',
    aspectRatio: 2.8,
    // 红色标 (标准水印等使用)
    colorSvg: `<svg viewBox="0 0 140 50" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="36" font-family="'Plus Jakarta Sans', serif" font-size="30" font-weight="900" letter-spacing="1" fill="#DC2626">Canon</text>
    </svg>`,
    // 白色标 (黑金夜行等使用)
    whiteSvg: `<svg viewBox="0 0 140 50" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="36" font-family="'Plus Jakarta Sans', serif" font-size="30" font-weight="900" letter-spacing="1" fill="#FFFFFF">Canon</text>
    </svg>`,
    // 深色标 (奶油底签等使用)
    darkSvg: `<svg viewBox="0 0 140 50" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="36" font-family="'Plus Jakarta Sans', serif" font-size="30" font-weight="900" letter-spacing="1" fill="#18181B">Canon</text>
    </svg>`
  },

  sony: {
    id: 'sony',
    name: 'Sony',
    aspectRatio: 2.0,
    // 橙色 α 标 (标准水印等使用)
    colorSvg: `<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" font-style="italic" fill="#F97316">α</text>
      <text x="38" y="33" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" letter-spacing="2.5" fill="#18181B">SONY</text>
    </svg>`,
    // 纯白标 (黑金夜行等使用)
    whiteSvg: `<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" font-style="italic" fill="#FFFFFF">α</text>
      <text x="38" y="33" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" letter-spacing="2.5" fill="#FFFFFF">SONY</text>
    </svg>`,
    // 深色标
    darkSvg: `<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" font-style="italic" fill="#18181B">α</text>
      <text x="38" y="33" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" letter-spacing="2.5" fill="#18181B">SONY</text>
    </svg>`
  },

  leica: {
    id: 'leica',
    name: 'Leica',
    aspectRatio: 1.0,
    // 经典红色可乐标
    colorSvg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#D32F2F"/>
      <text x="50" y="58" font-family="'Brush Script MT', 'Dancing Script', cursive, sans-serif" font-size="30" font-weight="bold" font-style="italic" fill="#FFFFFF" text-anchor="middle">Leica</text>
    </svg>`,
    // 纯白镂空标 (黑金夜行等使用)
    whiteSvg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="none" stroke="#FFFFFF" stroke-width="5"/>
      <text x="50" y="58" font-family="'Brush Script MT', 'Dancing Script', cursive, sans-serif" font-size="30" font-weight="bold" font-style="italic" fill="#FFFFFF" text-anchor="middle">Leica</text>
    </svg>`,
    // 深灰标
    darkSvg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#18181B"/>
      <text x="50" y="58" font-family="'Brush Script MT', 'Dancing Script', cursive, sans-serif" font-size="30" font-weight="bold" font-style="italic" fill="#FFFFFF" text-anchor="middle">Leica</text>
    </svg>`
  },

  fujifilm: {
    id: 'fujifilm',
    name: 'FUJIFILM',
    aspectRatio: 3.2,
    // 绿红标识
    colorSvg: `<svg viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="8" height="22" fill="#EF4444"/>
      <rect x="18" y="14" width="8" height="22" fill="#10B981"/>
      <text x="34" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="900" letter-spacing="2" fill="#18181B">FUJIFILM</text>
    </svg>`,
    // 纯白标
    whiteSvg: `<svg viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="8" height="22" fill="#FFFFFF"/>
      <rect x="18" y="14" width="8" height="22" fill="#FFFFFF"/>
      <text x="34" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="900" letter-spacing="2" fill="#FFFFFF">FUJIFILM</text>
    </svg>`,
    // 深灰标
    darkSvg: `<svg viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="8" height="22" fill="#18181B"/>
      <rect x="18" y="14" width="8" height="22" fill="#18181B"/>
      <text x="34" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="900" letter-spacing="2" fill="#18181B">FUJIFILM</text>
    </svg>`
  },

  nikon: {
    id: 'nikon',
    name: 'Nikon',
    aspectRatio: 2.2,
    // 黄色标
    colorSvg: `<svg viewBox="0 0 110 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="30" height="30" rx="3" fill="#FBBF24"/>
      <text x="12" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="900" font-style="italic" fill="#000000">N</text>
      <text x="44" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" font-style="italic" letter-spacing="1" fill="#18181B">Nikon</text>
    </svg>`,
    // 纯白标
    whiteSvg: `<svg viewBox="0 0 110 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="30" height="30" rx="3" fill="#FFFFFF"/>
      <text x="12" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="900" font-style="italic" fill="#000000">N</text>
      <text x="44" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" font-style="italic" letter-spacing="1" fill="#FFFFFF">Nikon</text>
    </svg>`,
    // 深色标
    darkSvg: `<svg viewBox="0 0 110 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="30" height="30" rx="3" fill="#18181B"/>
      <text x="12" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="900" font-style="italic" fill="#FFFFFF">N</text>
      <text x="44" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" font-style="italic" letter-spacing="1" fill="#18181B">Nikon</text>
    </svg>`
  },

  hasselblad: {
    id: 'hasselblad',
    name: 'Hasselblad',
    aspectRatio: 3.8,
    // 橙色 H 标
    colorSvg: `<svg viewBox="0 0 200 52" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" font-style="italic" letter-spacing="4" fill="#18181B">H</text>
      <text x="46" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="700" letter-spacing="4.5" fill="#18181B">HASSELBLAD</text>
      <circle cx="192" cy="18" r="4" fill="#EA580C"/>
    </svg>`,
    // 纯白标
    whiteSvg: `<svg viewBox="0 0 200 52" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" font-style="italic" letter-spacing="4" fill="#FFFFFF">H</text>
      <text x="46" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="700" letter-spacing="4.5" fill="#FFFFFF">HASSELBLAD</text>
      <circle cx="192" cy="18" r="4" fill="#FFFFFF"/>
    </svg>`,
    // 深色标
    darkSvg: `<svg viewBox="0 0 200 52" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" font-style="italic" letter-spacing="4" fill="#18181B">H</text>
      <text x="46" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="700" letter-spacing="4.5" fill="#18181B">HASSELBLAD</text>
      <circle cx="192" cy="18" r="4" fill="#18181B"/>
    </svg>`
  },

  apple: {
    id: 'apple',
    name: 'Apple',
    aspectRatio: 1.0,
    colorSvg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 6 C32 3, 36 2, 38 2 C38 4, 37 8, 34 10 C32 12, 28 12, 28 11 C28 9, 29 7, 30 6 Z" fill="#71717A"/>
      <path d="M36 26 C36 21, 40 18, 40 18 C37 14, 33 14, 32 14 C27 14, 25 17, 22 17 C19 17, 17 14, 13 14 C8 15, 3 19, 3 28 C3 34, 5 40, 8 44 C10 47, 13 50, 16 50 C19 50, 20 48, 23 48 C26 48, 27 50, 30 50 C34 50, 36 47, 38 44 C41 40, 42 36, 42 36 C42 36, 36 33, 36 26 Z" fill="#71717A"/>
    </svg>`,
    whiteSvg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 6 C32 3, 36 2, 38 2 C38 4, 37 8, 34 10 C32 12, 28 12, 28 11 C28 9, 29 7, 30 6 Z" fill="#FFFFFF"/>
      <path d="M36 26 C36 21, 40 18, 40 18 C37 14, 33 14, 32 14 C27 14, 25 17, 22 17 C19 17, 17 14, 13 14 C8 15, 3 19, 3 28 C3 34, 5 40, 8 44 C10 47, 13 50, 16 50 C19 50, 20 48, 23 48 C26 48, 27 50, 30 50 C34 50, 36 47, 38 44 C41 40, 42 36, 42 36 C42 36, 36 33, 36 26 Z" fill="#FFFFFF"/>
    </svg>`,
    darkSvg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 6 C32 3, 36 2, 38 2 C38 4, 37 8, 34 10 C32 12, 28 12, 28 11 C28 9, 29 7, 30 6 Z" fill="#18181B"/>
      <path d="M36 26 C36 21, 40 18, 40 18 C37 14, 33 14, 32 14 C27 14, 25 17, 22 17 C19 17, 17 14, 13 14 C8 15, 3 19, 3 28 C3 34, 5 40, 8 44 C10 47, 13 50, 16 50 C19 50, 20 48, 23 48 C26 48, 27 50, 30 50 C34 50, 36 47, 38 44 C41 40, 42 36, 42 36 C42 36, 36 33, 36 26 Z" fill="#18181B"/>
    </svg>`
  },

  polaroid: {
    id: 'polaroid',
    name: 'Polaroid',
    aspectRatio: 2.2,
    colorSvg: `<svg viewBox="0 0 110 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="18" width="5" height="14" fill="#EF4444"/>
      <rect x="13" y="18" width="5" height="14" fill="#F97316"/>
      <rect x="18" y="18" width="5" height="14" fill="#FBBF24"/>
      <rect x="23" y="18" width="5" height="14" fill="#10B981"/>
      <rect x="28" y="18" width="5" height="14" fill="#3B82F6"/>
      <text x="38" y="31" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#18181B">polaroid</text>
    </svg>`,
    whiteSvg: `<svg viewBox="0 0 110 50" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" letter-spacing="3" fill="#FFFFFF">POLAROID</text>
    </svg>`,
    darkSvg: `<svg viewBox="0 0 110 50" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" letter-spacing="3" fill="#18181B">POLAROID</text>
    </svg>`
  }
};

// SVG image cache
const svgCache = new Map<string, HTMLImageElement>();

/**
 * Loads brand logo with color variant
 * @param brandId - brand key (canon, sony, leica, fujifilm, nikon, hasselblad, apple, polaroid)
 * @param variant - 'color' | 'white' | 'dark' | 'none'
 */
export function getLogoImage(
  brandId: string,
  variant: 'color' | 'white' | 'dark' | 'none' = 'color'
): Promise<HTMLImageElement | null> {
  if (variant === 'none') {
    return Promise.resolve(null);
  }

  const key = (brandId || '').toLowerCase().trim();
  let brand = BRAND_LOGOS[key];

  // Fuzzy match
  if (!brand) {
    if (key.includes('canon')) brand = BRAND_LOGOS.canon;
    else if (key.includes('sony')) brand = BRAND_LOGOS.sony;
    else if (key.includes('nikon')) brand = BRAND_LOGOS.nikon;
    else if (key.includes('fuji')) brand = BRAND_LOGOS.fujifilm;
    else if (key.includes('hasselblad')) brand = BRAND_LOGOS.hasselblad;
    else if (key.includes('apple') || key.includes('iphone')) brand = BRAND_LOGOS.apple;
    else if (key.includes('polaroid')) brand = BRAND_LOGOS.polaroid;
    else brand = BRAND_LOGOS.leica;
  }

  const cacheKey = `${brand.id}_${variant}`;
  if (svgCache.has(cacheKey)) {
    return Promise.resolve(svgCache.get(cacheKey)!);
  }

  let svgMarkup = brand.colorSvg;
  if (variant === 'white') svgMarkup = brand.whiteSvg;
  else if (variant === 'dark') svgMarkup = brand.darkSvg;

  return new Promise(resolve => {
    const img = new Image();
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      svgCache.set(cacheKey, img);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
