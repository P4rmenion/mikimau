import { fetchMovies } from '@lib/api';
import { safeFetch } from '@actions/auth';
import { MovieResponse } from '@lib/definitions';

// Mock the safeFetch function
jest.mock('../../../actions/auth', () => ({
  safeFetch: jest.fn(),
}));

describe('fetchMovies() Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('Should return movies on success', async () => {
    const mockMoviesResponse: MovieResponse = {
      results: [
        {
          uuid: '1',
          title: 'Movie 1',
          rating: 4.5,
          pub_date: 2023,
          duration: 120,
          description: 'Description 1',
          poster_url: 'https://example.com/poster1.jpg',
        },
        {
          uuid: '2',
          title: 'Movie 2',
          rating: 4.0,
          pub_date: 2023,
          duration: 100,
          description: 'Description 2',
          poster_url: 'https://example.com/poster2.jpg',
        },
      ],
      count: 2,
      next: null,
      previous: null,
    };

    // Mock the safeFetch call to return the mock response
    (safeFetch as jest.Mock).mockResolvedValue(mockMoviesResponse);

    const queryParams = new URLSearchParams({ page: '1', page_size: '10' });
    const response = await fetchMovies('mockAccessToken', queryParams);

    expect(safeFetch).toHaveBeenCalledWith(
      `/api/movies?${queryParams}`,
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer mockAccessToken',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }),
    );

    expect(response).toEqual(mockMoviesResponse);
  });

  it('Should return error on failure', async () => {
    const mockErrorResponse = { error: 'Unauthorized', status: 401 };

    // Mock the safeFetch call to return the error response
    (safeFetch as jest.Mock).mockResolvedValue(mockErrorResponse);

    const queryParams = new URLSearchParams({ page: '1', page_size: '10' });
    const response = await fetchMovies(null, queryParams);

    expect(response).toEqual(mockErrorResponse);
  });
});
