const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const { ObjectId } = require("mongodb");
const { error } = require("console");
const { isEmpty } = require("lodash");


const url = "mongodb+srv://traveller:Manoj1999@traveller.ots9ysb.mongodb.net/";
dotenv.config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// MongoDB connection
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
console.log(db)
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("MongoDB connection is open!");
});

// Mongoose Schema and Model  
// In mongodb already exist database so  we can just update it 
const emaraldBankRegisterCustomersSchema = new mongoose.Schema({
  fieldName: String,
});

const EmaraldBankRegisterCustomers = mongoose.model(
  "EmaraldBankRegisterCustomers",
  emaraldBankRegisterCustomersSchema
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

const uploadMultiple = upload.fields([
  { name: "file1", maxCount: 1 },
  { name: "file2", maxCount: 10 },
]);
console.log(uploadMultiple);

const uploadFiles = async (req, res) => {

  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: "Error uploading file" });
    }

    try {
      console.log(req.files);
      const file = req.files;
      const files = Object.values(file).flatMap((arr) => arr);
      const filenames = files.map((file) => file.filename);

      console.log(filenames);

      // Assuming you have a collection called 'EmaraldBankRegisterCustomers'
      // and want to update 'fieldName' with the uploaded filename
      const filter = { _id: "647dce58b54b9e47c422e822" };
      const update = { $set: { fieldName: filenames.join(", ") } };

      await EmaraldBankRegisterCustomers.updateOne(filter, update);

      res.json({ message: "File uploaded successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Error handling file upload" });
    }
  });
};

module.exports = {
  uploadFiles,
};
