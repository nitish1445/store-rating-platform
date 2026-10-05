import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowDown,
  FaArrowUp,
  FaFilter,
  FaUser,
  FaEnvelope,
  FaLocationDot,
} from "react-icons/fa6";
import api from "../../config/Api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        ...filters,
        sortBy,
        sortOrder,
      };

      const response = await api.get("/admin/users", { params });

      setUsers(response.data.users || []);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, sortOrder]);

  const handleFilter = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchUsers();
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
      role: "",
    });

    setTimeout(() => {
      fetchUsers();
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
            Users
          </h1>

          <p className="mt-1 text-sm text-(--muted)">
            Manage normal users, store owners and administrators.
          </p>
        </div>

        <Link
          to="/admin/users/add"
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center bg-(--primary) px-5 text-sm font-semibold text-white transition hover:bg-(--secondary) sm:w-auto"
        >
          Add user
        </Link>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="mt-6 border border-(--border) bg-(--surface)"
      >
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-sm font-semibold text-(--foreground)">
                Filter users
              </h2>

              <p className="mt-0.5 hidden text-xs text-(--muted) sm:block">
                Search and filter users by account information.
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

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-5">
          <input
            name="name"
            value={filters.name}
            onChange={handleFilter}
            placeholder="Search name"
            className="h-10 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) transition focus:border-(--primary)"
          />

          <input
            name="email"
            value={filters.email}
            onChange={handleFilter}
            placeholder="Search email"
            className="h-10 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) transition focus:border-(--primary)"
          />

          <input
            name="address"
            value={filters.address}
            onChange={handleFilter}
            placeholder="Search address"
            className="h-10 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) transition focus:border-(--primary)"
          />

          <select
            name="role"
            value={filters.role}
            onChange={handleFilter}
            className="h-10 w-full cursor-pointer border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none transition focus:border-(--primary)"
          >
            <option value="">All roles</option>
            <option value="user">Normal User</option>
            <option value="owner">Store Owner</option>
            <option value="admin">Administrator</option>
          </select>

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

      {/* Users */}
      <div className="mt-6 overflow-hidden border border-(--border) bg-(--surface)">
        {loading ? (
          <div className="space-y-3 p-4 sm:p-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-16 animate-pulse bg-(--border)" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-(--muted)">
            No users found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-212.5 text-left">
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
                      <button
                        type="button"
                        onClick={() => handleSort("email")}
                        className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--muted)"
                      >
                        Email
                        <SortIcon field="email" />
                      </button>
                    </th>

                    <th className="px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                        Address
                      </span>
                    </th>

                    <th className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort("role")}
                        className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--muted)"
                      >
                        Role
                        <SortIcon field="role" />
                      </button>
                    </th>

                    <th className="px-5 py-4 text-right">
                      <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                        Action
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-(--border)">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-5 py-4 text-sm font-medium text-(--foreground)">
                        {user.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-(--muted)">
                        {user.email}
                      </td>

                      <td className="max-w-xs truncate px-5 py-4 text-sm text-(--muted)">
                        {user.address}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold capitalize text-(--foreground)">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/users/${user.id}`}
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
            <div className="space-y-5 p-3 md:hidden">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border border-(--border) bg-(--surface) p-4"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                        <FaUser className="text-sm" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-(--foreground)">
                          {user.name}
                        </h3>

                        <p className="mt-0.5 truncate text-xs text-(--muted)">
                          {user.role === "user"
                            ? "Normal User"
                            : user.role === "owner"
                              ? "Store Owner"
                              : "Administrator"}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 bg-(--background) px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-(--primary)">
                      {user.role}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-3 border-t border-(--border) pt-4">
                    <div className="flex items-start gap-3">
                      <FaEnvelope className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                      <p className="min-w-0 break-all text-xs text-(--muted)">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaLocationDot className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                      <p className="text-xs leading-5 text-(--muted)">
                        {user.address}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-4 border-t border-(--border) pt-3">
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 bg-(--primary) text-xs font-semibold text-white transition hover:bg-(--secondary)"
                    >
                      View user
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

export default AdminUsers;
