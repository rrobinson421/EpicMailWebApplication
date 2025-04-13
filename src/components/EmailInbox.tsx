import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "/src/styles/EmailInboxStyle.css";

export interface Email {
  from: string;
  subject: string;
  message: string;
  category: string;
  read: boolean;
}

interface EmailInboxProps {
  onEmailClick: (email: Email) => void; // Prop to handle email click
}

  const EmailInbox: React.FC<EmailInboxProps> = ({ onEmailClick }) => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");
  
    // Fetch emails from the Flask backend
    const fetchEmails = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/email-inbox");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.message); // Log the message from the response
        setEmails(data.emails); // Assuming the response has an "emails" field
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      }
    };
  
    useEffect(() => {
      fetchEmails();
    }, []);

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Combine search and category filters
  const filteredEmails = emails.filter((email) => {
    const matchesCategory = activeTab === "all" || email.category === activeTab;
    const matchesSearchQuery =
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  return (
    <div className="email-container">
      {/* Sidebar for tabs */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-content">
        <h2 className="inbox__title">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Inbox
        </h2>
        {/* Search Bar */}
        <input
          type="text"
          className="inbox__search"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Email List */}
        <ul className="inbox__list">
          {filteredEmails.map((email, index) => (
            <li
              key={index}
              className={`inbox__item ${!email.read ? "unread" : ""}`}
              onClick={() => onEmailClick(email)}
            >
              <strong>From:</strong> {email.from} <br />
              <strong>Subject:</strong> {email.subject} <br />
              <p>{email.message}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmailInbox;
