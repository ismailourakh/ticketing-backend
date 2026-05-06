const prisma = require("../config/prisma");


// post reserve ticket api
exports.reserveTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) {
      return res.status(400).json({ message: "eventId is required" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Lock the event row
      const event = await tx.$queryRaw`
        SELECT * FROM "Event"
        WHERE id = ${eventId}
        FOR UPDATE
      `;

      if (!event || event.length === 0) {
        throw new Error("Event not found");
      }

      const currentEvent = event[0];

      if (currentEvent.availableSeats <= 0) {
        throw new Error("Event sold out");
      }

      const existingTicket = await tx.ticket.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      if (existingTicket) {
        throw new Error("You already reserved a ticket for this event");
      }

      const ticket = await tx.ticket.create({
        data: {
          userId,
          eventId,
        },
      });

      const updatedEvent = await tx.event.update({
        where: { id: eventId },
        data: {
          availableSeats: {
            decrement: 1,
          },
        },
      });

      return { ticket, updatedEvent };
    });

    res.status(201).json({
      message: "Ticket reserved successfully",
      ticket: result.ticket,
      availableSeats: result.updatedEvent.availableSeats,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// get my ticket api
exports.getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await prisma.ticket.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};