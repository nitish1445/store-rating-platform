import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaArrowRight,
} from "react-icons/fa6";
import api from "../../config/Api";

const OwnerRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/owner/ratings");

        setRatings(response.data.ratings || []);
      } catch (error) {
        console.error("Error fetching ratings:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load ratings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 animate-pulse bg-(--border)" />

        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse border border-(--border) bg-(--surface)"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-(--border) bg-(--surface) p-6">
        <p className="text-sm font-semibold text-(--danger)">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          Customer Feedback
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
          Ratings
        </h1>

        <p className="mt-1 text-sm text-(--muted)">
          View ratings submitted by customers for your store.
        </p>
      </div>

      <div className="mt-7 border border-(--border) bg-(--surface)">
        {ratings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FaStar className="mx-auto text-2xl text-(--muted)" />

            <p className="mt-3 text-sm font-semibold text-(--foreground)">
              No ratings yet
            </p>

            <p className="mt-1 text-xs text-(--muted)">
              Customer ratings will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {ratings.map((rating) => (
              <Link
                key={rating.id}
                to={`/owner/ratings/${rating.id}`}
                className="flex items-center justify-between gap-5 px-5 py-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-(--foreground)">
                    {rating.user_name}
                  </p>

                  <p className="mt-1 truncate text-xs text-(--muted)">
                    {rating.user_email}
                  </p>

                  <p className="mt-1 text-xs text-(--muted)">
                    Rated{" "}
                    {formatDate(
                      rating.updated_at ||
                        rating.created_at
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="flex items-center gap-1 text-sm font-semibold text-(--accent)">
                    <FaStar />
                    {Number(rating.rating).toFixed(1)}
                  </div>

                  <FaArrowRight className="text-xs text-(--muted)" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerRatings;