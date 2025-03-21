import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import  authContext  from "../../context/authenticationContext";

export default function GoogleButton() {
  const { dispatch } = React.useContext(authContext);
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log("Google login started. Credential response:", credentialResponse);

      const { credential } = credentialResponse;

      // Send Google token to backend for verification
      console.log("Sending Google token to backend for verification...");
      const response = await axios.post("http://localhost:4000/google/verify-token", {
        token: credential, // Google ID token
      }, { withCredentials: true }
    );

      console.log("Backend response:", response.data);

      if (response.data.isAuthenticated) {
        console.log("User authenticated successfully.");

        // Save user data to localStorage
        localStorage.setItem("NexaCuraIsAuthenticated", true);
        localStorage.setItem("userData", JSON.stringify(response.data.message));

        // Update authentication context
        dispatch({
          type: "LOGIN",
          payload: {
            isAuthenticated: true,
            user: response.data.message,
          },
        });

        // Redirect to home/dashboard
        navigate("/");
      } else {
        console.error("Authentication failed:", response.data.error);
      }
    } catch (error) {
      console.error("Google authentication failed:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="31675834820-i18ifq0aefcuq6skf750bspkvsrfd6d2.apps.googleusercontent.com">
      <div className="">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.error("Google login failed")}
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              type="button"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign up with Google
            </button>
          )}
        />
      </div>
    </GoogleOAuthProvider>
  );
}