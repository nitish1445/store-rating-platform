import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStore,
  FaStar,
  FaLocationDot,
  FaArrowRight,
  FaEnvelope,
} from "react-icons/fa6";
import api from "../../config/Api";

const OwnerStore = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/owner/store");

        setStore(response.data.store);
      } catch (error) {
        console.error("Error fetching store:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load store."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-3 w-20 animate-pulse bg-(--border)" />
          <div className="mt-3 h-8 w-48 animate-pulse bg-(--border)" />
        </div>

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
      </div>
    );
  }

  if (!store) {
    return (
      <div className="border border-(--border) bg-(--surface) p-8 text-center">
        <FaStore className="mx-auto text-2xl text-(--muted)" />

        <p className="mt-3 text-sm font-semibold text-(--foreground)">
          No store found
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          Store
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
          My Store
        </h1>

        <p className="mt-1 text-sm text-(--muted)">
          View and manage your store information.
        </p>
      </div>

      <div className="mt-7 border border-(--border) bg-(--surface)">
        <div className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-start">
          <div>
            <div className="flex size-12 items-center justify-center bg-(--background) text-lg text-(--primary)">
              <FaStore />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-(--foreground)">
              {store.name}
            </h2>

            <p className="mt-2 flex items-start gap-2 text-sm text-(--muted)">
              <FaLocationDot className="mt-0.5 shrink-0 text-(--primary)" />
              {store.address}
            </p>

            {store.email && (
              <p className="mt-2 flex items-start gap-2 text-sm text-(--muted)">
              <FaEnvelope className="mt-0.5 shrink-0 text-(--primary)" />
              {store.email}
            </p>
            )}
          </div>

          <Link
            to={`/owner/store/${store.id}`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 bg-(--primary) px-5 text-sm font-semibold text-white"
          >
            Manage store
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid border-t border-(--border) sm:grid-cols-2">
          <div className="border-b border-(--border) p-6 sm:border-b-0 sm:border-r">
            <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
              Average Rating
            </p>

            <div className="mt-2 flex items-center gap-2">
              <FaStar className="text-(--accent)" />

              <span className="text-2xl font-bold text-(--foreground)">
                {Number(store.average_rating || 0).toFixed(1)}
              </span>
            </div>
          </div>

          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
              Total Ratings
            </p>

            <p className="mt-2 text-2xl font-bold text-(--foreground)">
              {store.total_ratings || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerStore;