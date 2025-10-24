import { createContext, useState } from "react";

export const ThemeContext = createContext<{ theme: string; toggleTheme: () => void } | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'bg-gray-900 text-white min-h-screen' : 'bg-gray-50 text-gray-900 min-h-screen'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};