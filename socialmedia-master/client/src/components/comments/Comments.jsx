import { useContext, useState, useEffect } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data, refetch } = useQuery(
    { queryKey: ["comments", { postId }], queryFn: () => makeRequest.get("/comments?postId=" + postId).then((res) => res.data) }
  );
  
  console.log(postId);

  const queryClient = useQueryClient();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await makeRequest.post("/comments", { desc, postId });
      setDesc("");
      // Invalidate and refetch
      queryClient.invalidateQueries(["comments", postId]);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  useEffect(() => {
    // Refetch comments when postId changes
    refetch();
  }, [postId, refetch]);

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading"
        : data.map((comment) => (
            <div className="comment" key={comment.id}>
              <img src={"/upload/" + comment.profilePic} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
