const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const authRouter = require("./routers/authRouter");
const { errorResponse } = require("./controllers/responseController");
const categoryRouter = require("./routers/categoryRouter");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 minute
  max: 15,
  message: "Too many request from this IP. Please try again later.",
});

// middleware
app.use(cookieParser());
app.use(rateLimiter);
app.use(xssClean());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// api
app.use("/users", userRouter);
app.use("/seed", seedRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);


// get requests
app.get("/test", (req, res) => {
  res.status(200).send("Welcome to the server");
});

// client error handling
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

// server error handling
app.use((err, req, res, next) => {
  return errorResponse(res,{
    statusCode:err.status,
    message: err.message
  });
  next();
});

module.exports = app;
