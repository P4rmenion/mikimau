import { Order, Rental, Sort } from '@lib/definitions';
import { sortRentals } from '@lib/utils';

describe('sortRentals() Tests', () => {
  it('Should sort rentals by movie title', async () => {
    const sortBy: Sort = 'TITLE';
    const order: Order = 'ASC';

    const rentals: Rental[] = [
      {
        uuid: 'uuid',
        movie: 'B',
        rental_date: 'rental_date',
        return_date: 'return_date',
        is_paid: true,
        user: 'user',
      },
      {
        uuid: 'uuid',
        movie: 'A',
        rental_date: 'rental_date',
        return_date: 'return_date',
        is_paid: false,
        user: 'user',
      },
      {
        uuid: 'uuid',
        movie: 'C',
        rental_date: 'rental_date',
        return_date: 'return_date',
        is_paid: false,
        user: 'user',
      },
    ];

    const sortedRentals = sortRentals({ sortBy, rentals, order });

    expect(sortedRentals[0].movie).toBe('A');
    expect(sortedRentals[1].movie).toBe('B');
    expect(sortedRentals[2].movie).toBe('C');
  });

  it('Should sort rentals by movie rental date', async () => {
    const sortBy: Sort = 'RENTAL_DATE';
    const order: Order = 'DESC';

    const rentals: Rental[] = [
      {
        uuid: 'uuid',
        movie: 'movie',
        rental_date: '2023-01-01',
        return_date: 'return_date',
        is_paid: true,
        user: 'user',
      },
      {
        uuid: 'uuid',
        movie: 'movie',
        rental_date: '2023-01-02',
        return_date: 'return_date',
        is_paid: false,
        user: 'user',
      },
      {
        uuid: 'uuid',
        movie: 'movie',
        rental_date: '2023-01-03',
        return_date: 'return_date',
        is_paid: false,
        user: 'user',
      },
    ];

    const sortedRentals = sortRentals({ sortBy, rentals, order });

    expect(sortedRentals[0].rental_date).toBe('2023-01-03');
    expect(sortedRentals[1].rental_date).toBe('2023-01-02');
    expect(sortedRentals[2].rental_date).toBe('2023-01-01');
  });
  it('Should sort rentals by movie status', async () => {
    const sortBy: Sort = 'STATUS';
    const order: Order = 'ASC';

    const rentals: Rental[] = [
      {
        uuid: 'uuid',
        movie: 'movie',
        rental_date: '2023-01-01',
        return_date: 'return_date',
        is_paid: true,
        user: 'user',
      },
      {
        uuid: 'uuid',
        movie: 'movie',
        rental_date: '2023-01-02',
        return_date: 'return_date',
        is_paid: false,
        user: 'user',
      },
      {
        uuid: 'uuid',
        movie: 'movie',
        rental_date: '2023-01-03',
        return_date: 'return_date',
        is_paid: false,
        user: 'user',
      },
    ];

    const sortedRentals = sortRentals({ sortBy, rentals, order });

    expect(sortedRentals[0].is_paid).toBe(true);
    expect(sortedRentals[1].is_paid).toBe(false);
    expect(sortedRentals[2].is_paid).toBe(false);
  });
});
