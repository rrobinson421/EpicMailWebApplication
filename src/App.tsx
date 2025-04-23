import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import EmailManagement from "./components/EmailManagement";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("all");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="main-content">
        <EmailManagement  />
      </div>
    </div>
  );
}

export default App;
