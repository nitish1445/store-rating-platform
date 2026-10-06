import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaStar, FaStore } from "react-icons/fa6";
const Home = () => {
  return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
      {/* Hero */}
      <section className="flex min-h-[calc(100vh-136px)] items-center px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto w-full max-w-7xl ">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--primary)">
              Store Rating Platform
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-(--foreground) sm:text-5xl lg:text-6xl">
              Discover stores.
              <br />
              Share your experience.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-(--muted) sm:text-base">
              Find registered stores, view their overall ratings, and share your
              own experience with a simple and reliable rating platform.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/user-signup"
                className="inline-flex h-11 w-full items-center justify-center gap-2 bg-(--primary) px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
              >
                Get started
                <FaArrowRight className="text-xs" />
              </Link>

              <Link
                to="/login"
                className="inline-flex h-11 w-full items-center justify-center border border-(--border) bg-(--surface) px-6 text-sm font-semibold text-(--foreground) transition-colors hover:bg-(--background) sm:w-auto"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mx-auto mt-14 grid max-w-3xl gap-px border border-(--border) bg-(--border) sm:grid-cols-2">
            <div className="bg-(--surface) p-6">
              <div className="flex size-10 items-center justify-center bg-(--background) text-(--primary)">
                <FaStore />
              </div>

              <h2 className="mt-5 text-base font-semibold text-(--foreground)">
                Discover stores
              </h2>

              <p className="mt-2 text-sm leading-6 text-(--muted)">
                Search registered stores by name or address and explore their
                overall ratings.
              </p>
            </div>

            <div className="bg-(--surface) p-6">
              <div className="flex size-10 items-center justify-center bg-(--background) text-(--accent)">
                <FaStar />
              </div>

              <h2 className="mt-5 text-base font-semibold text-(--foreground)">
                Share your rating
              </h2>

              <p className="mt-2 text-sm leading-6 text-(--muted)">
                Submit a rating from 1 to 5 and update your rating whenever your
                experience changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-(--border) bg-(--surface)">
        <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-center px-5 sm:px-8 lg:px-10">
          <p className="text-[11px] text-(--muted)">
            © {new Date().getFullYear()} Roxiler · All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
