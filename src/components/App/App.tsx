import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import type { MoviesResponse, Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

const fetchMovies = async (
  query: string,
  page: number
): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: { query, page },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );
  return response.data;
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery.trim().length > 0,
  });

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
    setPage(1);
  };

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
