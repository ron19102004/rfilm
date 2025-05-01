import { FilmUpdateResponse, GetFilmsType, Movie } from "@/apis/index.d";
import filmApi from "@/apis/filmKK.api";
import { useCallback, useEffect, useState } from "react";
import { useSystemContext } from "@/context";

export interface FilmContextType {
  filmUpdateResponse: FilmUpdateResponse | null;
  setFilmUpdateResponse: (filmUpdateResponse: FilmUpdateResponse) => void;
  loadMovies: (
    page?: number,
    start?: () => void,
    end?: () => void
  ) => Promise<void>;
  filmIntro: Movie[];
  filmKorean: Movie[];
  filmChina: Movie[];
  filmHistoryVietNam: Movie[];
  filmSchool: Movie[];
}

const useFilmHook = (): FilmContextType => {
  const [filmUpdateResponse, setFilmUpdateResponse] =
    useState<FilmUpdateResponse | null>(null);
  const { setLoading } = useSystemContext();
  const [filmIntro, setFilmIntro] = useState<Movie[]>([]);
  const [filmKorean, setFilmKorean] = useState<Movie[]>([]);
  const [filmChina, setFilmChina] = useState<Movie[]>([]);
  const [filmHistoryVietNam, setFilmHistoryVietNam] = useState<Movie[]>([]);
  const [filmSchool, setFilmSchool] = useState<Movie[]>([]);
  const loadMoviesUpdate = async (
    page = 2,
    start?: () => void,
    end?: () => void
  ) => {
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
  const loadFilmIntro = useCallback(async () => {
    const filmIntro = await filmApi.getFilmsUpdateV3(1);
    setFilmIntro(filmIntro.items);
  }, []);
  const loadFilmResource = useCallback(async () => {
    const filmKr = await filmApi.getFilmsBy({
      type: GetFilmsType.COUNTRY,
      value: "han-quoc",
      page: 1,
      selectedCountry: "all",
      selectedGenre: "all",
      selectedYear: "all",
    });
    setFilmKorean(filmKr.data.items);
    const filmChi = await filmApi.getFilmsBy({
      type: GetFilmsType.COUNTRY,
      value: "trung-quoc",
      page: 1,
      selectedCountry: "all",
      selectedGenre: "all",
      selectedYear: "all",
    });
    setFilmChina(filmChi.data.items);
    const filmHistoryVietNam = await filmApi.getFilmsBy({
      type: GetFilmsType.COUNTRY,
      value: "viet-nam",
      page: 1,
      selectedCountry: "all",
      selectedGenre: "chien-tranh",
      selectedYear: "all",
    });
    setFilmHistoryVietNam(filmHistoryVietNam.data.items);
    const filmSchool = await filmApi.getFilmsBy({
      type: GetFilmsType.GENRE,
      value: "hoc-duong",
      page: 1,
      selectedCountry: "all",
      selectedGenre: "all",
      selectedYear: "all",
    });
    setFilmSchool(filmSchool.data.items);
  }, []);
  const init = async () => {
    try {
      await loadMoviesUpdate();
      await loadFilmIntro();
    } finally {
      setLoading(false);
      await loadFilmResource();
    }
  };
  useEffect(() => {
    init();
  }, []);
  return {
    filmUpdateResponse: filmUpdateResponse,
    setFilmUpdateResponse: setFilmUpdateResponse,
    loadMovies: loadMoviesUpdate,
    filmIntro: filmIntro,
    filmKorean: filmKorean,
    filmChina: filmChina,
    filmHistoryVietNam: filmHistoryVietNam,
    filmSchool: filmSchool,
  };
};

export default useFilmHook;
