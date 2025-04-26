import { useAuthContext } from "@/context";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const VerifyTokenGoogle: React.FC = () => {
  const { signInUserInfoFromAccessToken, user } = useAuthContext();
  const [searchParams] = useSearchParams();

  // Get token from both query params and hash fragment
  const getAccessToken = () => {
    // Try to get from query params first
    const queryToken = searchParams.get("access_token");
    if (queryToken) return queryToken;

    // If not in query params, try to get from hash fragment
    const hash = window.location.hash.substring(1); // Remove the # character
    const hashParams = new URLSearchParams(hash);
    return hashParams.get("access_token");
  };

  const accessToken = getAccessToken();
  const error = searchParams.get("error") || null;

  useEffect(() => {
    if (error) {
      toast.error("Lỗi");
      window.location.href = "/login";
    } else if (accessToken) {
      console.log("accessToken", accessToken);
      signInUserInfoFromAccessToken(accessToken);
    } else {
      toast.error("Không tìm thấy access token");
      window.location.href = "/login";
    }
  }, [accessToken, error]);
  useEffect(() => {
    if (user) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#1a1a1a",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #2a2a2a",
          borderTop: "5px solid #ff3333",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default VerifyTokenGoogle;
