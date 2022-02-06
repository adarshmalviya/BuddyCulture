import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import friends_home_page from "../../images/friends_home_page.png";
import { ToastContainer, toast } from 'react-toastify';


const Signup = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loding, setLoding] = useState(false)

    const PostData = () => {
        setLoding(true)

        fetch("http://localhost:5000/signup", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password, email })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    toast.error(`${data.error}`, { position: "top-center" })
                }
                else {
                    toast.success("Registered Successfully!", { position: "top-center" })
                    setTimeout(() => { navigate('/login'); }, 3000)
                }
                setLoding(false)
            })
            .catch(err => {
                console.log("Something went wrong!", err)
                setLoding(false)
            })
    }

    return (
        <div className="home-page">
            <ToastContainer />
            <div className="mycard">
                <div className="card auth-card">
                    <h2 className="brand-logo-home">BuddyCulture</h2>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="btn btn-login blue" onClick={() => PostData()}>
                        {loding && <i class="fas fa-sync fa-spin"></i>}
                        {loding && <span>Please Wait</span>}
                        {!loding && <span>SignUp</span>}

                    </button>
                    <div className="redirect">
                        Already have an account? <Link to="/login">Login</Link>
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

export default Signup;