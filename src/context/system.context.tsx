import { createContext, useCallback, useEffect, useRef, useState } from "react";
import firebase from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import { Genre, Country, Movie } from "@/apis";
import filmApi from "@/apis/filmKK.api";
import { URL_DOWNLOAD_APP_ANDROID } from "@/constant/system.constant";
interface SystemContextType {
  contentSpecial: string;
  isLoading: boolean;
  genres: Genre[];
  countries: Country[];
  filmIntro: Movie[];
  urlDownloadAppAndroid: string;
  updateAvailable: boolean;
  topRef: React.RefObject<HTMLDivElement | null>;
  scrollToTop: () => void;
  genresRecord: Record<string, string>;
  countriesRecord: Record<string, string>;
}
const useSystemContext = () => {
  const [genresRecord, setGenresRecord] = useState<Record<string, string>>({});
  const [countriesRecord, setCountriesRecord] = useState<
    Record<string, string>
  >({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentSpecial, setContentSpecial] = useState<string>("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filmIntro, setFilmIntro] = useState<Movie[]>([]);
  const [urlDownloadAppAndroid, setUrlDownloadAppAndroid] = useState<string>(
    URL_DOWNLOAD_APP_ANDROID
  );
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement | null>(null);
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const loadResources = useCallback(async () => {
    const genres = await filmApi.loadGenres();
    const countries = await filmApi.loadCountries();
    setGenres(genres);
    setCountries(countries);
    const genresRd = genres.reduce((acc, item) => {
      acc[item.slug] = item.name;
      return acc;
    }, {} as Record<string, string>);
    const countriesRd = countries.reduce((acc, item) => {
      acc[item.slug] = item.name;
      return acc;
    }, {} as Record<string, string>);
    setGenresRecord(genresRd);
    setCountriesRecord(countriesRd);
  }, []);
  const loadFilmIntro = useCallback(async () => {
    const filmIntro = await filmApi.getFilmsUpdateV3(1);
    setFilmIntro(filmIntro.items);
  }, []);
  const init = useCallback(async () => {
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
      }, 1000);
    }
  }, []);
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
    topRef: topRef,
    scrollToTop: scrollToTop,
    genresRecord: genresRecord,
    countriesRecord: countriesRecord,
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
  topRef: { current: null },
  scrollToTop: function (): void {
    throw new Error("Function not implemented.");
  },
  genresRecord: {},
  countriesRecord: {},
});

const SystemContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useSystemContext();
  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};

export default SystemContextProvider;
