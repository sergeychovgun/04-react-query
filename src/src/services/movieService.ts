import axios from 'axios';
import { Movie } from '../types/movie';

interface MovieSearchResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<MovieSearchResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page: 1,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  return response.data.results;
};
