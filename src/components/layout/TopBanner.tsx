import AdSlot from '@/components/ads/AdSlot';

export default function TopBanner() {
  return (
    <div className="w-full px-4 sm:px-6 pt-4">
      <div className="mx-auto max-w-[1280px]">
        <AdSlot
          size="large-leaderboard"
          placement="Site top leaderboard"
        />
      </div>
    </div>
  );
}
