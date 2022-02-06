import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const NewPassword = () => {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const { token } = useParams()
    const [loding, setLoding] = useState(false)


    const PostData = () => {
        setLoding(true)

        fetch("http://localhost:5000/new-password", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, token })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    toast.error(`${data.error}`, { position: "top-center" })
                }
                else {
                    toast.success(`${data.message}`, { position: "top-center", autoClose: 3000 })
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000)
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
                <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn btn-login blue loginBtn" onClick={() => PostData()}>
                    {loding && <i className="fas fa-sync fa-spin"></i>}
                    {loding && <span>Please Wait</span>}
                    {!loding && <span>Change Password</span>}
                </button>
            </div>
        </div>
        // <div className="mycard">
        //     <div className="card auth-card">
        //         <h2 className="brand-logo">Instagram</h2>
        //         <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
        //         <button className="btn waves-effect waves-light btn-login blue loginBtn" onClick={() => PostData()}>
        //             Change Password
        //         </button>
        //     </div>
        // </div>
    );
};

export default NewPassword;