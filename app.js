const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const indexRouter = require("./routes");
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", indexRouter);

const LOCAL_DB_ADDRESS = process.env.LOCAL_DB_ADDRESS;
const AWS_DB_ADDRESS = process.env.AWS_DB_ADDRESS;

mongoose
  .connect(LOCAL_DB_ADDRESS)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("DB Connection Error: ", err);
  });

console.log("AWS_DB_ADDRESS:", process.env.AWS_DB_ADDRESS);
console.log("LOCAL_DB_ADDRESS:", process.env.LOCAL_DB_ADDRESS);
app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT || 5001}`);
});
