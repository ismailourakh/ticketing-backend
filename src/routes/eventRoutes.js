const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createEvent,
  getEvents,
  getEventById,
} = require("../controllers/eventController");

router.post("/", authMiddleware, createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);

module.exports = router;