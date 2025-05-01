import { FilmUpdateResponse } from "@/apis";
import filmHook, { FilmContextType } from "@/hooks/film.hook";
import { createContext } from "react";

export const FilmContext = createContext<FilmContextType>({
  filmUpdateResponse: null,
  setFilmUpdateResponse: function (_: FilmUpdateResponse): void {
    throw new Error("Function not implemented.");
  },
  loadMovies: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  filmIntro: [],
  filmKorean: [],
  filmChina: [],
  filmHistoryVietNam:[],
  filmSchool:[]
});

const FilmContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <FilmContext.Provider value={filmHook()}>{children}</FilmContext.Provider>
  );
};

export default FilmContextProvider;
