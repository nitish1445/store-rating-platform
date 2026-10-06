// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaBars,
//   FaXmark,
//   FaStore,
//   FaUser,
//   FaUserShield,
// } from "react-icons/fa6";

// const roleConfig = {
//   admin: {
//     label: "Admin",
//     path: "/admin/profile",
//     icon: FaUserShield,
//   },
//   user: {
//     label: "User",
//     path: "/user/profile",
//     icon: FaUser,
//   },
//   owner: {
//     label: "Owner",
//     path: "/owner/profile",
//     icon: FaStore,
//   },
// };

// const Header = ({ user, mobileOpen = false, setMobileOpen }) => {
//   const [authMenuOpen, setAuthMenuOpen] = useState(false);

//   const currentRole = roleConfig[user?.role] || {
//     label: "User",
//     path: "/",
//     icon: FaUser,
//   };

//   const RoleIcon = currentRole.icon;

//   const displayName = user?.name?.split(" ").slice(0, 2).join(" ") || "User";
//   const initials = displayName
//     .split(" ")
//     .map((word) => word[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   const handleMobileAuthToggle = () => {
//     setAuthMenuOpen((previous) => !previous);
//   };

//   const closeMenus = () => {
//     setAuthMenuOpen(false);
//     setMobileOpen?.(false);
//   };

//   return (
//     <header className="fixed left-0 right-0 top-0 z-50 border-b border-(--border) bg-(--surface)">
//       <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-10">
//         {/* LEFT - BRAND */}
//         <div className="flex min-w-0 items-center gap-3">
//           <Link
//             to="/"
//             onClick={closeMenus}
//             className="inline-flex min-w-0 cursor-pointer items-center gap-1 sm:gap-1.5"
//           >
//             {/* Store icon = Brand Logo */}
//             <div className="flex size-9 shrink-0 items-center justify-center text-(--secondary) sm:size-10">
//               <FaStore className="text-lg sm:text-xl" />
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-base font-bold leading-none tracking-tight text-(--foreground) sm:text-lg">
//                 Roxiler
//               </p>

//               <p className="mt-1 hidden text-[9px] font-semibold uppercase leading-none tracking-[0.14em] text-(--muted) sm:block">
//                 Store Rating
//               </p>
//             </div>
//           </Link>
//         </div>

//         {/* RIGHT */}
//         {user ? (
//           /* LOGGED-IN USER */
//           <Link
//             to={currentRole.path}
//             className="group flex cursor-pointer items-center gap-3"
//           >
//             {/* Initial Avatar */}
//             <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-(--secondary) text-xs font-bold text-white">
//               {initials}
//             </div>

//             {/* Name + Role */}

//             <div className=" leading-tight ">
//               <p className="max-w-32 truncate text-sm font-semibold text-(--foreground)">
//                 {displayName}
//               </p>

//               <p className="mt-0.5 flex items-baseline gap-1 text-[10px] font-medium uppercase tracking-[0.08em] text-(--muted)">
//                 <RoleIcon className="text-[9px]" />
//                 {currentRole.label}
//               </p>
//             </div>
//           </Link>
//         ) : (
//           /* GUEST */
//           <>
//             {/* Desktop Login / Signup */}
//             <div className="hidden items-center gap-2.5 sm:flex">
//               <Link
//                 to="/login"
//                 className="inline-flex h-10 cursor-pointer items-center justify-center px-4 text-sm font-semibold text-(--foreground) transition hover:text-(--primary)"
//               >
//                 Login
//               </Link>

//               <Link
//                 to="/user-signup"
//                 className="inline-flex h-10 cursor-pointer items-center justify-center bg-(--primary) px-5 text-sm font-semibold text-white transition hover:bg-(--secondary)"
//               >
//                 Sign up
//               </Link>
//             </div>

//             {/* Mobile Hamburger */}
//             <div className="relative sm:hidden">
//               <button
//                 type="button"
//                 onClick={handleMobileAuthToggle}
//                 aria-label={
//                   authMenuOpen
//                     ? "Close authentication menu"
//                     : "Open authentication menu"
//                 }
//                 className="flex size-9 cursor-pointer items-center justify-center text-(--foreground) transition-colors hover:text-(--primary)"
//               >
//                 {authMenuOpen ? (
//                   <FaXmark className="text-xl" />
//                 ) : (
//                   <FaBars className="text-xl" />
//                 )}
//               </button>

//               {/* Mobile Auth Menu */}

