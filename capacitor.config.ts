import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ronial.app",
  appName: "RFilm",
  webDir: "dist",
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "148106803737-9flo3maauatd9sp43lmq5i84dq4ao63r.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;