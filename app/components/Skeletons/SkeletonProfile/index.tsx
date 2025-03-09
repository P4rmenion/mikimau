import { Skeleton } from '@components/shadcn/skeleton';

const SkeletonProfile = () => {
  return (
    <div className="flex items-center justify-between gap-10 rounded-lg p-20">
      <Skeleton className="bg-secondary-300 h-[15vw] w-[15vw] rounded-full" />
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="bg-secondary-300 h-[20px] w-[15vw]" />
        <Skeleton className="bg-secondary-300 h-[20px] w-[15vw]" />
        <Skeleton className="bg-secondary-300 mr-auto h-[20px] w-[12vw]" />
        <Skeleton className="bg-secondary-300 mr-auto h-[20px] w-[10vw]" />
      </div>
    </div>
  );
};

export default SkeletonProfile;
