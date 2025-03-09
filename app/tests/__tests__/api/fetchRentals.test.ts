import { fetchRentals } from '@lib/api';
import { safeFetch } from '@actions/auth';
import { RentalResponse } from '@lib/definitions';

// Mock the safeFetch function
jest.mock('../../../actions/auth', () => ({
  safeFetch: jest.fn(),
}));

describe('fetchRentals() Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('Should return rentals on success', async () => {
    const mockRentalsResponse: RentalResponse = {
      results: [
        {
          uuid: '1',
          movie: 'Movie 1',
          rental_date: '2023-01-01',
          return_date: '2023-01-05',
          is_paid: true,
          user: 'email@example.com',
        },
        {
          uuid: '2',
          movie: 'Movie 2',
          rental_date: '2023-01-01',
          return_date: null,
          is_paid: false,
          user: 'email@example.com',
        },
      ],
      count: 2,
      next: null,
      previous: null,
    };

    // Mock the safeFetch call to return the mock response
    (safeFetch as jest.Mock).mockResolvedValue(mockRentalsResponse);

    const queryParams = new URLSearchParams({ page: '1', page_size: '20' });
    const response = await fetchRentals('mockAccessToken', queryParams);

    expect(safeFetch).toHaveBeenCalledWith(
      `/api/rentals?${queryParams}`,
      expect.objectContaining({
        headers: { Authorization: 'Bearer mockAccessToken' },
        method: 'GET',
      }),
    );

    expect(response).toEqual(mockRentalsResponse);
  });

  it('Should return error on failure', async () => {
    const mockErrorResponse = { error: 'Unauthorized', status: 401 };

    // Mock the safeFetch call to return the error response
    (safeFetch as jest.Mock).mockResolvedValue(mockErrorResponse);

    const queryParams = new URLSearchParams({ page: '1', page_size: '10' });
    const response = await fetchRentals(null, queryParams);

    expect(response).toEqual(mockErrorResponse);
  });
});
