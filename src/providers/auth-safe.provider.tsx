import { useAuthContext } from "@/context";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center bg-[#0a0a0a]">
    <div className="flex flex-col items-center">
      <Loader className="h-8 w-8 text-red-500 animate-spin" />
      <p className="mt-4 text-red-500 text-lg font-semibold">
        Loading or{" "}
        <Link to="/login" className="text-red-500 hover:text-red-600">
          Sign In
        </Link>
      </p>
    </div>
  </div>
);

const AuthSafeProvider: React.FC = () => {
  const { user, loading } = useAuthContext();

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return <Outlet />;
};

export default AuthSafeProvider;
