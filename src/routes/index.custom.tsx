import { RouteObject, Outlet } from "react-router-dom";

const router = (path: string, element: React.ReactNode): RouteObject => {
  return {
    path: path,
    element: element,
  };
};
const index = (element: React.ReactNode): RouteObject => {
  return router("", element);
};
const layout = (
  layout: React.ReactNode,
  routers: RouteObject[]
): RouteObject => {
  return {
    path: "",
    element: layout,
    children: routers,
  };
};
const prefix = (path: string, routers: RouteObject[]): RouteObject => {
  return {
    path: path,
    element: <Outlet />,
    children: routers,
  };
};

export { index, layout, prefix , router};
