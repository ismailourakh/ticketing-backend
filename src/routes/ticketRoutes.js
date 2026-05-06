const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { reserveTicket, getMyTickets} = require("../controllers/ticketController");


router.post("/reserve", authMiddleware, reserveTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);

module.exports = router;