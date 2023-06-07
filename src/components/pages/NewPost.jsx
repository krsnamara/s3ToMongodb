import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");

  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      await axios.post("http://localhost:8080/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      window.alert("New Post has been successfully created");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form
        onSubmit={submit}
        style={{ width: 650 }}
        className="flex flex-col space-y-5 px-5 py-14"
      >
        <input
          onChange={fileSelected}
          type="file"
          accept="image/*"
          className="border-2 border-gray-200 rounded-md p-2"
        ></input>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          type="text"
          placeholder="Caption"
          className="border-2 border-gray-200 rounded-md p-2"
        ></input>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
