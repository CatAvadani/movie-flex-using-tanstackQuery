import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import MovieCard from './components/MovieCard';
import { getSearchResults, getTrending } from './data/apiRequest';
import useDebounce from './utils/useDebounce';

function App() {
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const debouncedSearchString = useDebounce(searchString, 300);

  // Fetch trending movies based on the current page
  const trendingQuery = useQuery({
    queryKey: ['trending', currentPage],
    queryFn: () => getTrending(currentPage),
  });

  // Fetch search results based on the debounced search string and current page
  const searchQuery = useQuery({
    queryKey: ['search', debouncedSearchString, currentPage],
    queryFn: () => getSearchResults(debouncedSearchString),
    enabled: debouncedSearchString.length > 0, // Ensures the query only runs if there is a search string
  });

  // Handlers for pagination
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-violet-800'>
      <h1 className='text-6xl font-black text-white/50 text-purple-100 tracking-wide'>
        Movie Flex
      </h1>
      <form
        className='flex items-center justify-center w-full max-w-sm mx-auto m-8'
        onSubmit={(e) => {
          e.preventDefault();
          setCurrentPage(1); // Reset to the first page when a new search is made
          searchQuery.refetch();
        }}
      >
        <input
          placeholder='Search for a movie, tv show, person....'
          className='w-full px-4 py-2 bg-gray-100 rounded-l-full shadow-md'
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <button
          className='px-4 py-2 text-white bg-yellow-500 rounded-r-full shadow-md'
          type='submit'
        >
          Search
        </button>
      </form>
      <h2 className='text-2xl font-bold text-purple-100 mb-8'>
        {searchQuery.data?.results ? 'Search Results' : 'Trending Movies'}
      </h2>

      {trendingQuery.isLoading || searchQuery.isLoading ? (
        <p className='text-purple-100'>Loading...</p>
      ) : trendingQuery.isError || searchQuery.isError ? (
        <p className='text-purple-100'>Error fetching data</p>
      ) : (
        <>
          <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {searchQuery.data?.results
              ? searchQuery.data?.results.map((result) => (
                  <MovieCard key={result.id} movie={result} />
                ))
              : trendingQuery.data?.results.map((result) => (
                  <MovieCard key={result.id} movie={result} />
                ))}
          </ul>
          <div className='flex justify-between mt-4'>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className='px-4 py-2 text-white disabled:opacity-40'
            >
              <ChevronDoubleLeftIcon className='w-5 h-5' />
            </button>
            <p className='text-purple-100 py-4'>Page {currentPage}</p>
            <button onClick={handleNextPage} className='px-4 py-2 text-white'>
              <ChevronDoubleRightIcon className='w-5 h-5 ' />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
