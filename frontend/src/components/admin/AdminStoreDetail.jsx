import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTrash,
  FaStar,
  FaStore,
  FaEnvelope,
  FaLocationDot,
  FaUser,
  FaCircleCheck,
} from "react-icons/fa6";
import api from "../../config/Api";
import toast from "react-hot-toast";

const AdminStoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [owners, setOwners] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeResponse, ownersResponse] = await Promise.all([
          api.get(`/admin/stores/${id}`),
          api.get("/admin/owners"),
        ]);

        const data = storeResponse.data.store;

        setStore(data);
        setOwners(ownersResponse.data.owners || []);

        setForm({
          name: data.name || "",
          email: data.email || "",
          address: data.address || "",
          ownerId: data.owner_id || "",
        });
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load store.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

      const response = await api.put(`/admin/stores/${id}`, {
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        ownerId: form.ownerId,
      });

      setStore((previous) => ({
        ...previous,
        ...response.data.store,
      }));

      toast.success(response.data.message || "Store updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update store.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this store?")) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await api.delete(`/admin/stores/${id}`);
      toast.success(response?.data?.success || "Store deleted successfully");
      navigate("/admin/stores");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to delete store.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-5 w-32 animate-pulse bg-(--border)" />

        <div className="h-10 w-56 animate-pulse bg-(--border)" />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-130 animate-pulse bg-(--surface)" />
          <div className="space-y-4">
            <div className="h-32 animate-pulse bg-(--surface)" />
            <div className="h-32 animate-pulse bg-(--surface)" />
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="bg-(--surface) p-6">
        <p className="text-sm text-(--danger)">{error || "Store not found."}</p>

        <Link
          to="/admin/stores"
          className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 bg-(--primary) px-4 text-sm font-semibold text-white transition hover:bg-(--secondary)"
        >
          <FaArrowLeft className="text-xs" />
          Back to stores
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link
        to="/admin/stores"
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-(--primary) transition hover:text-(--secondary)"
      >
        <FaArrowLeft className="text-xs" />
        Back to stores
      </Link>

      {/* Page heading */}
      <div>
        <div className="flex items-start gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-(--foreground) sm:text-2xl">
              Store details
            </h1>

            <p className="mt-1 text-sm text-(--muted)">
              Update store information, ownership, and view rating performance.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start gap-3 bg-(--surface) p-4 text-sm text-(--danger)">
          <span className="mt-0.5 size-2 shrink-0 bg-(--danger)" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 bg-(--surface) p-4 text-sm text-(--success)">
          <FaCircleCheck className="mt-0.5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Store form */}
        <form onSubmit={handleSubmit} className="bg-(--surface) p-5 sm:p-6">
          <div className="border-b border-(--border) pb-5">
            <h2 className="text-base font-semibold text-(--foreground)">
              Store information
            </h2>

            <p className="mt-1 text-xs leading-5 text-(--muted)">
              Keep the store details accurate and up to date.
            </p>
          </div>

          <div className="mt-6 grid gap-5">
            {/* Store name */}
            <div>
              <label
                htmlFor="store-name"
                className="text-xs font-semibold text-(--foreground)"
              >
                Store name
              </label>

              <input
                id="store-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 h-11 w-full bg-(--background) px-3 text-sm text-(--foreground) outline-none ring-1 ring-inset ring-(--border) transition focus:bg-(--surface) focus:ring-(--primary)"
                placeholder="Enter store name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="store-email"
                className="text-xs font-semibold text-(--foreground)"
              >
                Store email
              </label>

              <div className="relative mt-2">
                <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-(--muted)" />

                <input
                  id="store-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-11 w-full bg-(--background) pl-9 pr-3 text-sm text-(--foreground) outline-none ring-1 ring-inset ring-(--border) transition focus:bg-(--surface) focus:ring-(--primary)"
                  placeholder="store@example.com"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="store-address"
                  className="text-xs font-semibold text-(--foreground)"
                >
                  Address
                </label>

                <span className="text-[10px] font-medium text-(--muted)">
                  {form.address.length}/400
                </span>
              </div>

              <div className="relative mt-2">
                <FaLocationDot className="pointer-events-none absolute left-3 top-3.5 text-xs text-(--muted)" />

                <textarea
                  id="store-address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  maxLength={400}
                  rows={4}
                  required
                  className="w-full resize-none bg-(--background) py-3 pl-9 pr-3 text-sm leading-6 text-(--foreground) outline-none ring-1 ring-inset ring-(--border) transition focus:bg-(--surface) focus:ring-(--primary)"
                  placeholder="Enter complete store address"
                />
              </div>
            </div>

            {/* Owner */}
            <div>
              <label
                htmlFor="store-owner"
                className="text-xs font-semibold text-(--foreground)"
              >
                Store owner
              </label>

              <div className="relative mt-2">
                <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-(--muted)" />

                <select
                  id="store-owner"
                  name="ownerId"
                  value={form.ownerId}
                  onChange={handleChange}
                  required
                  className="h-11 w-full cursor-pointer appearance-none bg-(--background) pl-9 pr-3 text-sm text-(--foreground) outline-none ring-1 ring-inset ring-(--border) transition focus:bg-(--surface) focus:ring-(--primary)"
                >
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} -- {owner.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-(--border) pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 border border-(--danger) px-5 text-sm font-semibold text-(--danger) transition hover:bg-(--danger) hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <FaTrash className="text-xs" />
              {deleting ? "Deleting..." : "Delete store"}
            </button>

            <button
              type="submit"
              disabled={saving || deleting}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 bg-(--primary) px-6 text-sm font-semibold text-white transition hover:bg-(--secondary) disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving ? "Saving..." : "Save changes"}
              {!saving && <FaArrowRight className="text-[10px]" />}
            </button>
          </div>
        </form>

        {/* Store summary */}
        <div className="space-y-5">
          {/* Store overview */}
          <div className="bg-(--surface) p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                <FaStore className="text-sm" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                  Store
                </p>

                <h2 className="mt-1 truncate text-sm font-semibold text-(--foreground)">
                  {store.name}
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                <p className="min-w-0 break-all text-xs leading-5 text-(--muted)">
                  {store.email || "No email provided"}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <FaLocationDot className="mt-0.5 shrink-0 text-xs text-(--muted)" />

                <p className="text-xs leading-5 text-(--muted)">
                  {store.address}
                </p>
              </div>
            </div>
          </div>

          {/* Average rating */}
          <div className="bg-(--surface) p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
              Average rating
            </p>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div className="flex items-center gap-2">
                <FaStar className="text-(--accent)" />

                <span className="text-3xl font-bold tracking-tight text-(--foreground)">
                  {Number(store.overall_rating || 0).toFixed(1)}
                </span>
              </div>

              <span className="text-xs text-(--muted)">out of 5</span>
            </div>
          </div>

          {/* Total ratings */}
          <div className="bg-(--surface) p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
              Total ratings
            </p>

            <div className="mt-3 flex items-end justify-between gap-4">
              <p className="text-3xl font-bold tracking-tight text-(--foreground)">
                {store.total_ratings || 0}
              </p>

              <p className="text-xs text-(--muted)">submissions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStoreDetail;
