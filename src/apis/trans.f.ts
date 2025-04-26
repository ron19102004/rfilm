import { FilmTypeList } from "./index.d";

function transFilmTypeToVN(type: string) {
  switch (type) {
    case "all":
      return "Tất cả";
    case "phim-bo":
      return "Phim bộ";
    case "phim-le":
      return "Phim lẻ";
    case "hoat-hinh":
      return "Phim hoạt hình";
    case "phim-thuyet-minh":
      return "Phim thuyết minh";
    case "phim-long-tieng":
      return "Phim dài tập";
    case "phim-vietsub":
      return "Phim Vietsub";
    case "tv-shows":
      return "TV Shows";
  }
}

function transFilmTypeToEN(type: string) {  
  switch (type) {
    case "phim-bo":
      return FilmTypeList.PHIM_BO;
    case "phim-le":
      return FilmTypeList.PHIM_LE;
    case "hoat-hinh":
      return FilmTypeList.PHIM_HOAT_HINH;
    case "phim-thuyet-minh":
      return FilmTypeList.PHIM_THUYET_MINH;
    case "phim-long-tieng":
      return FilmTypeList.PHIM_LONG_TIENG;
    case "phim-vietsub":
      return FilmTypeList.PHIM_VIETSUB;
    case "tv-shows":
      return FilmTypeList.TV_SHOWS;
    default:
      return FilmTypeList.ALL;
  }
}

export { transFilmTypeToVN, transFilmTypeToEN };
