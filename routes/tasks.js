const express = require("express");
const router = express.Router();
const Task = require("../models/Tasks");

/**
 * @swagger
 * tags:
 *  name: Tasks
 *  description: A Task CRUD API
 */

/**
 * @swagger
 * /createTask:
 *  post:
 *      summary: Create a new Task
 *      tags: [Tasks]
 *      requestBody:
 *          required : true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Task'
 *      responses:
 *          200:
 *            description: The task was successfully created
 *            content:
 *                application/json:
 *                    schema:
 *                        $ref: '#/components/schemas/Task'
 *          500:
 *             description: Something went wrong!!
 */

// create tasks
router.post("/createTask", async (req, res) => {
  const taskObj = {
    ttitle: req.body.ttitle,
    tdesc: req.body.tdesc,
    taction: req.body.taction,
  };

  try {
    const task = new Task(taskObj);
    await task.save();
    res.status(200).json({
      message: "Task saved Successfully",
      taskData: task,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something Went Wrong ",
      error: err,
    });
  }
});

/**
 * @swagger
 * /getAllTasks:
 *  get:
 *      summary: Returns the list of all the tasks
 *      tags: [Tasks]
 *      responses:
 *          200:
 *              description: The list of the tasks
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Task'
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Something went wrong!!
 */

// To get all the tasks
router.get("/getAllTasks", async (req, res, next) => {
  try {
    let tasks = await Task.find();
    if (!tasks) {
      tasks = [];
    }
    res.status(200).json({
      message: "Tasks fetched Successfully",
      taskData: tasks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something Went Wrong ",
      error: err,
    });
  }
});

/**
 * @swagger
 * /getTasksById/{id}:
 *  get:
 *      summary: Get the task by id
 *      tags: [Tasks]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The task id
 *      responses:
 *          200:
 *              description: The task description by id
 *              contents:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Task'
 *          404:
 *              description: The task was not found
 *          500:
 *              description: Something went wrong
 */

//  To get tasks by id
router.get("/getTasksById/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let tasks = await Task.findById(id).populate();

    if (!tasks) {
      tasks = [];
      res.status(404).json({
        message: "Task Not Found",
      });
    } else {
      res.status(200).json({
        message: "Tasks Successfully fetched",
        taskData: tasks,
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
 * /updateTask/{id}:
 *  put:
 *      summary: Update the task by id
 *      tags: [Tasks]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The task id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Task'
 *      responses:
 *          200:
 *              description: The updated task description by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Task'
 *          404:
 *              description: The task was not found
 *          500:
 *              description: Something went wrong
 */

// Update a Task By id
router.put("/updateTask/:id", async (req, res) => {
  const id = req.params.id;
  const taskObj = {
    ttitle: req.body.ttitle,
    tdesc: req.body.tdesc,
    taction: req.body.taction,
  };
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, {
      $set: taskObj,
    }).populate();
    if (updatedTask == null) {
      res.status(400).json({
        message: "Something went wrong!ID not found",
      });
    } else {
      res.status(200).json({
        message: "Task Updated Succesfully",
        updated: updatedTask,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong!",
      error: err,
    });
  }
});

/**
 * @swagger
 * /deleteTask/{id}:
 *  delete:
 *      summary: Delete the task by id
 *      tags: [Tasks]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The task id
 *      responses:
 *          200:
 *              description: The Task was Deleted
 *          404:
 *              description: The task was not found
 *          500:
 *              description: Something went wrong
 */

// Delete a Task By Id
router.delete("/deleteTask/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (deletedTask == null) {
      res.status(400).json({
        message: "Something went wrong!ID not found",
      });
    } else {
      res.status(200).json({
        message: "Task Deleted Succesfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong!",
      error: err,
    });
  }
});

module.exports = router;
