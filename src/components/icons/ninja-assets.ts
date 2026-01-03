import { getNinjaSvgString } from './NinjaIcon';

export type IconSize = 16 | 32 | 48 | 64 | 128 | 256 | 512;

export interface IconAsset {
  size: IconSize;
  svg: string;
  dataUrl: string;
  filename: string;
}

/**
 * Generate SVG data URL for a ninja icon at the specified size
 */
export const getNinjaSvgDataUrl = (size: IconSize = 64): string => {
  const svg = getNinjaSvgString(size);
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Generate PNG data URL from SVG (requires canvas)
 */
export const getNinjaPngDataUrl = async (size: IconSize = 64): Promise<string> => {
  return new Promise((resolve, reject) => {
    const svg = getNinjaSvgString(size);
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => reject(new Error('Failed to load SVG'));
    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
  });
};

/**
 * Download icon as file
 */
export const downloadNinjaIcon = async (
  size: IconSize = 64,
  format: 'svg' | 'png' = 'svg'
): Promise<void> => {
  let dataUrl: string;
  let filename: string;

  if (format === 'svg') {
    dataUrl = getNinjaSvgDataUrl(size);
    filename = `ninja-icon-${size}x${size}.svg`;
  } else {
    dataUrl = await getNinjaPngDataUrl(size);
    filename = `ninja-icon-${size}x${size}.png`;
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate all standard icon sizes
 */
export const generateAllIconAssets = (): IconAsset[] => {
  const sizes: IconSize[] = [16, 32, 48, 64, 128, 256, 512];

  return sizes.map((size) => ({
    size,
    svg: getNinjaSvgString(size),
    dataUrl: getNinjaSvgDataUrl(size),
    filename: `ninja-icon-${size}x${size}.svg`,
  }));
};

/**
 * Generate favicon-ready icon (32x32)
 */
export const getFaviconSvg = (): string => getNinjaSvgString(32);

/**
 * Generate Apple Touch Icon (180x180) - uses closest available
 */
export const getAppleTouchIconSvg = (): string => getNinjaSvgString(256);

/**
 * Get icon as blob for programmatic use
 */
export const getNinjaIconBlob = async (
  size: IconSize = 64,
  format: 'svg' | 'png' = 'svg'
): Promise<Blob> => {
  if (format === 'svg') {
    const svg = getNinjaSvgString(size);
    return new Blob([svg], { type: 'image/svg+xml' });
  } else {
    const dataUrl = await getNinjaPngDataUrl(size);
    const response = await fetch(dataUrl);
    return response.blob();
  }
};
