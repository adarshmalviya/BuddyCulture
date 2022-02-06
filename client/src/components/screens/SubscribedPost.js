import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./../../App";
import { Link } from "react-router-dom";

const SubscribedPost = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        fetch("/getsubpost", {
            headers: {
                "x-auth-token": localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setData(result.posts);
            });
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
                console.log("AFTER DELETE RESULT->", result);

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
            {data.map((item) => {
                return (
                    <div key={item._id} className="card home-card">
                        <h5>
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
                            <img className="home-card-img" src={item.photo} alt="home-img" />
                        </div>
                        <div className="home-card-content">
                            <i className="material-icons btn-like">favorite</i>
                            {item.likes.includes(state._id) ? (
                                <i
                                    className="material-icons thumb"
                                    onClick={() => unlikePost(item._id)}
                                >
                                    thumb_down
                                </i>
                            ) : (
                                <i
                                    className="material-icons thumb"
                                    onClick={() => likePost(item._id)}
                                >
                                    thumb_up
                                </i>
                            )}

                            <h6 className="home-card-content">{item.likes.length} likes</h6>
                            <h6 className="home-card-content">{item.title}</h6>
                            <p className="home-card-content">{item.body}</p>
                            <div className="comment-box">
                                {item.comments.map((record) => {
                                    return (
                                        <h6 key={record._id}>
                                            <span
                                                style={{ "fontFamily": "Supermercado One, cursive" }}
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
                                })}

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        commentPost(e.target[0].value, item._id);
                                        e.target[0].value = "";
                                    }}
                                >
                                    <input
                                        className="home-card-content"
                                        type="text"
                                        placeholder="Drop your comment"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SubscribedPost;
