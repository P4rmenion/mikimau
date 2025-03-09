'use client';

import { useAuth } from '@context/AuthContext';
import { logout } from '@actions/auth';
import { Order, Profile, Rental, Sort } from '@lib/definitions';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import SkeletonProfile from '@components/Skeletons/SkeletonProfile';
import SkeletonTable from '@components/Skeletons/SkeletonTable';

import {
  depositFunds,
  fetchProfile,
  fetchRentals,
  returnMovie,
} from '@lib/api';
import RentalsTable from '@components/RentalsTable';
import UserProfile from '@components/Profile';
import Pagination from '@components/Pagination';

export default function AccountPage() {
  const router = useRouter();

  // Access
  const { access } = useAuth();

  // State
  const [isTableLoading, setIsTableLoading] = useState<boolean>(true);

  const [user, setUser] = useState<Profile | null>(null);
  const [rentals, setRentals] = useState<Rental[] | null>(null);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [sortBy, setSortBy] = useState<Sort>('TITLE');
  const [order, setOrder] = useState<Order>('ASC');

  const [onlyActive, setOnlyActive] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  const [deposit, setDeposit] = useState<number>(0);

  const [depositCompleted, setDepositCompleted] = useState<boolean>(false);
  const [returnCompleted, setReturnCompleted] = useState<boolean>(false);

  // Update query params
  useEffect(() => {
    const query = queryParams;

    query.set('page', page.toString());
    query.set('page_size', pageSize.toString());

    if (onlyActive) query.set('only-active', 'true');
    else query.delete('only-active');

    setQueryParams(query);
  }, [page, pageSize, queryParams, onlyActive]);

  // Fetch profile
  useEffect(() => {
    async function loadProfile() {
      const data = await fetchProfile(access);

      if ('error' in data) {
        console.error(data.error);
        if (data.status === 401) {
          await logout();
          router.refresh();
        }
      } else setUser(data);
    }

    setDepositCompleted(false);
    setReturnCompleted(false);
    loadProfile();
  }, [access, depositCompleted, returnCompleted, router]);

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
        setRentals(data.results);
        setTotalPages(Math.ceil(data.count / pageSize) || 1);
      }

      setIsTableLoading(false);
    }

    setReturnCompleted(false);
    setIsTableLoading(true);
    loadRentals();
  }, [
    access,
    page,
    pageSize,
    queryParams,
    router,
    onlyActive,
    returnCompleted,
  ]);

  // Deposit funds
  const handleDeposit = async () => {
    const data = await depositFunds(access, deposit);

    if ('error' in data) {
      console.error(data.error);
      if (data.status === 401) {
        await logout();
        router.refresh();
      }
    } else setDepositCompleted(true);
  };

  // Return movie and update balance.
  const handleReturn = async (rental_uuid: string) => {
    const data = await returnMovie(access, rental_uuid);

    if (typeof data === 'string') {
      setReturnCompleted(true);
    } else {
      console.error(data.error);
      if (data.status === 401) {
        await logout();
        router.refresh();
      }
    }
  };

  return (
    <div className="bg-secondary flex h-full w-full flex-col items-center gap-20 px-[10vw] py-20">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-semibold">Account</h1>
        <h2 className="text-lg">
          Check out your balance, rentals and return movies
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {user ? (
          <UserProfile
            user={user}
            setDeposit={setDeposit}
            handleDeposit={handleDeposit}
          />
        ) : (
          <SkeletonProfile />
        )}
      </div>

      <div className="flex min-w-full flex-col items-center gap-10">
        <h1 className="text-2xl font-bold">My Rentals</h1>
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
          {!isTableLoading && rentals ? (
            <RentalsTable
              sortBy={sortBy}
              order={order}
              rentals={rentals}
              setSortBy={setSortBy}
              setOrder={setOrder}
              handleReturn={handleReturn}
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
    </div>
  );
}
