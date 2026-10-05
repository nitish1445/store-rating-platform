import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaArrowRight,
  FaUser,
  FaStore,
  FaUserTie,
} from "react-icons/fa6";
import api from "../../config/Api";

const AdminRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get("/admin/ratings");

        setRatings(response.data.ratings || []);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load ratings.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <div className="h-3 w-24 animate-pulse bg-(--border)" />
          <div className="mt-3 h-8 w-36 animate-pulse bg-(--border)" />
          <div className="mt-2 h-4 w-72 max-w-full animate-pulse bg-(--border)" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-24 animate-pulse bg-(--surface)" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-(--surface) p-5">
        <p className="text-sm text-(--danger)">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
          Ratings
        </h1>

        <p className="mt-1 text-sm text-(--muted)">
          All ratings submitted across registered stores.
        </p>
      </div>

      {/* Summary */}
      <div className="mt-6 flex items-center justify-between bg-(--surface) p-4 sm:p-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
            Total ratings
          </p>

          <p className="mt-1 text-2xl font-bold text-(--foreground)">
            {ratings.length}
          </p>
        </div>

        <div className="flex size-10 items-center justify-center bg-(--background) text-(--accent)">
          <FaStar className="text-sm" />
        </div>
      </div>

      {/* Ratings */}
      <div className="mt-5">
        {ratings.length === 0 ? (
          <div className="bg-(--surface) px-5 py-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center bg-(--background) text-(--muted)">
              <FaStar className="text-lg" />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-(--foreground)">
              No ratings found
            </h2>

            <p className="mt-1 text-xs leading-5 text-(--muted)">
              Ratings submitted by users will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden bg-(--surface) md:block">
              <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_120px_40px] items-center gap-5 border-b border-(--border) px-5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                  User
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                  Store
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                  Rating
                </p>

                <span />
              </div>

              <div className="divide-y divide-(--border)">
                {ratings.map((rating) => (
                  <Link
                    key={rating.id}
                    to={`/admin/ratings/${rating.id}`}
                    className="grid cursor-pointer grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_120px_40px] items-center gap-5 px-5 py-4 transition hover:bg-(--background)"
                  >
                    {/* User */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                        <FaUser className="text-xs" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-(--foreground)">
                          {rating.user_name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-(--muted)">
                          {rating.user_email}
                        </p>
                      </div>
                    </div>

                    {/* Store */}
                    <div className="min-w-0">
                      <p className="flex min-w-0 items-center gap-2 text-sm font-medium text-(--foreground)">
                        <FaStore className="shrink-0 text-xs text-(--muted)" />

                        <span className="truncate">{rating.store_name}</span>
                      </p>

                      <p className="mt-1 flex min-w-0 items-center gap-2 text-xs text-(--muted)">
                        <FaUserTie className="shrink-0 text-[10px]" />

                        <span className="truncate">
                          Owner: {rating.owner_name}
                        </span>
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <FaStar className="text-xs text-(--accent)" />

                      <span className="text-sm font-semibold text-(--foreground)">
                        {Number(rating.rating).toFixed(1)}
                      </span>

                      <span className="text-xs text-(--muted)">/ 5</span>
                    </div>

                    <FaArrowRight className="justify-self-end text-xs text-(--muted)" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-3 bg-(--background) py-3 md:hidden">
              {ratings.map((rating) => (
                <Link
                  key={rating.id}
                  to={`/admin/ratings/${rating.id}`}
                  className="block cursor-pointer bg-(--surface) p-4 transition hover:bg-white"
                >
                  {/* User */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                        <FaUser className="text-sm" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-(--foreground)">
                          {rating.user_name}
                        </h3>

                        <p className="mt-0.5 truncate text-xs text-(--muted)">
                          {rating.user_email}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex shrink-0 items-center gap-1 bg-(--background) px-2.5 py-1.5 text-xs font-semibold text-(--accent)">
                      <FaStar className="text-[10px]" />

                      {Number(rating.rating).toFixed(1)}
                    </div>
                  </div>

                  {/* Store */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <FaStore className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--muted)">
                          Store
                        </p>

                        <p className="mt-1 truncate text-xs font-semibold text-(--foreground)">
                          {rating.store_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaUserTie className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--muted)">
                          Store owner
                        </p>

                        <p className="mt-1 truncate text-xs text-(--muted)">
                          {rating.owner_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View */}
                  <div className="mt-4 border-t border-(--border) pt-3">
                    <span className="flex h-10 w-full items-center justify-center gap-2 bg-(--primary) text-xs font-semibold text-white transition hover:bg-(--secondary)">
                      View rating
                      <FaArrowRight className="text-[10px]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRatings;
