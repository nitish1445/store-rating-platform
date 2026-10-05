import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/Signup";
import AuthAdminLayout from "./Layout/AdminLayout";
import AuthUserLayout from "./Layout/UserLayout";
import AuthOwnerLayout from "./Layout/OwnerLayout";
import UserOverview from "./components/user/UserOverview";
import OwnerOverview from "./components/owner/OwnerOverview";
import AdminOverview from "./components/admin/AdminOverview";
import UserStores from "./components/user/UserStore";
import UserStoreDetail from "./components/user/UserStoreDetail";
import UserRatings from "./components/user/UserRating";
import UserProfile from "./components/user/UserProfile";
import OwnerProfile from "./components/owner/OwnerProfile";
import OwnerStore from "./components/owner/OwnerStore";
import OwnerStoreDetail from "./components/owner/OwnerStoreDetail";
import OwnerRatings from "./components/owner/OwnerRating";
import OwnerRatingDetail from "./components/owner/OwnerRatingDetail";
import AdminUsers from "./components/admin/AdminUser";
import AddUser from "./components/admin/AddUser";
import AdminUserDetail from "./components/admin/AdminUserDetail";
import AdminStores from "./components/admin/AdminStores";
import AddStore from "./components/admin/AddStore";
import AdminStoreDetail from "./components/admin/AdminStoreDetail";
import AdminRatings from "./components/admin/AdminRatings";
import AdminRatingDetail from "./components/admin/AdminRatingDetail";
import AdminProfile from "./components/admin/AdminProfile";
import OwnerUpdatePassword from "./components/owner/OwnerUpdatePassword";
import UserUpdatePassword from "./components/user/UserUpdatePassword";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public access page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-signup" element={<SignupPage />} />

        {/* Authentication Required: Admin Related routes  */}
        <Route path="/admin" element={<AuthAdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="stores" element={<AdminStores />} />
          <Route path="stores/add" element={<AddStore />} />
          <Route path="stores/:id" element={<AdminStoreDetail />} />
          <Route path="ratings" element={<AdminRatings />} />
          <Route path="ratings/:id" element={<AdminRatingDetail />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Authentication Required: User Retlated Routes */}
        <Route path="/user" element={<AuthUserLayout />}>
          <Route index element={<UserOverview />} />
          <Route path="stores" element={<UserStores />} />
          <Route path="stores/:id" element={<UserStoreDetail />} />
          <Route path="ratings" element={<UserRatings />} />
          <Route path="ratings/:id" element={<UserStoreDetail />} />
          <Route path="profile" element={<UserProfile />} />
          <Route
            path="profile/update-password"
            element={<UserUpdatePassword />}
          />
        </Route>

        {/* Authentication Required: Owner Related Routes */}
        <Route path="/owner" element={<AuthOwnerLayout />}>
          <Route index element={<OwnerOverview />} />
          <Route path="profile" element={<OwnerProfile />} />
          <Route path="store" element={<OwnerStore />} />
          <Route path="store/:id" element={<OwnerStoreDetail />} />
          <Route path="ratings" element={<OwnerRatings />} />
          <Route path="ratings/:id" element={<OwnerRatingDetail />} />
          <Route
            path="profile/update-password"
            element={<OwnerUpdatePassword />}
          />
        </Route>

        {/* Routes which does not exists */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
