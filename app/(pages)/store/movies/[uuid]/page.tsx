'use client';

import { useAuth } from '@context/AuthContext';
import { Movie } from '@lib/definitions';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import ImageWithFallback from '@components/ImageFallback';

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
import Link from 'next/link';
import { logout } from '@actions/auth';
import SkeletonPoster from '@components/Skeletons/SkeletonPoster';
import SkeletonMovieDetails from '@components/Skeletons/SkeletonMovieDetails';
import { fetchMovieDetails, rentMovie } from '@lib/api';

export default function MovieDetailsPage() {
  const { access, isAdmin } = useAuth();

  const { uuid } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  const rentalAlertSuccess = useRef<HTMLButtonElement>(null);
  const rentalAlertFailure = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  // Fetch movie details
  useEffect(() => {
    async function loadMovieDetails() {
      if (!uuid) return;
      const uuidString = Array.isArray(uuid) ? uuid[0] : uuid;

      const data = await fetchMovieDetails(access, uuidString);

      if ('error' in data) {
        console.error(data.error);
        if (data.status === 401) {
          await logout();
          router.refresh();
        }
      } else {
        setMovie(data);
      }
    }

    loadMovieDetails();
  }, [access, uuid, router]);

  const handleRental = async () => {
    if (!uuid) return;
    const uuidString = Array.isArray(uuid) ? uuid[0] : uuid;
    const data = await rentMovie(access, uuidString);

    if ('error' in data) {
      rentalAlertFailure.current?.click();
      if (data.status === 401) {
        await logout();
        router.refresh();
      }
    } else {
      rentalAlertSuccess.current?.click();
    }
  };

  return (
    <div className="flex h-full min-h-fit w-full items-start justify-start gap-40 px-[10vw] py-20">
      {movie ? (
        <ImageWithFallback
          fallback="/no-poster.jpg"
          src={movie.poster_url ? movie.poster_url : '/no-poster.jpg'}
          alt={movie.title}
          width={500}
          height={720}
          className="h-[70vh] min-h-[500px] rounded-lg border-2 border-gray-300 shadow-xl shadow-black"
        />
      ) : (
        <SkeletonPoster />
      )}

      <div className="flex h-[70vh] flex-col gap-10">
        {movie ? (
          <>
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="text-gray-200">{movie.description}</p>

            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2">
                <strong>Release Date:</strong>
                <span>{movie.pub_date || 'N/A'}</span>
              </p>
              <p className="flex items-center gap-2">
                <strong>Duration:</strong>
                <span>{movie.duration ? `${movie.duration} min` : 'N/A'}</span>
              </p>
              <p className="flex items-center gap-2">
                <strong>Rating:</strong>
                <span className="font-semibold text-yellow-600">
                  {movie.rating || 'N/A'}
                </span>
              </p>
            </div>
          </>
        ) : (
          <SkeletonMovieDetails />
        )}

        {!isAdmin && movie && (
          <div className="flex items-center gap-10">
            <p className="text-2xl font-semibold">Caught your eye?</p>
            <div className="flex items-center gap-20">
              <AlertDialog>
                <AlertDialogTrigger className="border-primary cursor-pointer rounded-full border-2 px-6 py-2 text-xl text-white shadow-lg shadow-black">
                  Rent Movie
                </AlertDialogTrigger>
                <AlertDialogContent className="border-primary border-2 bg-black">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you would like to rent this movie?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col gap-4">
                      <span className="text-sm font-medium text-white">
                        You will be charged upon returning the movie based on
                        the duration of your rental.
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRental}
                      className="border-primary hover:bg-primary border-2 bg-transparent font-semibold transition-all duration-200 ease-in-out"
                    >
                      Rent
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        <AlertDialog>
          <AlertDialogTrigger className="hidden" ref={rentalAlertFailure}>
            Open
          </AlertDialogTrigger>
          <AlertDialogContent className="border-primary border-2 bg-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Something went wrong.</AlertDialogTitle>
              <AlertDialogDescription>
                You might already be renting this movie. Check out the rentals
                at your disposal under{' '}
                <Link
                  href="/store/account"
                  className="text-primary font-semibold"
                >
                  Rentals
                </Link>
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="hover:bg-primary border-primary border-2 bg-transparent transition-all duration-200 ease-in-out">
                I understand
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger className="hidden" ref={rentalAlertSuccess}>
            Open
          </AlertDialogTrigger>
          <AlertDialogContent className="border-primary border-2 bg-black">
            <AlertDialogHeader>
              <AlertDialogTitle>
                You have successfully rented this movie!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Check out the movies at your disposal under{' '}
                <Link
                  href="/store/account"
                  className="text-primary font-semibold"
                >
                  Rentals
                </Link>
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="hover:bg-primary border-primary border-2 bg-transparent transition-all duration-200 ease-in-out">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
