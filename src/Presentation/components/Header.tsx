import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTheme } from '@/Application/hooks';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboardClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Determine which buttons to show based on current location
  const isDashboard = location.pathname === '/';
  const isProfile = location.pathname === '/profile';

  // const handleLogout = () => {
  //   logout();
  // };

  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <header className={`${headerBg} ${borderColor} border-b shadow-sm`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className={`text-xl font-bold ${textColor}`}>Kaya Diagrams</h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {!isDashboard && (
              <button
                onClick={handleDashboardClick}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </button>
            )}
           
            {!isProfile && (
              <button
                onClick={handleProfileClick}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                My Profile
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`px-3 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            {/* <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              Log out
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
