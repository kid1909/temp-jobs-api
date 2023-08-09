require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const authenticateUser = require("./middleware/authentication");
// extra security packages
const helmet= require ('helmet')
const cors = require ('cors')
const xss = require ('xss-clean')
const rateLimiter = require ('express-rate-limit')
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.get("/", (req, res) => {
  res.send(`<h1>jobs API </h1><a href="/api-use">Documents</a>`);
});
app.use("/api-use", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//connect DB
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

//Swagger



// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
