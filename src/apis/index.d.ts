export interface Country {
  _id: string;
  slug: string;
  name: string;
}

export interface Genre {
  _id: string;
  slug: string;
  name: string;
}

export interface Movie {
  name: string;
  origin_name: string;
  content?: string;
  poster_url: string;
  quality: string;
  episode_current: string;
  year: string;
  time: string;
  lang: string;
  category: Array<Genre>;
  country: Array<Country>;
  slug: string;
  thumb_url: string;
}
export interface MovieDetails {
  _id: string;
  name: string;
  origin_name: string;
  year: string;
  time: string;
  quality: string;
  status: string;
  content: string;
  director: string[];
  country: Country[];
  lang: string;
  rating: string;
  view: number;
  actor: string[];
  category: Genre[];
  poster_url: string;
  thumb_url: string;
  slug: string;
  trailer_url: string;
}

export interface Episode {
  name: string;
  link_embed: string;
  link_m3u8:string
}

export interface Server {
  server_name: string;
  server_data: Episode[];
}

export interface MovieDetailsResponse {
  status: boolean;
  movie: MovieDetails;
  episodes: Server[];
}
export interface SearchResponse {
  status: string;
  data: {
    items: Movie[];
    APP_DOMAIN_CDN_IMAGE: string;
    params: {
      pagination: {
        totalPages: number;
        currentPage: number;
      };
    };
  };
}
export enum FilmTypeList {
  ALL = "all",
  PHIM_BO = "phim-bo",
  PHIM_THUYET_MINH = "phim-thuyet-minh",
  PHIM_LE = "phim-le",
  PHIM_HOAT_HINH = "hoat-hinh",
  PHIM_LONG_TIENG = "phim-long-tieng",
  PHIM_VIETSUB = "phim-vietsub",
  TV_SHOWS = "tv-shows",
}

export enum GetFilmsType {
  COUNTRY = "country",
  GENRE = "genre",
  YEAR = "year",
  KEYWORD = "keyword",
  LIST = "list",
}
export interface GetFilmsOptions {
  type: GetFilmsType;
  value: string;
  selectedGenre?: string;
  selectedCountry?: string;
  selectedYear?: string;
  page: number;
  limit?: number;
}
export interface FilmUpdateResponse {
  status: boolean;
  items: Movie[];
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
    updateToday: number;
  };
}

