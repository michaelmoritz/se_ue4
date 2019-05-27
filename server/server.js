const mysql = require("mysql");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: "veranstaltungsservice.csgcsrajxclt.us-east-2.rds.amazonaws.com",
  user: "SE2019",
  password: "ServiceEngineering2019",
  database: "VeranstaltungsService"
});

const secretKey = "ServiceEngineering2019";

app.get("/events", (req, res) => {
  const query = "SELECT * FROM event;";

  //query the DB
  connection.query(query, function(err, rows, fields) {
    if (err) handleError(res, err);
    else {
      //query successful
      console.log("events received");
      res.json(JSON.stringify(rows));
    }
  });
});

app.post("/events", (req, res) => {
  if (!isValidAuthToken(req.get("Authorization"))) {
    //token is invalid
    res.status(401).json({ message: "Auth failed" });
  } else {
    //access granted
    if (
      !req.body.name ||
      !req.body.location ||
      !req.body.date ||
      !req.body.maxParticipants ||
      !req.body.host
    ) {
      res.status(400).send("Invalid input");
    } else {
      const query = `INSERT INTO event (name, description, location, date, maxParticipants, host)
    values("${req.body.name}", "${req.body.description}", 
    "${req.body.location}", "${req.body.date}", ${req.body.maxParticipants}, 
    "${req.body.host}");`;

      //query the DB
      connection.query(query, function(err, rows, fields) {
        if (err) handleError(res, err);
        else {
          //query successful
          console.log("1 record inserted");
          res.status(200).send("Event added");
        }
      });
    }
  }
});

app.get("/events/:id", (req, res) => {
  const query = `SELECT * FROM event WHERE id=${req.params.id};`;

  //query the DB
  connection.query(query, function(err, rows, fields) {
    if (err) handleError(res, err);
    else {
      //query successful
      console.log("event received");
      res.json(JSON.stringify(rows[0]));
    }
  });
});

app.post("/events/:id", (req, res) => {
  if (
    !req.body.name ||
    !req.body.location ||
    !req.body.date ||
    !maxParticipants ||
    !req.body.host
  ) {
    res.status(400).send("Invalid input");
  } else {
    const query = `UPDATE event 
    SET name="${req.body.name}", description="${req.body.description}", 
    location="${req.body.location}", date="${req.body.date}", 
    maxParticipants=${req.body.maxParticipants}, host="${req.body.host}"
    WHERE id=${req.params.id};`;

    //query the DB
    connection.query(query, function(err, rows, fields) {
      if (err) handleError(res, err);
      else {
        //query successful
        console.log("1 record updated");
        res.status(200).send("Event updated");
      }
    });
  }
});

app.delete("/events/:id", (req, res) => {
  if (!isValidAuthToken(req.header.Authorization)) {
    //token is invalid
    res.status(401).json({ message: "Auth failed" });
  } else {
    //access granted
    const query = `DELETE FROM event WHERE id=${req.params.id};`;

    //query the DB
    connection.query(query, function(err, rows, fields) {
      //if query fails
      if (err) handleError(res, err);
      else {
        //query successful
        console.log("1 record deleted");
        res.status(200);
        res.send("Event successfully deleted");
      }
    });
  }
});

app.get("/events/:id/registrations", (req, res) => {
  if (!isValidAuthToken(req.header.Authorization)) {
    //toke is invalid
    res.status(401).json({ message: "Auth failed" });
  } else {
    //access granted
    const query = `SELECT * FROM registration WHERE eventID=${req.params.id};`;

    //query the DB
    connection.query(query, function(err, rows, fields) {
      if (err) handleError(res, err);
      else {
        //query successful
        console.log("registrations received");
        res.status(200).json(JSON.stringify(rows));
      }
    });
  }
});

app.post("/events/:id/registrations", (req, res) => {
  if (!isValidAuthToken(req.header.Authorization)) {
    //token is invalid
    res.status(401).json({ message: "Auth failed" });
  } else {
    //access granted
    if (!req.body.username || !req.body.eventID || !req.body.escort) {
      res.status(400).send("Invalid input");
    } else {
      //input validated
      //TBD: eventID von 1 in true umwandeln
      const query = `INSERT INTO registration(user, eventID, escort) values 
  ("${req.body.username}", ${req.body.eventID}, ${req.body.escort});`;

      //query the DB
      connection.query(query, function(err, rows, fields) {
        //if query fails
        if (err) handleError(res, err);
        else {
          //query successful
          console.log("1 record inserted");
          res.status(200);
          res.send("User successfully registered for the event");
        }
      });
    }
  }
});

app.delete("/events/:id/registrations/:regNr", (req, res) => {
  if (!isValidAuthToken(req.header.Authorization)) {
    //token is invalid
    res.status(401).json({ message: "Auth failed" });
  } else {
    //access granted
    const query = `DELETE FROM registration WHERE registrationNr=${
      req.params.regNr
    };`;

    //query the DB
    connection.query(query, function(err, rows, fields) {
      //if query fails
      if (err) handleError(res, err);
      else {
        //query successful
        console.log("1 record deleted");
        res.status(200);
        res.send("User successfully unregistered from the event");
      }
    });
  }
});

app.post("/user", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Invalid input");
  } else {
    bcrypt.hash(req.body.password, 1, (err, hash) => {
      if (err) {
        res.status(400).send("Invalid password");
      } else {
        const query = `INSERT INTO user(name, password) values 
        ("${req.body.username}", "${hash}");`;

        //connection.connect();
        console.log("sending query...");
        connection.query(query, function(err, rows, fields) {
          if (err) handleError(res, err);
          console.log("1 record inserted");
          res.status(200);
          res.send("User successfully added");
        });
        //connection.end();
      }
    });
  }
});

//TBD
app.post("/user/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Invalid input");
  } else {
    const query = `SELECT * FROM user WHERE name= 
    "${req.body.username}";`;

    //connection.connect();
    connection.query(query, function(err, rows, fields) {
      if (err) handleError(res, err);
      if (rows.length < 1) {
        res.status(401).json({ message: "Auth failed" });
      } else {
        console.log("user found in Database");
        //TBD generate Token
        bcrypt.compare(req.body.password, rows[0].password, (err, result) => {
          if (err) {
            res.status(401).json({ message: "Auth failed" });
          } else {
            if (result) {
              const token = jwt.sign({ name: req.body.username }, secretKey, {
                expiresIn: "1h"
              });
              res
                .status(200)
                .json({ message: "Auth successful", token: token });
            } else {
              res.status(401).json({ message: "Auth failed" });
            }
          }
        });
      }
    });
    //connection.end();
  }
});

var handleError = function(res, err) {
  res.status(500).json(JSON.stringify(err));
  console.log(err);
};

var isValidAuthToken = function(token) {
  if (!token) {
    return false;
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded) {
      console.log("valid Token");
      return true;
    }
  } catch (ex) {
    return false;
  }
  return false;
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));

//TBD: Einführen von Registration ID in der DB
//TBD: Delete für Registration/Event
