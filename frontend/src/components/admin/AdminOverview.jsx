import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaStore, FaStar, FaArrowRight } from "react-icons/fa6";
import api from "../../config/Api";

const AdminOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await api.get("/admin/overview");

        setOverview(response.data.overview);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse border border-(--border) bg-(--surface)"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-(--border) bg-(--surface) p-6 text-sm font-medium text-(--danger)">
        {error}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: overview?.total_users || 0,
      icon: FaUsers,
      link: "/admin/users",
    },
    {
      title: "Total Stores",
      value: overview?.total_stores || 0,
      icon: FaStore,
      link: "/admin/stores",
    },
    {
      title: "Submitted Ratings",
      value: overview?.total_ratings || 0,
      icon: FaStar,
      link: "/admin/ratings",
    },
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
        Administration
      </p>

      <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
        Dashboard overview
      </h1>

      <p className="mt-1 text-sm text-(--muted)">
        Monitor users, stores and ratings across the platform.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="border border-(--border) bg-(--surface) p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center bg-(--background) text-(--primary)">
                  <Icon />
                </div>

                <FaArrowRight className="text-xs text-(--muted)" />
              </div>

              <p className="mt-5 text-2xl font-bold text-(--foreground)">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-(--muted)">{stat.title}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/users/add"
          className="border border-(--border) bg-(--surface) p-6"
        >
          <p className="text-sm font-semibold text-(--foreground)">Add user</p>

          <p className="mt-1 text-xs leading-5 text-(--muted)">
            Create a normal user, store owner or administrator account.
          </p>

          <p className="mt-4 text-xs font-semibold text-(--primary)">
            Create account →
          </p>
        </Link>

        <Link
          to="/admin/stores/add"
          className="border border-(--border) bg-(--surface) p-6"
        >
          <p className="text-sm font-semibold text-(--foreground)">Add store</p>

          <p className="mt-1 text-xs leading-5 text-(--muted)">
            Register a store and assign its owner.
          </p>

          <p className="mt-4 text-xs font-semibold text-(--primary)">
            Create store →
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminOverview;
