import React, { useEffect } from 'react'
import { useAuthContext } from '@/context'
import { LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const LoginPage: React.FC = () => {
  const { signInWithGoogle, user } = useAuthContext()
  const navigate = useNavigate()
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="md:min-h-[500px] flex items-center justify-center bg-[#1a1a1a] pt-20 md:pt-0">
      <div className=" p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-8">Đăng nhập</h1>
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
        >
          <LogIn className="w-5 h-5" />
          <span className="font-medium cursor-pointer">Đăng nhập với Google</span>
        </button>
      </div>
    </div>
  )
}

export default LoginPage;
