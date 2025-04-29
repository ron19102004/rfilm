import { createContext, useCallback, useEffect, useRef, useState } from "react";
import firebase from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import { Genre, Country, Movie } from "@/apis";
import filmApi from "@/apis/filmKK.api";
import { Capacitor } from "@capacitor/core";
import { Directory } from "@capacitor/filesystem";
import { FileOpener } from "@awesome-cordova-plugins/file-opener";
import { Http } from "@capacitor-community/http";
import toast from "react-hot-toast";
import { AppVersion } from "@ionic-native/app-version";

const isApkLink = (url: string) => /\.apk(\?.*)?$/.test(url);
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
  downloadAndInstallApk: () => Promise<void>;
  isMobile: () => boolean;
  versionAppCurrent: string;
}
const useSystemContext = () => {
  const [versionAppCurrent, setVersionAppCurrent] = useState<string>("");
  const [genresRecord, setGenresRecord] = useState<Record<string, string>>({});
  const [countriesRecord, setCountriesRecord] = useState<
    Record<string, string>
  >({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentSpecial, setContentSpecial] = useState<string>("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filmIntro, setFilmIntro] = useState<Movie[]>([]);
  const [urlDownloadAppAndroid, setUrlDownloadAppAndroid] =
    useState<string>("");
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement | null>(null);

  const isMobile = () =>
    Capacitor.isNativePlatform() || Capacitor.getPlatform() === "android";
  const downloadAndInstallApk = async () => {
    if (!isMobile() || !isApkLink(urlDownloadAppAndroid)) {
      window.open(urlDownloadAppAndroid, "_system");
      return;
    }
    try {
      const fileName = `${Date.now()}update.apk`;
      const result = await Http.downloadFile({
        url: urlDownloadAppAndroid,
        filePath: fileName,
        fileDirectory: Directory.Cache,
      });

      const fileUri = result.path?.replace("file://", "");
      if (fileUri) {
        await FileOpener.open(
          fileUri,
          "application/vnd.android.package-archive"
        );
        console.log("File opened successfully");
      }
    } catch (err) {
      toast.error("Lỗi khi tải hoặc mở tệp");
      console.log("Lỗi:", err);
    }
  };
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
      //Read content special
      const docRefContentSpecial = doc(firebase.db, "system", "contentSpecial");
      const docSnapContentSpecial = await getDoc(docRefContentSpecial);
      if (docSnapContentSpecial.exists()) {
        setContentSpecial(docSnapContentSpecial.data().contentSpecial);
      } else {
        console.log("No such document!");
      }
      //Read url download app
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
        setUrlDownloadAppAndroid(url);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      //Read url download app
      if (isMobile()) {
        const currentVersion = await AppVersion.getVersionNumber();
        setVersionAppCurrent(currentVersion);
        const versionCurrentFirebase = doc(
          firebase.db,
          "system",
          "appVersionCurrent"
        );
        const docSnapVersionCurrentFirebase = await getDoc(
          versionCurrentFirebase
        );
        if (docSnapVersionCurrentFirebase.exists()) {
          const verCurrentFirebase =
            docSnapVersionCurrentFirebase.data().appVersionCurrent;
          if (currentVersion !== verCurrentFirebase) {
            setUpdateAvailable(true);
          }
        } else {
          console.log("No such document!");
        }
      }
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
    downloadAndInstallApk: downloadAndInstallApk,
    isMobile: isMobile,
    versionAppCurrent: versionAppCurrent,
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
  downloadAndInstallApk: async () => {},
  isMobile: function (): boolean {
    throw new Error("Function not implemented.");
  },
  versionAppCurrent: "",
});

const SystemContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useSystemContext();
  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};

export default SystemContextProvider;
