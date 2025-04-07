import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Inbox from "./components/Inbox";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("all");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const fetchInboxEmails = async () => {
    try {
      const response = await fetch("http://localhost:5000/email-inbox");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Inbox Emails:", data);
    } catch (error) {
      console.error("Error fetching inbox emails:", error);
    }
  };

  useEffect(() => {
    fetchInboxEmails();
  }, []);

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="main-content">
        <Inbox activeTab={activeTab} />
      </div>
    </div>
  );
}

export default App;
