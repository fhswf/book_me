const User = require('../models/User')
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { validationResult } = require('express-validator');
const mailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
    }
})

function validateUrl(userUrl){
  var reg = new RegExp(/[~\/]/g);
  var newUrl = userUrl.toLowerCase().replace(/[\. ,:]+/g, "-");
  newUrl = newUrl.replace(reg,"-")
  return newUrl;
}

// Handles the register and sending activation Email
exports.registerController = (req, res) => {

    const { name, email, password } = req.body 
   
    const errors = validationResult(req);// The result of user input validation

    if (!errors.isEmpty()) {
      const newError = errors.array().map(error => error.msg)[0];
      return res.status(422).json({errors: newError});
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
          //Checking if email already exists 
            if (user) {
                return res.status(400).json({ errors: "Email is taken"});
            }
            if(err)
            {
              return res.status(400).json({ errors: "Error, cant find User"});
            }
        });
        
        //Sing a JWT with user data
        const token = jwt.sign({name,email,password},process.env.ACCOUNT_ACTIVATION,{expiresIn: '10m'});

        //Actual Email for Nodemailer
        var mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Account activation "Bookme" ',
            html: `<h1>Click the link below to activate your account</h1>
                   <p>${process.env.CLIENT_URL}/users/activate/${token}</p>`
        }
        //Sending the email
        transporter.sendMail(mailOptions, function (error) {
            if (error) {
                return res.status(400).json({
                    success: false,
                    errors: error,
                })
            } else {
                return res.json({
                    message: `Email has been send to ${email}`
                })
            }
        })

    }
}

//Controller for saving the user to the DB
exports.activationController = (req, res) => {
  //Grab the token
  const { token } = req.body;

  if (token) 
  {
    //Verfiy it
    jwt.verify(token, process.env.ACCOUNT_ACTIVATION, (err) => {
      if (err) 
      {
        return res.status(401).json({errors: 'Error! Please signup again!'}); //Verify failed
      }
      else
      {
        //Decode the jwt for User information
        const { name, email, password } = jwt.decode(token);
        const user_url = validateUrl(name);
        //Create a new User 
        const userToSave = new User({name,email,password,user_url});
        //Save the new created User to the DB
        userToSave.save((err, userToSave) => {
          if (err)
          {
            return res.status(401).json({errors: "Could not save the User to the Database"});
          } 
          else
          {
            console.log(userToSave);
            return res.json({success: true,message: userToSave,message: 'You successfully signed up!'});
          }
        });
      }
    });
  }
  else
  {
    return res.json({ message: 'Error, please Signup and try again!'});
  }
};

// Controller for handling user login
exports.loginController = (req,res) => {
  //Grab user input
  const { email, password } = req.body;
  //Valdationresults
  const errors = validationResult(req);

  
  if(!errors.isEmpty())
  { 
      //If Validation failed
      const newError = errors.array().map(error => error.msg)[0];
      return res.status(422).json({errors: newError});
  }
  else
  {
    //Validation was successfull and now search for a user by the email
    User.findOne({email}).exec((err,user) => {
      if(!user || err)
      {
        //Email doent exist
        return res.status(400).json({errors:"User does not exist!"})
      }
      if(user.authenticate(password) === false)
      {
        //Passwords doesnt match 
        return res.status(400).json({errors:"Wrong password or email!"})
      }

      //User found in DB and password matches so we sign a token and respond with the token+user
      const token = jwt.sign({_id:user._id},process.env.JWT_SECRET_TOKEN,{expiresIn: "30min"});
      const { _id, name, email} = user;
      return res.json({token,user:{_id,name,email}});
    });
  }
};

//Controller for the Login with Google Button
const client = new OAuth2Client(process.env.GOOGLE_ID);
exports.googleController = (req, res) => {
  // Again grab the token
  const { idToken } = req.body;

  //Verify the Token with the google client ID (google dev console)
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_ID })
    .then(response => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            //If the email already exists just sign a token 
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_TOKEN, {
              expiresIn: '1h'
            });
            //Respond with the user and the signed token
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role }
            });
          } else {
            //If email doesnt exist / Create a new user and Save it to the DB
            let password = email + process.env.JWT_SECRET_TOKEN;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log('Couldnt save user @google login', err);
                return res.status(400).json({
                  error: 'User signup failed with google'
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET_TOKEN,
                { expiresIn: '1m' }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role }
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again'
        });
      }
    });
};