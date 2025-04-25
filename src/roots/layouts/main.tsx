import { Outlet } from "react-router-dom";
import MainHeader from "./partials/main_header";
import MainFooter from "./partials/main_footer";

const MainLayout: React.FC = () => {
  return (
    <>
      <MainHeader />
      <main>
        <Outlet />
      </main>
      <MainFooter />
    </>
  );
};

export default MainLayout;
