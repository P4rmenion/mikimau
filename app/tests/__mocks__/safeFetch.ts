export const safeFetchMock = jest.fn(async (url: URL, options) => {
  const headers = options.headers;
  const token = headers?.Authorization?.replace('Bearer ', '');
  if (token !== 'mockAccessToken') {
    return {
      error: 'Unauthorized',
      status: 401,
    };
  }

  if (url.pathname.includes('/api/profile/')) {
    return {
      first_name: 'John',
      last_name: 'Doe',
      email: 'email@example.com',
    };
  }

  if (url.pathname === '/api/movies') {
    return {
      results: [
        { id: 1, title: 'Movie 1', category: 'Action' },
        { id: 2, title: 'Movie 2', category: 'Comedy' },
      ],
      count: 2,
    };
  }

  return null;
});
