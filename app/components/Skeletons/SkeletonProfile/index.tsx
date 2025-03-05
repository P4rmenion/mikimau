import { Skeleton } from '@components/shadcn/skeleton';

const SkeletonProfile = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-lg p-4">
      <Skeleton className="bg-secondary-300 h-[15vw] w-[15vw] rounded-full" />
      <div className="flex w-4/5 flex-col items-center gap-4">
        <Skeleton className="bg-secondary-300 h-[20px] w-full" />
        <Skeleton className="bg-secondary-300 h-[20px] w-full" />
        <Skeleton className="bg-secondary-300 mr-auto h-[20px] w-4/5" />
      </div>
    </div>
  );
};

export default SkeletonProfile;
