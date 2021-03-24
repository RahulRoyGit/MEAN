const Router = require("express").Router;
module.exports = Router({ mergeParams: true }).post(
  "/v1/users/auth",
  async (req, res, next) => {
    try {
      // console.log("User Name : " + req.body.username);
      // console.log("Password : " + req.body.password);
      // console.log("Body : " + req.body);
      const user = await req.db.User.findOne({
        username: req.body.username,
        password: req.body.password,
      });
      console.log(user);
      if (user) {
        req.session.userId = user._id;
        res.redirect("/");
      } else {
        res.status(403);
        res.send("Invalid username or password.");
      }
    } catch (error) {
      next(error);
    }
  }
);
