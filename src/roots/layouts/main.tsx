import { Outlet } from "react-router-dom";
import MainHeader from "./partials/main_header";
import MainFooter from "./partials/main_footer";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import MainMenuBottomMobile from "./partials/main_menu_bottom";

const MainLayout: React.FC = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#0a0a0a] relative pb-20 pt-10 md:pt-0 md:pb-0">
      <div ref={topRef} className="w-0 h-0" />
      <MainHeader />
      <main>
        <Outlet />
      </main>
      <MainFooter />
      
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 p-1 bg-transparent border-2 border-red-500 text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
      <MainMenuBottomMobile />
    </div>
  );
};

export default MainLayout;
