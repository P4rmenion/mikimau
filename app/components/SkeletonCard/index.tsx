import { Skeleton } from '@components/shadcn/skeleton';

const SkeletonCard = () => {
  return (
    <div className="flex h-[360px] w-[250px] flex-col items-center justify-between gap-[10px] rounded-lg p-4">
      <Skeleton className="bg-secondary-300 h-[250px] w-full rounded-lg" />
      <Skeleton className="bg-secondary-300 h-[30px] w-full" />
      <div className="flex w-full items-center justify-between">
        <Skeleton className="bg-secondary-300 h-[20px] w-[60px]" />
        <Skeleton className="bg-secondary-300 h-[20px] w-[60px]" />
        <Skeleton className="bg-secondary-300 h-[20px] w-[60px]" />
      </div>
    </div>
  );
};

export default SkeletonCard;
