import { ArrowUturnLeftIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getMovieDetails } from '../data/apiRequest';
import { MediaType } from '../data/apiResponse';

function MovieDetails() {
  const { id } = useParams<{ id: string }>();

  const getDetails = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(Number(id), MediaType.Movie),
  });

  if (getDetails.isLoading) return <p>Loading...</p>;
  if (getDetails.isError) return <p>Error loading movie details</p>;

  const movie = getDetails.data;

  return (
    <div className='w-full h-screen p-10  bg-gradient-to-br from-blue-500 to-violet-800 rounded-sm flex justify-center items-center gap-10'>
      <img
        className='w-[35vw] h-[650px] object-cover rounded-sm'
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <div className=' flex flex-col gap-10'>
        <h1 className='text-5xl font-bold text-white mb-10'>{movie.title}</h1>
        <p className='text-white/50 w-[50vw] text-xl'>{movie.overview}</p>
        <div className='flex gap-4 mt-4'>
          <p className='text-white/50'>Rating: {movie.vote_average}</p>
          <p className='text-white/50'>Release Date: {movie.release_date}</p>
        </div>
        <button className='px-4 py-2 text-white bg-yellow-500 rounded-full shadow-md'>
          Watch Trailer
        </button>
        <Link to='/'>
          <ArrowUturnLeftIcon className='h-10 w-10 text-yellow-500 hover:scale-105 transition-all ' />
        </Link>
      </div>
    </div>
  );
}

export default MovieDetails;
