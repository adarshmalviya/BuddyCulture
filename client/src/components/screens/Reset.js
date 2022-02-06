import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Reset = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loding, setLoding] = useState(false)

    const PostData = () => {
        setLoding(true)

        fetch("/reset-password", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    toast.error(`${data.error}`, { position: "top-center" })
                }
                else {
                    toast.success(`${data.message}`, { position: "top-center" })
                    setTimeout(() => {
                        navigate('/login');
                    }, 5000)
                }
                setLoding(false)
            })
            .catch(err => {
                console.log("Something went wrong!", err)
                setLoding(false)
            })
    }


    return (
        <div className="mycard background">
            <ToastContainer />
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="card auth-card reset-card">
                <h2 className="brand-logo-home">BuddyCulture</h2>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="btn btn-login blue loginBtn" onClick={() => PostData()}>
                    {loding && <i class="fas fa-sync fa-spin"></i>}
                    {loding && <span>Please Wait</span>}
                    {!loding && <span>Reset Password</span>}

                </button>
            </div>
        </div>
    );
};

export default Reset;