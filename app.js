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
const path = "./public/uploads";

let uploaded_files = [];
fs.readdir(path, (err, items) => (uploaded_files = items));

app.use(express.json());
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", { title: "Kenziegram", uploaded_files });
});

app.post("/upload", upload.single("myFile"), (req, res) => {
  uploaded_files.push(req.file.filename);
  res.render("fileUploaded");
});

// app.get("/poll", (req, res) => {
//   res.send({ image: "This is an example image" });
// });

app.post("/latest", (req, res) => {
  let after = req.body.after;
  const latestImages = [];
  let timestamp = 0;

  uploaded_files.forEach((image) => {
    const { mtimeMs } = fs.statSync(path + "/" + image);
    if (mtimeMs > after) {
      timestamp = mtimeMs > timestamp ? mtimeMs : timestamp;
      latestImages.push(image);
    }
  });
  res.send({ images: latestImages, timestamp: timestamp });
});

app.use(express.static("./public"));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));
