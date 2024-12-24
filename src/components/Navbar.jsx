import React, { useContext, useState } from 'react';
import './Navbar.css';
import userContext from '../context/UserContext';
import { NavLink } from 'react-router-dom';
import ImgContext from '../context/userImg';


const Navbar = () => {
  const { user,setUser } = useContext(userContext);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const {photos, setPhotos} = useContext(ImgContext)

  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };

  const handleLogout = () =>{
    setUser(null)
    setPhotos([])
    localStorage.removeItem('user');
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <p>iGallery</p>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "navbar-item active" : "navbar-item"
            }
          >
            Photos
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive ? "navbar-item active" : "navbar-item"
            }
          >
            Upload
          </NavLink>
        </div>
        <div className="navbar-right">
          {user ? (
            <div className="user-info">
              <span className="username">{user.name}</span>
              <img
                src={user.profile_photo}
                alt="Profile"
                className="profile-photo"
                onClick={toggleProfileCard}
              />
              {showProfileCard && (
                <div className="profile-card">
                  <img src={user.profile_photo} alt="" />
                  <p>Name: {user.name}</p>
                  <p>Age: {user.age}</p>
                  <p>Gender: {user.gender}</p>
                  <p>User Name: {user.user_name}</p>
                  <button className='logoutbtn' onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/signup" className="navbar-button">Sign In</NavLink>
              <NavLink to="/login" className="navbar-button">Log In</NavLink>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
