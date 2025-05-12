const { Event } = require("../models");


const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      message: "Event created successfully!",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllEvents = async (req,res) => {
    const events = await Event.find()
    if(!events) {
        return res.json({
            message: "No Events Found!",
            success: false
        })
    }
    return res.json({
        message: "Found!",
        events
    })
}

module.exports = { createEvent, getAllEvents };
