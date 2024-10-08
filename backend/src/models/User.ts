
import { Document, Schema, model } from 'mongoose';
import { User } from "common/src/types";


export interface GoogleTokens extends Document {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  expiry_date?: number;
}

interface GoogleTokensDocument extends GoogleTokens, Document {
}

export interface UserDocument extends Document, User {
}

// User schema for the Database
const tokenSchema = new Schema<GoogleTokensDocument>({
  access_token: {
    type: String,
    default: null,
  },
  refresh_token: {
    type: String,
    default: null,
  },
  scope: {
    type: String,
    default: null,
  },
  expiry_date: {
    type: Number,
    default: null,
  },
});

// User schema for the Database
const userSchema = new Schema<UserDocument>(
  {
    _id: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: false,
      lowercase: true,
    },
    google_tokens: {
      type: tokenSchema
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    user_url: {
      type: String,
      default: "",
      unique: true,
    },
    picture_url: {
      type: String,
      default: "",
      unique: true,
    },
    pull_calendars: {
      type: [String],
      default: []
    },
    push_calendar: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<UserDocument>("User", userSchema);
