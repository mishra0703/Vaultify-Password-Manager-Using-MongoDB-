const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require ("body-parser")
const cors = require("cors")
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "Vaultify";
const port = 3000;

app.use(bodyParser.json())
app.use(cors())
dotenv.config();
client.connect();



// Get All the Passwords
app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.find({}).toArray();
  res.json(findResult);
});


// Save all the Passwords
app.post("/", async (req, res) => {
  const Password_data = req.body
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.insertOne(Password_data)
  res.send({success : true , result : findResult});
});



// Delete all the Passwords
app.delete("/", async (req, res) => {
  const Password_data = req.body
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.deleteOne(Password_data)
  res.send({success : true , result : findResult});
});


app.listen(port, () => {
  console.log("Example app listening at http://localhost:" + port);
});
