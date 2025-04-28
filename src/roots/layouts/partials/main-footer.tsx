import React from "react";
import { Mail, Smartphone, Send, Star, BellRing } from "lucide-react";
import { Link } from "react-router-dom";
import { useSystemContext } from "@/context";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";
const MainFooter: React.FC = () => {
  const { contentSpecial, urlDownloadAppAndroid } = useSystemContext();
  return (
    <footer className=" bg-[#1a1a1a]  text-gray-100 pb-16 pt-10 px-2 md:px-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-700 rounded-full w-full md:w-fit justify-center">
              <div className="bg-red-800 p-1 rounded-full">
                <Star className="text-yellow-400 w-4 h-4  fill-yellow-400" />
              </div>
              <span className="text-white text-sm font-semibold">
                Hoàng Sa &amp; Trường Sa là của Việt Nam!
              </span>
            </div>
            <h3 className="text-red-500 text-2xl font-bold tracking-wide">
              Thông báo
            </h3>
            <p className="text-gray-300 leading-relaxed">
              <BellRing className="inline-block w-5 h-5"/> : {contentSpecial.length > 0 ? contentSpecial : "Không có"}
            </p>
            <div className="flex items-center space-x-2">
              <Mail className="text-red-500 w-5 h-5" />
              <span className="text-gray-300">info@rfilm.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-red-500 text-2xl font-bold tracking-wide">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-red-500 transition duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 transform group-hover:scale-150 transition duration-300"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/tim-kiem"
                  className="text-gray-300 hover:text-red-500 transition duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 transform group-hover:scale-150 transition duration-300"></span>
                  Tìm kiếm
                </Link>
              </li>
              <li
                className={cn({
                  hidden: Capacitor.isNativePlatform(),
                })}
              >
                <a
                  href={urlDownloadAppAndroid}
                  className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 mt-4 gap-2"
                >
                  <Smartphone className="w-5 h-5" />
                  Tải ứng dụng tại đây
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-red-500 text-2xl font-bold tracking-wide">
              Kết Nối Với Chúng Tôi
            </h3>
            <div className="flex space-x-6">
              <a
                href="https://t.me/ronial19"
                className="text-gray-300 hover:text-red-500 transition duration-300 text-2xl transform hover:scale-110"
              >
                <Send className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#1a1a1a] text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} RFilm.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
