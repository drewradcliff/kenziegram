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

app.use(express.json());
app.set("view engine", "pug");

app.get("/", (req, res) => {
  const path = "./public/uploads";
  fs.readdir(path, (err, items) => {
    res.render("index", { title: "Kenziegram", items });
  });
});

app.post("/upload", upload.single("myFile"), (req, res) => {
  uploaded_files.push(req.file.filename);
  res.render("fileUploaded");
});

// app.get("/poll", (req, res) => {
//   res.send({ image: "This is an example image" });
// });

app.post("/latest", (req, res) => {
  res.json(req.body);
  // const modified = fs.statSync(imagePath).mtimeMs;
  // if (modified > after) {
  // }
  // res.send()
});

app.use(express.static("./public"));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));
