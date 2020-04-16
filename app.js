const express = require("express");
const fs = require("fs");
const multer = require("multer");
const pug = require("pug");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + ".jpg";
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
const app = express();
const port = 3000;
const uploaded_files = [];

app.set("view engine", "pug");

app.get("/", (req, res) => {
  const path = "./public/uploads";
  fs.readdir(path, (err, items) => {
    res.render("index", { title: "Kenziegram", items });
  });
});

app.post("/upload", upload.single("myFile"), function (req, res) {
  uploaded_files.push(req.file.filename);
  res.render("fileUploaded");
});

app.use(express.static("./public"));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));
