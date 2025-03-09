import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Order, Rental, Sort } from './definitions';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortRentals = ({
  sortBy,
  rentals,
  order,
}: {
  sortBy: Sort;
  rentals: Rental[];
  order: Order;
}): Rental[] => {
  const sortedRentals = [...rentals];

  sortedRentals.sort((a: Rental, b: Rental): number => {
    switch (sortBy) {
      // Sort alphabetically by movie title
      case 'TITLE':
        return a.movie.localeCompare(b.movie);
      case 'USER':
        return a.user.localeCompare(b.user);
      // Sort by date
      case 'RENTAL_DATE':
        return (
          new Date(a.rental_date).getTime() - new Date(b.rental_date).getTime()
        );
      // Sort by active status
      case 'STATUS':
        return a.is_paid ? -1 : 1;
      default:
        return 0;
    }
  });

  if (order === 'DESC') {
    sortedRentals.reverse();
  }

  return sortedRentals;
};

export const arrangeRentals = (
  sortBy: Sort,
  order: Order,
  setSortBy: (sort: Sort) => void,
  setOrder: (order: Order) => void,
) => {
  setSortBy(sortBy);
  setOrder(order === 'ASC' ? 'DESC' : 'ASC');
};
