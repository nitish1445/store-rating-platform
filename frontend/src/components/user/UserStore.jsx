import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStore,
  FaStar,
  FaChevronRight,
  FaFilter,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import api from "../../config/Api";

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    name: "",
    address: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/user/stores");

        setStores(response.data.stores || []);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load stores.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = useMemo(() => {
    const name = appliedFilters.name.trim().toLowerCase();
    const address = appliedFilters.address.trim().toLowerCase();

    return stores.filter((store) => {
      const matchesName = store.name?.toLowerCase().includes(name);

      const matchesAddress = store.address?.toLowerCase().includes(address);

      return matchesName && matchesAddress;
    });
  }, [stores, appliedFilters]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      name: filters.name,
      address: filters.address,
    });
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      name: "",
      address: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const hasFilters =
    appliedFilters.name.trim() || appliedFilters.address.trim();

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <p className="text-sm text-(--muted)">Loading stores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-(--surface) p-6">
        <p className="text-sm text-(--danger)">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-(--foreground)">Stores</h1>

        <p className="mt-1 text-sm text-(--muted)">
          Discover stores and share your experience.
        </p>
      </div>

      {/* Filters */}
      {/* Filters */}
      <div className="bg-(--surface) p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Filter heading */}
          <div className="flex items-center gap-3 lg:min-w-47.5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
              <FaFilter className="text-xs" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-(--foreground)">
                Filter stores
              </h2>

              <p className="mt-0.5 text-[11px] text-(--muted)">
                Search by name or address
              </p>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="store-name-filter"
                className="text-[11px] font-semibold text-(--foreground)"
              >
                Store name
              </label>

              <input
                id="store-name-filter"
                name="name"
                value={filters.name}
                onChange={handleChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleApplyFilters();
                  }
                }}
                placeholder="Search store name"
                className="mt-1.5 h-10 w-full bg-(--background) px-3 text-xs text-(--foreground) outline-none ring-1 ring-inset ring-(--border) transition focus:bg-(--surface) focus:ring-(--primary)"
              />
            </div>

            <div>
              <label
                htmlFor="store-address-filter"
                className="text-[11px] font-semibold text-(--foreground)"
              >
                Address
              </label>

              <input
                id="store-address-filter"
                name="address"
                value={filters.address}
                onChange={handleChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleApplyFilters();
                  }
                }}
                placeholder="Search address"
                className="mt-1.5 h-10 w-full bg-(--background) px-3 text-xs text-(--foreground) outline-none ring-1 ring-inset ring-(--border) transition focus:bg-(--surface) focus:ring-(--primary)"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 lg:shrink-0">
            {hasFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center border border-(--border) bg-(--surface) px-4 text-xs font-semibold text-(--foreground) transition hover:bg-(--background) sm:flex-none"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={handleApplyFilters}
              className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 bg-(--primary) px-5 text-xs font-semibold text-white transition hover:bg-(--secondary) sm:flex-none"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Store count */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-(--muted)">
          Showing{" "}
          <span className="font-semibold text-(--foreground)">
            {filteredStores.length}
          </span>{" "}
          {filteredStores.length === 1 ? "store" : "stores"}
        </p>
      </div>

      {/* Empty state */}
      {filteredStores.length === 0 ? (
        <div className="bg-(--surface) p-10 text-center">
          <FaStore className="mx-auto text-2xl text-(--muted)" />

          <p className="mt-3 text-sm font-medium text-(--foreground)">
            {stores.length === 0
              ? "No stores available."
              : "No stores match your filters."}
          </p>

          {stores.length > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 cursor-pointer text-xs font-semibold text-(--primary) hover:text-(--secondary)"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStores.map((store) => (
            <Link
              key={store.id}
              to={`/user/stores/${store.id}`}
              className="group cursor-pointer bg-(--surface) p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                  <FaStore />
                </div>

                <FaChevronRight className="mt-1 text-xs text-(--muted) transition group-hover:text-(--primary)" />
              </div>

              <h2 className="mt-5 text-base font-semibold text-(--foreground)">
                {store.name}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-5 text-(--muted)">
                {store.address}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-(--border) pt-4">
                <div className="flex items-center gap-1.5">
                  <FaStar className="text-sm text-(--accent)" />

                  <span className="text-sm font-semibold text-(--foreground)">
                    {Number(store.overall_rating).toFixed(1)}
                  </span>
                </div>

                <span className="text-xs text-(--muted)">
                  {store.total_ratings} ratings
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStores;
