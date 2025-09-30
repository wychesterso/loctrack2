const { io } = require("socket.io-client");

const socket = io("http://localhost:4000", {
  auth: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc1OTIyMzk2NiwiZXhwIjoxNzU5ODI4NzY2fQ.dp2JDnKu6_sIm99lMSCE4mS1sm_0ZIiAC2fY5wEsx1o" }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("location:update", (data) => {
  console.log("Location update received:", data);
});

socket.on("connect_error", (err) => {
  console.error("Socket error:", err.message);
});
