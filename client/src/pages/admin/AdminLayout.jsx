import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminGuard() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          RK Admin
        </Link>
        <nav>
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/workshops">Workshops</NavLink>
          <NavLink to="/admin/story">Homepage</NavLink>
          <NavLink to="/admin/journal">Journal</NavLink>
          <NavLink to="/admin/subscribers">Subscribers</NavLink>
        </nav>
        <div className="admin-sidebar-foot">
          <p className="muted small">{user?.email}</p>
          <button
            type="button"
            className="text-btn"
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
          >
            Log out
          </button>
          <Link to="/" className="text-link">
            View site
          </Link>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
