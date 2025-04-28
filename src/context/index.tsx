import { useContext } from "react";
import { SystemContext } from "./system.context";
import { FilmContext } from "./film.context";
import { AuthContext } from "./auth.context";
import { MyMovieContext } from "./my-movie.hook";

export const useSystemContext = () => useContext(SystemContext);
export const useFilmContext = () => useContext(FilmContext);
export const useAuthContext = () => useContext(AuthContext);
export const useMyMovieContext = () => useContext(MyMovieContext);
