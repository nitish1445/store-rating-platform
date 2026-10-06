import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLocationDot,
  FaLock,
  FaUserShield,
} from "react-icons/fa6";
import { BsCheck2Circle } from "react-icons/bs";
import api from "../../config/Api";
import toast from "react-hot-toast";

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const response = await api.post("/admin/users", {
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
        role: form.role,
      });

      navigate("/admin/users");
      toast.success(response?.data?.message || "User added succesfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link
        to="/admin/users"
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-(--primary) transition hover:text-(--secondary)"
      >
        <FaArrowLeft className="text-xs" />
        Back to users
      </Link>

      {/* Heading */}
      <div>
        <div className="flex items-start gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
              Administration
            </p>

            <h1 className="mt-1 text-xl font-bold tracking-tight text-(--foreground) sm:text-2xl">
              Add user
            </h1>

            <p className="mt-1 text-sm text-(--muted)">
              Create a new account and assign its platform role.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-(--surface) p-4 text-sm text-(--danger)">
          <span className="mt-1 size-2 shrink-0 bg-(--danger)" />

          <p className="leading-5">{error}</p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-(--surface) p-5 sm:p-6">
          <div className="border-b border-(--border) pb-5">
            <h2 className="text-base font-semibold text-(--foreground)">
              Account information
            </h2>

            <p className="mt-1 text-xs leading-5 text-(--muted)">
              Enter the user's basic information and account credentials.
            </p>
          </div>

          <div className="mt-6 grid gap-5">
            {/* Full name */}
            <div>
              <label
                htmlFor="user-name"
                className="flex items-center gap-2 text-xs font-semibold text-(--foreground)"
              >
                <FaUser className="text-(--muted)" />
                Full name
              </label>

              <input
                id="user-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                minLength={20}
                maxLength={60}
                required
                placeholder="Enter full name"
                className="mt-2 h-11 w-full bg-(--background) px-3 text-sm text-(--foreground) outline-none ring-1 ring-inset ring-(--border) placeholder:text-(--muted) transition focus:bg-(--surface) focus:ring-(--primary)"
              />

              <p className="mt-1.5 text-[11px] leading-5 text-(--muted)">
                Must contain between 20 and 60 characters.
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="user-email"
                className="flex items-center gap-2 text-xs font-semibold text-(--foreground)"
              >
                <FaEnvelope className="text-(--muted)" />
                Email address
              </label>

              <input
                id="user-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                autoComplete="email"
                className="mt-2 h-11 w-full bg-(--background) px-3 text-sm text-(--foreground) outline-none ring-1 ring-inset ring-(--border) placeholder:text-(--muted) transition focus:bg-(--surface) focus:ring-(--primary)"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="user-role"
                className="flex items-center gap-2 text-xs font-semibold text-(--foreground)"
              >
                <FaUserShield className="text-(--muted)" />
                Account role
              </label>

              <select
                id="user-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-2 h-11 w-full cursor-pointer appearance-none bg-(--background) px-3 text-sm text-(--foreground) outline-none ring-1 ring-inset ring-(--border) transition focus:bg-(--surface) focus:ring-(--primary)"
              >
                <option value="user">Normal User</option>
                <option value="owner">Store Owner</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="user-address"
                  className="flex items-center gap-2 text-xs font-semibold text-(--foreground)"
                >
                  <FaLocationDot className="text-(--muted)" />
                  Address
                </label>

                <span className="text-[10px] font-medium text-(--muted)">
                  {form.address.length}/400
                </span>
              </div>

              <textarea
                id="user-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                maxLength={400}
                rows={4}
                required
                placeholder="Enter complete address"
                className="mt-2 w-full resize-none bg-(--background) px-3 py-3 text-sm leading-6 text-(--foreground) outline-none ring-1 ring-inset ring-(--border) placeholder:text-(--muted) transition focus:bg-(--surface) focus:ring-(--primary)"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="user-password"
                className="flex items-center gap-2 text-xs font-semibold text-(--foreground)"
              >
                <FaLock className="text-(--muted)" />
                Password
              </label>

              <input
                id="user-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                maxLength={16}
                required
                placeholder="Enter account password"
                autoComplete="new-password"
                className="mt-2 h-11 w-full bg-(--background) px-3 text-sm text-(--foreground) outline-none ring-1 ring-inset ring-(--border) placeholder:text-(--muted) transition focus:bg-(--surface) focus:ring-(--primary)"
              />

              <p className="mt-1.5 text-[11px] leading-5 text-(--muted)">
                8-16 characters with at least one uppercase letter and one
                special character.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-(--border) pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/admin/users"
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center border border-(--border) bg-(--surface) px-5 text-sm font-semibold text-(--foreground) transition hover:bg-(--background) sm:w-auto"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 bg-(--primary) px-6 text-sm font-semibold text-white transition hover:bg-(--secondary) disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  Create user
                  <FaArrowRight className="text-[10px]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Side information */}
        <aside className="space-y-5">
          {/* Account setup */}
          <div className="bg-(--surface) p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
                <FaUserPlus className="text-sm" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                  New account
                </p>

                <h2 className="mt-1 text-sm font-semibold text-(--foreground)">
                  Account setup
                </h2>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-(--muted)">
              Create an account with the required personal information and
              assign the appropriate platform role.
            </p>
          </div>

          {/* Required information */}
          <div className="bg-(--surface) p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
              Required information
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <BsCheck2Circle className="shrink-0 text-xs text-(--success)" />

                <span className="text-xs text-(--muted)">Full name</span>
              </div>

              <div className="flex items-center gap-3">
                <BsCheck2Circle className="shrink-0 text-xs text-(--success)" />

                <span className="text-xs text-(--muted)">Email address</span>
              </div>

              <div className="flex items-center gap-3">
                <BsCheck2Circle className="shrink-0 text-xs text-(--success)" />

                <span className="text-xs text-(--muted)">Account role</span>
              </div>

              <div className="flex items-center gap-3">
                <BsCheck2Circle className="shrink-0 text-xs text-(--success)" />

                <span className="text-xs text-(--muted)">Address</span>
              </div>

              <div className="flex items-center gap-3">
                <BsCheck2Circle className="shrink-0 text-xs text-(--success)" />

                <span className="text-xs text-(--muted)">Secure password</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddUser;
