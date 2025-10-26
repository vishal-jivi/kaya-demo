import { useState, useEffect } from "react";
import { useAuth, useTheme } from "@/Application/hooks";
import { getUserData } from "@/Infra";
import { auth } from "@/Infra";
import type { UserDocument } from "@/Domain/interfaces";
import { Header } from "@/Presentation/components";

const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [userData, setUserData] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const user = await getUserData(auth.currentUser.uid);
          setUserData(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const inputBg =
    theme === "dark"
      ? "bg-gray-700 border-gray-600"
      : "bg-white border-gray-300";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const secondaryTextColor =
    theme === "dark" ? "text-gray-300" : "text-gray-600";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`${cardBg} rounded-lg shadow-xl p-8 w-full max-w-md`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className={`mt-4 ${textColor}`}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`${cardBg} rounded-lg shadow-xl p-8 w-full max-w-md`}>
          <h1 className="text-xl font-bold mb-8 text-center">
            Profile Settings
          </h1>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${textColor}`}>
                Theme
              </label>
              <button
                onClick={toggleTheme}
                className={`w-full px-4 py-3 rounded-lg border ${inputBg} hover:bg-opacity-80 transition flex items-center justify-between`}
              >
                <span className={textColor}>
                  {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </span>
                <span className="text-blue-600">Toggle</span>
              </button>
            </div>

            {/* Email Display */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${textColor}`}>
                Email
              </label>
              <div
                className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${textColor}`}
              >
                {userData?.email || auth.currentUser?.email || "Not available"}
              </div>
            </div>

            {/* Role Display */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${textColor}`}>
                Role
              </label>
              <div
                className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${textColor} capitalize`}
              >
                {userData?.role || "Not assigned"}
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-4">
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div
            className={`mt-6 p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} text-sm`}
          >
            <p className={`font-semibold mb-2 ${textColor}`}>
              Account Information
            </p>
            <p className={secondaryTextColor}>
              Manage your profile settings and account preferences here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
