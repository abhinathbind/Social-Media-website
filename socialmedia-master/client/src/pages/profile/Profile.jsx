import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);// frontend kr url deta hai

  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ["relationship"],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const handleFollow = async () => {
    try {
      const following = relationshipData?.includes(currentUser.id);

      if (following) {
        await makeRequest.delete("/relationships?userId=" + userId);
      } else {
        await makeRequest.post("/relationships", { userId });
      }

      // Invalidate and refetch
      queryClient.invalidateQueries(["relationship"]);
    } catch (error) {
      // Handle error, if needed
      console.error("Error in handleFollow:", error);
    }
  };


  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          {data &&
            <div className="images">
              <img src={"/upload/" + data.coverPic} alt="" className="cover" />
              <img src={"/upload/" + data.profilePic} alt="" className="profilePic" />
            </div>
          }
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              {data &&
                <div className="center">
                  <span>{data.name}</span>
                  <div className="info">
                    <div className="item">
                      <PlaceIcon />
                      <span>{data.city}</span>
                    </div>
                    <div className="item">
                      <LanguageIcon />
                      <span>{data.website}</span>
                    </div>
                  </div>
                  {rIsLoading ? (
                    "loading"
                  ) : userId === currentUser.id ? (
                    <button onClick={() => setOpenUpdate(true)}>update</button>
                  ) : (
                    <button onClick={handleFollow}>
                      {relationshipData.includes(currentUser.id)
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}

                </div>
              }
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
