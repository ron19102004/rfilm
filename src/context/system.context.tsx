import { createContext, useEffect, useState } from "react";
import firebase from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import { Genre, Country, Movie } from "@/apis";
import filmApi from "@/apis/film.api";
interface SystemContextType {
  contentSpecial: string;
  isLoading: boolean;
  genres: Genre[];
  countries: Country[];
  filmIntro: Movie[];
}
const useSystemContext = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentSpecial, setContentSpecial] = useState<string>("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filmIntro, setFilmIntro] = useState<Movie[]>([]);
  const loadResources = async () => {
    const genres = await filmApi.loadGenres();
    const countries = await filmApi.loadCountries();
    setGenres(genres);
    setCountries(countries);
  };
  const loadFilmIntro = async () => {
    const filmIntro = await filmApi.getFilmsUpdateV2();
    setFilmIntro(filmIntro.items);
  };
  const init = async () => {
    setIsLoading(true);
    try {
      await loadResources();
      await loadFilmIntro();
      const docRef = doc(firebase.db, "system", "contentSpecial");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContentSpecial(docSnap.data().contentSpecial);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return {
    contentSpecial: contentSpecial,
    isLoading: isLoading,
    genres: genres,
    countries: countries,
    filmIntro: filmIntro,
  };
};
export const SystemContext = createContext<SystemContextType>({
  contentSpecial: "",
  isLoading: true,
  genres: [],
  countries: [],
  filmIntro: []
});

const SystemContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useSystemContext();
  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};

export default SystemContextProvider;
