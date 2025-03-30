import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import authContext from "../../context/authenticationContext";
import { FaGithub } from "react-icons/fa";

export default function GitHubButton() {
  const { dispatch } = React.useContext(authContext);
  const navigate = useNavigate();
  const handleGitHubLogin = () => {
    const githubWindow = window.open(
      "http://localhost:4000/github",
      "_blank",
      "width=500,height=600"
    );
    let retries = 0;
    const interval = setInterval(async () => {
      if (githubWindow.closed) {
        retries++;
        try {
          const res = await axios.get("http://localhost:4000/github/user", {
            withCredentials: true,
          });
          if (res.data && res.data.email) {
            localStorage.setItem("NexaCuraIsAuthenticated", true);
            localStorage.setItem("userData", JSON.stringify(res.data));
            dispatch({
              type: "LOGIN",
              payload: {
                isAuthenticated: true,
                user: res.data,
              },
            });
            clearInterval(interval);
            navigate("/");
          } else {
            console.warn("GitHub session not ready yet, retrying...");
          }
        } catch (err) {
          console.error("GitHub fetch failed:", err);
        }
        if (retries > 10) {
          clearInterval(interval);
          console.error("GitHub login failed after retries");
        }
      }
    }, 500); // Check every 500ms
  };
  

  return (
    <button
  onClick={handleGitHubLogin}
  type="button"
  className="py-2 px-4  flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
>
  <FaGithub className="w-5 h-5 mr-2" />
  <span className="flex-grow text-center">Sign in with GitHub</span>
</button>
  );
}
