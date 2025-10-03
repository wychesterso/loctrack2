import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Map from "./Map";
import Profile from "./Profile";
import Layout from "./Layout";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      {!token ? (
        <Routes>
          <Route path="*" element={<Login setToken={setToken} />} />
        </Routes>
      ) : (
        <Routes>
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/map" element={<Map token={token} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/map" />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
