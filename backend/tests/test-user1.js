const { io } = require("socket.io-client");

const socket = io("http://localhost:4000", {
  auth: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc1OTIyMTUyMCwiZXhwIjoxNzU5ODI2MzIwfQ.U05gXotBevTUIQQLrTP4JYvjdfvaFl_Ysza6pA8V8Lw" }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  socket.emit("location:update", { lat: -27.47, lng: 153.03 });
});

socket.on("location:update", (data) => {
  console.log("Location update received:", data);
});

socket.on("connect_error", (err) => {
  console.error("Socket error:", err.message);
});
