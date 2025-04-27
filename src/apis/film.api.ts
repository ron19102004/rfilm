import { URL_API } from "@/constant/api.constant";
import axios from "axios";
import {
  Genre,
  Country,
  SearchResponse,
  FilmUpdateResponse,
  GetFilmsOptions,
  GetFilmsType,
  FilmTypeList,
  MovieDetailsResponse,
} from "./index.d";

const loadGenres = async () => {
  const response = await axios.get<Genre[]>(`${URL_API}the-loai`);
  return response.data;
};

const loadCountries = async () => {
  const response = await axios.get<Country[]>(`${URL_API}quoc-gia`);
  return response.data;
};

const getFilmsUpdateV3 = async (page: number) => {
  const response = await axios.get<FilmUpdateResponse>(
    `${URL_API}danh-sach/phim-moi-cap-nhat-v3?page=${page}`
  );
  return response.data;
};
const getFilmsUpdateV2 = async (page?: number) => {
  const response = await axios.get<FilmUpdateResponse>(
    `${URL_API}danh-sach/phim-moi-cap-nhat-v2?page=${page || 1}`
  );
  return response.data;
};
const getFilmsBy = async (options: GetFilmsOptions) => {
  let url = "https://phimapi.com/v1/api";
  switch (options.type) {
    case GetFilmsType.COUNTRY:
      url += `/quoc-gia/${options.value}?page=${
        options.page
      }&sort_field=_id&sort_type=desc&limit=${options.limit || 20}`;
      if (options.selectedGenre !== "all") {
        url += `&category=${options.selectedGenre}`;
      }
      if (options.selectedYear !== "all") {
        url += `&year=${options.selectedYear}`;
      }
      break;
    case GetFilmsType.GENRE:
      url += `/the-loai/${options.value}?page=${
        options.page
      }&sort_field=_id&sort_type=desc&limit=${options.limit || 20}`;
      if (options.selectedCountry !== "all") {
        url += `&country=${options.selectedCountry}`;
      }
      if (options.selectedYear !== "all") {
        url += `&year=${options.selectedYear}`;
      }
      break;
    case GetFilmsType.YEAR:
      url += `/nam/${options.value}?page=${
        options.page
      }&sort_field=_id&sort_type=desc&limit=${options.limit || 20}`;
      if (options.selectedGenre !== "all") {
        url += `&category=${options.selectedGenre}`;
      }
      if (options.selectedCountry !== "all") {
        url += `&country=${options.selectedCountry}`;
      }
      break;
    case GetFilmsType.KEYWORD:
      url += `/tim-kiem?keyword=${options.value}&page=${options.page}`;
      break;
    case GetFilmsType.LIST:
      url += `/danh-sach/${options.value || FilmTypeList.PHIM_BO}?page=${
        options.page
      }&sort_field=_id&sort_type=desc&limit=${options.limit || 20}`;
      if (options.selectedGenre !== "all") {
        url += `&category=${options.selectedGenre}`;
      }
      if (options.selectedCountry !== "all") {
        url += `&country=${options.selectedCountry}`;
      }
      if (options.selectedYear !== "all") {
        url += `&year=${options.selectedYear}`;
      }
      break;
  }
  const response = await axios.get<SearchResponse>(url);
  return response.data;
};

const getFilmDetails = async (slug: string) => {
  const response = await axios.get<MovieDetailsResponse>(
    `https://phimapi.com/phim/${slug}`
  );
  return response.data;
};

export default {
  getFilmsUpdateV3,
  getFilmsUpdateV2,
  loadCountries,
  loadGenres,
  getFilmsBy,
  getFilmDetails,
};
