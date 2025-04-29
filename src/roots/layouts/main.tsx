import { Outlet } from "react-router-dom";
import MainHeader from "./partials/main-header";
import MainFooter from "./partials/main-footer";
import { useEffect, useState } from "react";
import { ArrowUp, CloudOff } from "lucide-react";
import MainMenuBottomMobile from "./partials/main-menu-bottom";
import { useSystemContext } from "@/context";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const MainLayout: React.FC = () => {
  const { scrollToTop, topRef } = useSystemContext();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
      toast.success("Đã kết nối Internet");
    } else {
      toast.error("Mất kết nối Internet");
    }
  };
  useEffect(() => {
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    // Clean up
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div ref={topRef} className="w-0 h-0" />
      <div
        className={cn("bg-[#1a1a1a] relative", {
          "pb-10 lg:pb-0": isOnline,
        })}
      >
        {isOnline ? (
          <>
            <MainHeader />
            <main className="">
              <Outlet />
            </main>
            <MainFooter />
          </>
        ) : (
          <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
            <div className="w-full text-center">
              <div className="mb-4 flex flex-col justify-center items-center">
                <CloudOff className="w-40 h-40 text-white " />
              </div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">
                Mất kết nối rồi!
              </h1>
              <p className="text-[#5a5a5a]">
                Vui lòng kiểm tra kết nối mạng và thử lại sau.
              </p>
              <div className="px-10">
                <Button
                  variant={"outline"}
                  className="mt-10 w-full md:w-96"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Tải lại
                </Button>
              </div>
            </div>
          </div>
        )}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-28 right-8 p-1 border-2 border-red-500/10 text-red-500 rounded-full shadow-lg bg-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 z-40"
            aria-label="Scroll to top"
          >
            <ArrowUp size={34} />
          </button>
        )}
        <MainMenuBottomMobile />
      </div>
    </>
  );
};

export default MainLayout;
