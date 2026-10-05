import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaUser,
  FaStore,
  FaEnvelope,
  FaLocationDot,
} from "react-icons/fa6";
import api from "../../config/Api";

const OwnerRatingDetail = () => {
  const { id } = useParams();

  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRating = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/owner/ratings/${id}`
        );

        setRating(response.data.rating);
      } catch (error) {
        console.error("Error fetching rating:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load rating."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-5 w-32 animate-pulse bg-(--border)" />

        <div className="h-80 animate-pulse border border-(--border) bg-(--surface)" />
      </div>
    );
  }

  if (error || !rating) {
    return (
      <div className="border border-(--border) bg-(--surface) p-6">
        <p className="text-sm font-semibold text-(--danger)">
          {error || "Rating not found."}
        </p>

        <Link
          to="/owner/ratings"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-(--primary)"
        >
          <FaArrowLeft />
          Back to ratings
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/owner/ratings"
        className="inline-flex items-center gap-2 text-xs font-semibold text-(--primary)"
      >
        <FaArrowLeft />
        Back to ratings
      </Link>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          Customer Rating
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
          Rating details
        </h1>
      </div>

      <div className="mt-7 border border-(--border) bg-(--surface)">
        <div className="border-b border-(--border) p-6">
          <div className="flex size-12 items-center justify-center bg-(--background) text-lg text-(--primary)">
            <FaUser />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-(--foreground)">
            {rating.user_name}
          </h2>

          <p className="mt-1 text-sm text-(--muted)">
            Customer feedback
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
              Customer
            </p>

            <div className="mt-3 flex items-center gap-3">
              <FaUser className="text-(--primary)" />

              <span className="text-sm font-medium text-(--foreground)">
                {rating.user_name}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
              Email
            </p>

            <div className="mt-3 flex items-center gap-3">
              <FaEnvelope className="text-(--primary)" />

              <span className="break-all text-sm font-medium text-(--foreground)">
                {rating.user_email}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
              Customer Address
            </p>

            <div className="mt-3 flex items-start gap-3">
              <FaLocationDot className="mt-0.5 shrink-0 text-(--primary)" />

              <span className="text-sm font-medium text-(--foreground)">
                {rating.user_address}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
              Store
            </p>

            <div className="mt-3 flex items-center gap-3">
              <FaStore className="text-(--primary)" />

              <span className="text-sm font-medium text-(--foreground)">
                {rating.store_name}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-(--border) p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
            Rating given
          </p>

          <div className="mt-3 flex items-center gap-2">
            <FaStar className="text-xl text-(--accent)" />

            <span className="text-3xl font-bold text-(--foreground)">
              {Number(rating.rating).toFixed(1)}
            </span>

            <span className="text-sm text-(--muted)">
              / 5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerRatingDetail;