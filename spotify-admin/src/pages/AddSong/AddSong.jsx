import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { url } from "../../App";
import { toast } from "react-toastify";
import axios from "axios";

const AddSong = () => {
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !desc || !song || !image) {
      toast.warning("Please fill all fields and upload files.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("audio", song);
      formData.append("album", album);

      const response = await axios.post(`${url}/api/song/add`, formData);
      if (response.data.success) {
        toast.success("Song Added Successfully");
        resetForm();
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Error occurred while adding song.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumData(response.data.albums || []);
    } catch (error) {
      console.error("Error loading album data:", error);
      toast.error("Failed to load albums.");
    }
  };

  const resetForm = () => {
    setName("");
    setDesc("");
    setAlbum("none");
    setImage(null);
    setSong(null);
  };

  useEffect(() => {
    loadAlbumData();
  }, []);

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      <div className="flex gap-8">
        {/* Upload Song */}
        <div className="flex flex-col gap-4">
          <p>Upload Song</p>
          <input
            onChange={(e) => setSong(e.target.files[0])}
            type="file"
            id="song"
            accept="audio/*"
            hidden
          />
          <label htmlFor="song">
            <img
              className="w-24 cursor-pointer"
              src={song ? assets.upload_added : assets.upload_song}
              alt="Upload Song"
            />
          </label>
        </div>

        {/* Upload Image */}
        <div className="flex flex-col gap-4">
          <p>Upload Image</p>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              className="w-24 cursor-pointer"
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload Image"
            />
          </label>
        </div>
      </div>

      {/* Song Name */}
      <div className="flex flex-col gap-2.5">
        <p>Song Name</p>
        <input
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Song Description */}
      <div className="flex flex-col gap-2.5">
        <p>Song Description</p>
        <input
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Album Selection */}
      <div className="flex flex-col gap-2.5">
        <p>Album</p>
        <select
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]"
          onChange={(e) => setAlbum(e.target.value)}
          value={album}
        >
          <option value="none">None</option>
          {albumData.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding..." : "ADD"}
      </button>
    </form>
  );
};

export default AddSong;
