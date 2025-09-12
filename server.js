const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Simpan file di folder "uploads"
  const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png/;
      const ext = path.extname(file.originalname).toLowerCase();
      const mime = allowedTypes.test(file.mimetype);
      const validExt = allowedTypes.test(ext);
      if (mime && validExt) {
        cb(null, true);  // file diterima
      } else {
        cb(new Error("Hanya file gambar (.png, .jpg, .jpeg) yang diperbolehkan")); // tolak file lain
      }
    }
  });
// ------------------- ROUTE ------------------- //

// Root route untuk test
app.get("/", (req, res) => {
  res.send("🚀 Backend is running! Use /upload or /files");
});   

// Endpoint upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Tidak ada file yang diupload" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.json({
    url: fileUrl,
    name: req.file.originalname,
  });
});

// Endpoint list semua file
app.get("/files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Gagal membaca folder uploads" });
    }

    const fileList = files.map(f => ({
      name: f,
      url: `${req.protocol}://${req.get("host")}/uploads/${f}`,
    }));

    res.json(fileList);
  });
});

// Folder uploads bisa diakses
app.use("/uploads", express.static(uploadDir));

// Jalankan server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running at http://0.0.0.0:${PORT}`);
});
