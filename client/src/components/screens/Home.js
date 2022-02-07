import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./../../App";
import { Link } from "react-router-dom";
import send_img from "../../images/send_img.svg";
const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      })
      .catch((error) => console.log("Error->", error))
      .catch((error) => console.log("Error->", error));
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const commentPost = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((ele) => {
          if (ele._id == postId) {
            ele.comments = result;
          }
          return ele;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  return (
    <div className="home">
      <div className="home-items">
        {data.map((item) => {
          return (
            <div key={item._id} className="card home-card">
              <h5>
                <img src={item.postedBy.dp} alt="dp" className="user-dp" />
                <Link
                  className="postedByName"
                  to={
                    item.postedBy._id != state._id
                      ? "/profile/" + item.postedBy._id
                      : "/profile"
                  }
                >
                  {item.postedBy.name}
                </Link>
                {item.postedBy._id == state._id ? (
                  <i
                    className="material-icons delete-icon"
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                ) : null}
              </h5>
              <div className="home-card-img">
                <img
                  className="home-card-img"
                  src={item.photo}
                  alt="home-img"
                />
              </div>
              <div className="home-card-content">
                <div className="like-content">
                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons btn-liked"
                      onClick={() => unlikePost(item._id)}
                    >
                      favorite
                    </i>
                  ) : (
                    <i
                      className="material-icons btn-unliked"
                      onClick={() => likePost(item._id)}
                    >
                      favorite_border
                    </i>
                  )}

                  <h6 className="home-card-content">
                    {item.likes.length} likes
                  </h6>
                </div>

                <h6 className="home-card-content">{item.title}</h6>
                <p className="home-card-content">{item.body}</p>
                <div className="comment-box">
                  {item.comments.length > 2 ?
                  <React.Fragment>
                      <h6 key={item.comments[0]._id}>
                        <img
                          src={item.comments[0].postedBy.dp}
                          alt="dp"
                          className="comment-user-dp"
                        />
                        <span
                          style={{ fontFamily: "Supermercado One, cursive" }}
                        >
                          {item.comments[0].postedBy.name}
                        </span>{" "}
                        {item.comments[0].text}
                        {item.comments[0].postedBy._id == state._id ? (
                          <i
                            className="material-icons comment-clear"
                            onClick={() => deleteComment(item._id, item.comments[0]._id)}
                          >
                            clear
                          </i>
                        ) : null}
                      </h6>
                      <h6 key={item.comments[1]._id}>
                        <img
                          src={item.comments[1].postedBy.dp}
                          alt="dp"
                          className="comment-user-dp"
                        />
                        <span
                          style={{ fontFamily: "Supermercado One, cursive" }}
                        >
                          {item.comments[1].postedBy.name}
                        </span>{" "}
                        {item.comments[1].text}
                        {item.comments[1].postedBy._id == state._id ? (
                          <i
                            className="material-icons comment-clear"
                            onClick={() => deleteComment(item._id, item.comments[1]._id)}
                          >
                            clear
                          </i>
                        ) : null}
                      </h6>
                      <Link to={`/post/${item._id}`} className='more_comment'>View all {item.comments.length} comments</Link>
                    </React.Fragment>
                    :
                    item.comments.map((record) => {
                      return (
                        <h6 key={record._id}>
                          <img
                            src={record.postedBy.dp}
                            alt="dp"
                            className="comment-user-dp"
                          />
                          <span
                            style={{ fontFamily: "Supermercado One, cursive" }}
                          >
                            {record.postedBy.name}
                          </span>{" "}
                          {record.text}
                          {record.postedBy._id == state._id ? (
                            <i
                              className="material-icons comment-clear"
                              onClick={() => deleteComment(item._id, record._id)}
                            >
                              clear
                            </i>
                          ) : null}
                        </h6>
                      );
                    }
                    )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      commentPost(e.target[0].value, item._id);
                      e.target[0].value = "";
                    }}
                  >
                    <div className="comment-section">
                      <input
                        className="home-card-content"
                        type="text"
                        placeholder="Drop your comment"
                      />
                      <button type="submit" className="send-submit-btn">
                        <img
                          src={send_img}
                          alt="send_img"
                          className="send_img"
                        />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
