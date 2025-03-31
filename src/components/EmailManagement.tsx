import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailSend from './EmailSend'; 
import EmailInbox from './EmailInbox';  
import { Email } from './EmailInbox';
import '/src/styles/EmailManagementStyle.css'; 

const EmailManagement: React.FC = () => {
  const [isEmailView, setIsEmailView] = useState<boolean>(false); // Track if we're viewing an email
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null); // Store the selected email
  const navigate = useNavigate(); // To navigate to the login page

  // This function will be called when an email is clicked
  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsEmailView(true); // Set to true to show the email view
  };

  // This function will be called when the "Back to Compose" button is clicked
  const handleBackToCompose = () => {
    setIsEmailView(false);
    setSelectedEmail(null);
  };

  // Handle logout
  const handleLogout = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="email-management">
      <div className="email-management-container">        
        <div className="email-inbox">
          <EmailInbox onEmailClick={handleEmailClick} />
        </div>

        <div className="email-view">
          {isEmailView ? (
            <div className="email-expanded">
              <h3>From: {selectedEmail?.from}</h3>
              <h4>Subject: {selectedEmail?.subject}</h4>
              <p>{selectedEmail?.message}</p>
              <button onClick={handleBackToCompose}>Back to Compose</button>
            </div>
          ) : (
            <EmailSend onSubmit={(emailData) => console.log(emailData)} />
          )}
        </div>

        
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button> 
    </div>
  );
};

export default EmailManagement;
