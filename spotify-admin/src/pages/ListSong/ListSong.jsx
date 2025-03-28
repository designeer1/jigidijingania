import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../App';
import { toast } from 'react-toastify';
import { FaTrash } from "react-icons/fa";

const ListSong = () => {
  const [data, setData] = useState([]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      if (response.data.success) {
        setData(response.data.songs);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch songs.");
    }
  };

  const removeSong = async (id) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;

    try {
      const response = await axios.post(`${url}/api/song/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSongs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete song.");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">All Songs List</h2>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100 font-semibold">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5">
            <img className="w-12 rounded-md" src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.album}</p>
            <p>{item.duration}</p>
            <FaTrash className="text-red-500 cursor-pointer hover:text-red-700" onClick={() => removeSong(item._id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSong;
