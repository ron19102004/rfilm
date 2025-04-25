import React from 'react'
import { Mail, Facebook, Twitter, Instagram, Linkedin, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
const URL_DOWNLOAD_APP = "https://drive.google.com/uc?export=download&id=1hu29j12BvEg1NjYr5thTsotl04_Vpl6l"
const MainFooter: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] text-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <h3 className="text-red-500 text-2xl font-bold tracking-wide">Về Chúng Tôi</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Chúng tôi là đơn vị chuyên cung cấp các giải pháp công nghệ hiện đại, mang đến trải nghiệm tốt nhất cho khách hàng.
            </p>
            <div className="flex items-center space-x-2">
              <Mail className="text-red-500 w-5 h-5" />
              <span className="text-gray-300">info@rfilm.com</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-red-500 text-2xl font-bold tracking-wide">Liên Kết Nhanh</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-red-500 transition duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 transform group-hover:scale-150 transition duration-300"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/tim-kiem" className="text-gray-300 hover:text-red-500 transition duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 transform group-hover:scale-150 transition duration-300"></span>
                  Tìm kiếm
                </Link>
              </li>
              <li>
                <a 
                  href={URL_DOWNLOAD_APP}
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
            <h3 className="text-red-500 text-2xl font-bold tracking-wide">Kết Nối Với Chúng Tôi</h3>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-red-500 transition duration-300 text-2xl transform hover:scale-110">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-red-500 transition duration-300 text-2xl transform hover:scale-110">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-red-500 transition duration-300 text-2xl transform hover:scale-110">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-red-500 transition duration-300 text-2xl transform hover:scale-110">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-6">
              <h4 className="text-gray-300 font-semibold mb-2">Đăng ký nhận tin</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="px-4 py-2 rounded-l-lg bg-[#1a1a1a] text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                />
                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-r-lg transition duration-300">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#1a1a1a] text-center">
          <p className="text-gray-400 text-sm">&copy; 2024 Công Ty. Bảo lưu mọi quyền.</p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <a href="#" className="text-gray-400 hover:text-red-500 transition duration-300">Chính sách bảo mật</a>
            <span className="text-[#1a1a1a]">|</span>
            <a href="#" className="text-gray-400 hover:text-red-500 transition duration-300">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MainFooter
