import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaStar } from "react-icons/fa";
import api from "../../config/Api";

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRatings = async () => {
    try {
      setLoading(true);

      const response = await api.get("/user/ratings");

      setRatings(response.data.ratings || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load your ratings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm text-(--muted)">
          Loading your ratings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-(--foreground)">
          My Ratings
        </h1>

        <p className="mt-1 text-sm text-(--muted)">
          View and update the ratings you have submitted.
        </p>
      </div>

      {error && (
        <div className="border border-(--border) bg-(--surface) p-4">
          <p className="text-sm text-(--danger)">
            {error}
          </p>
        </div>
      )}

      {ratings.length === 0 ? (
        <div className="border border-(--border) bg-(--surface) p-10 text-center">
          <FaStar className="mx-auto text-2xl text-(--muted)" />

          <p className="mt-3 text-sm text-(--muted)">
            You have not rated any stores yet.
          </p>

          <Link
            to="/user/stores"
            className="mt-5 inline-flex h-10 items-center bg-(--primary) px-5 text-sm font-semibold text-white"
          >
            Discover stores
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ratings.map((item) => (
            <Link
              key={item.id}
              to={`/user/ratings/${item.store_id}`}
              className="flex items-center justify-between gap-4 border border-(--border) bg-(--surface) p-5"
            >
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-(--foreground)">
                  {item.store_name}
                </h2>

                <p className="mt-1 truncate text-sm text-(--muted)">
                  {item.store_address}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <FaStar className="text-xs text-(--accent)" />

                    <span className="text-sm font-semibold text-(--foreground)">
                      Your rating: {item.rating}/5
                    </span>
                  </div>

                  <span className="text-xs text-(--muted)">
                    Overall:{" "}
                    {Number(item.overall_rating).toFixed(1)}
                  </span>
                </div>
              </div>

              <FaChevronRight className="shrink-0 text-xs text-(--muted)" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRatings;