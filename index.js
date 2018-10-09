const express = require("express");
const app = express();
const mysql = require("mysql");
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

const pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "wakin",
  debug: false
});

app.use(express.static(__dirname + "/public"));

//REGISTER USER
app.post("/api/registerUser", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        `INSERT INTO
          users(firstName, lastName, password, email)
          VALUES( "${req.body.firstName}",
                  "${req.body.lastName}",
                  "${req.body.password}",
                  "${req.body.email}")`,
        error =>
          !error
            ? res.send("SUCCESSFULLY REGISTERED")
            : res.send(
                `${
                  req.body.email
                } IS ALREADY REGISTERD PLEASE USE ANOTHER EMAIL TO SIGNUP`
              )
      );
      connection.release();
      // connection.destroy();
    } else {
      res.json("Error connecting to db. " + err);
      connection.release();
      // connection.destroy();
    }
  });
});

app.post("/api/signin", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        `select * from users where email="${req.body.email}" and password="${
          req.body.password
        }"`,
        (err, results) => {
          if (!err) {
            results.length == 0
              ? res.send("INVALID USER NAME OR PASSWORD")
              : res.redirect();
          }
        }
      );
      connection.release();
    } else {
      res.json("Error connecting to db. " + err);
      connection.release();
    }
  });
});

app.get("*", (req, res) => res.send("./public/index.html"));
app.listen(8080, () => console.log(`App listening on port 8080`));