//               {authMenuOpen && (
//                 <div className=" left-0 right-0 top-16 border-t border-(--border) bg-(--surface) sm:hidden">
//                   <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-3 sm:px-8">
//                     <Link
//                       to="/login"
//                       onClick={closeMenus}
//                       className="flex h-11 cursor-pointer items-center px-3 text-sm font-semibold text-(--foreground) transition hover:bg-(--background)"
//                     >
//                       Login
//                     </Link>

//                     <Link
//                       to="/user-signup"
//                       onClick={closeMenus}
//                       className="mt-1 flex h-11 cursor-pointer items-center px-3 text-sm font-semibold text-(--primary) transition hover:bg-(--background)"
//                     >
//                       Sign up
//                     </Link>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaXmark,
  FaStore,
  FaUser,
  FaUserShield,
} from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

const roleConfig = {
  admin: {
    label: "Admin",
    path: "/admin/profile",
    icon: FaUserShield,
  },
  user: {
    label: "User",
    path: "/user/profile",
    icon: FaUser,
  },
  owner: {
    label: "Owner",
    path: "/owner/profile",
    icon: FaStore,
  },
};

const Header = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentRole = roleConfig[user?.role] || {
    label: "User",
    path: "/",
    icon: FaUser,
  };

  const RoleIcon = currentRole.icon;

  const displayName = user?.name?.split(" ").slice(0, 2).join(" ") || "User";

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-(--border) bg-(--surface)">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-10">
        {/* BRAND */}
        <Link
          to="/"
          onClick={closeMenu}
          className="inline-flex min-w-0 cursor-pointer items-center gap-1 sm:gap-1.5"
        >
          <div className="flex size-9 shrink-0 items-center justify-center text-(--secondary) sm:size-10">
            <FaStore className="text-lg sm:text-xl" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-none tracking-tight text-(--foreground) sm:text-lg">
              Roxiler
            </p>

            <p className="mt-1 hidden text-[9px] font-semibold uppercase leading-none tracking-[0.14em] text-(--muted) sm:block">
              Store Rating
            </p>
          </div>
        </Link>

        {/* DESKTOP RIGHT */}
        <div className="hidden items-center sm:flex">
          {user ? (
            <Link
              to={currentRole.path}
              className="group flex cursor-pointer items-center gap-3"
            >
              <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-(--secondary) text-white">
                <FaUser className="text-sm" />
              </div>

              <div className="leading-tight">
                <p className="max-w-32 truncate text-sm font-semibold text-(--foreground)">
                  {displayName}
                </p>

                <p className="mt-0.5 flex items-baseline gap-1 text-[10px] font-medium uppercase tracking-[0.08em] text-(--muted)">
                  <RoleIcon className="text-[9px]" />
                  {currentRole.label}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="inline-flex h-10 cursor-pointer items-center justify-center px-4 text-sm font-semibold text-(--foreground) transition hover:text-(--primary)"
              >
                Login
              </Link>

              <Link
                to="/user-signup"
                className="inline-flex h-10 cursor-pointer items-center justify-center bg-(--primary) px-5 text-sm font-semibold text-white transition hover:bg-(--secondary)"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          className="flex size-9 cursor-pointer items-center justify-center text-(--foreground) transition-colors hover:text-(--primary) sm:hidden"
        >
          {mobileMenuOpen ? (
            <FaXmark className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="border-b border-(--border) bg-(--surface) sm:hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-8 lg:px-10">
            {user ? (
              <>
                {/* USER */}
                <Link
                  to={currentRole.path}
                  onClick={closeMenu}
                  className="flex cursor-pointer items-center gap-3 border-b border-(--border) pb-5"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-(--secondary) text-white">
                    <FaUser className="text-base" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-(--foreground)">
                      {displayName}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.08em] text-(--muted)">
                      <RoleIcon className="text-[9px]" />
                      {currentRole.label}
                    </p>
                  </div>
                </Link>

                <div className="mt-4">
                  <Link
                    to={currentRole.path}
                    onClick={closeMenu}
                    className="flex h-11 cursor-pointer items-center px-3 text-sm font-semibold text-(--foreground) transition hover:bg-(--background)"
                  >
                    My Profile
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* GUEST */}
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-(--muted)">
                  Account
                </p>

                <div className="mt-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex h-11 cursor-pointer items-center px-3 text-sm font-semibold text-(--foreground) transition hover:bg-(--background)"
                  >
                    Login
                  </Link>

                  <Link
                    to="/user-signup"
                    onClick={closeMenu}
                    className="mt-1 flex h-11 cursor-pointer items-center bg-(--primary) px-3 text-sm font-semibold text-white transition hover:bg-(--secondary)"
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
