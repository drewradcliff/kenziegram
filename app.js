const express = require("express");
const fs = require("fs");
const multer = require("multer");

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

app.get("/", (req, res) => {
  const path = "./public/uploads";
  fs.readdir(path, (err, items) => {
    const images = items.map((image) => {
      return `<img style="height:100px" src="./uploads/${image}" />`;
    });
    res.send(`
      <h1>Welcome to Kenziegram!</h1>
      ${images}
      <form
      action="/upload"
      method="POST"
      enctype="multipart/form-data"
    >
      <input type="file" name="myFile" />
      <button type="submit">Upload</button>
    </form>
    `);
  });
});

app.post("/upload", upload.single("myFile"), function (
  request,
  response,
  next
) {
  uploaded_files.push(request.file.filename);
  response.send(`
    <h1>Uploaded file!</h1>
    <a href="/">Back Home</a>
  `);
});

app.use(express.static("./public"));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));
