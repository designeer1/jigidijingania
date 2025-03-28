import albumModel from '../models/albumModel.js';
import { v2 as cloudinary } from 'cloudinary';
impo

// ✅ Add Album
export const addAlbum = async (req, res) => {
  try {
    console.log("Received Request:", req.body);
    console.log("Received File:", req.file);
    
    const { name, desc, bgColour } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });

    // Save album data
    const album = new albumModel({
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
    });

    await album.save();

    res.json({ success: true, message: "Album Added Successfully!" });
  } catch (error) {
    console.error("Error in addAlbum:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ✅ List All Albums
export const listAlbum = async (req, res) => {
  try {
    const albums = await albumModel.find(); // Fetch all albums from DB
    res.json({ success: true, data: albums });
  } catch (error) {
    console.error("Error in listAlbum:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Remove Album
export const removeAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAlbum = await albumModel.findByIdAndDelete(id);
    
    if (!deletedAlbum) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    res.json({ success: true, message: "Album Deleted Successfully!" });
  } catch (error) {
    console.error("Error in removeAlbum:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
