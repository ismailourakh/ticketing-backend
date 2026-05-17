const { getPrisma } = require("../config/prisma");const prisma = getPrisma();

if (!prisma) {
  return res.status(503).json({ error: "Database not configured" });
}

exports.createEvent = async (req, res) => {
  try {
    const { title, description, totalSeats } = req.body;

    if (!title || !description || !totalSeats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        totalSeats: Number(totalSeats),
        availableSeats: Number(totalSeats),
        creatorId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Event created",
      event,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        tickets: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};