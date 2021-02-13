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
export const getUserController = (req: Request, res: Response): void => {
  const userid = req.user_id;
  const query = UserModel.findOne({ _id: userid });
  query.exec()
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
  const query = UserModel.findOne({ user_url: <string>userurl }, "-password");
  query.exec()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    })
};
