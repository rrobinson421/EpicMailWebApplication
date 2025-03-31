import React from "react";
import "./EmailList.css";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
}

const EmailList: React.FC<EmailListProps> = ({ emails, onEmailClick }) => {
  return (
    <div className="email-list">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`email-item ${!email.read ? "unread" : ""}`}
          onClick={() => onEmailClick(email)}
        >
          <div className="email-sender">{email.sender}</div>
          <div className="email-subject">{email.subject}</div>
          <div className="email-preview">{email.preview}</div>
          <div className="email-date">{email.date}</div>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
