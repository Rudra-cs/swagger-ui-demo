const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - ttitle
 *         - tdesc
 *       properties:
 *          _id:
 *             type: ObejctId(string)
 *             description: The auto-generated id of the task by mongodb
 *          ttitle:
 *              type: string
 *              description: The task title
 *          tdesc:
 *              type: string
 *              description: The task description
 *          taction:
 *              type: string
 *              description: The task undergoing action
 *       example:
 *          id: 62bff1f2f1b751255b5c2e26
 *          ttitle: Task 1
 *          tdesc: Task is going on
 *          taction: Pending
 *
 */

// Task Schema
const TaskSchema = mongoose.Schema({
  ttitle: {
    type: String,
    required: true,
  },
  tdesc: {
    type: String,
    required: true,
  },
  taction: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("tasks", TaskSchema);
