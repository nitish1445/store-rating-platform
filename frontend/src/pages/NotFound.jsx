import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft, FaHouse } from "react-icons/fa6";

const NotFound = () => {
  const location = useLocation();

  const getHomePath = () => {
    const path = location.pathname;

    if (path.startsWith("/admin")) return "/admin";
    if (path.startsWith("/owner")) return "/owner";
    if (path.startsWith("/user")) return "/user";

    return "/";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--background) px-5 py-10">
      <div className="w-full max-w-xl text-center">
        {/* Brand */}
        <Link to={getHomePath()} className="inline-flex items-center gap-2">
          <div className="flex size-9 items-center justify-center bg-(--secondary) text-sm font-bold text-white">
            R
          </div>

          <span className="text-lg font-bold tracking-tight text-(--foreground)">
            Roxiler
          </span>
        </Link>

        {/* Error */}
        <div className="mt-12">
          <p className="text-8xl font-bold tracking-tight text-(--primary) sm:text-9xl">
            404
          </p>

          <h1 className="mt-5 text-2xl font-semibold text-(--foreground) sm:text-3xl">
            Page not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-(--muted) sm:text-base">
            The page you are looking for doesn't exist, has been moved, or you
            may not have permission to access it.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="cursor-pointer inline-flex h-11 items-center justify-center gap-2 border border-(--border) bg-(--surface) px-5 text-sm font-semibold text-(--foreground) transition hover:bg-(--background)"
          >
            <FaArrowLeft className="text-xs" />
            Go back
          </button>

          <Link
            to={getHomePath()}
            className="inline-flex h-11 items-center justify-center gap-2 bg-(--primary) px-5 text-sm font-semibold text-white transition hover:bg-(--secondary) cursor-pointer"
          >
            <FaHouse className="text-xs" />
            Go to dashboard
          </Link>
        </div>

        {/* Path */}
        <p className="mt-8 break-all text-xs text-(--muted)">
          {location.pathname}
        </p>
      </div>
    </main>
  );
};

export default NotFound;
