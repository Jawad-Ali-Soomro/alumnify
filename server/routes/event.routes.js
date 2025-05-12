const express = require("express")
const { createEvent, getAllEvents } = require("../controllers")
const eventRoute = express.Router()


eventRoute.post('/', createEvent)
eventRoute.get('/all', getAllEvents)

module.exports = eventRoute