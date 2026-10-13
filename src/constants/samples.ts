import { PhotoItem } from '../types';
import sampleStreetLeica from '../assets/images/sample_street_leica_1791792053570.jpg';
import sampleMountainLake from '../assets/images/sample_mountain_lake_1791792062627.jpg';
import samplePortraitWarm from '../assets/images/sample_portrait_warm_1791792071815.jpg';

export const SAMPLE_PHOTOS: PhotoItem[] = [
  {
    id: 'sample-1',
    name: 'Dolomites_Alpine_Lake.jpg',
    url: sampleMountainLake,
    width: 2048,
    height: 1365,
    selectedTemplateId: 'soft-focus',
    exif: {
      make: 'Canon',
      model: 'EOS R5',
      lens: 'RF 50mm F1.2 L USM',
      focalLength: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/1579s',
      iso: 'ISO 100',
      dateTime: '2024.09.28 17:42',
      photographer: 'Marco Bellini',
      location: 'Lago di Sorapis'
    }
  },
  {
    id: 'sample-2',
    name: 'Tokyo_Rain_Street.jpg',
    url: sampleStreetLeica,
    width: 2048,
    height: 1365,
    selectedTemplateId: 'standard-1',
    exif: {
      make: 'Leica',
      model: 'M11 Monochrom',
      lens: 'Summilux-M 35mm f/1.4 ASPH.',
      focalLength: '35mm',
      aperture: 'f/1.4',
      shutterSpeed: '1/250s',
      iso: 'ISO 400',
      dateTime: '2024.10.12 21:18',
      photographer: 'Kenji Sato',
      location: 'Shinjuku, Tokyo'
    }
  },
  {
    id: 'sample-3',
    name: 'Golden_Hour_Portrait.jpg',
    url: samplePortraitWarm,
    width: 2048,
    height: 1365,
    selectedTemplateId: 'cream-sign',
    exif: {
      make: 'Fujifilm',
      model: 'X100VI',
      lens: 'Fujinon 23mm F2.0 II',
      focalLength: '23mm',
      aperture: 'f/2.0',
      shutterSpeed: '1/800s',
      iso: 'ISO 160',
      dateTime: '2024.10.05 16:35',
      photographer: 'Chloe Lin',
      location: 'Kyoto Botanical Garden'
    }
  }
];

export const CAMERA_PRESETS = [
  {
    name: 'Leica M11 + 35mm f/1.4',
    make: 'Leica',
    model: 'M11',
    lens: 'Summilux-M 35mm f/1.4 ASPH.',
    focalLength: '35mm',
    aperture: 'f/1.4',
    shutterSpeed: '1/500s',
    iso: 'ISO 100'
  },
  {
    name: 'Sony A7M4 + 24-70 GM II',
    make: 'Sony',
    model: 'ILCE-7M4',
    lens: 'FE 24-70mm F2.8 GM II',
    focalLength: '50mm',
    aperture: 'f/2.8',
    shutterSpeed: '1/250s',
    iso: 'ISO 200'
  },
  {
    name: 'Hasselblad X2D 100C + 55mm',
    make: 'Hasselblad',
    model: 'X2D 100C',
    lens: 'XCD 55mm f/2.5 V',
    focalLength: '55mm',
    aperture: 'f/2.5',
    shutterSpeed: '1/160s',
    iso: 'ISO 64'
  },
  {
    name: 'Fujifilm X100VI + 23mm',
    make: 'Fujifilm',
    model: 'X100VI',
    lens: 'Fujinon 23mm F2.0',
    focalLength: '23mm',
    aperture: 'f/2.0',
    shutterSpeed: '1/400s',
    iso: 'ISO 125'
  },
  {
    name: 'Canon EOS R5 + 50mm f/1.2',
    make: 'Canon',
    model: 'Canon EOS R5',
    lens: 'RF50mm F1.2 L USM',
    focalLength: '50mm',
    aperture: 'f/1.2',
    shutterSpeed: '1/1000s',
    iso: 'ISO 100'
  },
  {
    name: 'Nikon Z8 + 85mm f/1.2',
    make: 'Nikon',
    model: 'NIKON Z 8',
    lens: 'NIKKOR Z 85mm f/1.2 S',
    focalLength: '85mm',
    aperture: 'f/1.2',
    shutterSpeed: '1/640s',
    iso: 'ISO 100'
  },
  {
    name: 'iPhone 16 Pro + 24mm',
    make: 'Apple',
    model: 'iPhone 16 Pro',
    lens: 'Main Camera 24mm f/1.78',
    focalLength: '24mm',
    aperture: 'f/1.8',
    shutterSpeed: '1/120s',
    iso: 'ISO 80'
  }
];
