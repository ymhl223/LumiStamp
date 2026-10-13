import exifr from 'exifr';
import { ExifData } from '../types';

export const RAW_EXTENSIONS = [
  '.cr2', '.cr3', '.nef', '.nrw', '.arw', '.srf', '.sr2',
  '.raf', '.dng', '.orf', '.rw2', '.pef', '.x3f', '.raw', '.erf'
];

export function isRawFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return RAW_EXTENSIONS.some(ext => name.endsWith(ext));
}

export function isSupportedFormat(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  if (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp') return true;
  return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp');
}

export function normalizeMake(make?: string): string {
  if (!make) return 'Camera';
  const m = make.trim().toLowerCase();
  if (m.includes('leica')) return 'Leica';
  if (m.includes('sony')) return 'Sony';
  if (m.includes('fujifilm') || m.includes('fuji')) return 'Fujifilm';
  if (m.includes('canon')) return 'Canon';
  if (m.includes('nikon')) return 'Nikon';
  if (m.includes('hasselblad')) return 'Hasselblad';
  if (m.includes('apple')) return 'Apple';
  if (m.includes('zeiss')) return 'Zeiss';
  if (m.includes('panasonic') || m.includes('lumix')) return 'Lumix';
  if (m.includes('olympus') || m.includes('om digital')) return 'Olympus';
  if (m.includes('ricoh')) return 'Ricoh';
  return make.trim();
}

export function formatExposureTime(exposureTime?: number): string {
  if (exposureTime === undefined || exposureTime === null || isNaN(exposureTime) || exposureTime <= 0) {
    return '1/125s';
  }
  if (exposureTime >= 1) {
    return `${Number(exposureTime.toFixed(1))}s`;
  }
  const denominator = Math.round(1 / exposureTime);
  return `1/${denominator}s`;
}

export function formatAperture(fNumber?: number): string {
  if (!fNumber || isNaN(fNumber) || fNumber <= 0) return 'f/2.8';
  return `f/${Number(fNumber.toFixed(1))}`;
}

export function formatFocalLength(focalLength?: number): string {
  if (!focalLength || isNaN(focalLength) || focalLength <= 0) return '50mm';
  return `${Math.round(focalLength)}mm`;
}

export function formatDateTime(date?: Date | string): string {
  if (!date) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${y}.${m}.${d} ${h}:${min}`;
  }
  try {
    const dObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dObj.getTime())) return String(date).slice(0, 16);
    const y = dObj.getFullYear();
    const m = String(dObj.getMonth() + 1).padStart(2, '0');
    const d = String(dObj.getDate()).padStart(2, '0');
    const h = String(dObj.getHours()).padStart(2, '0');
    const min = String(dObj.getMinutes()).padStart(2, '0');
    return `${y}.${m}.${d} ${h}:${min}`;
  } catch {
    return String(date);
  }
}

export async function parsePhotoExif(fileOrUrl: File | string): Promise<ExifData> {
  try {
    // Attempt parsing with exifr
    const raw = await exifr.parse(fileOrUrl, {
      tiff: true,
      exif: true,
      gps: true,
      makerNote: false
    });

    if (raw) {
      const make = normalizeMake(raw.Make);
      const model = raw.Model ? String(raw.Model).trim() : 'Digital Camera';
      const lens = raw.LensModel || raw.Lens || (raw.FocalLength ? `${Math.round(raw.FocalLength)}mm Prime` : 'Standard Lens');
      const focalLength = formatFocalLength(raw.FocalLengthIn35mmFormat || raw.FocalLength);
      const aperture = formatAperture(raw.FNumber || raw.ApertureValue);
      const shutterSpeed = formatExposureTime(raw.ExposureTime);
      const iso = raw.ISO || raw.ISOSpeedRatings ? `ISO ${raw.ISO || raw.ISOSpeedRatings}` : 'ISO 100';
      const dateTime = formatDateTime(raw.DateTimeOriginal || raw.CreateDate || raw.ModifyDate);
      const artist = raw.Artist || raw.Author || raw.OwnerName || 'Photographer';

      return {
        make,
        model,
        lens: String(lens).trim(),
        focalLength,
        aperture,
        shutterSpeed,
        iso: String(iso).startsWith('ISO') ? String(iso) : `ISO ${iso}`,
        dateTime,
        photographer: String(artist).trim()
      };
    }
  } catch (err) {
    console.warn('Failed to parse EXIF, using default values:', err);
  }

  // Graceful fallback default values
  return {
    make: 'Leica',
    model: 'M11',
    lens: 'Summilux-M 35mm f/1.4 ASPH.',
    focalLength: '35mm',
    aperture: 'f/1.4',
    shutterSpeed: '1/500s',
    iso: 'ISO 100',
    dateTime: formatDateTime(new Date()),
    photographer: 'FrameCraft'
  };
}
