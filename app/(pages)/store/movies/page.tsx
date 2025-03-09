'use client';

import { useAuth } from '@context/AuthContext';
import { Category, Movie, MovieFilters } from '@lib/definitions';

import { useEffect, useRef, useState } from 'react';

import Pagination from '@components/Pagination';
import AddMovieForm from '@components/AddMovieForm';

import MovieCard from '@components/MovieCard';
import SkeletonCard from '@components/Skeletons/SkeletonCard';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/shadcn/select';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@components/shadcn/alert-dialog';

import { logout } from '@actions/auth';
import { fetchCategories, fetchMovies } from '@lib/api';

import { useRouter } from 'next/navigation';

export default function MoviesPage() {
  const router = useRouter();

  // References to control the filters DOM state (resetting)
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoriesFilterRef = useRef<HTMLButtonElement>(null);

  const ratingRef = useRef<HTMLDivElement>(null);
  const ratingFilterRef = useRef<HTMLButtonElement>(null);

  const yearRef = useRef<HTMLDivElement>(null);
  const yearFilterRef = useRef<HTMLButtonElement>(null);

  const feedbackRef = useRef<HTMLButtonElement>(null);

  // Filters State
  const [filters, setFilters] = useState<MovieFilters>({
    categories: [],
    fromRating: null,
    toRating: null,
    fromYear: null,
    toYear: null,
  });

  // Filters DOM state
  const [filtersOpen, setFiltersOpen] = useState<{
    categories: boolean;
    rating: boolean;
    year: boolean;
  }>({
    categories: false,
    rating: false,
    year: false,
  });

  // Authentication
  const { access, setAccess, isAdmin } = useAuth();

  // Data API
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [queryParams, setQueryParams] = useState(new URLSearchParams());

  // Admin addMovie feedback
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (feedback) feedbackRef.current?.click();
  }, [feedback]);

  const resetCategories = () => {
    const inputs = categoriesRef.current?.querySelectorAll('input');
    inputs?.forEach((input) => (input.checked = false));
    setFilters((prevState) => {
      return { ...prevState, categories: [] };
    });
  };

  const resetRating = () => {
    if (!filters.fromRating && !filters.toRating) return;
    setFilters((prevState) => {
      return { ...prevState, fromRating: null, toRating: null };
    });
  };

  const resetYear = () => {
    if (!filters.fromYear && !filters.toYear) return;
    setFilters((prevState) => {
      return { ...prevState, fromYear: null, toYear: null };
    });
  };

  const clearFilters = () => {
    resetCategories();
    resetRating();
    resetYear();

    [categoriesFilterRef, ratingFilterRef, yearFilterRef].forEach(
      (ref) => (
        ref.current?.classList.remove('bg-primary'),
        ref.current?.classList.add('bg-transparent')
      ),
      setFiltersOpen({
        categories: false,
        rating: false,
        year: false,
      }),
    );
  };

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
    async function loadMovies() {
      const data = await fetchMovies(access, queryParams);

      if ('results' in data) {
        setMovies(data.results);
        setTotalPages(data.count > 0 ? Math.ceil(data.count / pageSize) : 1);
        setLoading(false);
      } else {
        console.error(data.error);
        if (data.status === 401) {
          await logout();
          router.refresh();
        }
      }
    }

    setLoading(true);
    loadMovies();
  }, [access, pageSize, page, queryParams, router, filters]);

  // Fetch Categories
  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories(access);

      if ('error' in data) {
        console.error(data.error);
        if (data.status === 401) {
          await logout();
          router.refresh();
        }
      } else {
        setCategories(data);
        setLoading(false);
      }
    }

    setLoading(true);
    loadCategories();
  }, [access, router, setAccess]);

  return (
    <div className="flex h-full flex-col items-center justify-evenly p-4 pt-[5dvh] lg:gap-20 lg:px-[10vw] lg:py-20">
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
          {(filtersOpen.year ||
            filtersOpen.rating ||
            filtersOpen.categories) && (
            <button
              onClick={clearFilters}
              className="relative h-fit cursor-pointer rounded-full border-2 border-white bg-transparent px-4 py-2 font-bold text-white shadow-xl shadow-black transition-colors duration-200 ease-in-out"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div
          className={`${!filtersOpen.categories && !filtersOpen.rating && !filtersOpen.year ? 'hidden' : 'flex'} items-center justify-center text-center 2xl:w-4/5`}
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
                    <label
                      htmlFor={category.name + '-filter'}
                      className="has-checked:bg-primary rounded-full bg-gray-200 px-4 py-2 font-semibold text-black transition-all duration-300 ease-out has-checked:text-white"
                    >
                      <input
                        name={category.name}
                        id={category.name + '-filter'}
                        type="checkbox"
                        className="absolute opacity-0"
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
                        ))
                        .reverse()}
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
                            ))
                            .reverse()}
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
          <div className="bg-primary-100 outline-primary-100 text-md flex w-full items-center justify-center gap-6 rounded-full px-10 py-6 text-center font-semibold outline-2 outline-offset-4">
            <h2>There are no movies matching your selected criteria.</h2>
            <button
              onClick={clearFilters}
              className="w-fit cursor-pointer rounded-full border-2 border-white px-4 py-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        setPage={setPage}
        setPageSize={setPageSize}
      />

      {isAdmin && (
        <>
          <div className="fixed right-10 bottom-10 z-10">
            <AlertDialog>
              <AlertDialogTrigger className="border-primary bg-secondary mt-4 cursor-pointer rounded-full border-2 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-black">
                Add Movie
              </AlertDialogTrigger>
              <AlertDialogContent className="border-primary bg-secondary max-h-[80vh] overflow-y-scroll border-2">
                <AlertDialogHeader className="pt-10">
                  <AlertDialogTitle className="text-center text-xl">
                    Fill in the movie details
                  </AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-col gap-4"></AlertDialogDescription>
                </AlertDialogHeader>
                <AddMovieForm
                  categories={categories}
                  setFeedback={setFeedback}
                />
                <AlertDialogFooter />
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <AlertDialog>
            <AlertDialogTrigger
              ref={feedbackRef}
              className="pointer-events-none invisible h-0 w-0"
            >
              Feedback
            </AlertDialogTrigger>
            <AlertDialogContent className="border-primary bg-secondary border-2">
              <AlertDialogHeader>
                <AlertDialogTitle className="border-primary mb-10 w-full border-b-2 py-2 text-center">
                  {feedback}
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction className="border-primary border-2 bg-transparent transition-colors duration-200 ease-in-out">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
