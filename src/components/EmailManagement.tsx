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
  const [forwardRecipient, setForwardRecipient] = useState<string>('');
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isForwarding, setIsForwarding] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const navigate = useNavigate();

  // Handle email selection
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

  // Handle reply action
  const handleReply = () => {
    setIsReplying(true);
    setIsForwarding(false);
    setMessage('');
  };

  // Handle forward action
  const handleForward = () => {
    setIsForwarding(true);
    setIsReplying(false);
    setMessage('');
  };

  // Submit reply
  const handleReplySubmit = async () => {
    if (replyMessage.trim() === '') {
      setMessage('Please enter a reply message.');
      setMessageType('error');
      return;
    }

    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail || !selectedEmail) {
        setMessage('User email or selected email not found.');
        setMessageType('error');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/email-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          email_id: selectedEmail.id,
          email_data: {
            from: userEmail,
            to: selectedEmail.from,
            message: selectedEmail.message,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reply');
      }

      setMessage('Reply sent successfully!');
      setMessageType('success');
      setReplyMessage('');
      setIsReplying(false);

      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An unknown error occurred');
      setMessageType('error');
    }
  };

  // Submit forward
  const handleForwardSubmit = async () => {
    if (forwardRecipient.trim() === '') {
      setMessage('Please enter a valid email address to forward the email.');
      setMessageType('error');
      return;
    }

    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail || !selectedEmail) {
        setMessage('User email or selected email not found.');
        setMessageType('error');
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/email-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: 'forward',
          email_id: selectedEmail.id,
          email_data: {
            from: userEmail,
            to: forwardRecipient,
            message: '',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to forward email');
      }

      setMessage('Email forwarded successfully!');
      setMessageType('success');
      setForwardRecipient('');
      setIsForwarding(false);

      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An unknown error occurred');
      setMessageType('error');
    }
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

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default EmailManagement;
