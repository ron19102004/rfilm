import { FC } from "react";
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

const users: RouteObject[] = [
  layout(<MainLayout />, [
    prefix("/", [
      index(<FilmPage />),
      router("/tim-kiem", <FilmSearchPage />),
      router("/xem-phim/:slug", <WatchFilmPage />),
    ]),
  ]),
];
const RouterRoot: FC = () => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        ...users,
        { path: "*", element: <div>404</div> }, //
      ])}
    />
  );
};
export default RouterRoot;
