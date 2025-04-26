import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import toast from "react-hot-toast";
import { Browser } from "@capacitor/browser";
import { App } from "@capacitor/app";
import axios from "axios";
import { Preferences } from "@capacitor/preferences";
export interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
}
export interface AuthContextType {
  user: GoogleUserInfo | null;
  signInWithGoogle: () => Promise<void>;
  signInUserInfoFromAccessToken: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}
const useAuth = (): AuthContextType => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<GoogleUserInfo | null>(null);

  const signInWithGoogle = async () => {
    try {
      let authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${
        import.meta.env.VITE_GOOGLE_CLIENT_ID
      }&response_type=token&scope=email%20profile%20openid`;

      if (Capacitor.isNativePlatform()) {
        authUrl =
          authUrl +
          `&redirect_uri=https://ron19102004.github.io/deeplink-gg-rfilm`;
        await Browser.open({ url: authUrl });
      } else {
        const baseUrl = window.location.origin;
        authUrl = authUrl + `&redirect_uri=${baseUrl}/auth/verify`;
        // Mở URL trong cửa sổ mới cho web
        console.log("authUrl", authUrl);
        window.location.href = authUrl;
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập với Google:", error);
      const errorMessage =
        error.code === "auth/popup-closed-by-user"
          ? "Đăng nhập bị hủy"
          : "Đăng nhập thất bại: " + (error.message || "Lỗi không xác định");
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Preferences.remove({ key: "user" });
      } else {
        localStorage.removeItem("user");
      }
      setUser(null);
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      toast.error("Đăng xuất thất bại");
      throw error;
    }
  };

  const checkLogin = async () => {
    if (Capacitor.isNativePlatform()) {
      const user = await Preferences.get({ key: "user" });
      if (user.value) {
        setUser(JSON.parse(user.value));
      }
    } else {
      const user = localStorage.getItem("user");
      if (user) {
        setUser(JSON.parse(user));
      }
    }
  };
  const saveUserToPreferences = async (userInfo: GoogleUserInfo) => {
    try {
      await Preferences.set({
        key: "user",
        value: JSON.stringify(userInfo),
      });
      console.log("User info saved to Preferences:", userInfo);
    } catch (error) {
      console.error("Lỗi khi lưu userInfo vào Preferences:", error);
      throw error;
    }
  };
  const signInUserInfoFromAccessToken = async (accessToken: string) => {
    try {
      const response = await axios.get<GoogleUserInfo>(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const userInfo = response.data as GoogleUserInfo;
      setUser(userInfo);
      if (Capacitor.isNativePlatform()) {
        await saveUserToPreferences(userInfo);
      } else {
        localStorage.setItem("user", JSON.stringify(userInfo));
      }
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    setLoading(true);
    checkLogin();
    setLoading(false);
  }, []);
  useEffect(() => {
    const appUrlListener = App.addListener("appUrlOpen", (event: any) => {
      const url = event.url;
      if (url && url.includes("access_token")) {
        const accessToken = new URL(url).searchParams.get("access_token");
        if (accessToken) {
          signInUserInfoFromAccessToken(accessToken);
        } else {
          console.log("Không tìm thấy access_token trong URL");
        }
      } else {
        console.log("Không tìm thấy access_token trong URL:", url);
      }
    });
    return () => {
      appUrlListener.remove(); // Hủy listener khi component unmount
    };
  }, []);
  return {
    user:user,
    signInWithGoogle:signInWithGoogle,
    logout:logout,
    signInUserInfoFromAccessToken: signInUserInfoFromAccessToken,
    loading:loading,
  };
};

export default useAuth;
