import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/styles/EmailInboxStyle.css';

interface Email {
  from: string;
  subject: string;
  message: string;
}

const EmailInbox: React.FC = () => {
  const navigate = useNavigate();
  
  // Fake emails for display
  const [emails] = useState<Email[]>([
    { from: "eth63510@uga.edu", subject: "Hello!", message: "Hey there, how are you?" },
    { from: "adg42902@uga.edu", subject: "Meeting Reminder", message: "Don't forget our project meeting at 3 AM." },
    { from: "thv35131@uga.edu", subject: "Epic Project Update", message: "The latest project updates are in." },
  ]);

  return (
    <div className="inbox">
      <h2 className="inbox__title">Inbox</h2>
      <ul className="inbox__list">
        {emails.map((email, index) => (
          <li key={index} className="inbox__item">
            <strong>From:</strong> {email.from} <br />
            <strong>Subject:</strong> {email.subject} <br />
            <p>{email.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailInbox;
