import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';

const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body;
        const audioFile = req.files?.audio?.[0];
        const imageFile = req.files?.image?.[0];

        if (!audioFile || !imageFile) {
            return res.status(400).json({ success: false, message: "Audio and Image files are required" });
        }

        // Uploading files to Cloudinary
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        };

        const song = new songModel(songData);
        await song.save();

        return res.json({ success: true, message: "Song Added Successfully", song });

    } catch (error) {
        console.error("Error in addSong:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({});
        if (!allSongs.length) {
            return res.json({ success: true, message: "No songs available", songs: [] });
        }
        return res.json({ success: true, songs: allSongs });
    } catch (error) {
        console.error("Error in listSong:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const removeSong = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Song ID is required" });
        }

        const deletedSong = await songModel.findByIdAndDelete(id);

        if (!deletedSong) {
            return res.status(404).json({ success: false, message: "Song not found" });
        }

        return res.json({ success: true, message: "Song Removed Successfully" });

    } catch (error) {
        console.error("Error in removeSong:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export { addSong, listSong, removeSong };
