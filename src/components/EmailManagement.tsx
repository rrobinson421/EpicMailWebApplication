import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailSend from './EmailSend'; 
import EmailInbox from './EmailInbox';  
import { Email } from './EmailInbox';
import '/src/styles/EmailManagementStyle.css'; 

const EmailManagement: React.FC = () => {
  const [isEmailView, setIsEmailView] = useState<boolean>(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [forwardRecipient, setForwardRecipient] = useState<string>('');
  const [isForwarding, setIsForwarding] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const navigate = useNavigate();

  // Expand an email when clicked
  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsEmailView(true);
    setIsReplying(false);
    setIsForwarding(false);
    setMessage('');
  };

  // Go back to compose email view
  const handleBackToCompose = () => {
    setIsEmailView(false);
    setSelectedEmail(null);
    setIsReplying(false);
    setIsForwarding(false);
    setMessage('');
  };

  // Reply to the email
  const handleReply = () => {
    setIsReplying(true);
    setIsForwarding(false);
    setMessage('');
  };

  // Submit reply
  const handleReplySubmit = () => {
    if (replyMessage.trim() === '') {
      setMessage('Please enter a reply message.');
      setMessageType('error');
      return;
    }

    setMessage('Reply sent successfully!');
    setMessageType('success');
    setReplyMessage('');
    setIsReplying(false);

    setTimeout(() => setMessage(''), 5000);
  };

  // Forward the email
  const handleForward = () => {
    setIsForwarding(true);
    setIsReplying(false);
    setMessage('');
  };

  // Submit forward
  const handleForwardSubmit = () => {
    if (forwardRecipient.trim() === '') {
      setMessage('Please enter a valid email address to forward the email.');
      setMessageType('error');
      return;
    }

    setMessage('Email forwarded successfully!');
    setMessageType('success');
    setForwardRecipient('');
    setIsForwarding(false);

    setTimeout(() => setMessage(''), 5000);
  };

  // Handle logout
  const handleLogout = () => {
    navigate('/login');
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

              <button onClick={handleReply}>Reply</button>
              <button onClick={handleForward}>Forward</button>
              <button onClick={handleBackToCompose}>Back to Compose</button>

              {/* Reply Section */}
              {isReplying && (
                <div className="reply-section">
                  <textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                  <button onClick={handleReplySubmit}>Send Reply</button>   
                </div>
              )}

              {/* Forward Section */}
              {isForwarding && (
                <div className="forward-section">
                  <input
                    type="email"
                    placeholder="Enter recipient's email"
                    value={forwardRecipient}
                    onChange={(e) => setForwardRecipient(e.target.value)}
                  />
                  <button onClick={handleForwardSubmit}>Forward Email</button>
                </div>
              )}
            </div>
          ) : (
            <EmailSend onSubmit={(emailData) => console.log(emailData)} />
          )}

          {/* Success/Error Message */}
          {message && <p className={`success-message ${messageType}`}>{message}</p>}
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button> 
    </div>
  );
};

export default EmailManagement;
