import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import friends_home_page from "../../images/friends_home_page.png";
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loding, setLoding] = useState(false)

  const PostData = async () => {
    setLoding(true)

    fetch("/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(`${data.error}`, { position: "top-center" })
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          navigate("/");
        }
        setLoding(false)
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
        setLoding(false)
      });

  };

  return (
    <div className="home-page">

      <ToastContainer />

      <div className="mycard">
        <div className="card auth-card">
          <h2 className="brand-logo-home">BuddyCulture</h2>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn btn-login blue loginBtn"
            onClick={() => PostData()}
          >
            {loding && <i class="fas fa-sync fa-spin"></i>}
            {loding && <span>Please Wait</span>}
            {!loding && <span>Login</span>}
          </button>
          {/* <div className="redirect">
          Don't have an account? <Link to="/signup">Signup</Link>
        </div> */}
          <div className="redirect">
            Forget Password ? Click <Link to="/reset">here</Link>
          </div>
        </div>
      </div>
      <img
        className="friends_home_page"
        src={friends_home_page}
        alt="home-page-img"
      />
    </div>
  );
};

export default Login;
