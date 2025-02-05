import {
  createContext,
  useContext,
  useState,
  useMemo,
  PropsWithChildren,
  useEffect,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const lightTheme = {
  background: "#fff",
  foreground: "#1a1a1a",
  error: "rgb(221, 52, 6)",
};

const darkTheme = {
  darkMode: true,
  background: "#1a1a1a",
  foreground: "#fff",
  error: "rgb(221, 52, 6)",
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("isDarMode") === "true"
  );

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const value = useMemo(() => ({ isDarkMode, toggleTheme }), [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("isDarMode", isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.displayName = "ThemeProvider";
