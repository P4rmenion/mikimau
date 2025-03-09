import { rentMovie } from '@lib/api';
import { safeFetch } from '@actions/auth';

// Mock the safeFetch function
jest.mock('../../../actions/auth', () => ({
  safeFetch: jest.fn(),
}));

describe('rentMovie() Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('Should return movie uuid on success', async () => {
    const mockMovieRentalResponse: { movie: string } = {
      movie: '1',
    };

    // Mock the safeFetch call to return the mock response
    (safeFetch as jest.Mock).mockResolvedValue(mockMovieRentalResponse);
    const response = await rentMovie('mockAccessToken', '1');

    expect(safeFetch).toHaveBeenCalledWith(
      `/api/rentals/`,
      expect.objectContaining({
        body: '{"movie":"1"}',
        headers: {
          Authorization: 'Bearer mockAccessToken',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    );

    expect(response).toEqual(mockMovieRentalResponse);
  });

  it('Should return error on failure', async () => {
    const mockErrorResponse = { error: 'Unauthorized', status: 401 };

    // Mock the safeFetch call to return the error response
    (safeFetch as jest.Mock).mockResolvedValue(mockErrorResponse);
    const response = await rentMovie(null, '1');

    expect(response).toEqual(mockErrorResponse);
  });
});
