import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loding, setLoding] = useState(false)

  useEffect(() => {
    if (url) {
      // Uploading Image url to server
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ title, body, pic: url }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(`${data.error}`, { position: "top-center" })
          } else {
            toast.success("Posted Successfully", { position: "top-center", autoClose: 3000 })
            setTimeout(() => {
              navigate('/');
            }, 3000)
          }
          setLoding(false)
        })
        .catch((err) => {
          console.log("Something went wrong!", err);
          setLoding(false)
        });
    }
  }, [url]);

  const postDetails = () => {
    if (!title || !body) {
      return toast.error("Please fill all the details", { position: "top-center" })
    }
    if (!image) {
      return toast.error("Please upload an image", { position: "top-center" })
    }
    if (image.type.substring(0, 5) != "image") { return toast.error(`Please upload image found an ${image.type.substring(0, 5)} file!`, { position: "top-center" }) }

    if (image.size > 9999999) {
      toast.error("Image size should be less then 10MB", { position: "top-center" })
      return
    }
    setLoding(true)
    // Uploading Image to cloud
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");

    fetch("https://api.cloudinary.com/v1_1/adarsh-cloud/image/upload/", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log("Error->", err);
        setLoding(false)
      })
      .catch((err) => {
        console.log("Error->", err);
        setLoding(false)
      });
  };

  return (
    <div className="background">
      <ToastContainer />
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>

      <div className="card input-field createPost">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="file-field input-field">
          <div className="btn blue">
            <span>Upload Image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn btn-login blue"
          onClick={() => postDetails()}
        >
          {loding && <i className="fas fa-sync fa-spin"></i>}
          {loding && <span>Please Wait</span>}
          {!loding && <span>Post</span>}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
