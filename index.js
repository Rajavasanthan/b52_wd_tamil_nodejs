const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const URL = process.env.DB;

app.use(express.json());
app.use(
  cors({
    origin: "https://stellar-douhua-66d483.netlify.app",
  })
);

let students = [];

function authorize(req, res, next) {
  console.log(req.headers);
  if (req.headers.authorization) {
    try {
      const verify = jwt.verify(
        req.headers.authorization,
        process.env.SECRET_KEY
      );
      if (verify) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

app.get("/students",authorize, async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const students = await db.collection("students").find().toArray();
    await connection.close();
    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/student", authorize,async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const student = await db.collection("students").insertOne(req.body);
    await connection.close();
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
  // req.body.id = students.length + 1;
  // students.push(req.body);
  // res.json({ message: "User created successfully" });
});

// URL Params
app.get("/student/:id",authorize, async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const student = await db
      .collection("students")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.json(student);
    await connection.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }

  // let id = req.params.id;
  // let student = students.find((student) => student.id == id);

  // if (student) {
  //   res.json(student);
  // } else {
  //   res.status(404).json({ message: "User not found" });
  // }
});

app.put("/student/:id",authorize, async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const student = await db
      .collection("students")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
    await connection.close();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went worng" });
  }

  // let index = students.findIndex((student) => student.id == req.params.id);
  // if (index != -1) {
  //   req.body.id = parseInt(req.params.id);
  //   students[index] = req.body;
  //   res.json({ message: "User updated successfully" });
  // } else {
  //   res.status(404).json({ message: "User not found" });
  // }
});

app.delete("/student/:id",authorize, async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const student = await db
      .collection("students")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    await connection.close();
    res.json({ message: "User Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
  // let index = students.findIndex((student) => student.id == req.params.id);
  // if (index != -1) {
  //   students.splice(index, 1);
  //   res.json({ message: "User deleted successfully" });
  // } else {
  //   res.status(404).json({ message: "User not found" });
  // }
});

app.post("/register", async (req, res) => {
  // email
  // username
  // password

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    req.body.password = hash;
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const user = await db.collection("user").insertOne(req.body);
    await connection.close();
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const user = await db.collection("user").findOne({ email: req.body.email });
    if (user) {
      const password = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      console.log(password);
      if (password) {
        // JWT Token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "1m",
        });
        res.json({ message: "Login success", token });
      } else {
        res.status(401).json({ message: "Username or Password is incorrect" });
      }
    } else {
      res.status(404).json({ message: "Username or Password is incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(3005);
