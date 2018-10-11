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
        (error, results) =>
          !error
            ? res.send(results.insertId.toString())
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

//POST PET
app.post("/api/postpet", (req, res) => {
  // const timeofmass = moment(req.body.dateofmass);
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        `INSERT INTO
          posts(userID, title, details, image, timepost)
          VALUES( "${req.body.ID}",
                  "${req.body.title}",
                  "${req.body.details}",
                  "${req.body.image}",
                  "${Date.now()}")`,
        (error, results) =>
          !error
            ? res.send("SUCCESSFULLY POSTED")
            : res.send("THERE'S SOMETHING WRONG FOR POSTING")
      );
      connection.release();
    } else {
      res.json("Error connecting to db. " + err);
      connection.release();
    }
  });
});

// POST LIST
app.get("/api/postlist", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        "SELECT u.firstname, u.lastname, u.email, p.title, p.details, p.image FROM users as u, posts as p where p.userid = u.id",
        (error, results) => {
          if (!error) {
            res.json(results);
            connection.release();
          }
        }
      );
    } else {
      connection.release();
    }
  });
});

app.post("/api/updateprofile", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      connection.query(
        `UPDATE users SET
          firstname="${req.body.firstName}",
          lastname="${req.body.lastName}",
          details="${req.body.details}",
          image="${req.body.image}"
          WHERE ID="${req.body.ID}"`,
        err => {
          if (!err) {
            // connection.query("SELECT * FROM users", (err, rows) => {
            res.send("SUCCESSFULLY UPDATED PROFILE");
            connection.release();
            // });
          }
        }
      );
    } else {
      res.json("Error connecting to db. " + err);
      connection.release();
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
              : res.json(results);
            connection.release();
          }
        }
      );
    } else {
      res.json("Error connecting to db. " + err);
      connection.release();
    }
  });
});

app.get("*", (req, res) => res.send("./public/index.html"));
app.listen(8080, () => console.log(`App listening on port 8080`));
