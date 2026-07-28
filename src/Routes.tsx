import { Navigate, Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Profile from "./pages/Profile";
import PostsPage from "./pages/posts/PostsPage";
import NewPostPage from "./pages/posts/NewPostPage";
import EditPostPage from "./pages/posts/EditPostPage";
import PreviewPostPage from "./pages/posts/PreviewPostPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/new" element={<NewPostPage />} />
          <Route path="posts/:id/edit" element={<EditPostPage />} />
          <Route path="posts/:id/preview" element={<PreviewPostPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
