import { fetchCategories } from '@lib/api';
import { safeFetch } from '@actions/auth';
import { Category } from '@lib/definitions';

// Mock the safeFetch function
jest.mock('../../../actions/auth', () => ({
  safeFetch: jest.fn(),
}));

describe('fetchCategories() Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('Should return categories on success', async () => {
    const mockCategoriesResponse: Category[] = [
      { name: 'Action' },
      { name: 'Comedy' },
    ];

    // Mock the safeFetch call to return the mock response
    (safeFetch as jest.Mock).mockResolvedValue(mockCategoriesResponse);
    const response = await fetchCategories('mockAccessToken');

    expect(safeFetch).toHaveBeenCalledWith(
      '/api/categories',
      expect.objectContaining({
        headers: { Authorization: 'Bearer mockAccessToken' },
        method: 'GET',
      }),
    );

    expect(response).toEqual(mockCategoriesResponse);
  });

  it('Should return error on failure', async () => {
    const mockErrorResponse = { error: 'Unauthorized', status: 401 };

    // Mock the safeFetch call to return the error response
    (safeFetch as jest.Mock).mockResolvedValue(mockErrorResponse);
    const response = await fetchCategories(null);

    expect(response).toEqual(mockErrorResponse);
  });
});
