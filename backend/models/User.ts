import * as mongoose from 'mongoose';
import { genSalt, hash } from "bcryptjs";

export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  expiry_date: number;
}

export interface User extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  user_url: string;
  picture_url: string;
  google_tokens: GoogleTokens;
};

// User schema for the Database
const userSchema = new mongoose.Schema<User>(
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
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
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
    welcome: {
      type: String,
      default: "Willkommen auf meiner Planungsseite",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  let user: User = <User>this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next();
  }

  // generate a salt
  genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // hash the password using our new salt
    hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

export const UserModel = mongoose.model<User>("User", userSchema);
