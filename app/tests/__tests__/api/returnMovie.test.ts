import { returnMovie } from '@lib/api';
import { safeFetch } from '@actions/auth';

// Mock the safeFetch function
jest.mock('../../../actions/auth', () => ({
  safeFetch: jest.fn(),
}));

describe('returnMovie() Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('Should make a PATCH request to return a movie', async () => {
    const mockMovieReturnResponse = {};

    // Mock the safeFetch call to return the mock response
    (safeFetch as jest.Mock).mockResolvedValue(mockMovieReturnResponse);
    await returnMovie('mockAccessToken', '1');

    expect(safeFetch).toHaveBeenCalledWith(
      `/api/rentals/1`,
      expect.objectContaining({
        headers: { Authorization: 'Bearer mockAccessToken' },
        method: 'PATCH',
      }),
    );
  });

  it('Should return error on failure', async () => {
    const mockErrorResponse = { error: 'Unauthorized', status: 401 };

    // Mock the safeFetch call to return the error response
    (safeFetch as jest.Mock).mockResolvedValue(mockErrorResponse);
    const response = await returnMovie(null, '1');

    expect(response).toEqual(mockErrorResponse);
  });
});
