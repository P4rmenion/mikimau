import { fetchMovieDetails } from '@lib/api';
import { safeFetch } from '@actions/auth';
import { Movie } from '@lib/definitions';

// Mock the safeFetch function
jest.mock('../../../actions/auth', () => ({
  safeFetch: jest.fn(),
}));

describe('fetchMovieDetails() Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('Should return user details on success', async () => {
    const mockMovieDetailsResponse: Movie = {
      uuid: '1',
      title: 'Movie 1',
      rating: 4.5,
      pub_date: 2023,
      duration: 120,
      description: 'Description 1',
      poster_url: 'https://example.com/poster1.jpg',
    };

    // Mock the safeFetch call to return the mock response
    (safeFetch as jest.Mock).mockResolvedValue(mockMovieDetailsResponse);
    const response = await fetchMovieDetails('mockAccessToken', '1');

    expect(safeFetch).toHaveBeenCalledWith(
      `/api/movies/1`,
      expect.objectContaining({
        headers: { Authorization: 'Bearer mockAccessToken' },
        method: 'GET',
      }),
    );

    expect(response).toEqual(mockMovieDetailsResponse);
  });

  it('Should return error on failure', async () => {
    const mockErrorResponse = { error: 'Unauthorized', status: 401 };

    // Mock the safeFetch call to return the error response
    (safeFetch as jest.Mock).mockResolvedValue(mockErrorResponse);
    const response = await fetchMovieDetails(null, '1');

    expect(response).toEqual(mockErrorResponse);
  });
});
