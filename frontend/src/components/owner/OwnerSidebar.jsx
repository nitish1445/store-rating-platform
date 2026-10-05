import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaStar,
  FaStore,
  FaUser,
  FaXmark,
} from "react-icons/fa6";

const OwnerSidebar = ({ isOpen, onClose }) => {
  const navigation = [
    {
      label: "Overview",
      path: "/owner",
      icon: FaChartPie,
      end: true,
    },
    {
      label: "My Store",
      path: "/owner/store",
      icon: FaStore,
    },
    {
      label: "Ratings",
      path: "/owner/ratings",
      icon: FaStar,
    },
    {
      label: "Profile",
      path: "/owner/profile",
      icon: FaUser,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-(--border) bg-(--surface) transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-(--border) px-5">
          <NavLink to="/owner" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center bg-(--secondary) font-bold text-white">
              R
            </div>

            <div>
              <p className="text-base font-bold leading-none text-(--foreground)">
                Roxiler
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                Store Owner
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="flex size-14 items-center justify-center text-(--muted) lg:hidden"
          >
            <FaXmark />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-(--muted)">
            Store Management
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex h-11 items-center gap-3 px-3 text-sm font-medium ${
                    isActive ? "bg-(--secondary) text-white" : "text-(--muted)"
                  }`
                }
              >
                <Icon className="text-sm" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-(--border) p-4">
          <div className="bg-(--background) px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--muted)">
              Account Type
            </p>
            <p className="mt-1 text-sm font-semibold text-(--foreground)">
              Store Owner
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default OwnerSidebar;
