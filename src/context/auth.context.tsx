import { createContext } from "react";
import useAuth, { AuthContextType } from "@/hooks/auth.hook";

export const AuthContext = createContext<AuthContextType>({
    user: null,
    signInWithGoogle: () => Promise.resolve(),
    logout: function (): Promise<void> {
        throw new Error("Function not implemented.");
    }
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={useAuth()}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
