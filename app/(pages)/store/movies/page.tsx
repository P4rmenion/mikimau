'use client';

import MovieCard from '@components/MovieCard';
import SkeletonCard from '@components/Skeletons/SkeletonCard';
import Image from 'next/image';

import { useAuth } from '@context/AuthContext';
import { Category, Movie, MovieFilters } from '@lib/definitions';

import { redirect } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/shadcn/select';

export default function MoviesPage() {
  // References to control the filters DOM state (resetting)
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoriesFilterRef = useRef<HTMLButtonElement>(null);

  const ratingRef = useRef<HTMLDivElement>(null);
  const ratingFilterRef = useRef<HTMLButtonElement>(null);

  const yearRef = useRef<HTMLDivElement>(null);
  const yearFilterRef = useRef<HTMLButtonElement>(null);

  // Filters State
  const [filters, setFilters] = useState<MovieFilters>({
    categories: [],
    fromRating: null,
    toRating: null,
    fromYear: null,
    toYear: null,
  });

  // Filters DOM state
  const [filtersOpen, setFiltersOpen] = useState({
    categories: false,
    rating: false,
    year: false,
  });

  // Authentication
  const { accessToken } = useAuth();

  // Data API
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [queryParams, setQueryParams] = useState(new URLSearchParams());

  const resetCategories = () => {
    const inputs = categoriesRef.current?.querySelectorAll('input');
    inputs?.forEach((input) => (input.checked = false));
    setFilters({ ...filters, categories: [] });
  };

  const resetRating = () => {
    if (!filters.fromRating && !filters.toRating) return;
    setFilters({ ...filters, fromRating: null, toRating: null });
  };

  const resetYear = () => {
    if (!filters.fromYear && !filters.toYear) return;
    setFilters({ ...filters, fromYear: null, toYear: null });
  };

  // Redirect if no access token
  useEffect(() => {
    if (!accessToken) redirect('/login');
  }, [accessToken]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Update query params
  useEffect(() => {
    const query = queryParams;

    query.set('page', page.toString());
    query.set('page_size', pageSize.toString());

    const { categories, fromRating, toRating, fromYear, toYear } = filters;
    const filterParams = [
      {
        key: 'category',
        value: categories.join(','),
      },
      {
        key: 'from-rating',
        value: fromRating?.toString() || '',
      },
      {
        key: 'to-rating',
        value: toRating?.toString() || '',
      },
      {
        key: 'from-year',
        value: fromYear?.toString() || '',
      },
      {
        key: 'to-year',
        value: toYear?.toString() || '',
      },
    ];

    for (const { key, value } of filterParams) {
      if (value) query.set(key, value);
      else query.delete(key);
    }

    setQueryParams(query);
  }, [page, pageSize, filters, queryParams]);

  // Fetch movies
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.DOMAIN}/api/movies?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        setTotalPages(data.count > 0 ? Math.ceil(data.count / pageSize) : 1);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setMovies([]);
      });
  }, [accessToken, pageSize, page, queryParams, filters]);

  // Fetch Categories
  useEffect(() => {
    setLoading(true);

    fetch(`${process.env.DOMAIN}/api/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setCategories([]);
      });
  }, [accessToken]);

  return (
    <div className="flex h-fit min-h-screen flex-col items-center justify-evenly p-4 pt-[5dvh] lg:gap-20 lg:px-[10vw] lg:py-20">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-semibold">Movies</h1>
        <h2 className="text-lg">
          Explore all time classics, box office hits and new releases
        </h2>
      </div>

      <div className="flex flex-col items-center justify-center gap-16">
        <div className="flex items-center gap-4">
          <h3 className="text-md font-semibold">Filter by</h3>
          <button
            ref={categoriesFilterRef}
            onClick={() => {
              setFiltersOpen({
                ...filtersOpen,
                categories: !filtersOpen.categories,
              });

              categoriesFilterRef.current?.classList.toggle('bg-transparent');
              categoriesFilterRef.current?.classList.toggle('bg-primary');
            }}
            className="border-primary relative h-fit cursor-pointer rounded-md border-2 bg-transparent px-4 py-2 font-bold text-white shadow-xl shadow-black transition-colors duration-200 ease-in-out"
          >
            Category
          </button>
          <button
            onClick={() => {
              setFiltersOpen({
                ...filtersOpen,
                rating: !filtersOpen.rating,
              });

              ratingFilterRef.current?.classList.toggle('bg-transparent');
              ratingFilterRef.current?.classList.toggle('bg-primary');
            }}
            ref={ratingFilterRef}
            className="border-primary relative h-fit cursor-pointer rounded-md border-2 bg-transparent px-4 py-2 font-bold text-white shadow-xl shadow-black transition-colors duration-200 ease-in-out"
          >
            Rating
          </button>
          <button
            onClick={() => {
              setFiltersOpen({
                ...filtersOpen,
                year: !filtersOpen.year,
              });
              yearFilterRef.current?.classList.toggle('bg-transparent');
              yearFilterRef.current?.classList.toggle('bg-primary');
            }}
            ref={yearFilterRef}
            className="border-primary relative h-fit cursor-pointer rounded-md border-2 bg-transparent px-4 py-2 font-bold text-white shadow-xl shadow-black transition-colors duration-200 ease-in-out"
          >
            Year
          </button>
        </div>

        <div
          className={`${!filtersOpen.categories && !filtersOpen.rating && !filtersOpen.year ? 'hidden' : 'flex'} items-center justify-evenly text-center 2xl:w-4/5`}
        >
          <div
            ref={categoriesRef}
            className={`${filtersOpen.categories ? 'flex' : 'hidden'} flex-1 flex-col items-center gap-4`}
          >
            <h3 className="bg-secondary-300 text-md rounded-full px-4 py-1 font-semibold uppercase">
              GENRES
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6 rounded-2xl p-4 text-sm">
              {categories.length > 0 &&
                categories?.map((category: Category, index) => (
                  <div key={index} className="relative">
                    <input
                      name={category.name}
                      type="checkbox"
                      className="peer absolute z-10 h-full w-full opacity-0"
                      onClick={(e) => {
                        const category = e.target as HTMLInputElement;
                        let categories = filters.categories;

                        if (!category.checked)
                          categories = categories.filter(
                            (element) => element !== category.name,
                          );
                        else categories.push(category.name);

                        setFilters({ ...filters, categories });
                      }}
                    />
                    <label
                      htmlFor={category.name}
                      className="peer-checked:bg-primary rounded-full bg-gray-200 px-4 py-2 font-semibold text-black transition-all duration-300 ease-out peer-checked:text-white"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              <button
                onClick={resetCategories}
                className="reset-button border-primary text-primary cursor-pointer rounded-full border-2 bg-transparent px-4 py-1 font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          <div
            className={`${!filtersOpen.rating && !filtersOpen.year ? 'hidden' : 'flex flex-col'} items-center justify-between gap-10 rounded-3xl px-16 py-10`}
          >
            <div
              ref={ratingRef}
              className={`${filtersOpen.rating ? 'flex' : 'hidden'} w-full items-center justify-between gap-6`}
            >
              <h2 className="bg-secondary-300 text-md mr-auto rounded-full px-4 py-1 font-semibold uppercase">
                Rating
              </h2>
              <div className="ml-auto flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-semibold">From</h3>
                  <Select
                    value={filters?.fromRating?.toString() || ''}
                    onValueChange={(value) =>
                      setFilters({ ...filters, fromRating: Number(value) })
                    }
                  >
                    <SelectTrigger className="bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary min-w-0">
                      {Array(10)
                        .fill(null)
                        .map((_, index) => (
                          <SelectItem
                            key={index}
                            value={(index + 1).toString()}
                          >
                            {index + 1}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {filters.fromRating !== null && filters.fromRating < 10 && (
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-semibold">To</h3>
                    <Select
                      value={filters.toRating?.toString() || ''}
                      onValueChange={(value) =>
                        setFilters({ ...filters, toRating: Number(value) })
                      }
                    >
                      <SelectTrigger className="bg-secondary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary min-w-0">
                        {Array(10 - filters.fromRating + 1)
                          .fill(null)
                          .map((_, index) => (
                            <SelectItem
                              key={index}
                              value={(filters?.fromRating
                                ? filters.fromRating + index
                                : index + 1
                              ).toString()}
                            >
                              {(filters.fromRating as number) + index}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <button
                onClick={resetRating}
                className="reset-button border-primary text-primary cursor-pointer rounded-full border-2 bg-transparent px-4 py-1 text-sm font-semibold"
              >
                Reset
              </button>
            </div>

            <div
              ref={yearRef}
              className={`${filtersOpen.year ? 'flex' : 'hidden'} w-full items-center justify-between gap-6`}
            >
              <h2 className="bg-secondary-300 text-md rounded-full px-4 py-1 font-semibold uppercase">
                Year
              </h2>
              <div className="ml-auto flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-semibold">From</h3>
                  <Select
                    value={filters?.fromYear?.toString() || ''}
                    onValueChange={(value) =>
                      setFilters({ ...filters, fromYear: Number(value) })
                    }
                    defaultValue={
                      filters?.fromYear ? filters.fromYear.toString() : '0'
                    }
                  >
                    <SelectTrigger className="bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary min-w-0">
                      {Array(100)
                        .fill(null)
                        .map((_, index) => (
                          <SelectItem
                            key={index}
                            value={(
                              new Date().getFullYear() -
                              100 +
                              index +
                              1
                            ).toString()}
                          >
                            {new Date().getFullYear() - 100 + index + 1}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {filters?.fromYear &&
                  filters.fromYear < new Date().getFullYear() && (
                    <div className="flex items-center gap-4">
                      <h3 className="text-sm font-semibold">To</h3>
                      <Select
                        value={filters?.toYear?.toString() || ''}
                        onValueChange={(value) =>
                          setFilters({ ...filters, toYear: Number(value) })
                        }
                      >
                        <SelectTrigger className="bg-secondary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-secondary min-w-0">
                          {Array(
                            new Date().getFullYear() - filters.fromYear + 1,
                          )
                            .fill(null)
                            .map((_, index) => (
                              <SelectItem
                                key={index}
                                value={(filters?.fromYear
                                  ? filters.fromYear + index
                                  : index + 1
                                ).toString()}
                              >
                                {filters?.fromYear
                                  ? filters.fromYear + index
                                  : index + 1}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
              </div>
              <button
                onClick={resetYear}
                className="reset-button border-primary text-primary cursor-pointer rounded-full border-2 bg-transparent px-4 py-1 text-sm font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-fit flex-wrap items-center gap-10 lg:justify-center">
        {loading ? (
          Array(pageSize)
            .fill(null)
            .map((_, index) => <SkeletonCard key={index} />)
        ) : movies && movies.length > 0 ? (
          movies?.map((movie: Movie) => (
            <MovieCard key={movie.uuid} {...movie} />
          ))
        ) : (
          <h2 className="bg-primary-100 outline-primary-100 text-md flex w-3/4 flex-col gap-4 rounded-full px-20 py-6 text-center font-semibold outline-2 outline-offset-4">
            There are no movies matching your selected criteria.
            <br />
            <span>
              You must have.. <i>an oddly specific taste</i>.
            </span>
          </h2>
        )}
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center justify-center gap-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="border-primary flex cursor-pointer items-center justify-center rounded-full border-1 bg-transparent p-1 text-black shadow-lg shadow-black disabled:border-gray-500 disabled:bg-gray-500 disabled:text-gray-400"
          >
            <Image
              src="/left-chevron.svg"
              width={20}
              height={20}
              alt="left chevron"
            />
          </button>
          <div className="flex gap-2">
            <span>{page}</span> / <span>{totalPages}</span>
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="border-primary flex cursor-pointer items-center justify-center rounded-full border-1 bg-transparent p-1 text-black shadow-lg shadow-black disabled:border-gray-500 disabled:bg-gray-500 disabled:text-gray-400"
          >
            <Image
              src="/left-chevron.svg"
              width={20}
              height={20}
              alt="right chevron"
              className="rotate-180"
            />
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm">
          Per page:
          <Select
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
            defaultValue={pageSize.toString()}
          >
            <SelectTrigger className="border-primary w-fit shadow-lg shadow-black">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-primary min-w-0">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
