import React, { useEffect, useState } from "react";
import {
  FaUserShield,
  FaEnvelope,
  FaLocationDot,
  FaCalendarDays,
  FaIdCard,
} from "react-icons/fa6";
import api from "../../config/Api";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get("/admin/profile");

        setAdmin(response.data.admin);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load admin profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse border border-(--border) bg-(--surface)" />

        <div className="h-72 animate-pulse border border-(--border) bg-(--surface)" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-(--danger) bg-(--surface) p-5">
        <p className="text-sm font-medium text-(--danger)">{error}</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="border border-(--border) bg-(--surface) p-6">
        <p className="text-sm text-(--muted)">Admin profile not found.</p>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Heading */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
          My profile
        </h1>

        <p className="mt-1 text-sm text-(--muted)">
          View your administrator account information.
        </p>
      </div>

      {/* Profile Header */}

      <div className="mt-7 border border-(--border) bg-(--surface) p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-24 shrink-0 items-center justify-center bg-(--secondary) text-xl text-white">
            <FaUserShield size={28} />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-(--foreground)">
              {admin.name}
            </h2>

            <p className="mt-1 text-sm text-(--muted)">{admin.email}</p>

            <span className="mt-3 inline-flex bg-(--background) px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-(--primary)">
              System Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Account Information */}

      <div className="mt-6 border border-(--border) bg-(--surface)">
        <div className="border-b border-(--border) px-6 py-4">
          <h2 className="text-sm font-semibold text-(--foreground)">
            Account information
          </h2>

          <p className="mt-1 text-xs text-(--muted)">
            Your registered administrator details.
          </p>
        </div>

        <div className="grid gap-x-8 sm:grid-cols-2">
          {/* Name */}

          <div className="flex gap-4 border-b border-(--border) px-6 py-5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
              <FaUserShield className="text-sm" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-(--muted)">Full name</p>

              <p className="mt-1 wrap-break-word text-sm font-medium text-(--foreground)">
                {admin.name}
              </p>
            </div>
          </div>

          {/* Email */}

          <div className="flex gap-4 border-b border-(--border) px-6 py-5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
              <FaEnvelope className="text-sm" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-(--muted)">Email address</p>

              <p className="mt-1 break-all text-sm font-medium text-(--foreground)">
                {admin.email}
              </p>
            </div>
          </div>

          {/* Address */}

          <div className="flex gap-4 border-b border-(--border) px-6 py-5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
              <FaLocationDot className="text-sm" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-(--muted)">Address</p>

              <p className="mt-1 wrap-break-word text-sm font-medium leading-5 text-(--foreground)">
                {admin.address || "—"}
              </p>
            </div>
          </div>

          {/* Role */}

          <div className="flex gap-4 border-b border-(--border) px-6 py-5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
              <FaIdCard className="text-sm" />
            </div>

            <div>
              <p className="text-xs text-(--muted)">Account role</p>

              <p className="mt-1 text-sm font-medium capitalize text-(--foreground)">
                {admin.role}
              </p>
            </div>
          </div>

          {/* Created */}

          <div className="flex gap-4 border-b border-(--border) px-6 py-5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
              <FaCalendarDays className="text-sm" />
            </div>

            <div>
              <p className="text-xs text-(--muted)">Account created</p>

              <p className="mt-1 text-sm font-medium text-(--foreground)">
                {formatDate(admin.created_at)}
              </p>
            </div>
          </div>

          {/* Updated */}

          <div className="flex gap-4 border-b border-(--border) px-6 py-5">
            <div className="flex size-9 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
              <FaCalendarDays className="text-sm" />
            </div>

            <div>
              <p className="text-xs text-(--muted)">Last updated</p>

              <p className="mt-1 text-sm font-medium text-(--foreground)">
                {formatDate(admin.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account ID */}

      <div className="mt-6 border border-(--border) bg-(--surface) p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
          Account ID
        </p>

        <p className="mt-2 break-all font-mono text-xs text-(--foreground)">
          {admin.id}
        </p>
      </div>
    </div>
  );
};

export default AdminProfile;
