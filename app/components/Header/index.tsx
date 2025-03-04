import { logout } from '@actions/auth';
import { orbitron } from '@(pages)/layout';

import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="outline-primary bg-primary px-4 py-3 text-white outline-2 outline-offset-4 lg:px-5 lg:py-4">
      <ul className="flex w-full items-center justify-start gap-6 font-semibold">
        <span
          className={`${orbitron.className} text-lg font-bold whitespace-nowrap lg:text-2xl`}
        >
          MIKIMAU
        </span>

        <Link href={'/store/movies'} className="lg:text-md text-sm">
          <li>Movies</li>
        </Link>

        <Link href={'/store/profile'} className="lg:text-md ml-auto text-sm">
          <li>Return a Movie</li>
        </Link>

        <div className="group relative flex flex-col">
          <Image
            src="/burger.svg"
            alt="burger icon"
            width={25}
            height={25}
            className="py-[10px]"
          />
          <div className="bg-secondary absolute top-[30px] right-0 -z-10 flex w-[120px] flex-col items-start justify-center rounded-md border-1 border-gray-200 text-start text-white opacity-0 duration-500 ease-in-out group-hover:z-10 group-hover:opacity-100">
            <span className="w-full rounded-t-sm border-b border-gray-200 px-3 py-1 text-sm">
              Account
            </span>
            <Link
              href={'/store/profile'}
              className="w-full px-3 py-1 text-sm transition-colors hover:bg-white hover:text-black"
            >
              <li>Profile</li>
            </Link>
            <Link
              href={'/store/rentals'}
              className="w-full px-3 py-1 text-sm transition-colors hover:bg-white hover:text-black"
            >
              <li>My Rentals</li>
            </Link>
            <button
              className="w-full cursor-pointer rounded-b-sm border-t border-gray-200 px-3 py-1 text-start text-sm transition-colors hover:bg-white hover:text-black"
              onClick={logout}
            >
              <li>Log out</li>
            </button>
          </div>
        </div>
      </ul>
    </header>
  );
};

export default Header;
