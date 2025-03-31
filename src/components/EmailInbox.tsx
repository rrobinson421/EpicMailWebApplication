import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "/src/styles/EmailInboxStyle.css";

interface Email {
  from: string;
  subject: string;
  message: string;
  category: string;
  read: boolean;
}

const EmailInbox: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // Fake emails for display with categories
  const [emails] = useState<Email[]>([
    {
      from: "eth63510@uga.edu",
      subject: "Hello!",
      message: "Hey there, how are you?",
      category: "all",
      read: false,
    },
    {
      from: "adg42902@uga.edu",
      subject: "Meeting Reminder",
      message: "Don't forget our project meeting at 3 AM.",
      category: "work",
      read: true,
    },
    {
      from: "thv35131@uga.edu",
      subject: "Epic Project Update",
      message: "The latest project updates are in.",
      category: "work",
      read: false,
    },
    {
      from: "professor@uga.edu",
      subject: "Assignment Due",
      message: "Your final project is due next week.",
      category: "school",
      read: true,
    },
    {
      from: "newsletter@tech.com",
      subject: "Weekly Updates",
      message: "Here are the latest tech news.",
      category: "subscriptions",
      read: false,
    },
  ]);

  const filteredEmails =
    activeTab === "all"
      ? emails
      : emails.filter((email) => email.category === activeTab);

  return (
    <div className="email-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-content">
        <h2 className="inbox__title">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Inbox
        </h2>
        <ul className="inbox__list">
          {filteredEmails.map((email, index) => (
            <li
              key={index}
              className={`inbox__item ${!email.read ? "unread" : ""}`}
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
