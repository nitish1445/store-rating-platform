import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaUsers,
  FaStore,
  FaArrowRight,
} from "react-icons/fa6";
import api from "../../config/Api";

const OwnerOverview = () => {
  const [overview, setOverview] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");

        const [overviewResponse, ratingsResponse] =
          await Promise.all([
            api.get("/owner/overview"),
            api.get("/owner/ratings"),
          ]);

        setOverview(overviewResponse.data.overview);
        setRatings(ratingsResponse.data.ratings || []);
      } catch (error) {
        console.error("Error fetching owner overview:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load store dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    const value = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() - value.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (minutes < 1) return "Just now";

    if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    }

    if (hours < 24) {
      return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    }

    if (days === 1) return "Yesterday";

    if (days < 7) {
      return `${days} days ago`;
    }

    return value.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-3 w-28 animate-pulse bg-(--border)" />
          <div className="mt-3 h-8 w-64 animate-pulse bg-(--border)" />
          <div className="mt-2 h-4 w-96 max-w-full animate-pulse bg-(--border)" />
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
        <p className="text-sm font-semibold text-(--danger)">
          {error}
        </p>

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

  const stats = [
    {
      title: "Average Rating",
      value: Number(
        overview?.average_rating || 0
      ).toFixed(1),
      icon: FaStar,
    },
    {
      title: "Total Ratings",
      value: overview?.total_ratings || 0,
      icon: FaStar,
    },
    {
      title: "Customers",
      value: overview?.total_customers || 0,
      icon: FaUsers,
    },
  ];

  return (
    <div>
      {/* Heading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          Store Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
          Store overview
        </h1>

        <p className="mt-1 text-sm text-(--muted)">
          Track your store performance and customer feedback.
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
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center bg-(--background) text-(--primary)">
                  <Icon />
                </div>

                {stat.title === "Average Rating" && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-(--success)">
                    Performance
                  </span>
                )}
              </div>

              <p className="mt-5 text-2xl font-bold text-(--foreground)">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-(--muted)">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Store Card */}
      <div className="mt-6 border border-(--border) bg-(--surface) p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <div className="flex size-10 items-center justify-center bg-(--background) text-(--primary)">
              <FaStore />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-(--foreground)">
              Your store
            </h2>

            <p className="mt-1 text-sm font-medium text-(--foreground)">
              {overview?.store_name || "Store"}
            </p>

            <p className="mt-1 text-xs leading-5 text-(--muted)">
              {overview?.store_address ||
                "Store address unavailable."}
            </p>
          </div>

          <Link
            to={`/owner/store/${overview?.store_id}`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 bg-(--primary) px-5 text-sm font-semibold text-white"
          >
            View store
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="mt-6 border border-(--border) bg-(--surface)">
        <div className="flex items-center justify-between border-b border-(--border) px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-(--foreground)">
              Recent customer ratings
            </h2>

            <p className="mt-1 text-xs text-(--muted)">
              Customers who recently rated your store
            </p>
          </div>

          <Link
            to="/owner/ratings"
            className="text-xs font-semibold text-(--primary)"
          >
            View all
          </Link>
        </div>

        {ratings.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-(--foreground)">
              No ratings yet
            </p>

            <p className="mt-1 text-xs text-(--muted)">
              Customer ratings will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {ratings.slice(0, 5).map((rating) => (
              <Link
                key={rating.id}
                to={`/owner/ratings/${rating.id}`}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-(--foreground)">
                    {rating.user_name}
                  </p>

                  <p className="mt-1 text-xs text-(--muted)">
                    Rated{" "}
                    {formatDate(
                      rating.updated_at ||
                        rating.created_at
                    )}
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
      </div>
    </div>
  );
};

export default OwnerOverview;