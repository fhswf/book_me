const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    default: "No explizit Location",
    trim: true,
  },

  description: {
    type: String,
    default: "",
    trim: true,
  },

  duration: {
    type: Number,
    required: true,
    default: 15,
  },

  url: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: false,
  },

  range_days: {
    type: Number,
    default: 30,
  },

  calendardays: {
    type: Boolean,
    default: true,
  },
  buffer: {
    type: Number,
    default: 0,
  },
  available: {
    mon: [
      {
        starttime: {
          type: Number,
          default: 800,
        },
        endtime: {
          type: Number,
          default: 1700,
        },
      },
    ],
    tue: [
      {
        starttime: {
          type: Number,
          default: 800,
        },
        endtime: {
          type: Number,
          default: 1700,
        },
      },
    ],
    wen: [
      {
        starttime: {
          type: Number,
          default: 800,
        },
        endtime: {
          type: Number,
          default: 1700,
        },
      },
    ],
    thu: [
      {
        starttime: {
          type: Number,
          default: 800,
        },
        endtime: {
          type: Number,
          default: 1700,
        },
      },
    ],
    fri: [
      {
        starttime: {
          type: Number,
          default: 800,
        },
        endtime: {
          type: Number,
          default: 1700,
        },
      },
    ],
    sat: [
      {
        starttime: {
          type: Number,
          default: 800,
        },
        endtime: {
          type: Number,
          default: 1700,
        },
      },
    ],
    sun: [
      {
        starttime: {
          type: Number,
          default: 800,
        },
        endtime: {
          type: Number,
          default: 1700,
        },
      },
    ],
  },
});
module.exports = mongoose.model("Event", eventSchema);
