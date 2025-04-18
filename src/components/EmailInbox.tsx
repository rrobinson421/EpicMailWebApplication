import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "/src/styles/EmailInboxStyle.css";

export interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  message: string;
  category: string;
  read: boolean;
}

interface EmailInboxProps {
  onEmailClick: (email: Email) => void; // Prop to handle email click
}

const EmailInbox: React.FC<EmailInboxProps> = ({ onEmailClick}) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchEmails = async () => {
    console.log("Fetching emails...");
    const userEmail = localStorage.getItem("userEmail"); // Retrieve email from local storage
    if (!userEmail) {
      setError("User email not found in local storage.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/email-inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch emails");
      }

      const data = await response.json();
      setEmails(data.emails); // Set the fetched emails
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
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
