import axios from 'axios';
import { Movie } from '../types/movie';

export interface MoviesResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}

export const fetchMovies = async (query: string, page: number): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: { query, include_adult: false, language: 'en-US', page },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return response.data;
};
