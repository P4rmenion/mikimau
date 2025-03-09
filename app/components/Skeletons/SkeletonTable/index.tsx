import { Skeleton } from '@components/shadcn/skeleton';

const SkeletonTable = ({ rows = 5 }: { rows: number }) => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 rounded-lg py-5">
      <Skeleton className="bg-secondary-200 h-[35px] w-full" />

      <div className="flex w-full flex-col gap-3">
        {Array(rows)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              key={index}
              className="even:bg-secondary-300 odd:bg-secondary-400 h-[40px] w-full"
            />
          ))}
      </div>
    </div>
  );
};

export default SkeletonTable;
