import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaStore,
  FaEnvelope,
  FaLocationDot,
  FaUser,
} from "react-icons/fa6";
import api from "../../config/Api";
import toast from "react-hot-toast";
import { BsCheck2Circle } from "react-icons/bs";

const AddStore = () => {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [loading, setLoading] = useState(false);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get("/admin/owners");
        setOwners(response.data.owners || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load store owners.",
        );
      } finally {
        setOwnersLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/admin/stores", {
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        ownerId: form.ownerId,
      });

      toast.success(response?.data?.message || "Store updated succesfully");
      navigate("/admin/stores");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create store.");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Heading */}
      <div>
        <div className="flex items-start gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
              Administration
            </p>

            <h1 className="mt-1 text-xl font-bold tracking-tight text-(--foreground) sm:text-2xl">
              Add store
            </h1>

            <p className="mt-1 text-sm text-(--muted)">
              Create a new store and assign it to a registered store owner.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-(--surface) p-4 text-sm text-(--danger)">
          <span className="mt-1 size-2 shrink-0 bg-(--danger)" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-(--surface) p-5 sm:p-6">
          <div className="border-b border-(--border) pb-5">
            <h2 className="text-base font-semibold text-(--foreground)">
              Store information
            </h2>

            <p className="mt-1 text-xs leading-5 text-(--muted)">
              Enter the basic details for the new store.
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

              <div className="relative mt-2">
                <FaStore className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-(--muted)" />

                <input
                  id="store-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="h-11 w-full bg-(--background) pl-9 pr-3 text-sm text-(--foreground) outline-none ring-1 ring-inset ring-(--border) transition focus:bg-(--surface) focus:ring-(--primary)"
                  placeholder="Enter store name"
                />
              </div>
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
                  disabled={ownersLoading}
                  className="h-11 w-full cursor-pointer appearance-none bg-(--background) pl-9 pr-3 text-sm text-(--foreground) outline-none ring-1 ring-inset ring-(--border) transition focus:bg-(--surface) focus:ring-(--primary) disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {ownersLoading ? "Loading owners..." : "Select store owner"}
                  </option>

                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} -- {owner.email}
                    </option>
                  ))}
                </select>
              </div>

              {!ownersLoading && owners.length === 0 && (
                <p className="mt-2 text-xs text-(--danger)">
                  No store owners are available.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-(--border) pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/admin/stores"
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center border border-(--border) bg-(--surface) px-5 text-sm font-semibold text-(--foreground) transition hover:bg-(--background) sm:w-auto"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || ownersLoading || owners.length === 0}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 bg-(--primary) px-6 text-sm font-semibold text-white transition hover:bg-(--secondary) disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  Create store
                  <FaArrowRight className="text-[10px]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Side information */}
        <aside className="space-y-5">
          <div className="bg-(--surface) p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                <FaStore className="text-sm" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                  New store
                </p>

                <h2 className="mt-1 text-sm font-semibold text-(--foreground)">
                  Store setup
                </h2>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-(--muted)">
              Add the store's basic information and assign an existing store
              owner. The owner will be responsible for viewing ratings
              associated with this store.
            </p>
          </div>

          <div className="bg-(--surface) p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
              Required information
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <BsCheck2Circle className="shrink-0 text-xs text-(--success)" />

                <span className="text-xs text-(--muted)">Store name</span>
              </div>

              <div className="flex items-center gap-3">
                <BsCheck2Circle className="shrink-0 text-xs text-(--success)" />

                <span className="text-xs text-(--muted)">Store address</span>
              </div>

              <div className="flex items-center gap-3">
                <BsCheck2Circle className="shrink-0 text-xs text-(--success)" />

                <span className="text-xs text-(--muted)">Store owner</span>
              </div>

              <div className="flex items-center gap-3">
                <BsCheck2Circle className="shrink-0 text-xs text-(--success)" />

                <span className="text-xs text-(--muted)">
                  Email is optional
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddStore;
