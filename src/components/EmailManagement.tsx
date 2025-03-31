import React from 'react';
import EmailSend from './EmailSend'; 
import EmailInbox from './EmailInbox';  
import { useNavigate } from 'react-router-dom';
import '/src/styles/EmailManagementStyle.css'; 

const EmailManagement: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="email-management">
      <div className="email-management-container">
        <div className="email-inbox">
          <EmailInbox />
        </div>
        <div className="email-send">
          <EmailSend onSubmit={(emailData) => console.log(emailData)} />
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default EmailManagement;
