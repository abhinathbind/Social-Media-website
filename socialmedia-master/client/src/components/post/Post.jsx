// import "./post.scss";
// import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
// import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
// import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
// import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import { Link } from "react-router-dom";
// import Comments from "../comments/Comments";
// import { useState } from "react";
// import moment from "moment";
// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import { makeRequest } from "../../axios";
// import { useContext } from "react";
// import { AuthContext } from "../../context/authContext";
// const Post = ({ post }) => {
//   const [commentOpen, setCommentOpen] = useState(false);
//   const { currentUser } = useContext(AuthContext);

  
//   const { isLoading, error, data } = useQuery({
//     queryKey: ["likes", post.id],
//     queryFn: () => makeRequest.get("/likes?postId=" + post.id).then((res) => res.data),
//   });
//   const queryClient = useQueryClient();

//   const handleLike = async () => {
//     try {
//       if (data.includes(currentUser.id)) {
//         await makeRequest.delete("/likes?postId=" + post.id);
//       } else {
//         await makeRequest.post("/likes", { postId: post.id });
//       }

//       // Invalidate and refetch
//       queryClient.invalidateQueries(["likes"]);
//     } catch (error) {
//       console.error("Error toggling like:", error);
//     }
//   };
//   console.log(data)
// //  console.log(currentUser)
//   return (
//     <div className="post">
//       <div className="container">
//         <div className="user">
//           <div className="userInfo">
//             <img src={post.profilePic} alt="" />
//             <div className="details">
//               <Link
//                 to={`/profile/${post.userId}`}
//                 style={{ textDecoration: "none", color: "inherit" }}
//               >
//                 <span className="name">{post.name}</span>
//               </Link>
//               <span className="date">{moment(post.createdAt).fromNow()}</span>
//             </div>
//           </div>
//           <MoreHorizIcon />
//         </div>
//         <div className="content">
//           <p>{post.desc}</p>
//           <img src={"./upload/"+post.img} alt="" />
//         </div>
//         <div className="info">
          
//         {data && 
//         <div className="item">
//            {data.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike}/> : 
//            <FavoriteBorderOutlinedIcon onClick={handleLike}/>}
//           {data.length} Likes</div>
//         }
//           <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
//             <TextsmsOutlinedIcon />
//             12 Comments
//           </div>
//           <div className="item">
//             <ShareOutlinedIcon />
//             Share
//           </div>
//         </div>
//         {commentOpen && <Comments />}
//       </div>
//     </div>
//   );
// };

// export default Post;
import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

const query = useQuery({
  queryKey: ["likes", post.id],
  queryFn: () => makeRequest.get("/likes?postId=" + post.id).then((res) => res.data),
});

const { data, isLoading, error } = query;

const queryClient = useQueryClient();

const handleLike = async () => {
  try {
    if (data.includes(currentUser.id)) {
      await makeRequest.delete("/likes?postId=" + post.id);
    } else {
      await makeRequest.post("/likes", { postId: post.id });
    }

    // Invalidate and refetch
    queryClient.invalidateQueries(["likes"]);
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

const handleDelete = async () => {
  try {
    await makeRequest.delete("/posts/" + post.id);

    // Invalidate and refetch
    queryClient.invalidateQueries(["posts"]);
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};


  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/"+post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"/upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;