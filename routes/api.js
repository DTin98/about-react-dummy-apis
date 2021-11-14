var express = require("express");
var router = express.Router();
var fs = require("fs");
const User = require("../models/user.model");

/* List of API */
router.get("/", function (req, res, next) {
  res.render("list", {
    title: "ABOUTREACT",
    apilist: [
      {
        name: `${req.headers.host}/api/user`,
        description: "All User Listing",
        method: "get",
      },
      {
        name: `${req.headers.host}/api/user/register`,
        description: "New User Register",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/login`,
        description: "User Authentication",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/search`,
        description: "User Search",
        method: "get",
      },
    ],
  });
});

/* All User Listing */
router.get("/user", function (req, res, next) {
  try {
    let resultUsers = [];
    User.getAll(null, function (t, result) {
      resultUsers = result;
      res.json({ status: "success", data: resultUsers, msg: "" });
    });
  } catch (err) {
    console.error(err);
    res.json(500).send({ status: "failed", msg: "Internal Server Error" });
  }
});

/* New User Register */
router.post("/user/register", function (req, res, next) {
  try {
    console.log("req.body -> ", req.body);
    User.getAll(null, function (t, result) {
      const users = result;
      let newUsers = users.filter(function (e) {
        return e.email == req.body.email;
      });
      if (newUsers.length > 0) {
        res
          .status(400)
          .send({ status: "failed", data: {}, msg: "User Already Exists" });
      } else {
        users.push(req.body);
        User.create(req.body, (result) => {
          res.send({ status: "success", data: req.body, msg: "" });
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.json(500).send({ status: "failed", msg: "Internal Server Error" });
  }
});

/* User Authentication */
router.post("/user/login", function (req, res, next) {
  try {
    User.getAll(null, function (t, result) {
      console.log("req.body -> ", req.body);
      const users = result;
      let newUsers = users.filter(function (e) {
        return e.email == req.body.email && e.password == req.body.password;
      });
      if (newUsers.length > 0) {
        res.send({ status: "success", data: newUsers[0], msg: "" });
      } else {
        res.send({
          status: "failed",
          data: {},
          msg: "No UserId / Password Found",
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.json(500).send({ status: "failed", msg: "Internal Server Error" });
  }
});

/* User Search */
router.get("/user/search", function (req, res, next) {
  try {
    User.getAll(null, function (t, result) {
      const users = result;
      console.log(users);
      let newUsers = users.filter(function (e) {
        return (
          e.name && e.name.toLowerCase().includes(req.query.q.toLowerCase())
        );
      });
      res.send({ status: "success", data: newUsers, msg: "" });
    });
  } catch (err) {
    console.error(err);
    res.json(500).send({ status: "failed", msg: "Internal Server Error" });
  }
});

module.exports = router;
