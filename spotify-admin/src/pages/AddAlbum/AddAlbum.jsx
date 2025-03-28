import { useState } from "react";
import axios from "axios";

const AddAlbum = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [colour, setColour] = useState("#000000");
  const [image, setImage] = useState(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      console.error("No image selected!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("colour", colour);
    formData.append("image", image); // Ensure this is a valid file

    console.log("Form Data:", Object.fromEntries(formData.entries())); // Debugging

    try {
      const response = await axios.post("http://localhost:5000/api/album/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload Success:", response.data);
      alert("Album added successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  return (
    <div>
      <h2>Add Album</h2>
      <form onSubmit={onSubmitHandler}>
        <input type="text" placeholder="Album Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} required />
        <input type="color" value={colour} onChange={(e) => setColour(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit">Add Album</button>
      </form>
    </div>
  );
};

export default AddAlbum;
