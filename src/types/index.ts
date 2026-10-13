export interface ExifData {
  make: string;              // 相机品牌 (e.g., Leica, SONY, FUJIFILM, Canon, Nikon, Apple, Hasselblad)
  model: string;             // 相机机型 (e.g., M11, ILCE-7M4, X100VI, EOS R5)
  lens: string;              // 镜头型号 (e.g., APO-Summicron-M 50mm f/2 ASPH.)
  focalLength: string;       // 焦距 (e.g., 50mm, 35mm)
  aperture: string;          // 光圈 (e.g., f/2.0, f/1.4)
  shutterSpeed: string;      // 快门 (e.g., 1/500s, 1/125s, 2s)
  iso: string;               // 感光度 (e.g., 100, 400)
  dateTime: string;          // 拍摄时间 (e.g., 2024.10.12 16:48)
  photographer: string;      // 摄影师签名 / 自定义文案
  location?: string;         // 拍摄地点
}

export type TemplateCategory = 'camera' | 'film' | 'blur' | 'gallery' | 'minimal';

export interface WatermarkTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  theme: 'light' | 'dark' | 'custom' | 'blur';
  backgroundColor: string;
  textColor: string;
  subTextColor?: string;
  accentColor: string;
  defaultLogo: string;       // leica | hasselblad | sony | fujifilm | canon | nikon | apple | zeiss | lumix | film
  defaultLogoMode: 'color' | 'white' | 'dark' | 'none'; // 模板默认 Logo 色彩规则
  layoutStyle: 
    | 'standard-1'            // 标准水印
    | 'standard-2'            // 标准水印2
    | 'cream-sign'            // 奶油底签
    | 'black-gold'            // 黑金夜行
    | 'blur-bg'               // 背景模糊 (无Logo纯文字)
    | 'soft-focus'            // 柔焦 (无Logo纯文字)
    | 'logo-center'           // logo居中
    | 'polaroid'              // 拍立得
    | 'bottom-split'
    | 'bottom-center'
    | 'blur-inset'
    | 'bottom-polaroid'
    | 'bottom-film'
    | 'gallery-frame'
    | 'cinematic-bar'
    | 'floating-minimal';
  defaultSettings: FrameSettings;
}

export interface FrameSettings {
  paddingPercent: number;       // 上左边缘留白比例 (0% - 15%)
  bottomHeightPercent: number;  // 底部信息栏相对图片高度 (6% - 25%)
  borderRadius: number;         // 图片圆角 (0 - 48px)
  shadowBlur: number;           // 图片外阴影 (0 - 40px)
  shadowOpacity: number;        // 阴影不透明度 (0 - 1)
  backgroundColor: string;      // 边框底色
  textColor: string;            // 主要文字颜色
  subTextColor: string;         // 次要文字颜色
  blurAmount: number;           // 毛玻璃模糊半径 (px, 用于 blur-bg 模板)
  blurBrightness: number;       // 毛玻璃背景亮度 (0.5 - 1.5)
  logoScale: number;            // Logo 缩放倍率 (0.6 - 1.6)
  logoColorMode: 'auto' | 'color' | 'white' | 'dark' | 'none'; // Logo 颜色模式
  fontSizeScale: number;        // 字体缩放倍率 (0.7 - 1.5)
  showLogo: boolean;
  showModel: boolean;
  showLens: boolean;
  showParams: boolean;          // 光圈快门ISO焦距
  showDate: boolean;
  showPhotographer: boolean;
  showDivider: boolean;
  dividerStyle: 'line' | 'dot' | 'slash';
  // 拖拽与偏移微调 (相对基准位置的百分比或像素)
  watermarkOffsetX: number;     // 像素偏移 X
  watermarkOffsetY: number;     // 像素偏移 Y
  watermarkScale: number;       // 水印整体缩放
}

export interface PhotoItem {
  id: string;
  file?: File;
  name: string;
  url: string;                  // ObjectURL or asset URL
  width: number;
  height: number;
  exif: ExifData;
  customSettings?: Partial<FrameSettings>;
  selectedTemplateId: string;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  text: string;
}

export interface ExportConfig {
  quality: number; // 0.7 - 1.0 (default 0.92)
}
