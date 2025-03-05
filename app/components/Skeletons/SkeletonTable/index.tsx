import { Skeleton } from '@components/shadcn/skeleton';

const SkeletonTable = () => {
  return (
    <div className="flex w-[30vw] flex-col items-center justify-between gap-4 rounded-lg p-4">
      <Skeleton className="bg-secondary-300 h-[20px] w-full" />
      <Skeleton className="bg-secondary-300 h-[20px] w-full" />
      <Skeleton className="bg-secondary-300 h-[20px] w-full" />
    </div>
  );
};

export default SkeletonTable;
