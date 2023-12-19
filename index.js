const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv").config();
const URL = process.env.DB;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

let users = [];

app.get("/users", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const users = await db.collection("users").find().toArray();
    await connection.close();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/user", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const user = await db.collection("users").insertOne(req.body);
    await connection.close();
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
  // req.body.id = users.length + 1;
  // users.push(req.body);
  // res.json({ message: "User created successfully" });
});

// URL Params
app.get("/user/:id", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.json(user);
    await connection.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }

  // let id = req.params.id;
  // let user = users.find((user) => user.id == id);

  // if (user) {
  //   res.json(user);
  // } else {
  //   res.status(404).json({ message: "User not found" });
  // }
});

app.put("/user/:id", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const user = await db
      .collection("users")
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

  // let index = users.findIndex((user) => user.id == req.params.id);
  // if (index != -1) {
  //   req.body.id = parseInt(req.params.id);
  //   users[index] = req.body;
  //   res.json({ message: "User updated successfully" });
  // } else {
  //   res.status(404).json({ message: "User not found" });
  // }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("b52_wd_tamil");
    const user = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    await connection.close();
    res.json({ message: "User Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
  // let index = users.findIndex((user) => user.id == req.params.id);
  // if (index != -1) {
  //   users.splice(index, 1);
  //   res.json({ message: "User deleted successfully" });
  // } else {
  //   res.status(404).json({ message: "User not found" });
  // }
});

app.listen(3005);

// aO6MAcQfH7L6AJC0
