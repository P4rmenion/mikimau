import { Skeleton } from '@components/shadcn/skeleton';

const SkeletonMovieDetails = () => {
  return (
    <div className="flex h-[60vh] w-full min-w-[40vw] flex-col items-start justify-start gap-[10px] rounded-lg">
      <Skeleton className="bg-secondary-300 h-[60px] w-2/3" />
      <Skeleton className="bg-secondary-300 h-[140px] w-full rounded-lg" />
      <div className="flex w-full flex-col items-start justify-between gap-4">
        <Skeleton className="bg-secondary-300 h-[40px] w-1/2" />
        <Skeleton className="bg-secondary-300 h-[30px] w-1/2" />
        <Skeleton className="bg-secondary-300 h-[20px] w-1/2" />
      </div>
    </div>
  );
};

export default SkeletonMovieDetails;
