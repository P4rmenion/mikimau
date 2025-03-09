import { fetchProfile } from '@lib/api';
import { safeFetch } from '@actions/auth';
import { Profile } from '@lib/definitions';

// Mock the safeFetch function
jest.mock('../../../actions/auth', () => ({
  safeFetch: jest.fn(),
}));

describe('fetchProfile() Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('Should return user details on success', async () => {
    const mockProfileResponse: Profile = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'email@example.com',
      wallet: 100,
    };

    // Mock the safeFetch call to return the mock response
    (safeFetch as jest.Mock).mockResolvedValue(mockProfileResponse);

    const response = await fetchProfile('mockAccessToken');

    expect(safeFetch).toHaveBeenCalledWith(
      `/api/profile/`,
      expect.objectContaining({
        headers: { Authorization: 'Bearer mockAccessToken' },
        method: 'GET',
      }),
    );

    expect(response).toEqual(mockProfileResponse);
  });

  it('Should return error on failure', async () => {
    const mockErrorResponse = { error: 'Unauthorized', status: 401 };

    // Mock the safeFetch call to return the error response
    (safeFetch as jest.Mock).mockResolvedValue(mockErrorResponse);
    const response = await fetchProfile(null);

    expect(response).toEqual(mockErrorResponse);
  });
});
