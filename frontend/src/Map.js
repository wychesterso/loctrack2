import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Map({ token }) {
  const [socket, setSocket] = useState(null);
  const [locations, setLocations] = useState({});

  useEffect(() => {
    const s = io("http://localhost:4000", {
      auth: { token },
    });

    s.on("connect", () => console.log("Connected:", s.id));

    s.on("location:update", (data) => {
      setLocations((prev) => ({
        ...prev,
        [data.userId]: { lat: data.lat, lng: data.lng },
      }));
    });

    setSocket(s);
    return () => s.disconnect();
  }, [token]);

  // send own location every 10s
  useEffect(() => {
    if (!socket) return;

    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          socket.emit("location:update", {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [socket]);

  return (
    <MapContainer center={[-27.47, 153.03]} zoom={13} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Object.entries(locations).map(([userId, loc]) => (
        <Marker key={userId} position={[loc.lat, loc.lng]}>
          <Popup>User {userId}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
