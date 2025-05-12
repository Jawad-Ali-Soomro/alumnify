const mongoose = require("mongoose")
const eventSchema = new  mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter title!"]
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate:  {
        type: Date,
        default: Date.now
    },
    category: {
        type: String
    },
    image: {
        type: String
    },
    isFree :{
        type: Boolean,
        default:  true
    },
    price: {
        type: Number,
        default: 0
    },
    url: {
        type: String
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Event = mongoose.model("Event", eventSchema)
module.exports = Event
