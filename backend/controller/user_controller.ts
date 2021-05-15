/**
 * @module user_controller
 */
import { User, UserModel } from "../models/User";
import { Request, Response } from 'express';

/**
 * Middleware to get the logged in user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getUser = (req: Request, res: Response): void => {
  const userid = req.user_id;
  void UserModel.findOne({ _id: userid },
    {
      "_id": 1,
      "email": 1,
      "name": 1,
      "picture_url": 1,
      "pull_calendars": 1,
      "push_calendar": 1,
      "user_url": 1,
      "welcome": 1,
      "updatedAt": 1,
      "google_tokens.access_token": 1
    })
    .exec()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};


export const putUser = (req: Request, res: Response): void => {
  const userid = req.user_id;
  const user = <User>req.body.data;
  console.log('putUser: %o', user);
  void UserModel.findByIdAndUpdate(userid, user,
    {
      new: true,
      projection: {
        "_id": 1,
        "email": 1,
        "name": 1,
        "picture_url": 1,
        "pull_calendars": 1,
        "push_calendar": 1,
        "user_url": 1,
        "welcome": 1,
        "updatedAt": 1,
        "google_tokens.access_token": 1
      }
    })
    .exec()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to get a user by their url
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getUserByUrl = (req: Request, res: Response): void => {
  const userurl = req.query.url;
  const query = UserModel.findOne({ user_url: <string>userurl },
    {
      "_id": 1,
      "email": 1,
      "name": 1,
      "picture_url": 1,
      "pull_calendars": 1,
      "push_calendar": 1,
      "user_url": 1,
      "welcome": 1,
      "updatedAt": 1,
      "password": 0,
      "google_tokens": 0
    });
  query.exec()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    })
};
