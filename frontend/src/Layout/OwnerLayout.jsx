import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaLock } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import OwnerDashboard from "../pages/dashboards/OwnerDashboard";

const AuthOwnerLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== "owner") {
    return (
      <div className="min-h-screen bg-(--background) px-4">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex size-16 items-center justify-center bg-(--secondary) text-(--accent)">
              <FaLock className="text-xl" />
            </div>

            <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-(--primary)">
              Access Restricted
            </p>

            <h1 className="mt-3 text-3xl font-bold uppercase text-(--foreground) sm:text-4xl">
              Owner Access Only
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-(--muted)">
              {user ? (
                <>
                  You are currently logged in as a{" "}
                  <span className="font-bold uppercase text-(--foreground)">
                    {user.role}
                  </span>{" "}
                  account. Please login with a store owner account to access the
                  owner dashboard.
                </>
              ) : (
                <>
                  You need to login with a store owner account to access this
                  area.
                </>
              )}
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-7 inline-flex cursor-pointer items-center gap-2 bg-(--primary) px-6 py-3 text-sm font-bold text-white"
            >
              Back to Home
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <OwnerDashboard />;
};

export default AuthOwnerLayout;
