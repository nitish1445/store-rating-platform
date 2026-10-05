import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCheck2Circle } from "react-icons/bs";
import { Eye, EyeOff } from "lucide-react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Signup = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      address: "",
      password: "",
    };

    const nameLength = form.name.trim().length;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (nameLength < 20 || nameLength > 60) {
      newErrors.name = "Name must be between 20 and 60 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required.";
    } else if (form.address.trim().length > 400) {
      newErrors.address = "Address cannot exceed 400 characters.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8 || form.password.length > 16) {
      newErrors.password = "Password must be between 8 and 16 characters.";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[^A-Za-z0-9]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
      };

      const response = await api.post("/auth/signup", payload);
      setUser(response?.data?.userData);
      toast.success(response?.data?.message || "Login Successfully.");
      navigate(response?.data?.navigation);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to create account. Please try again.";
      toast.error(message);
      setErrors((prev) => ({
        ...prev,
        email: message,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-(--background) lg:flex">
      {/* LEFT SIDE — DESKTOP ONLY */}
      <section className="hidden min-h-screen w-[40%] bg-(--secondary) p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-white text-lg font-bold text-(--secondary)">
              R
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight">Roxiler</p>

              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/65">
                Store Rating Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--accent)">
            Create user account
          </p>

          <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight xl:text-[2.7rem]">
            Join the platform built for better store ratings.
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            Discover stores, submit ratings, and manage your activity from one
            simple platform.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/85">
              <BsCheck2Circle size={18} className="shrink-0 text-(--accent)" />
              Discover registered stores
            </div>

            <div className="flex items-center gap-3 text-sm text-white/85">
              <BsCheck2Circle size={18} className="shrink-0 text-(--accent)" />
              Submit ratings from 1 to 5
            </div>

            <div className="flex items-center gap-3 text-sm text-white/85">
              <BsCheck2Circle size={18} className="shrink-0 text-(--accent)" />
              Update your submitted ratings
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between text-xs text-white/55">
          <span>© {new Date().getFullYear()} Roxiler</span>
          <span>All rights Reserved.</span>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="flex min-h-screen w-full items-center justify-center bg-(--surface) px-5 py-6 sm:px-8 lg:w-[60%] lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          {/* MOBILE BRANDING */}
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center bg-(--secondary) text-base font-bold text-white">
                R
              </div>

              <div>
                <p className="text-base font-bold leading-none tracking-tight text-(--foreground)">
                  Roxiler
                </p>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-(--muted)">
                  Store Rating Platform
                </p>
              </div>
            </Link>

            <span className="text-[10px] font-medium text-(--muted)">
              Register Safely
            </span>
          </div>

          {/* FORM CONTENT */}
          <div className="w-full">
            {/* Heading */}
            <div className="mb-6 text-left">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-(--primary) lg:hidden">
                Create Account
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-(--foreground) sm:text-2xl">
                Create user account
              </h2>

              <p className="mt-0.5 text-sm leading-5 text-(--muted) sm:text-sm">
                Enter your details to get started.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-0.5 block text-xs font-medium text-(--foreground)"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={60}
                  className={`h-10 w-full border bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) ${
                    errors.name
                      ? "border-(--danger)"
                      : "border-(--border) focus:border-(--primary)"
                  }`}
                />

                <div className="mt-0.5 flex items-center justify-between">
                  <p className="text-[11px] leading-3 text-(--danger)">
                    {errors.name}
                  </p>

                  <p className="mt-0.5 text-[11px] leading-3 text-(--muted)">
                    Name between 20-60 characters
                  </p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-0.5 block text-xs font-medium text-(--foreground)"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`h-10 w-full border bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) ${
                    errors.email
                      ? "border-(--danger)"
                      : "border-(--border) focus:border-(--primary)"
                  }`}
                />

                {errors.email && (
                  <p className="mt-0.5 text-[11px] leading-3 text-(--danger)">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-0.5 block text-xs font-medium text-(--foreground)"
                >
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  autoComplete="street-address"
                  maxLength={400}
                  rows={2}
                  className={`w-full resize-none border bg-(--surface) px-3 py-2 text-sm text-(--foreground) outline-none placeholder:text-(--muted) ${
                    errors.address
                      ? "border-(--danger)"
                      : "border-(--border) focus:border-(--primary)"
                  }`}
                />

                <div className="mt-0.5 flex items-center justify-between">
                  <p className="text-[10px] leading-3 text-(--danger)">
                    {errors.address}
                  </p>

                  <p className="text-[11px] leading-3 text-(--muted)">
                    {form.address.length}/400
                  </p>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-0.5 block text-xs font-medium text-(--foreground)"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    maxLength={16}
                    className={`h-10 w-full border bg-(--surface) px-3 pr-10 text-sm text-(--foreground) outline-none placeholder:text-(--muted) ${
                      errors.password
                        ? "border-(--danger)"
                        : "border-(--border) focus:border-(--primary)"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-(--muted)"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="mt-0.5 flex items-start justify-between gap-2">
                  <p className="text-[11px] leading-3 text-(--danger)">
                    {errors.password}
                  </p>

                  {!errors.password && (
                    <p className="text-right text-[10px] leading-3 text-(--muted)">
                      8-16 characters • 1 uppercase • 1 special character
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 h-10 w-full cursor-pointer bg-(--primary) px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              {/* Login */}
              <p className="py-2 text-center text-xs text-(--muted)">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-(--primary)">
                  Sign in
                </Link>
              </p>
            </form>

            {/* Note */}
            <div className="mt-3 border-t border-(--border) pt-2">
              <p className="text-[11px] leading-3.5 text-(--muted)">
                Your account will be created as a normal user. Store owner and
                administrator accounts are managed separately.
              </p>
            </div>

            {/* MOBILE FOOTER */}
            <div className="mt-3 flex items-center justify-center text-[9px] text-(--muted) lg:hidden">
              <span>
                © {new Date().getFullYear()} Roxiler · All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup;
