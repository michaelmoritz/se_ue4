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
    if (err) {
      handleError(res, err);
      return;
    }
    if (rows.length < 1) {
      //no events in the DB
      res.status(404).json({ message: "No events in the database" });
    } else {
      //query successful
      console.log("events received");
      res.json(rows);
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
      res.status(400).json({ message: "Invalid input" });
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
          res.status(200).json({ message: "Event successfully added" });
        }
      });
    }
  }
});

app.get("/events/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    //given id is not a number
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  const query = `SELECT * FROM event WHERE id=${req.params.id};`;

  //query the DB
  connection.query(query, function(err, rows, fields) {
    if (err) {
      handleError(res, err);
      return;
    }
    if (rows.length < 1) {
      //Event not found
      res
        .status(404)
        .json({ message: "The event could not be found in the database" });
    } else {
      //query successful
      console.log("event received");
      res.json(rows[0]);
    }
  });
});

app.post("/events/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    //given id is not a number
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  if (!isValidAuthToken(req.get("Authorization"))) {
    //token is invalid
    res.status(401).json({ message: "Auth failed" });
    return;
  }
  if (
    !req.body.name ||
    !req.body.location ||
    !req.body.date ||
    !req.body.maxParticipants ||
    !req.body.host
  ) {
    res.status(400).json({ message: "Invalid input" });
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
        res.status(200).json({ message: "Event successfully added" });
      }
    });
  }
});

app.delete("/events/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    //given id is not a number
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  if (!isValidAuthToken(req.get("Authorization"))) {
    //token is invalid
    res.status(401).json({ message: "Auth failed" });
  } else {
    //access granted
    const query = `DELETE FROM event WHERE id=${req.params.id};`;

    //query the DB
    connection.query(query, function(err, rows, fields) {
      //if query fails
      if (err) {
        handleError(res, err);
        return;
      }
      if (rows.length < 1) {
        res
          .status(404)
          .json({ message: "No event with the given ID in the database" });
      } else {
        //query successful
        console.log("1 record deleted");
        res.status(200).json({ message: "Event successfully deleted" });
      }
    });
  }
});

app.get("/events/:id/registrations", (req, res) => {
  if (isNaN(req.params.id)) {
    //given id is not a number
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  if (!isValidAuthToken(req.get("Authorization"))) {
    //toke is invalid
    res.status(401).json({ message: "Auth failed" });
  } else {
    //access granted
    const query = `SELECT * FROM registration WHERE eventID=${req.params.id};`;

    //query the DB
    connection.query(query, function(err, rows, fields) {
      //if query fails
      if (err) {
        handleError(res, err);
        return;
      }
      if (rows.length < 1) {
        res.status(404).json({ message: "No registrations found" });
      } else {
        //query successful
        console.log("registrations received " + rows[0].escort);
        res.status(200).json(rows);
      }
    });
  }
});

app.post("/events/:id/registrations", (req, res) => {
  if (isNaN(req.params.id)) {
    //given id is not a number
    res.status(400).json({ message: "Invalid input" });
    return;
  } else {
    if (!isValidAuthToken(req.get("Authorization"))) {
      //token is invalid
      res.status(401).json({ message: "Auth failed" });
    }
    //access granted
    if (!req.body.username || !req.body.eventID || !req.body.escort) {
      res.status(400).json({ message: "Invalid input" });
    } else {
      //input validated
      const query = `INSERT INTO registration(user, eventID, escort) values 
      ("${req.body.username}", ${req.body.eventID}, ${req.body.escort});`;

      console.log(query);
      console.log(req.body.escort);
      //query the DB
      connection.query(query, function(err, rows, fields) {
        //if query fails
        if (err) {
          handleError(res, err);
          return;
        }
        if (rows.length < 1) {
          res.status(400).json({ message: "Invalid input" });
          return;
        } else {
          //query successful
          console.log("1 record inserted");
          res
            .status(200)
            .json({ message: "Registration successfully inserted" });
        }
      });
    }
  }
});

app.delete("/events/:id/registrations/:regNr", (req, res) => {
  if (isNaN(req.params.id || isNaN(req.params.regNr))) {
    //given id is not a number
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  if (!isValidAuthToken(req.get("Authorization"))) {
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
      if (err) {
        handleError(res, err);
        return;
      }
      if (rows.length < 1) {
        res.status(404).json({
          message: "No registration with the given Nr. in the database"
        });
      } else {
        //query successful
        console.log("1 record deleted");
        res
          .status(200)
          .json({ message: "User successfully unregistered from the event" });
      }
    });
  }
});

app.post("/user", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: "Invalid input" });
    //valid password
  } else {
    //hash user password
    bcrypt.hash(req.body.password, 1, (err, hash) => {
      if (err) {
        res.status(400).json({ message: "Invalid password" });
      } else {
        const query = `INSERT INTO user(name, password) values 
        ("${req.body.username}", "${hash}");`;

        //query the DB
        connection.query(query, function(err, rows, fields) {
          //if query fails
          if (err) handleError(res, err);
          else {
            //query successful
            console.log("1 record inserted");
            res.status(200).json({ message: "User successfully added" });
          }
        });
      }
    });
  }
});

app.post("/user/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Invalid input");
  } else {
    const query = `SELECT * FROM user WHERE name= 
    "${req.body.username}";`;

    //query the DB
    connection.query(query, function(err, rows, fields) {
      //if query fails
      if (err) {
        handleError(res, err);
        return;
      }
      if (rows.length < 1) {
        //invalid user
        res.status(401).json({ message: "Auth failed" });
      } else {
        console.log("user found in Database");
        //Compare password from the DB with input password
        bcrypt.compare(req.body.password, rows[0].password, (err, result) => {
          if (err) {
            //passwords do not match
            res.status(401).json({ message: "Auth failed" });
          } else {
            if (result) {
              //passwords match, generate Token
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
  }
});

//function for handling db-query errors
var handleError = function(res, err) {
  res.status(500).json({ code: err.code });
  //console.log(err);
};

//function for validating tokens
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
