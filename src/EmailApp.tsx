import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import EmailSend from './components/EmailSend';
import EmailInbox from './components/EmailInbox';
import EmailManagement from './components/EmailManagement';

import '/src/styles/EmailAppStyle.css';

const EmailApp: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <h1>Epic Mail</h1>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-management" element={<EmailManagement />} />
          <Route path="/email-send" element={<EmailSend onSubmit={(emailData) => console.log(emailData)} />} />
          <Route path="/email-inbox" element={<EmailInbox />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default EmailApp;
