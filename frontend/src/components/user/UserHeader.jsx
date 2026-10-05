import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaArrowRightFromBracket } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";

const UserHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    if (location.pathname === "/user") return "Overview";
    if (location.pathname.includes("/stores")) return "Stores";
    if (location.pathname.includes("/ratings")) return "My Ratings";
    if (location.pathname.includes("/profile")) return "Profile";

    return "Dashboard";
  };

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
    } finally {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-(--border) bg-(--surface)">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex size-12 items-center justify-center border border-(--border) lg:hidden"
          >
            <FaBars />
          </button>

          <div>
            <p className="text-lg font-semibold text-(--foreground)">
              {getTitle()}
            </p>

            <p className="hidden text-xs text-(--muted) sm:block">
              Discover and rate stores
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-(--foreground)">
              {user?.name || "User"}
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-wide text-(--muted)">
              Normal User
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex size-10 items-center justify-center border border-red-500 text-red-400 cursor-pointer"
          >
            <FaArrowRightFromBracket className="text-sm" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
