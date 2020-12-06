const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User schema for the Database
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
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
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", userSchema);
