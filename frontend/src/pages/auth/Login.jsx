import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCheck2Circle } from "react-icons/bs";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/Api";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
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
      email: "",
      password: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });
      setUser(response?.data?.userData);
      toast.success(response?.data?.message || "Login Successfully.");
      navigate(response.data.navigation);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to sign in. Please check your credentials.";
      toast.error(message);
      setErrors({
        email: message,
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-(--background) lg:flex">
      {/* LEFT — DESKTOP ONLY */}
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
            Welcome back
          </p>

          <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight xl:text-[2.7rem]">
            Your store ratings,
            <br />
            all in one place.
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            Sign in to discover stores, manage your ratings, and keep your
            activity organized.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/85">
              <BsCheck2Circle size={18} className="shrink-0 text-(--accent)" />
              Discover registered stores
            </div>

            <div className="flex items-center gap-3 text-sm text-white/85">
              <BsCheck2Circle size={18} className="shrink-0 text-(--accent)" />
              View overall store ratings
            </div>

            <div className="flex items-center gap-3 text-sm text-white/85">
              <BsCheck2Circle size={18} className="shrink-0 text-(--accent)" />
              Submit and update your ratings
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between text-xs text-white/55">
          <span>© {new Date().getFullYear()} Roxiler</span>
          <span>All rights Reserved.</span>
        </div>
      </section>

      {/* RIGHT */}
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
              Secure Login
            </span>
          </div>

          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-6">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-(--primary) lg:hidden">
                Account Access
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-(--foreground) sm:text-3xl">
                Welcome back
              </h2>

              <p className="mt-1 text-sm leading-5 text-(--muted)">
                Sign in to continue to your account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-(--foreground)"
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
                  className={`h-11 w-full border bg-(--surface) px-4 text-sm text-(--foreground) outline-none placeholder:text-(--muted) ${
                    errors.email
                      ? "border-(--danger)"
                      : "border-(--border) focus:border-(--primary)"
                  }`}
                />

                {errors.email && (
                  <p className="mt-0.5 text-[11px] text-(--danger)">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-(--foreground)"
                  >
                    Password
                  </label>

                  <Link
                    to="/forget-password"
                    className="text-xs font-medium text-(--primary) hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`h-11 w-full border bg-(--surface) px-4 pr-11 text-sm text-(--foreground) outline-none placeholder:text-(--muted) ${
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
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-0.5 text-[11px] text-(--danger)">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full cursor-pointer bg-(--primary) px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {/* Signup */}
              <p className="pt-1 text-center text-sm text-(--muted)">
                Don't have an account?{" "}
                <Link
                  to="/user-signup"
                  className="font-semibold text-(--primary)"
                >
                  Create account
                </Link>
              </p>
            </form>

            {/* Note */}
            <div className="mt-7 border-t border-(--border) pt-3">
              <p className="text-[11px] leading-4 text-(--muted)">
                Sign in with your registered credentials. Your dashboard and
                available features depend on your assigned account role.
              </p>
            </div>

            {/* MOBILE FOOTER */}
            <div className="mt-8 flex items-center justify-center text-[10px] text-(--muted) lg:hidden">
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

export default Login;
