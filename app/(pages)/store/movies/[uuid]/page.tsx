'use client';

import { useAuth } from '@context/AuthContext';
import { Movie } from '@lib/definitions';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function MovieDetailsPage() {
  const { accessToken } = useAuth();

  const { uuid } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  // Fetch movie details
  useEffect(() => {
    if (!accessToken) return;

    fetch(`/api/movies/${uuid}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
      })
      .catch((err) => console.error(err));
  }, [accessToken, uuid]);

  const handleRental = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(`/api/rentals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ movie: uuid }),
      });

      if (response.ok) {
        console.log('Rental succeeded');
      } else {
        console.error('Rental failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return movie ? (
    <div className="flex h-full w-full items-center justify-evenly gap-40 px-[10vw] py-20">
      <ImageWithFallback
        fallback="/no-poster.jpg"
        src={movie.poster_url ? movie.poster_url : '/no-poster.jpg'}
        alt={movie.title}
        width={500}
        height={720}
        className="border-primary h-[70vh] rounded-lg border-2 shadow-xl shadow-black"
      />
      <div className="flex h-[70vh] flex-col gap-10">
        <h1 className="text-4xl font-bold">{movie.title}</h1>
        <p className="text-gray-200">{movie.description}</p>

        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2">
            <strong>Release Date:</strong>
            <span>{movie.pub_date}</span>
          </p>
          <p className="flex items-center gap-2">
            <strong>Duration:</strong>
            <span>{movie.duration}&quot;</span>
          </p>
          <p className="flex items-center gap-2">
            <strong>Rating:</strong>
            <span className="font-semibold text-yellow-600">
              {movie.rating}
            </span>
          </p>
        </div>

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
                      You will be charged upon returning the movie based on the
                      duration of your rental.
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
      </div>
    </div>
  ) : (
    <div className="flex h-full min-h-screen w-full items-center justify-center">
      <p className="text-xl">Fetching your movie..</p>
    </div>
  );
}
