import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaUser,
  FaStore,
  FaUserTie,
  FaEnvelope,
  FaLocationDot,
  FaCalendar,
} from "react-icons/fa6";
import api from "../../config/Api";

const AdminRatingDetail = () => {
  const { id } = useParams();

  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await api.get(`/admin/ratings/${id}`);

        setRating(response.data.rating);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load rating.");
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

        <div className="h-8 w-48 animate-pulse bg-(--border)" />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-96 animate-pulse bg-(--surface)" />

          <div className="space-y-4">
            <div className="h-40 animate-pulse bg-(--surface)" />
            <div className="h-40 animate-pulse bg-(--surface)" />
          </div>
        </div>
      </div>
    );
  }

  if (!rating) {
    return (
      <div className="bg-(--surface) p-6">
        <p className="text-sm text-(--danger)">
          {error || "Rating not found."}
        </p>

        <Link
          to="/admin/ratings"
          className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 bg-(--primary) px-4 text-sm font-semibold text-white transition hover:bg-(--secondary)"
        >
          <FaArrowLeft className="text-xs" />
          Back to ratings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link
        to="/admin/ratings"
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-(--primary) transition hover:text-(--secondary)"
      >
        <FaArrowLeft className="text-xs" />
        Back to ratings
      </Link>

      {/* Heading */}
      <div>
        <div className="flex items-start gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
              Administration
            </p>

            <h1 className="mt-1 text-xl font-bold tracking-tight text-(--foreground) sm:text-2xl">
              Rating details
            </h1>

            <p className="mt-1 text-sm text-(--muted)">
              Review the customer, store, owner, and submitted rating
              information.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-(--surface) p-4 text-sm text-(--danger)">
          {error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main information */}
        <div className="space-y-5">
          {/* Customer */}
          <section className="bg-(--surface)">
            <div className="border-b border-(--border) p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                  <FaUser className="text-sm" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                    Customer
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-(--foreground)">
                    {rating.user_name}
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-(--muted)">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-(--foreground)">
                    {rating.user_email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaLocationDot className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-(--muted)">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-(--muted)">
                    {rating.user_address}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Store */}
          <section className="bg-(--surface)">
            <div className="border-b border-(--border) p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                  <FaStore className="text-sm" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                    Store
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-(--foreground)">
                    {rating.store_name}
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <FaLocationDot className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-(--muted)">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-(--muted)">
                    {rating.store_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaUserTie className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-(--muted)">
                    Store owner
                  </p>

                  <p className="mt-1 text-sm font-medium text-(--foreground)">
                    {rating.owner_name}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Rating summary */}
        <aside className="space-y-5">
          <section className="bg-(--surface) p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
              Submitted rating
            </p>

            <div className="mt-5 flex items-center justify-center bg-(--background) px-5 py-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <FaStar className="text-xl text-(--accent)" />

                  <span className="text-4xl font-bold tracking-tight text-(--foreground)">
                    {Number(rating.rating).toFixed(1)}
                  </span>
                </div>

                <p className="mt-2 text-xs text-(--muted)">out of 5</p>
              </div>
            </div>

            {/* Stars */}
            <div className="mt-5 flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-base ${
                    star <= Number(rating.rating)
                      ? "text-(--accent)"
                      : "text-(--border)"
                  }`}
                />
              ))}
            </div>
          </section>

          {/* Rating metadata */}
          <section className="bg-(--surface) p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
              Rating information
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs text-(--muted)">Rating value</span>

                <span className="text-xs font-semibold text-(--foreground)">
                  {Number(rating.rating).toFixed(1)} / 5
                </span>
              </div>

              {rating.created_at && (
                <div className="flex items-start justify-between gap-4">
                  <span className="flex items-center gap-2 text-xs text-(--muted)">
                    <FaCalendar className="text-[10px]" />
                    Submitted
                  </span>

                  <span className="text-right text-xs font-medium text-(--foreground)">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}

              {rating.updated_at && rating.updated_at !== rating.created_at && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-(--muted)">Updated</span>

                  <span className="text-right text-xs font-medium text-(--foreground)">
                    {new Date(rating.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default AdminRatingDetail;
