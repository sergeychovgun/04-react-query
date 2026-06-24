import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';
import { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import styles from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data, isSuccess]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />
      <main className={styles.main}>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        )}
        {totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            forcePage={page - 1}
            nextLabel="→"
            previousLabel="←"
            breakLabel="..."
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            disabledClassName={styles.disabled}
          />
        )}
        {isFetching && !isLoading && <Loader />}
      </main>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}
