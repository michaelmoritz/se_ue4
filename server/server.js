const mysql = require("mysql");
const express = require("express");

const app = express();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "M160195m",
  database: "eventservice"
});

app.get("/events", (req, res) => {
  connection.connect();
  connection.query("SELECT * FROM event;", function(err, rows, fields) {
    if (err) throw err;
    console.log("The solution is: ", rows[0]);
    res.send("Success!");
  });
  connection.end();
  //res.send("Hello World");
});

app.get("/events/:id", (req, res) => {
  connection.connect();
  connection.query(`SELECT * FROM event WHERE id=${req.params.id};`, function(
    err,
    rows,
    fields
  ) {
    if (err) throw err;
    console.log("The solution is: ", rows[0]);
    res.send(rows[0]);
  });
  connection.end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
