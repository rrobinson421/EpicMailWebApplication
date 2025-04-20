import React, { useState } from 'react';
import '/src/styles/EmailSendStyle.css';

interface EmailSendProps {
  onSubmit: (emailData: { to: string; subject: string; message: string }) => void;
}

const EmailSend: React.FC<EmailSendProps> = ({ onSubmit }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    const emailData = { to, subject, message };
    onSubmit(emailData); // Call the parent onSubmit function with the email data
    try {
      const response = await fetch('http://127.0.0.1:5000/email-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: localStorage.getItem('userEmail'),
            to: to,
            subject: subject,
            message: message,
            category: 'email',
          }),
        });
      if (response.ok) {
        setSuccessMessage('Email sent successfully!');
      } else {
        alert('Error sending email. Please try again.');
      }

      // Hide the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      // Optionally reset the form
      setTo('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Render the email send form
  return (
    <div className="email-send">
      <form onSubmit={handleSubmit} className="email-form">
        <div>
          <label htmlFor="to">To:</label>
          <input
            type="email"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Email</button>
      </form>

      {/* Display success message if email was sent */}
      {successMessage && <p className="success-message">{successMessage}</p>}

    </div>
  );
};

export default EmailSend;
