import * as mongoose from 'mongoose';

import { Day, Event } from '@fhswf/bookme-common'




interface EventDocument extends Event, mongoose.Document { }

const eventSchema = new mongoose.Schema<EventDocument>({
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

  /** duration of the event (in minutes) */
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

  rangedays: {
    type: Number,
    default: 30,
  },

  calendardays: {
    type: Boolean,
    default: true,
  },

  /** reserved buffer before an event (in minutes) */
  bufferbefore: {
    type: Number,
    default: 0,
  },

  /** reserved buffer after an event (in minutes) */
  bufferafter: {
    type: Number,
    default: 0,
  },

  available: {
    mon: {
      type: Array,
      default: [{ starttime: "8:00", endtime: "17:00" }],
    },
    tue: {
      type: Array,
      default: [{ starttime: "8:00", endtime: "17:00" }],
    },
    wen: {
      type: Array,
      default: [{ starttime: "8:00", endtime: "17:00" }],
    },
    thu: {
      type: Array,
      default: [{ starttime: "8:00", endtime: "17:00" }],
    },
    fri: {
      type: Array,
      default: [{ starttime: "8:00", endtime: "17:00" }],
    },
    sat: {
      type: Array,
      default: [{ starttime: "8:00", endtime: "17:00" }],
    },
    sun: {
      type: Array,
      default: [{ starttime: "8:00", endtime: "17:00" }],
    },
  },
});

eventSchema.index({ user: 1, url: 1 }, { unique: true });

export const EventModel = mongoose.model<EventDocument>("Event", eventSchema);
