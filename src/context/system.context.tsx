import { createContext, useCallback, useEffect, useRef, useState } from "react";
import firebase from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import { Genre, Country } from "@/apis";
import filmApi from "@/apis/filmKK.api";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { FileOpener } from "@awesome-cordova-plugins/file-opener";
import { AppVersion } from "@ionic-native/app-version";

const isApkLink = (url: string) => /\.apk(\?.*)?$/.test(url);
interface AppExeSystem {
  exeDownloadAppWindow:string
}
interface AppApkSystem {
  versionAppCurrent: string;
  downloadAndInstallApk: (
    changeStatus?: (status: boolean) => void,
    changeProgress?: (progress: number) => void,
    changeError?: (error: string) => void
  ) => Promise<void>;
  urlDownloadAppAndroid: string;
  updateAvailable: boolean;
}
interface SystemContextType extends AppApkSystem ,AppExeSystem{
  contentSpecial: string;
  isLoading: boolean;
  genres: Genre[];
  countries: Country[];
  topRef: React.RefObject<HTMLDivElement | null>;
  scrollToTop: () => void;
  genresRecord: Record<string, string>;
  countriesRecord: Record<string, string>;
  isMobile: () => boolean;
  setLoading: (status:boolean) => void
}
const useSystemContext = () => {
  const [exeDownloadAppWindow, setExeDownloadAppWindow] = useState<string>("");
  const [versionAppCurrent, setVersionAppCurrent] = useState<string>("");
  const [genresRecord, setGenresRecord] = useState<Record<string, string>>({});
  const [countriesRecord, setCountriesRecord] = useState<
    Record<string, string>
  >({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentSpecial, setContentSpecial] = useState<string>("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [urlDownloadAppAndroid, setUrlDownloadAppAndroid] =
    useState<string>("");
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement | null>(null);

  const isMobile = () =>
    Capacitor.isNativePlatform() || Capacitor.getPlatform() === "android";
  const downloadAndInstallApk = async (
    changeStatus?: (status: boolean) => void,
    changeProgress?: (progress: number) => void,
    changeError?: (error: string) => void
  ) => {
    if (changeStatus) changeStatus(true);
    if (urlDownloadAppAndroid.length === 0) {
      if (changeError) changeError("Tài nguyên không tồn tại");
      if (changeStatus) changeStatus(false);
      return;
    }
    if (!isMobile() || !isApkLink(urlDownloadAppAndroid)) {
      window.open(urlDownloadAppAndroid, "_system");
      return;
    }
    try {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.open("GET", urlDownloadAppAndroid, true);
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = event.loaded / event.total;
          if (changeProgress) changeProgress(percentComplete);
          if (percentComplete === 1) {
            if (changeStatus) changeStatus(false);
          }
        }
      };
      xhr.onload = async () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Data = reader.result?.toString().split(",")[1];
            const fileName = `${Date.now()}update.apk`;

            await Filesystem.writeFile({
              path: fileName,
              data: base64Data!,
              directory: Directory.Cache,
            });

            const uri = await Filesystem.getUri({
              directory: Directory.Cache,
              path: fileName,
            });

            await FileOpener.open(
              uri.uri,
              "application/vnd.android.package-archive"
            );
          };
          reader.readAsDataURL(blob);
        }
      };
      xhr.onerror = () => {
        if (changeError) changeError("Lỗi khi tải tệp");
      };
      xhr.send();
    } catch (err) {
      if (changeError) changeError("Lỗi khi tải hoặc mở tệp");
      window.open(urlDownloadAppAndroid, "_system");
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
  const getFirebaseDocData = async (path: [string, string]) => {
    const docRef = doc(firebase.db, ...path);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  };
  const init = useCallback(async () => {
    setIsLoading(true);
    try {
      await loadResources();
      //Read content special
      const contentDoc = await getFirebaseDocData(["system", "contentSpecial"]);
      if (contentDoc) setContentSpecial(contentDoc.contentSpecial);
      //Read url download app
      const urlDownloadAppDoc = await getFirebaseDocData([
        "system",
        "urlDownloadAppAndroid",
      ]);
      if (urlDownloadAppDoc)
        setUrlDownloadAppAndroid(urlDownloadAppDoc.urlDownloadAppAndroid);
      //Read url download app
      const exeDownloadAppWindowDoc = await getFirebaseDocData([
        "system",
        "exeDownloadAppWindow",
      ]);
      if (exeDownloadAppWindowDoc) setExeDownloadAppWindow(exeDownloadAppWindowDoc.exeDownloadAppWindow);
    } catch (error) {
      console.log(error);
    } finally {
      //Read url download app
      if (isMobile()) {
        const currentVersion = await AppVersion.getVersionNumber();
        setVersionAppCurrent(currentVersion);
        //Read app version current
        const versionCurrentFirebaseDoc = await getFirebaseDocData([
          "system",
          "appVersionCurrent",
        ]);
        if (versionCurrentFirebaseDoc) {
          const verCurrentFirebase =
            versionCurrentFirebaseDoc.appVersionCurrent;
          setVersionAppCurrent(verCurrentFirebase);
          if (currentVersion !== verCurrentFirebase) {
            setUpdateAvailable(true);
          }
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
    urlDownloadAppAndroid: urlDownloadAppAndroid,
    updateAvailable: updateAvailable,
    topRef: topRef,
    scrollToTop: scrollToTop,
    genresRecord: genresRecord,
    countriesRecord: countriesRecord,
    downloadAndInstallApk: downloadAndInstallApk,
    isMobile: isMobile,
    versionAppCurrent: versionAppCurrent,
    exeDownloadAppWindow: exeDownloadAppWindow,
    setLoading: setIsLoading
  };
};
export const SystemContext = createContext<SystemContextType>({
  contentSpecial: "",
  isLoading: true,
  genres: [],
  countries: [],
  urlDownloadAppAndroid: "",
  updateAvailable: false,
  topRef: { current: null },
  scrollToTop: function (): void {
    throw new Error("Function not implemented.");
  },
  genresRecord: {},
  countriesRecord: {},
  isMobile: function (): boolean {
    throw new Error("Function not implemented.");
  },
  versionAppCurrent: "",
  downloadAndInstallApk: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  exeDownloadAppWindow: "",
  setLoading: function (_: boolean): void {
    throw new Error("Function not implemented.");
  }
});

const SystemContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useSystemContext();
  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};

export default SystemContextProvider;
