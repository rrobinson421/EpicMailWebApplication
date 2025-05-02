import React, { useState, useEffect } from "react";
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
  activeTab: string;
  onEmailClick: (email: Email) => void;
  refreshKey: number; // Optional prop to trigger refresh
}

const EmailInbox: React.FC<EmailInboxProps> = ({ activeTab, onEmailClick }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshKey] = useState(0); // State to trigger refresh

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

  // Expose fetchEmails to the parent component
  useEffect(() => { 
    fetchEmails();
  }, [refreshKey]);

  const refreshEmails = () => {
    setEmails([]); // Clear emails to show loading state
    fetchEmails(); // Fetch emails again
  };
  
  const handleEmailClick = async (email: Email) => {
    try {
      // Mark the email as read
      const response = await fetch("http://127.0.0.1:5000/email-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark-as-read",
          email_id: email.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to mark email as read:", errorData.message);
        return;
      }

      // Trigger a refresh by updating the refreshKey
      refreshEmails();
    } catch (err) {
      console.error("Error marking email as read:", err);
    }

    // Pass the email to the parent component (if needed)
    onEmailClick(email);
    // setActiveTab("all");
  };

  const filteredEmails = emails.filter((email) => {
    let matchesCategory = false;
    if (activeTab === "all") {
      matchesCategory = true; // Show all emails
    } else if (!email.read && activeTab === "unread") {
      matchesCategory = !email.read; // Show only unread emails
    } else {
      matchesCategory = email.category === activeTab.toLowerCase(); // Show emails in the selected category
    }
    const matchesSearchQuery =
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  return (
    <div className="email-container">
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
              onClick={() => handleEmailClick(email)}
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
