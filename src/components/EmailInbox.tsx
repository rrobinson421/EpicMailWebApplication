import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("all");

  // Fake emails for display with categories
  const [emails] = useState<Email[]>([
    { from: "eth63510@uga.edu", subject: "Hello!", message: "Hey there, how are you?", category: "all", read: false },
    { from: "adg42902@uga.edu", subject: "Meeting Reminder", message: "Don't forget our project meeting at 3 AM.", category: "work", read: true },
    { from: "thv35131@uga.edu", subject: "Epic Project Update", message: "The latest project updates are in.", category: "work", read: false },
    { from: "professor@uga.edu", subject: "Assignment Due", message: "Your final project is due next week.", category: "school", read: true },
    { from: "newsletter@tech.com", subject: "Weekly Updates", message: "Here are the latest tech news.", category: "subscriptions", read: false },
    {
      from: "rme78901@uga.edu",
      subject: "Biography",
      message: `During her childhood, she received early exposure to science from her mother, who was a "scientist."
      Her life in a tiny house with her family of science enthusiasts was filled with love. As such, it wasn't long before she realized there were subtle differences in "love," each kind coming with different scents.
      Her grandmother with silver hair was a fan of traditional theater with its humming and chirping, while her father wore a pair of large, furry boots.
      Her parents loved each other, but they still argued from time to time.
      She was an impassive girl who made mistakes all the time, but was also forgiven all the time.
      "I was closer with Aunt Arlice compared to my other relatives, as she would buy me snacks. Her love was the best."
      Soon, the young girl learned to be stubborn. Her understanding of "love" broke away from the formulae taught in textbooks.
      As she grew older, her mother became strict with her. Together, they walked one step at a time on a vast glacial planet.
      The girl gasped and stopped on the way, carefully observing the fantastical and enchanting "lifeforms" buried beneath the glaciers - What used to be lifeforms, at least.
      Every time she arrived home after going on scientific expeditions, it was time for "rewards" —
      When she took a small bite of the cake, the mouthwatering aroma would immediately cling to the roof of her mouth. Her insignificant anticipation always gave her mother's research an inviting smell.
      Starting from their home, a planet blessed by Abundance, they boarded research aircraft and set off to more worlds.
      Surrounded by flash bombs, silk headscarves, ribbons, and embroidery, the girl embraced joy amongst "lifeforms" created by spiraling and ascending data.
      "A-Ruan, after eating Qingtuan, you must wash your fingers thoroughly before you can touch the lab bench."`,
      category: "work",
      read: false
    },
    { from: "mnp67239@uga.edu", subject: "New Assignment", message: "Here's the new assignment for the course.", category: "school", read: true },
    {
      from: "hta78901@uga.edu",
      subject: "Genius Interview",
      message: `Recent research progress on the space station has been hampered by the impact of the accident. Several researchers have been blaming themselves for betraying Madam Herta's trust and preference. May I ask: Do you have anything you'd like to say to everyone?
      "Nope. Keep up the great work."
      Everyone wishes to contribute to your scientific research, Madam Herta...
      "No thanks."
      Indeed, no researcher could ever hope to match Madam Herta's scientific ability, which is why we're deeply impressed by your wisdom and insights. Could you please tell us, Madam Herta, whether you have any research recommendations for everyone? We'd love to learn from you!
      "No."
      Madam Herta, your intellect and talents are obvious to all, but normal people like us could never hope to be like you... Could you please give us any pointers, such as in what domain we might devote our limited cognitive resources to?
      "You should go home and sleep."`,
      category: "work",
      read: false
    },
    { from: "def34567@uga.edu", subject: "Team Outing", message: "Let's plan a team outing next weekend!", category: "school", read: true },
    { from: "ghi45678@uga.edu", subject: "Weekly Report", message: "The weekly report has been updated.", category: "all", read: true },
  ]);

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
