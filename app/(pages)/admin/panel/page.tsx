'use client';

import { useAuth } from '@context/AuthContext';
import { Order, Rental, Sort } from '@lib/definitions';

import Pagination from '@components/Pagination';
import RentalsTable from '@components/RentalsTable';
import SkeletonTable from '@components/Skeletons/SkeletonTable';

import { useEffect, useRef, useState } from 'react';
import { fetchMovies, fetchRentals } from '@lib/api';
import { BubbleChart } from '@components/BubbleChart';
import { logout } from '@actions/auth';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const { access } = useAuth();

  const router = useRouter();

  const [globalRentals, setGlobalRentals] = useState<Rental[]>([]);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(true);

  const [sortBy, setSortBy] = useState<Sort>('TITLE');
  const [order, setOrder] = useState<Order>('ASC');

  const [onlyActive, setOnlyActive] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Map of movie to their release year
  const [movieMap, setMovieMap] = useState<Map<number, string[]>>(new Map());
  const movieMapFetched = useRef<boolean>(false); // Prevent double fetch
  const [isChartLoading, setIsChartLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMovies() {
      const queryParams = new URLSearchParams({ page: '1', page_size: '100' });
      let hasNextPage = true;

      do {
        const data = await fetchMovies(access, queryParams);

        setMovieMap((prevMap) => {
          const updatedMap = new Map(prevMap);

          if ('error' in data) {
            console.error(data.error);
            if (data.status === 401) {
              logout();
              router.refresh();
            }
          } else if (data.next) {
            data.results.forEach(({ title, pub_date }) => {
              if (pub_date) {
                if (!updatedMap.has(pub_date)) {
                  updatedMap.set(pub_date, []);
                }

                updatedMap.get(pub_date)?.push(title);
              }
            });

            queryParams.set(
              'page',
              (Number(queryParams.get('page')) + 1).toString(),
            );
          } else {
            hasNextPage = false;
          }

          return updatedMap;
        });
      } while (hasNextPage);

      setIsChartLoading(false);
    }

    if (movieMapFetched.current) return; // Prevent duplicate execution

    movieMapFetched.current = true;
    setIsChartLoading(true);
    loadMovies();
  }, [access, router]);

  // Update query params
  useEffect(() => {
    const query = queryParams;

    query.set('page', page.toString());
    query.set('page_size', pageSize.toString());

    if (onlyActive) query.set('only-active', 'true');
    else query.delete('only-active');

    setQueryParams(query);
  }, [page, pageSize, queryParams, onlyActive]);

  // Fetch user rentals
  useEffect(() => {
    async function loadRentals() {
      const data = await fetchRentals(access, queryParams);

      if ('error' in data) {
        console.error(data.error);
        if (data.status === 401) {
          await logout();
          router.refresh();
        }
      } else {
        setGlobalRentals(data.results);
        setTotalPages(Math.ceil(data.count / pageSize) || 1);
      }

      setIsTableLoading(false);
    }

    setIsTableLoading(true);
    loadRentals();
  }, [access, page, pageSize, onlyActive, queryParams, router]);

  return (
    <div className="flex min-w-full flex-col items-center gap-32 p-20">
      <div className="flex min-w-full flex-col items-center gap-10">
        <h1 className="text-2xl font-bold">Global Rentals</h1>
        <button
          onClick={() => {
            setPage(1);
            setOnlyActive(!onlyActive);
          }}
          className={`hover:bg-primary border-primary text-md relative h-fit cursor-pointer rounded-md border-2 bg-transparent px-4 py-2 font-semibold text-white shadow-xl shadow-black transition-colors duration-200 ease-in-out`}
        >
          {onlyActive ? 'Show all rentals' : 'Show only active rentals'}
        </button>
        <div className="flex w-full items-center justify-center">
          {!isTableLoading && globalRentals ? (
            <RentalsTable
              sortBy={sortBy}
              order={order}
              rentals={globalRentals}
              setSortBy={setSortBy}
              setOrder={setOrder}
            />
          ) : (
            <SkeletonTable rows={pageSize} />
          )}
        </div>

        <Pagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={totalPages}
        />
      </div>

      {movieMapFetched && !isChartLoading && (
        <div className="flex w-full flex-col items-center gap-10">
          <p className="text-center text-2xl font-bold">
            Movies Released per Year
          </p>
          <BubbleChart movieMap={movieMap} />
        </div>
      )}
    </div>
  );
}
