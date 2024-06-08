import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Login from './Components/Login';
import Home from './Components/Home';
import Register from './Components/Register';
import { isAuthenticated } from './auth'; 
import Post from './Components/Post';
import Users from './Components/Users';

const isAuth = isAuthenticated();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {isAuth ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<Post />} />
          <Route path="/users" element={<Users/>} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      )}
      <Route path="*" element={isAuth ? <Home/> : <Login/>} />
    </Routes>
  </BrowserRouter>
);
