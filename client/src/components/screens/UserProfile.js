import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./../../App";
import { useParams, Link } from "react-router-dom";

const OtherUserProfile = () => {
  const [userProfile, setuserProfile] = useState();
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`/profile/${userid}`, {
      method: "get",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setuserProfile(result);
      })
      .catch((err) => {
        console.log("Error->", err);
      })
      .catch((err) => {
        console.log("Error->", err);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setuserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setuserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <div>
      {!userProfile ? null : (
        <div className="userProfile">
          <div className="profile">
            <div className="profile-img">
              <img
                className="profile-img"
                src={userProfile.user.dp}
                alt="dp-profile"
              />
            </div>
            <div className="profile-info">
              <h4>{userProfile ? userProfile.user.name : "Loading..."}</h4>
              <div className="profile-data">
                <div className="profile-ffl-data">
                  <h6 className="user-data-text">{userProfile.posts.length} Posts</h6>
                  <h6 className="user-data-text">{userProfile.user.followers.length} Followers</h6>
                  <h6 className="user-data-text">{userProfile.user.following.length} Following</h6>
                </div>
              </div>
              <div className="follow-unfollow">
                {showfollow ? (
                  <button
                    className="btn btn-sm btn-follow-unfollow blue"
                    onClick={() => followUser()}
                  >
                    <span className="user-data-text">Follow</span>
                  </button>
                ) : (
                  <button
                    className="btn btn-follow-unfollow blue"
                    onClick={() => unfollowUser()}
                  >
                    <span className="user-data-text">UnFollow</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <Link to={`/post/${item._id}`} userdata={item}>
                  <img
                    key={item._id}
                    className="gallery-img"
                    src={item.photo}
                    alt={item.title}
                    style={{ cursor: "pointer" }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherUserProfile;
