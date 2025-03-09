import { render } from '@testing-library/react';
import MovieCard from '@components/MovieCard';

describe('MovieCard Tests', () => {
  it('Should render movie title', () => {
    const { container } = render(
      <MovieCard
        uuid="uuid"
        title="Title"
        pub_date={2020}
        duration={120}
        rating={6}
        description="description"
        poster_url="example.com/imageURL.jpg"
      />,
    );

    const titleElement = container.querySelector('#title');
    expect(titleElement).toHaveTextContent('Title');
  });

  it('Should render N/A for missing fields', () => {
    const { container } = render(
      <MovieCard
        uuid="uuid"
        title="Title"
        duration={120}
        rating={6}
        description="description"
        poster_url="example.com/imageURL.jpg"
      />,
    );

    const publicationDateElement = container.querySelector('#pub_date');
    expect(publicationDateElement).toHaveTextContent('N/A');
  });

  it('Should render fallback poster in case of missing posterURL', () => {
    const { container } = render(
      <MovieCard
        uuid="uuid"
        title="Title"
        duration={120}
        rating={6}
        description="description"
      />,
    );

    const posterElement = container.querySelector('#poster');
    expect(posterElement).toHaveAttribute(
      'src',
      'http://localhost/no-poster.jpg',
    );
  });
});
