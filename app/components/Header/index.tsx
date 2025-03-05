import { logout } from '@actions/auth';
import { orbitron } from '@(pages)/layout';

import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="outline-primary bg-primary tex px-4 py-3 text-white shadow-lg shadow-black outline-2 outline-offset-4 lg:px-5 lg:py-4">
      <ul className="flex w-full items-center justify-start gap-6 font-semibold">
        <Link
          href={'/store/movies'}
          className={`${orbitron.className} text-lg font-bold whitespace-nowrap lg:text-3xl`}
        >
          MIKIMAU
        </Link>
        <Link
          href={'/store/movies'}
          className="lg:text-md text-sm font-semibold"
        >
          <li>Movies</li>
        </Link>

        <Link
          href={'/store/profile'}
          className="lg:text-md ml-auto rounded-full border-2 border-white px-4 py-2 text-sm font-semibold"
        >
          <li>Return a Movie</li>
        </Link>

        <div className="group relative flex flex-col">
          <Image
            src="/burger.svg"
            alt="burger icon"
            width={30}
            height={30}
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
              href={'/store/profile'}
              className="w-full px-3 py-1 text-sm transition-colors hover:bg-white hover:text-black"
            >
              <li>Rentals</li>
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
