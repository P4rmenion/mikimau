import { depositFunds } from '@lib/api';
import { safeFetch } from '@actions/auth';

// Mock the safeFetch function
jest.mock('../../../actions/auth', () => ({
  safeFetch: jest.fn(),
}));

describe('depositFunds() Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('Should return the deposit made on success', async () => {
    const mockDepositResponse: { deposit: number } = {
      deposit: 100,
    };

    // Mock the safeFetch call to return the mock response
    (safeFetch as jest.Mock).mockResolvedValue(mockDepositResponse);
    const response = await depositFunds('mockAccessToken', 100);

    expect(safeFetch).toHaveBeenCalledWith(
      `/api/profile/`,
      expect.objectContaining({
        body: '{"deposit":100}',
        headers: {
          Authorization: 'Bearer mockAccessToken',
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      }),
    );

    expect(response).toEqual(mockDepositResponse);
  });

  it('Should return error on failure', async () => {
    const mockErrorResponse = { error: 'Unauthorized', status: 401 };

    // Mock the safeFetch call to return the error response
    (safeFetch as jest.Mock).mockResolvedValue(mockErrorResponse);
    const response = await depositFunds(null, 0);

    expect(response).toEqual(mockErrorResponse);
  });
});
