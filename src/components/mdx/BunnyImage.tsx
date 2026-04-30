import Image from 'next/image';
import { bunnyOptimize } from '@/lib/bunny';

type BunnyImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
};

export default function BunnyImage({ src, alt, width, height, quality }: BunnyImageProps) {
  const optimizedSrc = bunnyOptimize(src, {
    width,
    height,
    quality: quality ?? 80,
  });

  if (width && height) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt || ''}
        width={width}
        height={height}
        className="rounded shadow-md my-4"
        unoptimized
      />
    );
  }

  return (
    <div className="relative w-full my-4" style={{ minHeight: '200px' }}>
      <Image
        src={optimizedSrc}
        alt={alt || ''}
        fill
        className="!static w-full h-auto rounded shadow-md object-contain"
        unoptimized
      />
    </div>
  );
}
