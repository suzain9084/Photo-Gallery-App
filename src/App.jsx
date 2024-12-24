import { useState , useEffect} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './components/HomePage';
import Navbar from './components/Navbar.jsx';
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import userContext from './context/UserContext.js';
import ImgContext from './context/userImg.js';
import UploadPage from './components/UploadPage.jsx';
import ImageViewerPage from './components/ImageViewerPage.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <HomePage />
        </>
      ),
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: '/upload',
      element: (
      <>
        <Navbar/>
        <UploadPage />
      </>

      )
    },
    {
      path: '/view',
      element: <ImageViewerPage />
    }
  ]);

  return (

    <ImgContext.Provider value={{ photos, setPhotos }}>
      <userContext.Provider value={{ user, setUser }}>
        <RouterProvider router={router} />
      </userContext.Provider>
    </ImgContext.Provider>
  );
}

export default App;

