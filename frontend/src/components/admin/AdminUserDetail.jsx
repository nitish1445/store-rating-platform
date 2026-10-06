import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrash,
  FaStar,
  FaUser,
  FaEnvelope,
  FaLocationDot,
  FaUserShield,
  FaCircleCheck,
} from "react-icons/fa6";
import api from "../../config/Api";
import toast from "react-hot-toast";

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    role: "user",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/admin/users/${id}`);
        const data = response.data.user;
        setUser(data);

        setForm({
          name: data.name || "",
          email: data.email || "",
          address: data.address || "",
          role: data.role || "user",
        });
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(`/admin/users/${id}`, {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
      });

      setUser((previous) => ({
        ...previous,
        ...response.data.user,
      }));

      toast.success(response?.data?.message || "User updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      const response = await api.delete(`/admin/users/${id}`);
      toast.success(response?.data?.message || "User deleted succesfully");
      navigate("/admin/users");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-28 animate-pulse bg-(--border)" />
        <div className="h-16 animate-pulse bg-(--border)" />
        <div className="h-96 animate-pulse bg-(--border)" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="border border-(--border) bg-(--surface) p-6">
        <p className="text-sm text-(--danger)">{error || "User not found."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Back */}
      <Link
        to="/admin/users"
        className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-(--primary) transition hover:text-(--secondary)"
      >
        <FaArrowLeft className="text-[11px]" />
        Back to users
      </Link>

      {/* Header */}
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          Administration
        </p>

        <div className="mt-1 flex items-center gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-(--foreground)">
              User details
            </h1>

            <p className="mt-0.5 text-sm text-(--muted)">
              View and manage this user's account information.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-6 flex items-start gap-3 border border-(--danger) bg-(--surface) px-4 py-3.5">
          <div className="mt-1 size-2 shrink-0 rounded-full bg-(--danger)" />

          <p className="text-sm leading-5 text-(--danger)">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-start gap-3 border border-(--success) bg-(--surface) px-4 py-3.5">
          <FaCircleCheck className="mt-0.5 shrink-0 text-sm text-(--success)" />

          <p className="text-sm leading-5 text-(--success)">{success}</p>
        </div>
      )}

      {/* Profile Summary */}
      <div className="mt-6 border border-(--border) bg-(--surface) p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center bg-(--background) text-lg text-(--primary)">
              <FaUser />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-(--foreground)">
                {user.name}
              </h2>

              <p className="mt-1 truncate text-sm text-(--muted)">
                {user.email}
              </p>
            </div>
          </div>

          <span className="w-fit bg-(--background) px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-(--primary)">
            {user.role === "user"
              ? "Normal User"
              : user.role === "owner"
                ? "Store Owner"
                : "Administrator"}
          </span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-5 border border-(--border) bg-(--surface)"
      >
        {/* Form Header */}
        <div className="border-b border-(--border) px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold text-(--foreground)">
            Account information
          </h2>

          <p className="mt-1 text-xs leading-5 text-(--muted)">
            Update the user's registered account details.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-(--foreground)"
              >
                <FaUser className="text-(--muted)" />
                Name
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                minLength={20}
                maxLength={60}
                required
                className="h-11 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none transition focus:border-(--primary)"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-(--foreground)"
              >
                <FaEnvelope className="text-(--muted)" />
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="h-11 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none transition focus:border-(--primary)"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-(--foreground)"
              >
                <FaUserShield className="text-(--muted)" />
                Role
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="h-11 w-full cursor-pointer border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none transition focus:border-(--primary)"
              >
                <option value="user">Normal User</option>
                <option value="owner">Store Owner</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-(--foreground)"
              >
                <FaLocationDot className="text-(--muted)" />
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                maxLength={400}
                rows={3}
                required
                className="w-full resize-none border border-(--border) bg-(--surface) px-3 py-3 text-sm leading-5 text-(--foreground) outline-none transition focus:border-(--primary)"
              />

              <div className="mt-1 flex justify-end">
                <span className="text-[11px] text-(--muted)">
                  {form.address.length}/400
                </span>
              </div>
            </div>
          </div>

          {/* Owner Rating */}
          {user.role === "owner" && (
            <div className="mt-6 border border-(--border) bg-(--background) p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                    Store owner rating
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <FaStar className="text-(--accent)" />

                    <span className="text-2xl font-bold text-(--foreground)">
                      {Number(user.owner_rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-(--muted)">Stores owned</p>

                  <p className="mt-1 text-lg font-semibold text-(--foreground)">
                    {user.total_stores || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-(--border) bg-(--background) px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 border border-(--danger) bg-(--surface) px-5 text-sm font-semibold text-(--danger) transition hover:bg-(--danger) hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <FaTrash className="text-xs" />
            {deleting ? "Deleting..." : "Delete user"}
          </button>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              to="/admin/users"
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center border border-(--border) bg-(--surface) px-5 text-sm font-semibold text-(--foreground) transition hover:bg-(--surface) sm:w-auto"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || deleting}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center bg-(--primary) px-6 text-sm font-semibold text-white transition hover:bg-(--secondary) disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminUserDetail;
