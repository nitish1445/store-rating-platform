import React, { useState } from "react";
import { FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import api from "../../config/Api";

const UpdatePasswordModal = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    setPasswordError("");

    if (!password || !confirmPassword) {
      setPasswordError("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password)) {
      setPasswordError(
        "Password must be 8–16 characters with at least one uppercase letter and one special character.",
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await api.put("/owner/password", {
        password,
      });

      setPassword("");
      setConfirmPassword("");

      navigate("/owner/profile");
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Unable to update password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancel = () => {
    if (passwordLoading) return;

    setPassword("");
    setConfirmPassword("");
    setPasswordError("");

    navigate("/owner/profile");
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Heading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--primary)">
          Account Security
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-(--foreground)">
          Update password
        </h1>

        <p className="mt-1 text-sm text-(--muted)">
          Change your account password to keep your account secure.
        </p>
      </div>

      {/* Password Card */}
      <div className="mt-7 border border-(--border) bg-(--surface)">
        {/* Card Header */}
        <div className="flex items-center gap-4 border-b border-(--border) px-5 py-5 sm:px-6">
          <div className="flex size-11 shrink-0 items-center justify-center bg-(--background) text-(--primary)">
            <FaLock />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-(--foreground)">
              Password & Security
            </h2>

            <p className="mt-1 text-xs leading-5 text-(--muted)">
              Enter a new password for your account.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handlePasswordUpdate} className="space-y-5 p-5 sm:p-6">
          {passwordError && (
            <div className="border border-(--danger) bg-(--surface) px-4 py-3">
              <p className="text-xs font-medium leading-5 text-(--danger)">
                {passwordError}
              </p>
            </div>
          )}

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-xs font-medium text-(--foreground)"
            >
              New password
            </label>

            <input
              id="newPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              className="h-11 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) focus:border-(--primary)"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-medium text-(--foreground)"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="h-11 w-full border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) focus:border-(--primary)"
            />
          </div>

          {/* Password Requirement */}
          <div className="border border-(--border) bg-(--background) px-4 py-3">
            <p className="text-xs leading-5 text-(--muted)">
              Password must be 8–16 characters and contain at least one
              uppercase letter and one special character.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={passwordLoading}
              className="cursor-pointer h-11 w-full border border-(--border) px-5 text-sm font-medium text-(--foreground) transition hover:bg-(--background) disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={passwordLoading}
              className="cursor-pointer h-11 w-full bg-(--primary) px-5 text-sm font-semibold text-white transition hover:bg-(--secondary) disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
