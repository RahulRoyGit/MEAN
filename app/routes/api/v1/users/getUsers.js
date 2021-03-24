const Router = require("express").Router;
module.exports = Router({ mergeParams: true }).get(
  "/v1/users",
  async (req, res, next) => {
    try {
      const users = await req.db.User.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);
