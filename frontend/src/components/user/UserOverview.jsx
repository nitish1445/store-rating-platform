import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStore, FaStar, FaRegStar, FaArrowRight } from "react-icons/fa6";
import api from "../../config/Api";

const UserOverview = () => {
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, ratingsResponse] = await Promise.all([
          api.get("/user/profile"),
          api.get("/user/ratings"),
        ]);

        setUser(profileResponse.data.user);
        setRatings(ratingsResponse.data.ratings || []);
      } catch (error) {
        console.error("Error loading user dashboard:", error);

        setError(
          error.response?.data?.message || "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRatings = ratings.length;

  const averageRating =
    totalRatings > 0
      ? (
          ratings.reduce((sum, item) => sum + Number(item.rating), 0) /
          totalRatings
        ).toFixed(1)
      : "0.0";

  const stats = [
    {
      title: "Stores Rated",
      value: totalRatings,
      icon: FaStore,
    },
    {
      title: "Ratings Submitted",
      value: totalRatings,
      icon: FaRegStar,
    },
    {
      title: "Average Given",
      value: averageRating,
      icon: FaStar,
    },
  ];

  const formatDate = (date) => {
    if (!date) return "";

    const ratingDate = new Date(date);
    const now = new Date();

    const difference = now.getTime() - ratingDate.getTime();

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return ratingDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-3 w-24 animate-pulse bg-(--border)" />
          <div className="mt-3 h-8 w-64 animate-pulse bg-(--border)" />
          <div className="mt-2 h-4 w-80 max-w-full animate-pulse bg-(--border)" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse border border-(--border) bg-(--surface)"
            />
          ))}
        </div>

        <div className="h-36 animate-pulse border border-(--border) bg-(--surface)" />

        <div className="h-64 animate-pulse border border-(--border) bg-(--surface)" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-(--border) bg-(--surface) p-6">
        <p className="text-sm font-semibold text-(--danger)">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex h-10 items-center justify-center bg-(--primary) px-5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          My Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
          Welcome back
          <span className="text-(--primary)">
            {" "}
            {user?.name?.split(" ")[0] || "User"}
          </span>
        </h1>

        <p className="mt-1 text-sm text-(--muted)">
          Find stores, share your experience and manage your ratings.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="border border-(--border) bg-(--surface) p-5"
            >
              <div className="flex size-10 items-center justify-center bg-(--background) text-(--primary)">
                <Icon />
              </div>

              <p className="mt-5 text-2xl font-bold text-(--foreground)">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-(--muted)">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Find Stores */}
      <div className="mt-6 border border-(--border) bg-(--surface) p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex size-10 items-center justify-center bg-(--background) text-(--primary)">
              <FaStore />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-(--foreground)">
              Discover stores
            </h2>

            <p className="mt-1 max-w-lg text-sm leading-6 text-(--muted)">
              Search stores by name or address and see their overall rating
              before sharing your own experience.
            </p>
          </div>

          <Link
            to="/user/stores"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 bg-(--primary) px-5 text-sm font-semibold text-white"
          >
            Browse stores
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="mt-6 border border-(--border) bg-(--surface)">
        <div className="border-b border-(--border) px-5 py-4">
          <h2 className="text-sm font-semibold text-(--foreground)">
            Recent ratings
          </h2>

          <p className="mt-1 text-xs text-(--muted)">
            Your latest store ratings
          </p>
        </div>

        {ratings.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto flex size-10 items-center justify-center bg-(--background) text-(--muted)">
              <FaRegStar />
            </div>

            <p className="mt-3 text-sm font-medium text-(--foreground)">
              No ratings yet
            </p>

            <p className="mt-1 text-xs text-(--muted)">
              Visit a store and share your experience.
            </p>

            <Link
              to="/user/stores"
              className="mt-4 inline-flex h-9 items-center justify-center bg-(--primary) px-4 text-xs font-semibold text-white"
            >
              Browse stores
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {ratings.slice(0, 5).map((rating) => (
              <Link
                key={rating.id}
                to={`/user/ratings/${rating.store_id}`}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-(--foreground)">
                    {rating.store_name}
                  </p>

                  <p className="mt-1 text-xs text-(--muted)">
                    Rated {formatDate(rating.updated_at)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-(--accent)">
                  <FaStar />
                  {Number(rating.rating).toFixed(1)}
                </div>
              </Link>
            ))}
          </div>
        )}

        {ratings.length > 5 && (
          <div className="border-t border-(--border) px-5 py-3">
            <Link
              to="/user/ratings"
              className="inline-flex items-center gap-2 text-xs font-semibold text-(--primary)"
            >
              View all ratings
              <FaArrowRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverview;
