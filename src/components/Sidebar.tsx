import React, { useState } from "react";
import type { JSX } from "react";
import {
  FaInbox,
  FaBriefcase,
  FaGraduationCap,
  FaNewspaper,
  FaAd,
  FaEnvelopeOpen,
  FaPlus,
  FaFolder,
  FaCheck,
  FaExclamationCircle,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import "/src/styles/SidebarStyle.css";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
  isCustom?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const defaultTabs: Tab[] = [
    { id: "all", label: "All Inbox", icon: <FaInbox /> },
    { id: "unread", label: "Unread", icon: <FaEnvelopeOpen /> },
    { id: "work", label: "Work", icon: <FaBriefcase /> },
    { id: "school", label: "School", icon: <FaGraduationCap /> },
    { id: "subscriptions", label: "Subscriptions", icon: <FaNewspaper /> },
    { id: "ads", label: "Promotions", icon: <FaAd /> },
  ];

  const [tabs, setTabs] = useState<Tab[]>(defaultTabs);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (isAdding) {
      if (!newCategoryName.trim()) {
        setError("Please enter a category name");
        return;
      }
      const newCategory: Tab = {
        id: newCategoryName.trim().toLowerCase(),
        label: newCategoryName.trim(),
        icon: <FaFolder />,
        isCustom: true,
      };
      setTabs([...tabs, newCategory]);
      setNewCategoryName("");
      setIsAdding(false);
      setError(null);
    } else {
      setIsAdding(true);
      setError(null);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewCategoryName("");
    setError(null);
  };

  const handleDeleteCategory = (tabId: string) => {
    setTabs(tabs.filter((tab) => !tab.isCustom || tab.id !== tabId));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">Mail</h2>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <div key={tab.id} className="sidebar-button-wrapper">
              <button
                onClick={() => onTabChange(tab.id)}
                className={`sidebar-button ${
                  activeTab === tab.id ? "active" : ""
                }`}
              >
                <span className="sidebar-icon">{tab.icon}</span>
                <span className="sidebar-label">{tab.label}</span>
              </button>
              {tab.isCustom && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteCategory(tab.id)}
                  title="Delete category"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}

          {isAdding ? (
            <div className="add-category-form">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  setError(null);
                }}
                placeholder="Category name"
                className="category-input"
                autoFocus
              />
              <div className="button-container">
                <button
                  className="cancel-button"
                  onClick={handleCancelAdd}
                  title="Cancel"
                >
                  <FaTimes />
                </button>
                <button onClick={handleAddCategory} className="save-button">
                  <FaCheck />
                </button>
              </div>
              {error && (
                <div className="error-message">
                  <FaExclamationCircle /> {error}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleAddCategory}
              className="sidebar-button add-category"
            >
              <span className="sidebar-icon">
                <FaPlus />
              </span>
              <span className="sidebar-label">Add Category</span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
