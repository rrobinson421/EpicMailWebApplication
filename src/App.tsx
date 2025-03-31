import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Inbox from "./components/Inbox";
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
        <Inbox activeTab={activeTab} />
      </div>
    </div>
  );
}

export default App;
