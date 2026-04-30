export const BUNNY_CDN_BASE = process.env.NEXT_PUBLIC_BUNNY_CDN_BASE || '';

export type BunnyImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
  crop?: string;
  aspect_ratio?: string;
  sharpen?: boolean;
  format?: 'webp' | 'jpeg' | 'png' | 'gif';
};

/**
 * Append Bunny Optimizer Dynamic Images parameters to a URL.
 *
 * Docs: https://docs.bunny.net/optimizer/dynamic-images/overview
 *
 * Transformation order (handled by Bunny):
 * 1. Crop (crop, aspect_ratio, face_crop)
 * 2. Resize (width, height)
 * 3. Reflections/rotations
 * 4. Color/luminosity
 * 5. Filters (blur, sharpen)
 * 6. Format and quality
 */
export function bunnyOptimize(src: string, options: BunnyImageOptions = {}): string {
  const url = new URL(src);

  if (options.crop) url.searchParams.set('crop', options.crop);
  if (options.aspect_ratio) url.searchParams.set('aspect_ratio', options.aspect_ratio);
  if (options.width) url.searchParams.set('width', String(options.width));
  if (options.height) url.searchParams.set('height', String(options.height));
  if (options.sharpen) url.searchParams.set('sharpen', 'true');
  if (options.quality) url.searchParams.set('quality', String(options.quality));
  if (options.format) url.searchParams.set('format', options.format);

  return url.toString();
}
