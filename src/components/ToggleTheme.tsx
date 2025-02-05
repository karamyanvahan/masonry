import { AiOutlineSun, AiOutlineMoon } from "react-icons/ai";
import { useTheme } from "providers/ThemeProvider";

export const ToggleTheme: React.FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <button onClick={toggleTheme} aria-label="toggle theme">
      {isDarkMode ? <AiOutlineSun size={30} /> : <AiOutlineMoon size={30} />}
    </button>
  );
};
