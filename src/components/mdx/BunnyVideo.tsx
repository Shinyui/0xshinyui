type BunnyVideoProps = {
  src: string;
  poster?: string;
};

export default function BunnyVideo({ src, poster }: BunnyVideoProps) {
  return (
    <div className="w-full my-4 rounded overflow-hidden shadow-md">
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster}
        className="w-full"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
