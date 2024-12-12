import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  useEffect(() => {
    fetchPosts();
  }, []);

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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="p-4">
      {posts.map((post) => return(
        <div key={post.id} className="bg-white shadow p-4 mb-4">
        <h2 className="text-lg font-bold">{post.title}</h2>
        <p>{post.content}</p>
        {post.imageUrl && <img src={post.imageUrl} alt="" className="w-full" />}
        {post.videoUrl && <VideoPost src={post.videoUrl} />}
        <Share url={`https://your-app.com/posts/${post.id}`} />
      </div>
      ))}
      {loading && <p>Loading more posts...</p>}
      {!hasMore && <p>No more posts to display.</p>}
    </div>
  );
};

export default Feed;
