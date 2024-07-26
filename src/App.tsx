import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import MovieCard from './components/MovieCard';
import { getSearchResults, getTrending } from './data/apiRequest';
import useDebounce from './utils/useDebounce';

function App() {
  const [searchString, setSearchString] = useState('');
  const debouncedSearchString = useDebounce(searchString, 300);

  const trendingQuery = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrending(),
  });

  const searchQuery = useQuery({
    queryKey: ['search', debouncedSearchString],
    queryFn: () => getSearchResults(debouncedSearchString),
    enabled: debouncedSearchString > 0,
  });

  return (
    <body className=' min-h-screen flex  flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-violet-800'>
      <h1 className=' text-3xl font-black text-purple-100'>Movie Flex</h1>
      <form
        className='
      flex items-center justify-center w-full max-w-sm mx-auto mt-4 mb-8
      '
        onSubmit={(e) => {
          e.preventDefault();
          searchQuery.refetch();
        }}
      >
        <input
          placeholder='Search for a movie, tv show, person....'
          className='
              w-full px-4 py-2 bg-gray-100 rounded-l-full shadow-md
              '
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />

        <button
          className='
        px-4 py-2 text-white bg-yellow-500 rounded-r-full shadow-md
        '
          type='submit'
        >
          Search
        </button>
      </form>
      <h2
        className='
      text-2xl font-bold text-purple-100 mb-8
      '
      >
        {searchQuery.data?.results ? 'Search Results' : 'Trending Movies'}
      </h2>

      {trendingQuery.isLoading || searchQuery.isLoading ? (
        <p className=' text-purple-100'>Loading...</p>
      ) : trendingQuery.isError || searchQuery.isError ? (
        <p className=' text-purple-100'>Error fetching data</p>
      ) : (
        <ul className=' grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {searchQuery.data?.results ? (
            <>
              {searchQuery.data?.results.map((result) => (
                <MovieCard key={result.id} movie={result} />
              ))}
            </>
          ) : (
            <>
              {trendingQuery.data?.results.map((result) => (
                <MovieCard key={result.id} movie={result} />
              ))}
            </>
          )}
        </ul>
      )}
    </body>
  );
}

export default App;
