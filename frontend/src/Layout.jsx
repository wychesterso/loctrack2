import { Link, Outlet } from "react-router-dom";

export default function Layout({ onLogout }) {
  return (
    <div>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/map" style={{ marginRight: "10px" }}>Map</Link>
        <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>
        <button onClick={onLogout}>Logout</button>
      </nav>
      <main style={{ padding: "10px" }}>
        <Outlet />
      </main>
    </div>
  );
}
