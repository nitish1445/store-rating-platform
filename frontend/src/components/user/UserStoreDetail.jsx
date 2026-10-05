import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaStore,
} from "react-icons/fa";
import api from "../../config/Api";

const UserStoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/user/stores/${id}`);

        const storeData = response.data.store;

        setStore(storeData);
        setSelectedRating(storeData.user_rating || 0);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load store."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  const handleRating = async () => {
    if (!selectedRating) {
      setError("Please select a rating from 1 to 5.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await api.put(
        `/user/stores/${id}/rating`,
        {
          rating: selectedRating,
        }
      );

      setMessage(response.data.message);

      const refreshed = await api.get(`/user/stores/${id}`);

      setStore(refreshed.data.store);
      setSelectedRating(refreshed.data.store.user_rating || 0);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to submit rating."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm text-(--muted)">
          Loading store...
        </p>
      </div>
    );
  }

  if (error && !store) {
    return (
      <div className="space-y-4">
        <Link
          to="/user/stores"
          className="inline-flex items-center gap-2 text-sm font-semibold text-(--primary)"
        >
          <FaArrowLeft />
          Back to stores
        </Link>

        <div className="border border-(--border) bg-(--surface) p-6">
          <p className="text-sm text-(--danger)">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        to="/user/stores"
        className="inline-flex items-center gap-2 text-sm font-semibold text-(--primary)"
      >
        <FaArrowLeft />
        Back to stores
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Store Information */}
        <div className="border border-(--border) bg-(--surface) p-6">
          <div className="flex size-12 items-center justify-center bg-(--background) text-(--primary)">
            <FaStore />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-(--foreground)">
            {store.name}
          </h1>

          <div className="mt-4 flex items-start gap-3 text-sm text-(--muted)">
            <FaMapMarkerAlt className="mt-0.5 shrink-0 text-(--primary)" />

            <span>{store.address}</span>
          </div>

          {store.email && (
            <p className="mt-3 text-sm text-(--muted)">
              {store.email}
            </p>
          )}

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="border border-(--border) p-4">
              <p className="text-xs text-(--muted)">
                Overall rating
              </p>

              <div className="mt-2 flex items-center gap-2">
                <FaStar className="text-(--accent)" />

                <span className="text-xl font-semibold text-(--foreground)">
                  {Number(store.overall_rating).toFixed(1)}
                </span>
              </div>
            </div>

            <div className="border border-(--border) p-4">
              <p className="text-xs text-(--muted)">
                Total ratings
              </p>

              <p className="mt-2 text-xl font-semibold text-(--foreground)">
                {store.total_ratings}
              </p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="h-fit border border-(--border) bg-(--surface) p-6">
          <h2 className="text-lg font-semibold text-(--foreground)">
            {store.user_rating
              ? "Update your rating"
              : "Rate this store"}
          </h2>

          <p className="mt-1 text-sm text-(--muted)">
            Select a rating from 1 to 5.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedRating(value)}
                className="cursor-pointer p-1"
                aria-label={`Rate ${value} out of 5`}
              >
                <FaStar
                  className={
                    value <= selectedRating
                      ? "text-(--accent)"
                      : "text-(--border)"
                  }
                />
              </button>
            ))}
          </div>

          <p className="mt-3 text-center text-sm font-semibold text-(--foreground)">
            {selectedRating
              ? `${selectedRating} / 5`
              : "No rating selected"}
          </p>

          {error && (
            <p className="mt-4 text-center text-xs text-(--danger)">
              {error}
            </p>
          )}

          {message && (
            <p className="mt-4 text-center text-xs text-(--success)">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={handleRating}
            disabled={submitting || !selectedRating}
            className="mt-5 h-11 w-full cursor-pointer bg-(--primary) text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : store.user_rating
                ? "Update rating"
                : "Submit rating"}
          </button>

          {store.user_rating && (
            <p className="mt-3 text-center text-xs text-(--muted)">
              Your current rating: {store.user_rating}/5
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStoreDetail;