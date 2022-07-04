const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *          username:
 *              type: string
 *              description: The task title
 *          password:
 *              type: string
 *              description: The task description
 *       example:
 *          username: rudra
 *          password: password
 *
 */

// User Schema
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("users", UserSchema);
