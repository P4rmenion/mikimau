'use client';

import Image from 'next/image';

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

import { Profile } from '@lib/definitions';

const UserProfile = ({
  user,
  setDeposit,
  handleDeposit,
}: {
  user: Profile;
  setDeposit: (amount: number) => void;
  handleDeposit: () => void;
}) => {
  return (
    <div className="flex items-center gap-10">
      <Image
        src="/people-watching.png"
        alt="People watching movies"
        width={500}
        height={720}
        className="h-[15vw] w-[15vw] rounded-full bg-gray-200 object-cover shadow-xl shadow-black"
      />
      <div className="flex flex-col items-start justify-between">
        <p className="text-4xl font-semibold capitalize">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-md font-md">{user.email}</p>
        <p className="mt-4 flex items-center gap-2 text-lg font-semibold">
          <span>Balance:</span>
          <span className="text-primary text-2xl font-bold tracking-wider">
            €{user.wallet}
          </span>
        </p>

        <AlertDialog>
          <AlertDialogTrigger className="border-primary text-md mt-4 cursor-pointer rounded-full border-2 px-6 py-2 font-semibold text-white shadow-lg shadow-black">
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
  );
};

export default UserProfile;
