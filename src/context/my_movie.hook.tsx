import useMyMovie, { MyMovieContextType } from "@/hooks/my_movie.hook";
import { createContext } from "react";

export const MyMovieContext = createContext<MyMovieContextType>({
  movies: [],
  loading: false,
  saveOrUpdateMovie: () => Promise.resolve(),
  loadMyMovies: () => Promise.resolve(),
});

const MyMovieContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <MyMovieContext.Provider value={useMyMovie()}>
      {children}
    </MyMovieContext.Provider>
  );
};

export default MyMovieContextProvider;
