import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaStore,
  FaEnvelope,
  FaLocationDot,
  FaUser,
} from "react-icons/fa6";
import api from "../../config/Api";

const AdminStores = () => {
  const [stores, setStores] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/stores", {
        params: {
          ...filters,
          sortBy,
          sortOrder,
        },
      });

      setStores(response.data.stores || []);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load stores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, sortOrder]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchStores();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
    });

    setTimeout(() => {
      fetchStores();
    }, 0);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;

    return sortOrder === "asc" ? (
      <FaArrowUp className="text-[10px]" />
    ) : (
      <FaArrowDown className="text-[10px]" />
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
            Stores
          </h1>

          <p className="mt-1 text-sm text-(--muted)">
            View and manage registered stores.
          </p>
        </div>

        <Link
          to="/admin/stores/add"
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center bg-(--primary) px-5 text-sm font-semibold text-white transition hover:bg-(--secondary) sm:w-auto"
        >
          Add store
        </Link>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 border border-(--border) bg-(--surface)"
      >
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-sm font-semibold text-(--foreground)">
                Filter stores
              </h2>

              <p className="mt-0.5 hidden text-xs text-(--muted) sm:block">
                Search stores by name, email or address.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            className="cursor-pointer text-xs font-semibold text-(--primary) transition hover:text-(--secondary)"
          >
            Clear
          </button>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          <input
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Search name"
            className="h-10 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) transition focus:border-(--primary)"
          />

          <input
            name="email"
            value={filters.email}
            onChange={handleChange}
            placeholder="Search email"
            className="h-10 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) transition focus:border-(--primary)"
          />

          <input
            name="address"
            value={filters.address}
            onChange={handleChange}
            placeholder="Search address"
            className="h-10 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) transition focus:border-(--primary)"
          />

          <button
            type="submit"
            className="h-10 w-full cursor-pointer bg-(--secondary) px-5 text-sm font-semibold text-white transition hover:bg-(--primary)"
          >
            Apply filters
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 border border-(--danger) bg-(--surface) p-4 text-sm text-(--danger)">
          {error}
        </div>
      )}

      {/* Store List */}
      <div className="mt-6 overflow-hidden bg-(--surface)">
        {loading ? (
          <div className="space-y-3 p-4 sm:p-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-16 animate-pulse bg-(--border)" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="p-10 text-center text-sm text-(--muted)">
            No stores found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-237.5 text-left">
                <thead className="border-b border-(--border) bg-(--background)">
                  <tr>
                    <th className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort("name")}
                        className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--muted)"
                      >
                        Name
                        <SortIcon field="name" />
                      </button>
                    </th>

                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                        Email
                      </span>
                    </th>

                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                        Address
                      </span>
                    </th>

                    <th className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort("rating")}
                        className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--muted)"
                      >
                        Rating
                        <SortIcon field="rating" />
                      </button>
                    </th>

                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                        Owner
                      </span>
                    </th>

                    <th className="px-5 py-4 text-right">
                      <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                        Action
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-(--border)">
                  {stores.map((store) => (
                    <tr key={store.id}>
                      <td className="px-5 py-4 text-sm font-medium text-(--foreground)">
                        {store.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-(--muted)">
                        {store.email || "—"}
                      </td>

                      <td className="max-w-xs truncate px-5 py-4 text-sm text-(--muted)">
                        {store.address}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-sm font-semibold text-(--accent)">
                          <FaStar />
                          {Number(store.overall_rating || 0).toFixed(1)}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-(--muted)">
                        {store.owner_name || "—"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/stores/${store.id}`}
                          className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-(--primary)"
                        >
                          View
                          <FaArrowRight />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 bg-(--background) p-3 md:hidden">
              {stores.map((store) => (
                <div key={store.id} className="bg-(--surface) p-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                        <FaStore className="text-sm" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-(--foreground)">
                          {store.name}
                        </h3>

                        <p className="mt-0.5 truncate text-xs text-(--muted)">
                          {store.owner_name || "No owner assigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 bg-(--background) px-2.5 py-1.5 text-xs font-semibold text-(--accent)">
                      <FaStar className="text-[10px]" />
                      {Number(store.overall_rating || 0).toFixed(1)}
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <FaEnvelope className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                      <p className="min-w-0 break-all text-xs text-(--muted)">
                        {store.email || "No email available"}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaLocationDot className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                      <p className="text-xs leading-5 text-(--muted)">
                        {store.address}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaUser className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                      <p className="text-xs text-(--muted)">
                        Owner:{" "}
                        <span className="font-medium text-(--foreground)">
                          {store.owner_name || "Not assigned"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-4 pt-1">
                    <Link
                      to={`/admin/stores/${store.id}`}
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 bg-(--primary) text-xs font-semibold text-white transition hover:bg-(--secondary)"
                    >
                      View store
                      <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminStores;
