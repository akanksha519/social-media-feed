import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const PostForm = ({ refreshPosts }) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...imageUrls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && images.length === 0 && !videoUrl) {
      alert("Please provide content for the post.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        text,
        images,
        videoUrl,
        createdAt: serverTimestamp(),
      });

      setText("");
      setImages([]);
      setVideoUrl("");
      refreshPosts(); // Refresh the feed
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-md">
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="mb-2"
      />
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="preview"
              className="h-20 w-20 object-cover"
            />
          ))}
        </div>
      )}
      <input
        type="url"
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mt-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default PostForm;
