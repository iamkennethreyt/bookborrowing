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
  database: "shy",
  debug: false
});

const d = new Date();

app.use(express.static(__dirname + "/public"));

// BOOK LIST
app.get("/api/booklist", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      "SELECT * from books ORDER by id desc",
      (error, results) => {
        res.json(results);
        connection.release();
        connection.destroy();
      }
    );
  });
});

// BORROWERS LIST
app.get("/api/borrowerslist", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      "SELECT * from borrowers ORDER by id desc",
      (error, results) => {
        res.json(results);
        connection.release();
        connection.destroy();
      }
    );
  });
});

//ADD BOOK
app.post("/api/addbook", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `INSERT INTO
          books(title, author, qty)
          VALUES( "${req.body.title}",
                  "${req.body.author}",
                  "${req.body.qty}")`,
      () => {
        res.send("SUCCESSFULLY POSTED");
        connection.release();
        connection.destroy();
      }
    );
  });
});

//ADD BORROWER
app.post("/api/addborrower", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `INSERT INTO
          borrowers(firstname, lastname, address, profession)
          VALUES( "${req.body.firstname}",
                  "${req.body.lastname}",
                  "${req.body.address}",
                  "${req.body.profession}")`,
      () => {
        res.send("SUCCESSFULLY POSTED");
        connection.release();
        connection.destroy();
      }
    );
  });
});

//API FOR SIGNIN
app.post("/api/signin", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `select * from users where username="${
        req.body.username
      }" and password="${req.body.password}"`,
      (err, results) => {
        if (results.length !== 0) {
          instance = results[0];
          res.send("SUCCESSFULLY LOGIN");
        } else {
          res.send("INVALID USERNAME OR PASSWORD");
        }
        connection.release();
        connection.destroy();
      }
    );
  });
});

//UPDATE BOOK
app.post("/api/updatebook", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `UPDATE books SET
        title="${req.body.title}",
        author="${req.body.author}",
        qty="${req.body.qty}"
        WHERE ID="${req.body.ID}"`,
      () => {
        res.send("SUCCESSFULLY UPDATED POST");
        connection.release();
        connection.destroy();
      }
    );
  });
});

//UPDATE BOOK
app.post("/api/updateborrower", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `UPDATE borrowers SET
        firstname="${req.body.firstname}",
        lastname="${req.body.lastname}",
        profession="${req.body.profession}",
        address="${req.body.address}"
        WHERE ID="${req.body.ID}"`,
      () => {
        res.send("SUCCESSFULLY UPDATED POST");
        connection.release();
        connection.destroy();
      }
    );
  });
});

//API FOR DELETE BOOK
app.post("/api/deletebook", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(`DELETE FROM books WHERE id = "${req.body.ID}"`, () => {
      res.send("SUCCESSFULLY DELETED BOOK");
      connection.release();
      connection.destroy();
    });
  });
});

//API FOR DELETE BORROWER
app.post("/api/deleteborrower", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `DELETE FROM borrowers WHERE id = "${req.body.ID}"`,
      () => {
        res.send("SUCCESSFULLY DELETED BORROWER");
        connection.release();
        connection.destroy();
      }
    );
  });
});

app.get("/api/readmanagebookborrowers", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `SELECT
        z.id, x.firstname, x.lastname, y.title, z.dateborrow
      from
        managebookborrowers as z, borrowers as x, books as y
      where z.borrowerID = x.id and z.bookID = y.ID and z.status="active"
      ORDER by id desc`,
      (error, results) => {
        res.json(results);
        connection.release();
        connection.destroy();
      }
    );
  });
});

//ADD BOOK BORROWER
app.post("/api/managebookborrower", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `INSERT INTO
          managebookborrowers(bookID, borrowerID, dateborrow, status)
          VALUES( "${req.body.bookID}",
                  "${req.body.borrowerID}",
                  "${d.getMonth()}/${d.getDate()}/${d.getFullYear()}",
                  "active")`,
      () => {
        res.send("SUCCESSFULLY POSTED");
        connection.release();
        connection.destroy();
      }
    );
  });
});

//ARCHIVE BOOK BORROWER
app.post("/api/archive", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `UPDATE managebookborrowers SET
        status="inactive"
        WHERE ID="${req.body.id}"`,
      () => {
        res.send("SUCCESSFULLY ARCHIVE DATA");
        connection.release();
        connection.destroy();
      }
    );
  });
  console.log("requeired", req.body.id);
});

app.get("*", (req, res) => res.send("./public/index.html"));
app.listen(8080, () => console.log(`App listening on port 8080`));
