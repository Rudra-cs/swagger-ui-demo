const express = require("express");
const dbConn = require("./config/db.conn");
const morgan = require("morgan");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const passport = require("passport");
require("./config/passport");

const corsOption = {
  origin: "*",
};

const port = process.env.PORT || 3000;
const app = express();

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(passport.initialize());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task API",
      version: "1.0.0",
      description: "A simple CRUD Application.",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./models/*.js", "./routes/*.js"],
};
const specs = swaggerJsDoc(options);

app.use("/", taskRoutes);
app.use("/", userRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
dbConn();

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
