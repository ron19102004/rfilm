import { FC, useEffect } from "react";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import FilmPage from "../roots/pages/film";
import { index, layout, prefix, router } from "./index.custom";
import FilmSearchPage from "@/roots/pages/film/search";
import WatchFilmPage from "@/roots/pages/film/watch";
import MainLayout from "@/roots/layouts/main";
import AOS from "aos";
import "aos/dist/aos.css";
import SystemContextProvider from "@/context/system.context";
import TypeListPage from "@/roots/pages/film/search_by_type_list";
import AllTypeListPage from "@/roots/pages/film/all_type_list";
import FilmContextProvider from "@/context/film.context";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/providers/auth.provider";
import ProfilePage from "@/roots/pages/user/profile";
import MyMovieContextProvider from "@/context/my_movie.hook";
import LoginPage from "@/roots/pages/auth/login";
import VerifyTokenGoogle from "@/roots/pages/auth/verify_token_google";
import NotFoundPage from "@/roots/pages/err/not_found";

const users: RouteObject[] = [
  layout(<MainLayout />, [
    prefix("/", [
      index(<FilmPage />),
      router("/tim-kiem", <FilmSearchPage />),
      router("/xem-phim/:slug", <WatchFilmPage />),
      router("/danh-sach/:slug", <TypeListPage />),
      router("/tat-ca-danh-sach", <AllTypeListPage />),
      layout(<AuthProvider />, [
        router("/profile", <ProfilePage />),
      ]),
      router("/login", <LoginPage />),
    ]),
  ]),
  router("/auth/verify", <VerifyTokenGoogle />),
  router("*", <NotFoundPage />),
];
const RouterRoot: FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SystemContextProvider>
        <FilmContextProvider>
          <MyMovieContextProvider>
            <RouterProvider
              router={createBrowserRouter([
                ...users,
                { path: "*", element: <div>404</div> }, //
              ])}
            />
          </MyMovieContextProvider>
        </FilmContextProvider>
      </SystemContextProvider>
    </>
  );
};
export default RouterRoot;
