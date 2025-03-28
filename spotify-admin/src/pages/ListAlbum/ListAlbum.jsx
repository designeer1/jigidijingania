import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../App";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const ListAlbum = () => {
  const [data, setData] = useState([]);

  // Fetch albums from backend
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success && Array.isArray(response.data.albums)) {
        setData(response.data.albums);
      } else {
        toast.error("Failed to fetch albums.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching albums.");
    }
  };

  // Delete album by ID
  const removeAlbum = async (id) => {
    if (!id) {
      toast.error("Invalid album ID.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this album?")) return;

    try {
      const response = await axios.delete(`${url}/api/album/remove/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        setData((prevData) => prevData.filter((album) => album._id !== id)); // Update UI instantly
      } else {
        toast.error(response.data.message || "Failed to delete album.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting album.");
    }
  };

  // Fetch albums on component mount
  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">All Albums List</h2>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100 font-semibold">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Colour</b>
          <b>Action</b>
        </div>
        {data.length === 0 ? (
          <p className="text-gray-500 p-3">No albums found.</p>
        ) : (
          data.map((item) => (
            <div
              key={item._id || item.id} // Ensure unique key
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
            >
              <img className="w-12 rounded-md" src={item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.desc}</p>
              <input type="color" value={item.bgColour} readOnly className="cursor-pointer" />
              <FaTrash
                className="text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => {
                  console.log("Deleting album ID:", item._id || item.id); // Debugging
                  removeAlbum(item._id || item.id);
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListAlbum;
