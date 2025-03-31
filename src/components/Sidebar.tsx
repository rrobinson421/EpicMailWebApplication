import React from "react";
import {
  FaInbox,
  FaBriefcase,
  FaGraduationCap,
  FaNewspaper,
  FaAd,
  FaShieldAlt,
} from "react-icons/fa";
import "./Sidebar.css";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "all", label: "All Inbox", icon: <FaInbox /> },
    { id: "work", label: "Work", icon: <FaBriefcase /> },
    { id: "school", label: "School", icon: <FaGraduationCap /> },
    { id: "subscriptions", label: "Subscriptions", icon: <FaNewspaper /> },
    { id: "ads", label: "Promotions", icon: <FaAd /> },
    { id: "twofa", label: "2FA", icon: <FaShieldAlt /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">Mail</h2>
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`sidebar-button ${
                activeTab === tab.id ? "active" : ""
              }`}
            >
              <span className="sidebar-icon">{tab.icon}</span>
              <span className="sidebar-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
