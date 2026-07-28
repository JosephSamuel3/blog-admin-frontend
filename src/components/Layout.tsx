import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "nav-link active" : "nav-link";
}

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="brand">Blog Admin</span>
        <nav className="topnav">
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
          <NavLink to="/posts" className={navLinkClass}>Posts</NavLink>
          <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
        </nav>
        <div className="topbar-user">
          {user && <span className="muted">{user.username}</span>}
          <button className="button-secondary" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
