import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import EmailManagement from './components/EmailManagement';
import mailLogo from '/src/assets/mail_logo.jpg';

import '/src/styles/EmailAppStyle.css';

const EmailApp: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <h1>Epic Mail    <img src={mailLogo} alt="Mail logo" className="app__logo" /></h1>
        
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-management" element={<EmailManagement />} />
          <Route path="/" element={<Login />} />
        </Routes>
        <footer className="app_footer">
          <p>Developed by TRACE</p>
        </footer>
      </div>
    </Router>
  );  
};

export default EmailApp;
