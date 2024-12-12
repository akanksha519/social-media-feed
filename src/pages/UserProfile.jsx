import { useEffect, useState } from "react";
import { useAuth } from "../contexts/UserAuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const UserProfile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const userPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error.message);
      }
    };

    if (user) fetchUserPosts();
  }, [user]);

  return (
    <div className="p-4">
      <div className="bg-gray-100 p-4 rounded mb-4">
        <img
          src={user?.photoURL || "/default-profile.png"}
          alt="Profile"
          className="w-16 h-16 rounded-full mb-2"
        />
        <h2 className="text-xl font-bold">{user?.displayName || "User"}</h2>
        <p>{user?.email}</p>
      </div>
      <h3 className="text-lg font-bold mb-2">My Posts</h3>
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow p-4 mb-4">
          <p>{post.content}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt="" className="w-full" />
          )}
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
