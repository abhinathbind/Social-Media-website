import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => makeRequest.get("/posts?userId=" + userId).then((res) => res.data),
  });

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data && Array.isArray(data)
        ? data.map((post) => <Post post={post} key={post.id} />)
        : "No posts available"}
    </div>
  );
};

export default Posts;
