const express = require("express");
const cors = require("cors");
const prisma = require("./src/config/prisma");
const authRoutes = require("./src/routes/authRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");

const authMiddleware = require("./src/middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/", async (req, res) => {
  res.json({ message: "Backend running" });
});

const PORT = process.env.PORT || 5000;

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});