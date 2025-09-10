const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// simpan file di folder "uploads"
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// endpoint upload
app.post("/upload", upload.single("file"), (req, res) => {
  const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, name: req.file.originalname });
});

// buat folder uploads bisa diakses
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
