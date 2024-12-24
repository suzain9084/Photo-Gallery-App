import React, { useState, useContext, useEffect, useRef } from 'react';
import './ImageViewerPage.css';
import ImgContext from '../context/userImg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import info from "/info.svg";
import delete_icon from "/delete.svg";
import left_arrow from "/left_arrow.svg"
import right_arrow from "/right_arrow.svg"
import userContext from '../context/UserContext';

const ImageViewerPage = () => {
  const { photos, setPhotos } = useContext(ImgContext);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [is_show, setIsShow] = useState(false);
  const [showInfo, setShowInfo] = useState(false)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    const foundIndex = photos.findIndex((item) => item.id == id);
    setCurrentIndex(foundIndex);
  }, [id, photos]);

  const handleNext = () => {
    if (photos.length > 0) {
      navigate(`/view?id=${photos[(currentIndex + 1) % photos.length].id}`);
    }
  };


  const timer = () => {
    timeoutRef.current = setTimeout(() => {
      setIsShow(false);
    }, 3000);
  };

  const handle_move = () => {
    setIsShow(true);
    clearTimeout(timeoutRef.current);
    timer();
  };

  const handlePrevious = () => {
    if (photos.length > 0) {
      navigate(`/view?id=${photos[(currentIndex - 1 + photos.length) % photos.length].id}`);
    }
  };

  const handleDelete = async () => {
    let res = await fetch(`http://localhost:3001/delete/${user.user_name}/${photos[currentIndex].id}`, { method: 'DELETE' })
    console.log(res)
    if (res.ok) {
      const updatedPhotos = photos.filter((item) => item.id !== photos[currentIndex].id);
      setPhotos(updatedPhotos);
      if (updatedPhotos.length > 0) {
        handleNext()
      } else {
        navigate('/');
      }
    }
    else{
      alert("There is some error, please try again later")
    }

  };

  const handleInfo = () => {
    setShowInfo(!showInfo)
  };

  const handleBack = () => {
    navigate('/')
  }

  return (
    <>
      <div
        className="img_cont"
        style={{ backgroundImage: `url(${photos[currentIndex]?.img_src})` }}
        onMouseMove={handle_move}
      >
        <div className="vhead" style={{ display: is_show ? 'flex' : 'none' }}>
          <div><img src={left_arrow} alt="" className='icon bicon' onClick={handleBack} /></div>
          <div>{photos[currentIndex]?.name}</div>
        </div>
        <div>
          <img src={left_arrow} alt="" className='icon left-arrow' onClick={handlePrevious} />
        </div>
        <div>
          <img src={right_arrow} alt="" className='icon right-arrow' onClick={handleNext} />
        </div>
        <div className="footer" style={{ display: is_show ? 'flex' : 'none' }}>
          <img src={delete_icon} alt="Delete" className="icon" onClick={handleDelete} />
          <img src={info} alt="Info" className="icon" onClick={handleInfo} />
        </div>
        <div className='infoDiv' style={{ display: showInfo && is_show ? 'flex' : 'none' }}>{`${photos[currentIndex]?.name},${photos[currentIndex]?.date}`}</div>
      </div>
    </>
  );
};

export default ImageViewerPage;
