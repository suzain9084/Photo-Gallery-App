import React, { useContext, useEffect, useState } from 'react';
import userContext from '../context/UserContext';
import ImgContext from '../context/userImg';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const { user } = useContext(userContext); 
  const {photos, setPhotos} = useContext(ImgContext)
  const navigator = useNavigate()
  

  useEffect(() => {
    const fetchphotos = async () =>{
      let imgs = await fetch(`http://localhost:3001/get_photos?user_name=${user.user_name}`)  
      if(imgs.ok){
        let img_json = await imgs.json()
        setPhotos(img_json)
      }
    }
    if(user){
      fetchphotos()
    }

  }, [user],[photos])

  const handleClick = (id) => {
    navigator(`/view?id=${id}`);
  };
  
  
  return (
    <div className="home-page">
      <div className="photo-grid">
        {photos.map(photo => (
          <div key={photo.id} className="photo-item" onClick={() => handleClick(photo.id)}>
            <img src={photo.img_src} alt={`Photo ${photo.name}`} className="photo" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
