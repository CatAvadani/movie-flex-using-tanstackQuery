import { Link } from 'react-router-dom';
import { ResultItem } from '../data/apiResponse';

type MovieCardProps = {
  movie: ResultItem;
};

function MovieCard({ movie }: MovieCardProps) {
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className='w-72 h-full bg-black/5 rounded-sm hover:opacity-70 transition-all'>
        <img
          className='w-full h-48 object-cover rounded-t-sm'
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className='p-4 mt-4 flex flex-col gap-8'>
          <h2 className='text-xl font-bold text-white'>{movie.title}</h2>
          <p className='text-white/50'>
            {truncateText(movie.overview, 10)}{' '}
            <span className=' text-amber-400'>Read more &gt;&gt;</span>{' '}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
