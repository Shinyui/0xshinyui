import Image from 'next/image';

interface PostCoverProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  sizes?: string;
  priority?: boolean;
}

export default function PostCover({
  src,
  alt,
  aspectRatio = '16/9',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
}: PostCoverProps) {
  return (
    <div
      className="relative mb-4 h-48 w-full overflow-hidden rounded-md border"
      style={{
        borderColor: 'var(--border-color)',
        aspectRatio
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 hover:scale-105"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
