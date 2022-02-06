import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import OtherUserProfile from "./components/screens/UserProfile";
import Home from "./components/screens/Home";
import SubscribedPost from "./components/screens/SubscribedPost"
import CreatePost from "./components/screens/CreatePost";
import NewPassword from "./components/screens/NewPassword";
import Reset from "./components/screens/Reset";
import UserPost from "./components/screens/UserPost";
import { reducer, initialState } from "./reducers/userReducer"
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';

export const UserContext = createContext()

const Routing = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: "USER", payload: user })
      navigate('/')
    } else {
      if (!window.location.pathname.startsWith('/reset')) {
        navigate('/login')
      }
    }
  }, [])
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/profile/:userid" element={< OtherUserProfile />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path='/create' element={<CreatePost />}></Route>
      <Route path='/reset/:token' element={<NewPassword />}></Route>
      <Route path='/reset' exact element={<Reset />}></Route>
      <Route path='/subscribedPost' element={<SubscribedPost />}></Route>
      <Route path='/post/:id' element={<UserPost />}></Route>
      <Route exact path="/" element={<Home />}></Route>
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
