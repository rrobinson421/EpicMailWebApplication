import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailSend from "./EmailSend";
import EmailInbox from "./EmailInbox";
import { Email } from "./EmailInbox";
import "/src/styles/EmailManagementStyle.css";
import Sidebar from "./Sidebar";

const EmailManagement: React.FC = () => {
  const [isEmailView, setIsEmailView] = useState<boolean>(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [forwardRecipient, setForwardRecipient] = useState<string>("");
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isForwarding, setIsForwarding] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);

  // Handle email selection
  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email);
    setIsEmailView(true);
    setIsReplying(false);
    setIsForwarding(false);
    setMessage("");

    try {
      // Send a request to mark the email as read
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
        console.error("Failed to update read status:", errorData.message);
      }
    } catch (err) {
      console.error("Error updating read status:", err);
    }
  };

  // Go back to compose email view
  const handleBackToCompose = () => {
    setIsEmailView(false);
    setSelectedEmail(null);
    setIsReplying(false);
    setIsForwarding(false);
    setMessage("");
  };

  // Handle reply action
  const handleReply = () => {
    setIsReplying(true);
    setIsForwarding(false);
    setMessage("");
  };

  // Handle forward action
  const handleForward = () => {
    setIsForwarding(true);
    setIsReplying(false);
    setMessage("");
  };

  // Submit reply
  const handleReplySubmit = async () => {
    if (replyMessage.trim() === "") {
      setMessage("Please enter a reply message.");
      setMessageType("error");
      return;
    }

    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail || !selectedEmail) {
        setMessage("User email or selected email not found.");
        setMessageType("error");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/email-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          email_id: selectedEmail.id,
          email_data: {
            from: userEmail,
            to: selectedEmail.from,
            message: replyMessage,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reply");
      }

      setMessage("Reply sent successfully!");
      setMessageType("success");
      setReplyMessage("");
      setIsReplying(false);

      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setMessageType("error");
    }
  };

  // Submit forward
  const handleForwardSubmit = async () => {
    if (forwardRecipient.trim() === "") {
      setMessage("Please enter a valid email address to forward the email.");
      setMessageType("error");
      return;
    }

    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail || !selectedEmail) {
        setMessage("User email or selected email not found.");
        setMessageType("error");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/email-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "forward",
          email_id: selectedEmail.id,
          email_data: {
            from: userEmail,
            to: forwardRecipient,
            message: "",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to forward email");
      }

      setMessage("Email forwarded successfully!");
      setMessageType("success");
      setForwardRecipient("");
      setIsForwarding(false);

      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setMessageType("error");
    }
  };

  // Handle logout
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="email-management">
      <div className="email-management-container">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          setCategories={setCategories}
        />

        <div className="email-inbox">
          <EmailInbox activeTab={activeTab} onEmailClick={handleEmailClick} />
        </div>

        <div className="email-view">
          <button onClick={handleBackToCompose}>New Email</button>
          {isEmailView ? (
            <div className="email-expanded">
              <h3>From: {selectedEmail?.from}</h3>
              <h4>Subject: {selectedEmail?.subject}</h4>
              <p>{selectedEmail?.message}</p>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button onClick={handleReply}>Reply</button>
              <button onClick={handleForward}>Forward</button>
              <button onClick={handleBackToCompose}>Back to Compose</button>

              {/* Reply Section */}
              {isReplying && (
                <div className="reply-section">
                  <textarea
                    placeholder="Type your reply..."
                    id="replyMessage"
                    value={replyMessage}
                    onChange={(e) => {
                      setReplyMessage(e.target.value)
                    }}
                    required
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
          {message && (
            <p className={`success-message ${messageType}`}>{message}</p>
          )}
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default EmailManagement;
