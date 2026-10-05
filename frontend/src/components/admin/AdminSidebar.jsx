import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaStore,
  FaStar,
  FaUserPlus,
  FaXmark,
  FaUser,
} from "react-icons/fa6";
import { FaStoreAlt } from "react-icons/fa";

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigation = [
    {
      label: "Overview",
      path: "/admin",
      icon: FaChartPie,
      end: true,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: FaUsers,
    },
    {
      label: "Stores",
      path: "/admin/stores",
      icon: FaStore,
    },
    {
      label: "Ratings",
      path: "/admin/ratings",
      icon: FaStar,
    },
    // {
    //   label: "Add User",
    //   path: "/admin/users/add",
    //   icon: FaUserPlus,
    // },
    // {
    //   label: "Add Store",
    //   path: "/admin/stores/add",
    //   icon: FaStoreAlt,
    // },
    {
      label: "Profile",
      path: "/admin/profile",
      icon: FaUser,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
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
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-(--border) px-5">
          <NavLink to="/admin" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center bg-(--secondary) font-bold text-white">
              R
            </div>

            <div>
              <p className="text-base font-bold leading-none text-(--foreground)">
                Roxiler
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-(--muted)">
                Administration
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="flex size-12 items-center justify-center text-(--muted) lg:hidden"
          >
            <FaXmark />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-(--muted)">
            Management
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
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-(--border) p-4">
          <div className="bg-(--background) px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--muted)">
              Administrator
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-(--foreground)">
              System Control
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
