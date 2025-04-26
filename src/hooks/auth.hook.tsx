import { GoogleAuthProvider,signOut,signInWithPopup ,onAuthStateChanged,User } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Đây là user đã đăng nhập
      toast.success("Đăng nhập thành công");
      const user = result.user;
      setUser(user);
    } catch (error) {
      throw error;
    }
  };
  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
    toast.success("Đăng xuất thành công");
  };
  const checkLogin = async () => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  };

  useEffect(() => {
    checkLogin();
  }, []);
  return {
    user: user,
    signInWithGoogle: signInWithGoogle,
    logout: logout,
  };
};

export default useAuth;
