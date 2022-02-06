import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./../App";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Offcanvas,
  FormControl,
  Button,
  Modal,
  ListGroup
} from "react-bootstrap";
import friends_logo from "../images/friends_logo.png";
import login_img from "../images/login_img.svg";
import signup_img from "../images/signup_img.svg";
import profile_img from "../images/profile_img.svg";
import create_post_img from "../images/post_img.svg";
import following_post_img from "../images/following_post_img.svg";
import logout_img from "../images/logout_img.svg";
import home_img from "../images/home_img.svg";
import search_img from "../images/search_img.svg";

const NavbarComponent = () => {
  const { state, dispatch } = useContext(UserContext);
  const [expandedNav, setExpandedNav] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("")
  const [userDetails, setUserDetails] = useState([])

  const renderList = () => {
    if (state) {
      return [
        <li className="navbar-list" key="home">
          <Link className="navbar-text" to="/">
            <img src={home_img} alt="home_img" />
            Home
          </Link>
        </li>,
        <li className="navbar-list" key="profile">
          <Link className="navbar-text" to="/profile">
            <img src={profile_img} alt="profile_img" />
            Profile
          </Link>
        </li>,
        <li className="navbar-list" key="find">
          <Link className="navbar-text" to="/" onClick={() => setShowModal(true)}>
            <img src={search_img} alt="search_img" />
            Find Friend
          </Link>
        </li>,
        <li className="navbar-list" key="create">
          <Link className="navbar-text" to="/create">
            <img src={create_post_img} alt="create_post_img" />
            Create Post
          </Link>
        </li>,
        <li className="navbar-list" key="subscribePost">
          <Link className="navbar-text" to="/subscribedPost">
            <img src={following_post_img} alt="following_post_img" />
            My Following Post
          </Link>
        </li>,
        <li className="navbar-list" key="logout">
          <Link
            className="navbar-text"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
            }}
            to="/login"
          >
            <img src={logout_img} alt="logout_img" />
            Logout
          </Link>
        </li>,
      ];
    } else {
      return [
        <li className="navbar-list" key="login">
          <Link className="navbar-text unauth unauth-login" to="/login">
            <img className="navbar-unauth-img" src={login_img} alt="login_img" />
            Login
          </Link>
        </li>,
        <li className="navbar-list" key="signup">
          <Link className="navbar-text unauth unauth-signup" to="/signup">
            <img className="navbar-unauth-img" src={signup_img} alt="signup_img" />
            Signup
          </Link>
        </li>,
      ];
    }
  };
  const fetchUser = (query) => {
    setSearch(query);
    fetch('/search-users', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(results => { setUserDetails(results.user) })
  }

  const handleClose = () => {
    setShowModal(false);
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
          <Modal.Title>Find Friend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search Name"
              className="me-2"
              aria-label="Search"
              value={search}
              onChange={(e) => fetchUser(e.target.value)}
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <ListGroup>
            {userDetails.map(item => {
              return (<ListGroup.Item>

                <Link
                  className="postedByName"
                  onClick={() => handleClose()}
                  to={
                    item._id != state._id
                      ? "/profile/" + item._id
                      : "/profile"
                  }
                >
                  {item.name}

                </Link>
              </ListGroup.Item>)
            })}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
    );
  }
  function clearplusexit() {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    setExpandedNav(false);
  }
  return (
    <React.Fragment>
      {getModal()}
      {!state ? (
        <Navbar expand="lg">
          <Container fluid>
            <Navbar.Brand>
              <Link to={state ? "/" : "/login"} className="brand-logo">
                <img alt="logo" src={friends_logo} className="friends-logo" />
                <div className="logo-name">BuddyCulture</div>
              </Link>
            </Navbar.Brand>
            {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}

            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            ></Nav>
            <ul>{renderList()}</ul>
          </Container>
        </Navbar>
      ) : (
        // Navbar for large Screen
        <React.Fragment>
          <Navbar expand="lg" className="navbar-large-screen">
            <Container fluid>
              <Navbar.Brand>
                <Link to={state ? "/" : "/login"} className="brand-logo">
                  <img alt="logo" src={friends_logo} className="friends-logo" />
                  <div className="logo-name">BuddyCulture</div>
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="nav-collapse">
                <Nav
                  className="me-auto my-lg-0"
                  style={{ maxHeight: "100px" }}
                  navbarScroll
                ></Nav>
                <Nav>
                  <ul>{renderList()}</ul>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          {/* Navbar for small screen */}
          <Navbar expanded={expandedNav} expand={false} className="navbar-small-screen">
            <Container fluid>
              <Navbar.Brand bg="dark">
                <Link to={state ? "/" : "/login"} className="brand-logo">
                  <img alt="logo" src={friends_logo} className="friends-logo" />
                  <div className="logo-name">BuddyCulture</div>
                </Link>
              </Navbar.Brand>

              <Navbar.Toggle onClick={() => setExpandedNav(!expandedNav)} aria-controls="offcanvasNavbar" />

              <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
              >
                <Offcanvas.Header>
                  <Offcanvas.Title id="offcanvasNavbarLabel">
                    BuddyCulture
                  </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    {/* <Nav.Link href="#action1">Home</Nav.Link>
                    <Nav.Link href="#action2">Link</Nav.Link> */}
                    <ul>
                      <li className="navbar-list" key="home">
                        <Link className="navbar-text" to="/" onClick={() => setExpandedNav(false)}>
                          <img src={home_img} alt="profile_img" />
                          Home
                        </Link>
                      </li>

                      <li className="navbar-list" key="profile">
                        <Link className="navbar-text" to="/profile" onClick={() => setExpandedNav(false)}>
                          <img src={profile_img} alt="profile_img" />
                          Profile
                        </Link>
                      </li>

                      <li className="navbar-list" key="create">
                        <Link className="navbar-text" to="/create" onClick={() => setExpandedNav(false)}>
                          <img src={create_post_img} alt="create_post_img" />
                          Create Post
                        </Link>
                      </li>

                      <li className="navbar-list" key="subscribePost">
                        <Link className="navbar-text" to="/subscribedPost" onClick={() => setExpandedNav(false)}>
                          <img
                            src={following_post_img}
                            alt="following_post_img"
                          />
                          My Following Post
                        </Link>
                      </li>

                      <li className="navbar-list" key="logout">
                        <Link
                          className="navbar-text"
                          to="/login" onClick={() => clearplusexit()}
                        >
                          <img src={logout_img} alt="logout_img" />
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </Nav>
                  <Form className="d-flex">
                    <FormControl
                      type="search"
                      placeholder="Search Name"
                      className="me-2 small-form-search"
                      aria-label="Search"
                      value={search}
                      onChange={(e) => fetchUser(e.target.value)}
                    />
                    <Button variant="outline-success">Search</Button>
                  </Form>
                  <ListGroup>
                    {userDetails.map(item => {
                      return (<ListGroup.Item>

                        <Link
                          className="postedByName"
                          onClick={() => setExpandedNav(false)}
                          to={
                            item._id != state._id
                              ? "/profile/" + item._id
                              : "/profile"
                          }
                        >
                          {item.name}

                        </Link>
                      </ListGroup.Item>)
                    })}
                  </ListGroup>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default NavbarComponent;
