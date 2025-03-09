import { Order, Sort } from '@lib/definitions';
import { arrangeRentals } from '@lib/utils';

describe('arrangeRentals() Tests', () => {
  it('Should update state variables', async () => {
    let sortBy: Sort = 'TITLE';
    let order: Order = 'ASC';

    const mockSetSortBy = jest.fn((newSortBy) => (sortBy = newSortBy));
    const mockSetOrder = jest.fn((newOrder) => (order = newOrder));

    arrangeRentals(sortBy, order, mockSetSortBy, mockSetOrder);

    expect(mockSetSortBy).toHaveBeenCalledWith('TITLE');
    expect(mockSetOrder).toHaveBeenCalledWith('DESC');

    expect(sortBy).toBe('TITLE');
    expect(order).toBe('DESC');
  });
});
