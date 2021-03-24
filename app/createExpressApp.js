const express = require("express");
const bodyParser = require("body-parser");
const expressWinston = require("express-winston");
const router = require("./routes/createRouter.js")();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
module.exports = ({ database, logger }) =>
  express()
    .use(
      session({
        secret: process.env.Secret_Key || "This is only my secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
          path: "/api",
          httpOnly: true,
          secure: false,
          maxAge: 3600,
        },
        store: new MongoStore({
          url: "", // Add MongoDBURL here
          touchAfter: 3600,
          ttl: 3600,
        }),
      })
    )
    .use(
      expressWinston.logger({
        winstonInstance: logger,
        msg:
          "{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms",
        meta: false,
      })
    )
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use((req, res, next) => {
      req.base = `${req.protocol}://${req.get("host")}`;
      req.logger = logger;
      req.db = database;
      return next();
    })
    .use(express.static("./public"))
    .use("/api", router)
    .use((error, req, res, next) => {
      logger.error(error, error);
      res.status(error.status || 500).json({ error });
    });
