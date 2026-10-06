import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaStore, FaStar, FaTrash } from "react-icons/fa6";
import api from "../../config/Api";
import toast from "react-hot-toast";

const OwnerStoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/owner/store/${id}`);
        const data = response.data.store;
        setStore(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error fetching store:", error);
        setError(error.response?.data?.message || "Unable to load store.");
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(`/owner/store/${id}`, {
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
      });

      setStore(response.data.store);

      setForm({
        name: response.data.store.name || "",
        email: response.data.store.email || "",
        address: response.data.store.address || "",
      });

      toast.success(response?.data?.message || "Store updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update store.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this store? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await api.delete(`/owner/store/${id}`);
      toast.success(response?.data?.message || "Store deleted successfully.");
      navigate("/owner/store");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete store.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse bg-(--border)" />

        <div className="h-96 animate-pulse border border-(--border) bg-(--surface)" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="border border-(--border) bg-(--surface) p-6">
        <p className="text-sm font-semibold text-(--danger)">
          {error || "Store not found."}
        </p>

        <Link
          to="/owner/store"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-(--primary)"
        >
          <FaArrowLeft />
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/owner/store"
        className="inline-flex items-center gap-2 text-xs font-semibold text-(--primary)"
      >
        <FaArrowLeft />
        Back to store
      </Link>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          Store Management
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
          {store.name}
        </h1>

        <p className="mt-1 text-sm text-(--muted)">
          Update your store information.
        </p>
      </div>

      {error && (
        <div className="mt-6 border border-(--danger) bg-(--surface) px-5 py-4">
          <p className="text-sm font-medium text-(--danger)">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-6 border border-(--success) bg-(--surface) px-5 py-4">
          <p className="text-sm font-medium text-(--success)">{success}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 border border-(--border) bg-(--surface)"
      >
        <div className="border-b border-(--border) p-6">
          <div className="flex size-11 items-center justify-center bg-(--background) text-(--primary)">
            <FaStore />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-(--foreground)">
            Store details
          </h2>

          <p className="mt-1 text-sm text-(--muted)">
            Keep your store information accurate.
          </p>
        </div>

        <div className="grid gap-5 p-6">
          <div>
            <label
              htmlFor="name"
              className="text-sm font-semibold text-(--foreground)"
            >
              Store Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 h-11 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none focus:border-(--primary)"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-(--foreground)"
            >
              Store Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 h-11 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none focus:border-(--primary)"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="text-sm font-semibold text-(--foreground)"
            >
              Address
            </label>

            <textarea
              id="address"
              name="address"
              rows={4}
              value={form.address}
              onChange={handleChange}
              required
              maxLength={400}
              className="mt-2 w-full resize-none border border-(--border) bg-(--surface) px-3 py-3 text-sm text-(--foreground) outline-none focus:border-(--primary)"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-(--border) p-6 sm:flex-row">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 border border-(--danger) hover:bg-(--danger) px-5 text-sm font-semibold text-(--danger) hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTrash />

            {deleting ? "Deleting..." : "Delete store"}
          </button>

          <button
            type="submit"
            disabled={saving || deleting}
            className="cursor-pointer inline-flex h-10 items-center justify-center bg-(--primary) hover:bg-(--secondary) px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border border-(--border) bg-(--surface) p-5">
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

        <div className="border border-(--border) bg-(--surface) p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
            Total Ratings
          </p>

          <p className="mt-2 text-2xl font-bold text-(--foreground)">
            {store.total_ratings || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerStoreDetail;
