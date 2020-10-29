const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// User schema for our Database
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods = {
  //Bcryptjs compare of passwords 
    authenticate: function(plain_password){
      bcrypt.compare(plain_password, this.password, function(err, result) {
        if(err)
        {
          throw(err);
        }
        else{
          return true;  
        }
    });
    }
}


module.exports = mongoose.model('User', userSchema);