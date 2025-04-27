import { FilmUpdateResponse } from "@/apis/index.d";
import filmApi from "@/apis/film.api";
import { useEffect, useState } from "react";

export interface FilmContextType {
  filmUpdateResponse: FilmUpdateResponse | null;
  setFilmUpdateResponse: (filmUpdateResponse: FilmUpdateResponse) => void;
  loadMovies: (page?: number, start?: () => void, end?: () => void) => Promise<void>;
}

const filmHook = (): FilmContextType => {
  const [filmUpdateResponse, setFilmUpdateResponse] =
    useState<FilmUpdateResponse | null>(null);
  const loadMovies = async (page = 2, start?: () => void, end?: () => void) => {
    try {
      start?.();
      const response = await filmApi.getFilmsUpdateV3(page);
      if (response.status) {
        setFilmUpdateResponse(response);
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      end?.();
    }
  };
  useEffect(() => {
    loadMovies();
  }, []);
  return {
    filmUpdateResponse: filmUpdateResponse,
    setFilmUpdateResponse: setFilmUpdateResponse,
    loadMovies: loadMovies,
  };
};

export default filmHook;
