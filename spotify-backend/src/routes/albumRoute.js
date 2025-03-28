import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const router = express.Router();

// Multer storage setup (Memory Storage for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Dummy database for storing albums (Replace with actual DB)
let albums = [];

// Upload to Cloudinary function
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "albums" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Add Album Route
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const newAlbum = {
      id: albums.length + 1, // Assign an ID (Replace with DB ID)
      name: req.body.name,
      desc: req.body.desc,
      colour: req.body.colour,
      imageUrl: imageUrl, // Cloudinary URL
    };

    albums.push(newAlbum);
    console.log("Album Data:", newAlbum);
    res.status(201).json({ success: true, message: "Album added successfully!", data: newAlbum });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Fetch All Albums (GET /list)
router.get("/list", (req, res) => {
  try {
    res.status(200).json({ success: true, albums });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Delete Album by ID (DELETE /remove/:id)
router.delete("/remove/:id", (req, res) => {
  try {
    const albumId = parseInt(req.params.id);

    // Check if album exists
    const albumIndex = albums.findIndex((album) => album.id === albumId);
    if (albumIndex === -1) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    // Remove the album from the array
    albums.splice(albumIndex, 1);

    res.status(200).json({ success: true, message: "Album deleted successfully", albums });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
