'use client';

import Image from 'next/image';

import { useAuth } from '@context/AuthContext';
import { Order, Rental, Sort } from '@lib/definitions';
import { arrangeRentals, sortRentals } from '@lib/utils';

const RentalsTable = ({
  sortBy,
  order,
  rentals,
  setSortBy,
  setOrder,
  handleReturn,
}: {
  sortBy: Sort;
  order: Order;
  rentals: Rental[];
  setSortBy: (sortBy: Sort) => void;
  setOrder: (order: Order) => void;
  handleReturn?: (uuid: string) => void;
}) => {
  const { isAdmin } = useAuth();

  return (
    <table className="border-primary w-full border-separate rounded-xl border-2 p-4 shadow-lg shadow-black">
      <thead className="rounded-2xl">
        <tr className="bg-secondary">
          {isAdmin && (
            <th className="px-4 py-2 text-start">
              <div className="text-primary flex items-center gap-2 font-bold">
                User
                <button
                  onClick={() => {
                    arrangeRentals('USER', order, setSortBy, setOrder);
                  }}
                >
                  <Image
                    src="/left-chevron.svg"
                    alt="Sort icon"
                    width={20}
                    height={20}
                    className={`${sortBy === 'USER' ? (order === 'DESC' ? '-rotate-90' : 'rotate-90') : 'rotate-180'} border-primary h-full cursor-pointer rounded-full border`}
                  />
                </button>
              </div>
            </th>
          )}
          <th className="px-4 py-2 text-start">
            <div className="text-primary flex items-center gap-2 font-bold">
              Movie Title
              <button
                onClick={() => {
                  arrangeRentals('TITLE', order, setSortBy, setOrder);
                }}
                className="flex items-center justify-center"
              >
                <Image
                  src="/left-chevron.svg"
                  alt="Sort icon"
                  width={20}
                  height={20}
                  className={`${sortBy === 'TITLE' ? (order === 'DESC' ? '-rotate-90' : 'rotate-90') : 'rotate-180'} border-primary h-full cursor-pointer rounded-full border`}
                />
              </button>
            </div>
          </th>
          <th className="flex items-center gap-2 px-4 py-2 text-start">
            <div className="text-primary flex items-center gap-2 font-bold">
              Rental Date
              <button
                onClick={() => {
                  arrangeRentals('RENTAL_DATE', order, setSortBy, setOrder);
                }}
                className="flex items-center justify-center"
              >
                <Image
                  src="/left-chevron.svg"
                  alt="Sort icon"
                  width={20}
                  height={20}
                  className={`${sortBy === 'RENTAL_DATE' ? (order === 'DESC' ? '-rotate-90' : 'rotate-90') : 'rotate-180'} border-primary h-full cursor-pointer rounded-full border`}
                />
              </button>
            </div>
          </th>
          <th className="text-primary px-4 py-2 text-start font-bold">
            Return Date
          </th>
          <th className="flex items-center gap-2 px-4 py-2 text-start">
            <div className="text-primary flex items-center gap-2 font-bold">
              Status
              <button
                onClick={() => {
                  arrangeRentals('STATUS', order, setSortBy, setOrder);
                }}
                className="flex items-center justify-center"
              >
                <Image
                  src="/left-chevron.svg"
                  alt="Sort icon"
                  width={20}
                  height={20}
                  className={`${sortBy === 'STATUS' ? (order === 'DESC' ? '-rotate-90' : 'rotate-90') : 'rotate-180'} border-primary h-full cursor-pointer rounded-full border`}
                />
              </button>
            </div>
          </th>
          {!isAdmin && (
            <th className="text-primary px-4 py-2 text-start font-bold">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rentals &&
          sortRentals({ rentals, sortBy, order }).map((rental) => (
            <tr
              key={rental.uuid}
              className="odd:bg-secondary-400 even:bg-transparent"
            >
              {isAdmin && (
                <td className="h-14 px-4 py-3 font-semibold">{rental.user}</td>
              )}
              <td className="h-14 px-4 py-3 font-semibold">{rental.movie}</td>
              <td className="h-14 px-4 py-3 tracking-widest">
                {new Date(rental.rental_date).toLocaleDateString()}
              </td>
              <td className="h-14 px-4 py-3 tracking-widest">
                {rental.return_date
                  ? new Date(rental.return_date).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td className="text-md h-14 px-4 py-3">
                {rental.is_paid ? (
                  <span className="font-medium text-gray-200">Returned</span>
                ) : (
                  <span className="text-primary-100 font-medium">Rented</span>
                )}
              </td>
              {!isAdmin && handleReturn && (
                <td className="flex h-14 w-full min-w-32 items-center justify-center px-4 py-3">
                  {!rental.is_paid && (
                    <button
                      onClick={() => handleReturn(rental.uuid)}
                      className="border-primary text-md cursor-pointer rounded-full border-2 bg-transparent px-3 py-1 font-semibold text-white"
                    >
                      Return
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default RentalsTable;
