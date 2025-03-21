import React, { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("text-base");

  // 🔹 Betöltjük az előző beállításokat, ha vannak
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedFontSize = localStorage.getItem("fontSize") || "text-base";

    setTheme(savedTheme);
    setFontSize(savedFontSize);
  }, []);

  // 🔹 Mentjük a beállításokat localStorage-be
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);

    // 🚀 Az osztályt hozzáadjuk a <html> elemhez, hogy alkalmazzuk a témát
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme, fontSize]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
