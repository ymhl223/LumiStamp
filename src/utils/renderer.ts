import { ExifData, FrameSettings, WatermarkTemplate } from '../types';
import { getLogoImage } from './logos';

export interface RenderResult {
  canvas: HTMLCanvasElement;
  watermarkBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface RenderOptions {
  img: HTMLImageElement;
  template: WatermarkTemplate;
  settings: FrameSettings;
  exif: ExifData;
  forExport?: boolean;
  maxDimension?: number;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (radius <= 0) {
    ctx.rect(x, y, width, height);
    return;
  }
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

/**
 * Main rendering engine for the 8 core templates
 */
export async function renderPhotoCanvas(options: RenderOptions): Promise<RenderResult> {
  const { img, template, settings, exif, forExport = false, maxDimension = 0 } = options;

  const originalWidth = img.naturalWidth || img.width;
  const originalHeight = img.naturalHeight || img.height;

  // Scale factor: 1.0 for 100% full-resolution lossless export
  let scale = 1.0;
  if (!forExport && maxDimension > 0) {
    const maxEdge = Math.max(originalWidth, originalHeight);
    if (maxEdge > maxDimension) {
      scale = maxDimension / maxEdge;
    }
  }

  const photoWidth = Math.round(originalWidth * scale);
  const photoHeight = Math.round(originalHeight * scale);

  const paddingRatio = settings.paddingPercent / 100;
  const bottomHeightRatio = settings.bottomHeightPercent / 100;

  let totalPaddingX = 0;
  let totalPaddingTop = 0;
  let totalPaddingBottom = 0;
  let bottomBarHeight = 0;

  // Layout sizing by template
  if (template.layoutStyle === 'blur-bg') {
    totalPaddingX = Math.round(photoWidth * (paddingRatio > 0 ? paddingRatio : 0.06));
    totalPaddingTop = Math.round(photoHeight * (paddingRatio > 0 ? paddingRatio : 0.05));
    bottomBarHeight = Math.round(photoHeight * (bottomHeightRatio > 0 ? bottomHeightRatio : 0.13));
    totalPaddingBottom = totalPaddingTop + bottomBarHeight;
  } else if (template.layoutStyle === 'soft-focus') {
    totalPaddingX = Math.round(photoWidth * (paddingRatio > 0 ? paddingRatio : 0.07));
    totalPaddingTop = Math.round(photoHeight * (paddingRatio > 0 ? paddingRatio : 0.06));
    bottomBarHeight = Math.round(photoHeight * (bottomHeightRatio > 0 ? bottomHeightRatio : 0.16));
    totalPaddingBottom = totalPaddingTop + bottomBarHeight;
  } else if (template.layoutStyle === 'polaroid') {
    totalPaddingX = Math.round(photoWidth * (paddingRatio > 0 ? paddingRatio : 0.04));
    totalPaddingTop = Math.round(photoHeight * (paddingRatio > 0 ? paddingRatio : 0.04));
    bottomBarHeight = Math.round(photoHeight * (bottomHeightRatio > 0 ? bottomHeightRatio : 0.20));
    totalPaddingBottom = bottomBarHeight;
  } else if (template.layoutStyle === 'cream-sign') {
    totalPaddingX = Math.round(photoWidth * (paddingRatio > 0 ? paddingRatio : 0.015));
    totalPaddingTop = Math.round(photoHeight * (paddingRatio > 0 ? paddingRatio : 0.015));
    bottomBarHeight = Math.round(photoHeight * (bottomHeightRatio > 0 ? bottomHeightRatio : 0.13));
    totalPaddingBottom = totalPaddingTop + bottomBarHeight;
  } else {
    // standard-1, standard-2, black-gold, logo-center
    totalPaddingX = Math.round(photoWidth * paddingRatio);
    totalPaddingTop = Math.round(photoHeight * paddingRatio);
    bottomBarHeight = Math.round(photoHeight * bottomHeightRatio);
    totalPaddingBottom = totalPaddingTop + bottomBarHeight;
  }

  const canvasWidth = photoWidth + totalPaddingX * 2;
  const canvasHeight = photoHeight + totalPaddingTop + totalPaddingBottom;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { canvas };

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const photoX = totalPaddingX;
  const photoY = totalPaddingTop;

  // 1. Background rendering
  if (template.layoutStyle === 'blur-bg' || template.layoutStyle === 'soft-focus') {
    // Gaussian blur background from original photo
    ctx.save();
    const blurRadius = Math.max(12, Math.round((settings.blurAmount || 42) * scale));
    try {
      ctx.filter = `blur(${blurRadius}px) brightness(${settings.blurBrightness || 0.82})`;
    } catch {
      // ignore
    }
    const bgScale = 1.15;
    const bgW = canvasWidth * bgScale;
    const bgH = canvasHeight * bgScale;
    ctx.drawImage(img, (canvasWidth - bgW) / 2, (canvasHeight - bgH) / 2, bgW, bgH);
    ctx.restore();

    // Dark overlay for rich photographic contrast matching reference image
    ctx.fillStyle = template.layoutStyle === 'soft-focus' ? 'rgba(0, 0, 0, 0.28)' : 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  } else {
    ctx.fillStyle = settings.backgroundColor || template.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // 2. Main Photo rendering (with shadow and round rect)
  ctx.save();
  const radius = Math.round(settings.borderRadius * scale);
  const shadowBlur = Math.round(settings.shadowBlur * scale);

  if (shadowBlur > 0 && settings.shadowOpacity > 0) {
    ctx.shadowColor = `rgba(0, 0, 0, ${settings.shadowOpacity})`;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = Math.round(shadowBlur * 0.35);
  }

  if (radius > 0) {
    drawRoundedRect(ctx, photoX, photoY, photoWidth, photoHeight, radius);
    ctx.clip();
  }

  ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);
  ctx.restore();

  // 3. Watermark layout placement
  const watermarkAreaX = totalPaddingX;
  const watermarkAreaY = photoY + photoHeight;
  const watermarkAreaW = photoWidth;
  const watermarkAreaH = bottomBarHeight;

  // Drag offset applied
  const dragOffsetX = Math.round((settings.watermarkOffsetX || 0) * scale);
  const dragOffsetY = Math.round((settings.watermarkOffsetY || 0) * scale);

  const adjustedWatermarkX = watermarkAreaX + dragOffsetX;
  const adjustedWatermarkY = watermarkAreaY + dragOffsetY;

  // 4. Resolve Logo Variant (Color, White, Dark, None)
  let activeLogoVariant: 'color' | 'white' | 'dark' | 'none' = template.defaultLogoMode;

  if (settings.logoColorMode && settings.logoColorMode !== 'auto') {
    activeLogoVariant = settings.logoColorMode;
  } else if (!settings.showLogo) {
    activeLogoVariant = 'none';
  }

  // Load logo image according to activeLogoVariant
  let logoImg: HTMLImageElement | null = null;
  if (activeLogoVariant !== 'none') {
    const brandKey = (exif.make || template.defaultLogo || 'canon').toLowerCase();
    logoImg = await getLogoImage(brandKey, activeLogoVariant);
  }

  // 5. Render Watermark layout according to the 8 templates
  ctx.save();
  if (template.layoutStyle === 'soft-focus') {
    // 【柔焦】：对标原图，第1行居中固定展示相机品牌名，第2行居中纯空格展示焦距 光圈 快门 ISO
    drawSoftFocusWatermark(ctx, {
      x: adjustedWatermarkX,
      y: adjustedWatermarkY,
      width: watermarkAreaW,
      height: watermarkAreaH,
      settings,
      template,
      exif,
      scale
    });
  } else if (template.layoutStyle === 'blur-bg') {
    // 【背景模糊】：纯文字精致排版
    drawDirectTextWatermark(ctx, {
      x: adjustedWatermarkX,
      y: adjustedWatermarkY,
      width: watermarkAreaW,
      height: watermarkAreaH,
      settings,
      template,
      exif,
      scale
    });
  } else if (template.layoutStyle === 'logo-center') {
    // 【logo居中】：Logo 位于正中，左右平衡
    drawCenteredLogoWatermark(ctx, {
      x: adjustedWatermarkX,
      y: adjustedWatermarkY,
      width: watermarkAreaW,
      height: watermarkAreaH,
      settings,
      template,
      exif,
      logoImg,
      scale
    });
  } else if (template.layoutStyle === 'standard-2') {
    // 【标准水印2】：双行对齐紧凑架构
    drawStandard2Watermark(ctx, {
      x: adjustedWatermarkX,
      y: adjustedWatermarkY,
      width: watermarkAreaW,
      height: watermarkAreaH,
      settings,
      template,
      exif,
      logoImg,
      scale
    });
  } else if (template.layoutStyle === 'polaroid') {
    // 【拍立得】
    drawPolaroidWatermark(ctx, {
      x: adjustedWatermarkX,
      y: adjustedWatermarkY,
      width: watermarkAreaW,
      height: watermarkAreaH,
      settings,
      template,
      exif,
      logoImg,
      scale
    });
  } else {
    // 【标准水印】/【奶油底签】/【黑金夜行】
    drawClassicSplitWatermark(ctx, {
      x: adjustedWatermarkX,
      y: adjustedWatermarkY,
      width: watermarkAreaW,
      height: watermarkAreaH,
      settings,
      template,
      exif,
      logoImg,
      scale
    });
  }
  ctx.restore();

  return {
    canvas,
    watermarkBounds: {
      x: adjustedWatermarkX,
      y: adjustedWatermarkY,
      width: watermarkAreaW,
      height: watermarkAreaH
    }
  };
}

/**
 * 柔焦专用水印：像素级对标原图
 * 第一行：相机品牌名（固定展示品牌名，如 Canon），纯白，居中
 * 第二行：焦距 光圈 快门 ISO，纯空格连接，居中
 */
function drawSoftFocusWatermark(
  ctx: CanvasRenderingContext2D,
  params: {
    x: number;
    y: number;
    width: number;
    height: number;
    settings: FrameSettings;
    template: WatermarkTemplate;
    exif: ExifData;
    scale: number;
  }
) {
  const { x, y, width, height, settings, exif } = params;

  const fontScale = settings.fontSizeScale || 1.0;
  const baseSize = Math.max(14, Math.round(height * 0.24 * fontScale));
  const subSize = Math.max(11, Math.round(height * 0.16 * fontScale));

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 1. Line 1: 相机品牌名 (用户确认: 仅固定展示相机品牌名，如 Canon)
  const brandName = exif.make || 'Canon';
  ctx.font = `600 ${baseSize}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(brandName, centerX, centerY - Math.round(baseSize * 0.65));

  // 2. Line 2: 焦距 光圈 快门 ISO (用户确认: 采用空格间隔整洁居中呈现)
  const paramsParts: string[] = [];
  if (exif.focalLength) paramsParts.push(exif.focalLength);
  if (exif.aperture) paramsParts.push(exif.aperture);
  if (exif.shutterSpeed) paramsParts.push(exif.shutterSpeed);
  if (exif.iso) paramsParts.push(exif.iso);

  const paramsText = paramsParts.length > 0 ? paramsParts.join('   ') : 'f/2.8   1/1579s';

  ctx.font = `400 ${subSize}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(paramsText, centerX, centerY + Math.round(subSize * 0.8));
}

/**
 * 纯文字直接排版（用于 背景模糊，严格无 Logo）
 */
function drawDirectTextWatermark(
  ctx: CanvasRenderingContext2D,
  params: {
    x: number;
    y: number;
    width: number;
    height: number;
    settings: FrameSettings;
    template: WatermarkTemplate;
    exif: ExifData;
    scale: number;
  }
) {
  const { x, y, width, height, settings, template, exif } = params;

  const fontScale = settings.fontSizeScale || 1.0;
  const baseSize = Math.max(12, Math.round(height * 0.22 * fontScale));
  const subSize = Math.max(10, Math.round(height * 0.16 * fontScale));

  const primaryColor = settings.textColor || template.textColor;
  const secondaryColor = settings.subTextColor || template.subTextColor || '#A1A1AA';

  const marginX = Math.round(width * 0.04);
  const centerY = y + height / 2;

  // Left: Camera Model & Lens
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const hasModel = settings.showModel && (exif.model || exif.make);
  const hasLens = settings.showLens && exif.lens;

  if (hasModel && hasLens) {
    ctx.font = `600 ${baseSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(exif.model || exif.make, x + marginX, centerY - Math.round(baseSize * 0.55));

    ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = secondaryColor;
    ctx.fillText(exif.lens, x + marginX, centerY + Math.round(subSize * 0.65));
  } else if (hasModel || hasLens) {
    ctx.font = `600 ${baseSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = primaryColor;
    ctx.fillText((hasModel ? exif.model : exif.lens) || '', x + marginX, centerY);
  }

  // Right: Exposure Parameters & Date
  const rightMarginX = x + width - marginX;
  ctx.textAlign = 'right';

  const paramsParts: string[] = [];
  if (settings.showParams) {
    if (exif.focalLength) paramsParts.push(exif.focalLength);
    if (exif.aperture) paramsParts.push(exif.aperture);
    if (exif.shutterSpeed) paramsParts.push(exif.shutterSpeed);
    if (exif.iso) paramsParts.push(exif.iso);
  }
  const paramsText = paramsParts.join('   ');

  const subParts: string[] = [];
  if (settings.showDate && exif.dateTime) subParts.push(exif.dateTime);
  if (settings.showPhotographer && exif.photographer) subParts.push(exif.photographer);
  const subText = subParts.join('  ·  ');

  if (paramsText && subText) {
    ctx.font = `600 ${baseSize}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(paramsText, rightMarginX, centerY - Math.round(baseSize * 0.55));

    ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = secondaryColor;
    ctx.fillText(subText, rightMarginX, centerY + Math.round(subSize * 0.65));
  } else if (paramsText || subText) {
    ctx.font = `600 ${baseSize}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(paramsText || subText, rightMarginX, centerY);
  }
}

/**
 * 经典分栏水印 (标准水印, 奶油底签, 黑金夜行)
 */
function drawClassicSplitWatermark(
  ctx: CanvasRenderingContext2D,
  params: {
    x: number;
    y: number;
    width: number;
    height: number;
    settings: FrameSettings;
    template: WatermarkTemplate;
    exif: ExifData;
    logoImg: HTMLImageElement | null;
    scale: number;
  }
) {
  const { x, y, width, height, settings, template, exif, logoImg, scale } = params;

  const fontScale = settings.fontSizeScale || 1.0;
  const baseSize = Math.max(12, Math.round(height * 0.22 * fontScale));
  const subSize = Math.max(10, Math.round(height * 0.16 * fontScale));

  const primaryColor = settings.textColor || template.textColor;
  const secondaryColor = settings.subTextColor || template.subTextColor || '#71717A';

  const marginX = Math.round(width * 0.04);
  const centerY = y + height / 2;

  let currentLeftX = x + marginX;

  // 1. Logo
  if (settings.showLogo && logoImg) {
    const logoScale = settings.logoScale || 1.0;
    const targetLogoH = Math.round(height * 0.38 * logoScale);
    const aspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
    const targetLogoW = Math.round(targetLogoH * aspect);
    const logoY = centerY - targetLogoH / 2;

    ctx.drawImage(logoImg, currentLeftX, logoY, targetLogoW, targetLogoH);
    currentLeftX += targetLogoW + Math.round(16 * scale);
  }

  // 2. Vertical Divider
  if (settings.showDivider && settings.showLogo && logoImg) {
    ctx.strokeStyle = template.theme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)';
    ctx.lineWidth = Math.max(1, Math.round(1.5 * scale));
    ctx.beginPath();
    ctx.moveTo(currentLeftX, centerY - Math.round(height * 0.2));
    ctx.lineTo(currentLeftX, centerY + Math.round(height * 0.2));
    ctx.stroke();
    currentLeftX += Math.round(16 * scale);
  }

  // 3. Model & Lens
  const hasModel = settings.showModel && (exif.model || exif.make);
  const hasLens = settings.showLens && exif.lens;

  if (hasModel || hasLens) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    if (hasModel && hasLens) {
      ctx.font = `600 ${baseSize}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = primaryColor;
      ctx.fillText(exif.model || exif.make, currentLeftX, centerY - Math.round(baseSize * 0.55));

      ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = secondaryColor;
      ctx.fillText(exif.lens, currentLeftX, centerY + Math.round(subSize * 0.65));
    } else {
      ctx.font = `600 ${baseSize}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = primaryColor;
      ctx.fillText((hasModel ? exif.model : exif.lens) || '', currentLeftX, centerY);
    }
  }

  // 4. Right side parameters
  const rightMarginX = x + width - marginX;
  ctx.textAlign = 'right';

  const paramsParts: string[] = [];
  if (settings.showParams) {
    if (exif.focalLength) paramsParts.push(exif.focalLength);
    if (exif.aperture) paramsParts.push(exif.aperture);
    if (exif.shutterSpeed) paramsParts.push(exif.shutterSpeed);
    if (exif.iso) paramsParts.push(exif.iso);
  }
  const paramsText = paramsParts.join('   ');

  const subParts: string[] = [];
  if (settings.showDate && exif.dateTime) subParts.push(exif.dateTime);
  if (settings.showPhotographer && exif.photographer) subParts.push(exif.photographer);
  const subText = subParts.join('  ·  ');

  if (paramsText && subText) {
    ctx.font = `600 ${baseSize}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(paramsText, rightMarginX, centerY - Math.round(baseSize * 0.55));

    ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = secondaryColor;
    ctx.fillText(subText, rightMarginX, centerY + Math.round(subSize * 0.65));
  } else if (paramsText || subText) {
    ctx.font = `600 ${baseSize}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(paramsText || subText, rightMarginX, centerY);
  }
}

/**
 * 标准水印2 (双行紧凑对齐，精细纵向分割线)
 */
function drawStandard2Watermark(
  ctx: CanvasRenderingContext2D,
  params: {
    x: number;
    y: number;
    width: number;
    height: number;
    settings: FrameSettings;
    template: WatermarkTemplate;
    exif: ExifData;
    logoImg: HTMLImageElement | null;
    scale: number;
  }
) {
  const { x, y, width, height, settings, template, exif, logoImg, scale } = params;

  const fontScale = settings.fontSizeScale || 1.0;
  const baseSize = Math.max(12, Math.round(height * 0.22 * fontScale));
  const subSize = Math.max(10, Math.round(height * 0.15 * fontScale));

  const primaryColor = settings.textColor || template.textColor;
  const secondaryColor = settings.subTextColor || template.subTextColor || '#71717A';

  const marginX = Math.round(width * 0.04);
  const centerY = y + height / 2;

  let currentLeftX = x + marginX;

  // Logo
  if (settings.showLogo && logoImg) {
    const logoScale = settings.logoScale || 1.0;
    const targetLogoH = Math.round(height * 0.36 * logoScale);
    const aspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
    const targetLogoW = Math.round(targetLogoH * aspect);
    ctx.drawImage(logoImg, currentLeftX, centerY - targetLogoH / 2, targetLogoW, targetLogoH);
    currentLeftX += targetLogoW + Math.round(14 * scale);
  }

  // Model & Lens on left
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${baseSize}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = primaryColor;
  ctx.fillText(exif.model || exif.make, currentLeftX, centerY - Math.round(baseSize * 0.55));

  ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = secondaryColor;
  ctx.fillText(exif.lens || '', currentLeftX, centerY + Math.round(subSize * 0.65));

  // Right side 2-line parameters
  const rightMarginX = x + width - marginX;
  ctx.textAlign = 'right';

  const line1Parts = [exif.aperture, exif.shutterSpeed, exif.iso].filter(Boolean).join(' · ');
  const line2Parts = [exif.focalLength, exif.dateTime, exif.photographer].filter(Boolean).join(' · ');

  ctx.font = `600 ${baseSize}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = primaryColor;
  ctx.fillText(line1Parts, rightMarginX, centerY - Math.round(baseSize * 0.55));

  ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = secondaryColor;
  ctx.fillText(line2Parts, rightMarginX, centerY + Math.round(subSize * 0.65));
}

/**
 * logo居中 (品牌 Logo 正中，左右对称)
 */
function drawCenteredLogoWatermark(
  ctx: CanvasRenderingContext2D,
  params: {
    x: number;
    y: number;
    width: number;
    height: number;
    settings: FrameSettings;
    template: WatermarkTemplate;
    exif: ExifData;
    logoImg: HTMLImageElement | null;
    scale: number;
  }
) {
  const { x, y, width, height, settings, template, exif, logoImg, scale } = params;

  const fontScale = settings.fontSizeScale || 1.0;
  const baseSize = Math.max(12, Math.round(height * 0.22 * fontScale));
  const subSize = Math.max(10, Math.round(height * 0.15 * fontScale));

  const primaryColor = settings.textColor || template.textColor;
  const secondaryColor = settings.subTextColor || template.subTextColor || '#71717A';

  const marginX = Math.round(width * 0.04);
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  // 1. Center: Draw Logo
  if (settings.showLogo && logoImg) {
    const logoScale = settings.logoScale || 1.1;
    const targetLogoH = Math.round(height * 0.4 * logoScale);
    const aspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
    const targetLogoW = Math.round(targetLogoH * aspect);
    ctx.drawImage(logoImg, centerX - targetLogoW / 2, centerY - targetLogoH / 2, targetLogoW, targetLogoH);
  }

  // 2. Left: Model & Lens
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${baseSize}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = primaryColor;
  ctx.fillText(exif.model || exif.make, x + marginX, centerY - Math.round(baseSize * 0.55));

  ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = secondaryColor;
  ctx.fillText(exif.lens || '', x + marginX, centerY + Math.round(subSize * 0.65));

  // 3. Right: Exposure Parameters & Date
  const rightMarginX = x + width - marginX;
  ctx.textAlign = 'right';

  const paramsParts = [exif.focalLength, exif.aperture, exif.shutterSpeed, exif.iso].filter(Boolean).join('  ');
  ctx.font = `600 ${baseSize}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = primaryColor;
  ctx.fillText(paramsParts, rightMarginX, centerY - Math.round(baseSize * 0.55));

  ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = secondaryColor;
  ctx.fillText(exif.dateTime || '', rightMarginX, centerY + Math.round(subSize * 0.65));
}

/**
 * 拍立得相纸水印
 */
function drawPolaroidWatermark(
  ctx: CanvasRenderingContext2D,
  params: {
    x: number;
    y: number;
    width: number;
    height: number;
    settings: FrameSettings;
    template: WatermarkTemplate;
    exif: ExifData;
    logoImg: HTMLImageElement | null;
    scale: number;
  }
) {
  const { x, y, width, height, settings, template, exif, logoImg } = params;

  const fontScale = settings.fontSizeScale || 1.0;
  const baseSize = Math.max(13, Math.round(height * 0.18 * fontScale));
  const subSize = Math.max(11, Math.round(height * 0.13 * fontScale));
  const primaryColor = settings.textColor || '#18181B';
  const secondaryColor = settings.subTextColor || '#71717A';

  const marginX = Math.round(width * 0.05);
  const centerY = y + height / 2;

  // Left: Polaroid Rainbow Bar Logo
  if (settings.showLogo && logoImg) {
    const logoScale = settings.logoScale || 1.1;
    const targetLogoH = Math.round(height * 0.28 * logoScale);
    const aspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
    const targetLogoW = Math.round(targetLogoH * aspect);
    ctx.drawImage(logoImg, x + marginX, centerY - targetLogoH / 2, targetLogoW, targetLogoH);
  }

  // Right: Handwritten / Vintage parameters
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  const modelText = [exif.model, exif.lens].filter(Boolean).join('  ');
  if (modelText) {
    ctx.font = `600 ${baseSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(modelText, x + width - marginX, centerY - Math.round(baseSize * 0.6));
  }

  const paramsParts = [exif.focalLength, exif.aperture, exif.shutterSpeed, exif.iso, exif.dateTime].filter(Boolean).join(' · ');
  if (paramsParts) {
    ctx.font = `400 ${subSize}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = secondaryColor;
    ctx.fillText(paramsParts, x + width - marginX, centerY + Math.round(subSize * 0.7));
  }
}
