import { createContext, useEffect, useState } from "react";
import firebase from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import { Genre, Country, Movie } from "@/apis";
import filmApi from "@/apis/film.api";
import { URL_DOWNLOAD_APP_ANDROID } from "@/constant/system.constant";
interface SystemContextType {
  contentSpecial: string;
  isLoading: boolean;
  genres: Genre[];
  countries: Country[];
  filmIntro: Movie[];
  urlDownloadAppAndroid: string;
  updateAvailable: boolean;
}
const useSystemContext = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentSpecial, setContentSpecial] = useState<string>("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filmIntro, setFilmIntro] = useState<Movie[]>([]);
  const [urlDownloadAppAndroid, setUrlDownloadAppAndroid] = useState<string>(URL_DOWNLOAD_APP_ANDROID);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
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
      const docRefContentSpecial = doc(firebase.db, "system", "contentSpecial");
      const docSnapContentSpecial = await getDoc(docRefContentSpecial);
      if (docSnapContentSpecial.exists()) {
        setContentSpecial(docSnapContentSpecial.data().contentSpecial);
      } else {
        console.log("No such document!");
      }
      const docRefUrlDownloadAppAndroid = doc(
        firebase.db,
        "system",
        "urlDownloadAppAndroid"
      );
      const docSnapUrlDownloadAppAndroid = await getDoc(
        docRefUrlDownloadAppAndroid
      );
      if (docSnapUrlDownloadAppAndroid.exists()) {
        const url = docSnapUrlDownloadAppAndroid.data().urlDownloadAppAndroid;
        if (url !== URL_DOWNLOAD_APP_ANDROID) {
          setUpdateAvailable(true);
          setUrlDownloadAppAndroid(url);
        }
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
    urlDownloadAppAndroid: urlDownloadAppAndroid,
    updateAvailable: updateAvailable,
  };
};
export const SystemContext = createContext<SystemContextType>({
  contentSpecial: "",
  isLoading: true,
  genres: [],
  countries: [],
  filmIntro: [],
  urlDownloadAppAndroid: "",
  updateAvailable: false,
});

const SystemContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useSystemContext();
  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};

export default SystemContextProvider;
