const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User Registration API
 */

/**
 * @swagger
 * /register:
 *  post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *          required : true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *            description: The user was successfully created
 *            content:
 *                application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              description: Registration Status
 *                          user:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: string
 *                                      description: User id
 *                                  username:
 *                                      type: string
 *                                      description: User's username
 *                      example:
 *                          message: User registered Successfully!
 *                          user:
 *                              id : akjdh67sad
 *                              username: rudra
 *          401:
 *             description: The user already exists
 *          500:
 *             description: Something went wrong!!
 */

//register route
router.post("/register", async (req, res) => {
  const userObj = new User({
    username: req.body.username,
    password: hashSync(req.body.password, 10),
  });

  try {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
      await userObj.save();
      res.status(200).json({
        message: "User registered Successfully!",
        user: {
          id: userObj._id,
          username: userObj.username,
        },
      });
    } else {
      res.status(401).json({
        message: "User Already Exists!",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something Went Wrong!",
      error: err,
    });
  }
});

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Log in to the account
 *      tags: [Users]
 *      requestBody:
 *          required : true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *            description: The user was successfully created
 *            content:
 *                application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              description: Login Status
 *                          token:
 *                              type: string
 *                              description: JWT AUTH Token
 *                      example:
 *                          message: User logged in Successfully!
 *                          token: hkjashd7a8das87dtas78as8dga87ohasdya78
 *          401:
 *             description: The user already exists
 *          500:
 *             description: Something went wrong!!
 */

//login route
router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json({
        message: "Username/Password is incorrect!!",
      });
    } else {
      if (!compareSync(req.body.password, user.password)) {
        res.status(401).json({
          message: "Username/Password is incorrect!!",
        });
      } else {
        const payload = {
          userData: {
            username: user.username,
            id: user._id,
          },
        };
        const token = await jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: 7200,
        });

        res.status(200).json({
          message: "User Logged in Successfully!",
          token: token,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something Went Wrong!",
      error: err,
    });
  }
});

/**
 * @swagger
 * /protected:
 *  get:
 *      security:
 *        - bearerAuth: []
 *      summary: Get the page if authenticated
 *      tags: [Users]
 *      parameters:
 *          - in : header
 *            name: authorization
 *            required: false
 *            description: The token id
 *      responses:
 *          200:
 *              description: User is Authenticated
 *              content:
 *                application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                           success:
 *                              type: string
 *                              description: Authentication Status
 *                           user:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: string
 *                                      description: User id
 *                                  username:
 *                                      type: string
 *                                      description: User's username
 *                      example:
 *                          success: true
 *                          user:
 *                            id: hghgg87
 *                            username: rudra
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Something went wrong
 */

// protected route
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      success: "true",
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  }
);
module.exports = router;
