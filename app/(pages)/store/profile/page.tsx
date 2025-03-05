'use client';

import Image from 'next/image';

import SkeletonProfile from '@components/Skeletons/SkeletonProfile';
import SkeletonTable from '@components/Skeletons/SkeletonTable';

import { useAuth } from '@context/AuthContext';
import { Profile, Rental } from '@lib/definitions';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@components/shadcn/alert-dialog';

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<Profile | null>(null);
  const [rentals, setRentals] = useState<Rental[] | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [deposit, setDeposit] = useState(0);
  const [depositMade, setDepositMade] = useState(false);

  // Fetch user details
  useEffect(() => {
    if (!accessToken) return;
    setDepositMade(false);

    fetch(`/api/profile/`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error(err));
  }, [accessToken, depositMade]);

  // Fetch user rentals
  useEffect(() => {
    if (!accessToken) return;

    fetch(`/api/rentals/`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRentals(data.results);
      })
      .catch((err) => console.error(err));
  }, [accessToken]);

  const handleDeposit = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(`/api/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ deposit: Number(deposit) }),
      });

      if (response.ok) setDepositMade(true);
      else console.error('Deposit failed');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return user ? (
    <div className="bg-secondary flex items-start">
      <div className="flex flex-col items-start gap-6 p-10 lg:p-20">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/people-watching.png"
            alt="People watching movies"
            width={500}
            height={720}
            className="h-[15vw] w-[15vw] rounded-full bg-gray-200 object-cover"
          />
          <div className="flex flex-col items-start justify-between">
            <p className="text-4xl font-semibold capitalize">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-md font-md">{user.email}</p>
            <p className="mt-4 flex items-center gap-2 text-lg font-semibold">
              <span>Balance:</span>
              <span className="text-primary font-bold">€{user.wallet}</span>
            </p>

            <AlertDialog>
              <AlertDialogTrigger className="border-primary text-md font-semibold mt-4 cursor-pointer rounded-full border-2 px-6 py-2 text-white shadow-lg shadow-black">
                Add funds
              </AlertDialogTrigger>
              <AlertDialogContent className="border-primary border-2 bg-black">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    How much would you like to add?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-col gap-4">
                    <span className="text-sm font-medium text-white">
                      Add funds to your wallet to return movies (up to 100€)
                    </span>
                    <input
                      type="number"
                      placeholder="€"
                      min={0}
                      max={100}
                      step={5}
                      onChange={(e) => setDeposit(parseInt(e.target.value))}
                      onKeyDown={(e) => {
                        e.preventDefault();
                        return;
                      }}
                      className="mx-auto my-2 w-1/3 rounded-full border-2 border-white bg-transparent p-2 text-center text-3xl font-bold text-white focus:outline-none"
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeposit}
                    className="border-primary hover:bg-primary border-2 bg-transparent font-semibold transition-all duration-200 ease-in-out"
                  >
                    Deposit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 p-10 lg:p-20">
        <h1 className="mb-4 text-2xl font-bold">My Rentals</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-secondary border-b">
                <th className="px-4 py-2">Movie Title</th>
                <th className="px-4 py-2">Rental Date</th>
                <th className="px-4 py-2">Return Date</th>
                <th className="px-4 py-2">Paid</th>
              </tr>
            </thead>
            <tbody>
              {rentals?.map((rental) => (
                <tr key={rental.uuid} className="border-b bg-transparent">
                  <td className="px-4 py-2">{rental.movie}</td>
                  <td className="px-4 py-2">
                    {new Date(rental.rental_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(rental.return_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {rental.is_paid ? (
                      <span className="font-bold text-green-600">Paid</span>
                    ) : (
                      <span className="font-bold text-red-600">Unpaid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-secondary flex h-full items-center gap-6 p-10 lg:justify-evenly lg:p-20">
      <SkeletonProfile />
      <SkeletonTable />
    </div>
  );
}
