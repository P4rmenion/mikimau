import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/shadcn/select';

import Image from 'next/image';

const Pagination = ({
  page,
  pageSize,
  totalPages,
  setPage,
  setPageSize,
}: {
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-center gap-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border-primary flex cursor-pointer items-center justify-center rounded-full border-1 bg-transparent p-1 text-black shadow-lg shadow-black disabled:border-gray-500 disabled:bg-gray-500 disabled:text-gray-400"
        >
          <Image
            src="/left-chevron.svg"
            width={20}
            height={20}
            alt="left chevron"
          />
        </button>
        <div className="flex gap-2">
          <span>{page}</span> / <span>{totalPages}</span>
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="border-primary flex cursor-pointer items-center justify-center rounded-full border-1 bg-transparent p-1 text-black shadow-lg shadow-black disabled:border-gray-500 disabled:bg-gray-500 disabled:text-gray-400"
        >
          <Image
            src="/left-chevron.svg"
            width={20}
            height={20}
            alt="right chevron"
            className="rotate-180"
          />
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm">
        Per page:
        <Select
          onValueChange={(value) => {
            setPageSize(Number(value));
            setPage(1);
          }}
          defaultValue={pageSize.toString()}
        >
          <SelectTrigger className="border-primary w-fit shadow-lg shadow-black">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent className="bg-secondary border-primary min-w-0">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
