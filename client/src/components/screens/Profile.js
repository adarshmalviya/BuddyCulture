import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./../../App";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


const Profile = () => {
  const [mypics, setPics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const [url, setUrl] = useState(state ? state.dp : undefined);
  const [loding, setLoding] = useState(false)

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        "x-auth-token": localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      })
      .catch((error) => console.log("Error->", error))
      .catch((error) => console.log("Error->", error));
  }, []);

  useEffect(() => {
    if (url) {
      // Uploading Image url to server
      fetch("/dpupdate", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ dp: url }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(`${data.error}`, { position: "top-center" });
          }
          setLoding(false)
        })
        .catch((err) => {
          console.log("Something went wrong!", err);
          setLoding(false)
        });
    }
  }, [url]);

  const handleClose = () => {
    setShowModal(false);
  };

  const postDetails = () => {
    if (!image) {
      return toast.error("Please upload an image", { position: "top-center" })
    }
    if (image.type.substring(0, 5) != "image") { return toast.error(`Please upload image found an ${image.type.substring(0, 5)} file!`, { position: "top-center" }) }

    if (image.size > 9999999) {
      toast.error("Image size should be less then 10MB", { position: "top-center" })
      return
    }
    setLoding(true)

    setShowModal(false);
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
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, dp: data.url })
        );
        dispatch({ type: "UPDATEDP", payload: data.url });
      })
      .catch((err) => {
        console.log("Error->", err);
        setLoding(false)
      });
  };

  function getModal() {
    return (
      <Modal
        // {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
        onHide={() => handleClose()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="file-field input-field">
            <div className="btn blue">
              <span>Upload Image</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => postDetails()}>
            {loding && <i className="fas fa-sync fa-spin"></i>}
            {loding && <span>Please Wait</span>}
            {!loding && <span>Save Changes</span>}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      {getModal()}
      <div className="userProfile">
        <div className="profile">
          <div className="profile-img">
            <img
              className="profile-img"
              src={url}
              alt="user-dp"
              title="Change Photo"
              onClick={() => setShowModal(true)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="profile-info profile-info-me">
            <h4>{state ? state.name : "Loading..."}</h4>
            <div className="profile-data profile-data-me">
              <h6>{mypics.length} Posts</h6>
              <h6>{state ? state.followers.length : "0"} Followers</h6>
              <h6>{state ? state.following.length : "0"} Following</h6>
            </div>
          </div>
        </div>

        <div className="gallery">
          {mypics.map((item) => {
            return (
              <Link to={`/post/${item._id}`} userdata={item}>
                <img
                  key={item._id}
                  className="gallery-img"
                  src={item.photo}
                  alt={item.title}
                  style={{ "cursor": "pointer" }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Profile;
