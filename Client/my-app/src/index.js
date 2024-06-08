import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './Components/Login';
import Home from './Components/Home';
import Register from './Components/Register';
import { isAuthenticated } from './auth'; // Assuming `auth.js` manages token logic

const isAuth = isAuthenticated();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {isAuth ? (
        <>
          <Route path="/" element={<Home />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      )}
      {/* Fallback route for undefined paths */}
      <Route path="*" element={isAuth ? <Home/> : <Login/>} />
    </Routes>
  </BrowserRouter>
);
