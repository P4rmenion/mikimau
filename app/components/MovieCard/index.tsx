import { Movie } from '@lib/definitions';
import Image from 'next/image';
import Link from 'next/link';

import { orbitron, montserrat } from '@(pages)/layout';
import { useState } from 'react';

const MovieCard = ({
  uuid,
  title,
  pub_date,
  duration,
  rating,
  description,
  poster_url,
}: Movie) => {
  const [imageFallback, setImageFallback] = useState(poster_url);

  return (
    <Link
      href={`/store/movies/${uuid}`}
      className="border-primary overflow-clip rounded-lg border-2 bg-black shadow-lg shadow-black transition-transform duration-400 ease-in-out hover:scale-105"
    >
      <div className="relative flex h-[360px] w-[250px] flex-col items-center gap-2">
        <div className="absolute">
          <div className="absolute bottom-0 h-[360px] w-[250px] bg-linear-[180deg,transparent_30%,black_85%]"></div>
          <Image
            src={imageFallback ? imageFallback : '/no-poster.jpg'}
            alt={title}
            width={250}
            height={360}
            onError={() => setImageFallback('/no-poster.jpg')}
          />
        </div>
        <div className="z-10 mt-auto flex w-full flex-col items-start gap-5 px-5 py-3">
          <div className="text-md w-full text-center">
            <span className={`font-bold ${orbitron.className}`}>{title} </span>
          </div>
          <div className="text-md relative flex w-full justify-between">
            <span className="font-semibold text-yellow-600">
              {rating ? rating : 'N/A'}
            </span>
            <span
              className={`${montserrat.className} absolute left-1/2 -translate-x-1/2 font-medium`}
            >
              {pub_date ? pub_date : 'N/A'}
            </span>
            <span>{duration ? `${duration}''` : 'N/A'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
