import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import PostForm from "../components/PostForm";
import VideoPost from "../components/VideoPost";

const MainFeed = () => {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let q;
      if (lastDoc) {
        q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(20)
        );
      } else {
        q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
      }

      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts((prev) => [...prev, ...newPosts]);

      if (snapshot.docs.length < 20) {
        setHasMore(false);
      } else {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
    setLoading(false);
  };

  // Infinite scrolling logic
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !loading &&
      hasMore
    ) {
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Post creation form */}
      <div className="sticky top-0 bg-white p-4 shadow">
        <PostForm refreshPosts={fetchPosts} />
      </div>

      {/* Posts feed */}
      <div className="p-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow p-4 mb-4">
            <h2 className="text-lg font-bold">
              {post.title || "Untitled Post"}
            </h2>
            <p>{post.content}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="" className="w-full my-2" />
            )}
            {post.videoUrl && <VideoPost src={post.videoUrl} />}
          </div>
        ))}
        {loading && (
          <p className="text-center text-gray-500">Loading more posts...</p>
        )}
        {!hasMore && (
          <p className="text-center text-gray-500">No more posts to display.</p>
        )}
      </div>
    </div>
  );
};

export default MainFeed;
