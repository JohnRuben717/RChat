import { useState, useEffect } from "react";
import { fetchConversations } from "@/lib/api/chat";

interface SidebarProps {
  userId: number;
  selectedConversation: number | null;
  onConversationSelect: (id: number) => void;
  highlightedUsers: number[];
}

export default function Sidebar({
  userId,
  selectedConversation,
  onConversationSelect,
  highlightedUsers,
}: SidebarProps) {
  const [conversations, setConversations] = useState<number[]>([]);

  useEffect(() => {
    if (!userId) return; // Only fetch if userId exists

    const fetchData = async () => {
      try {
        const users = await fetchConversations(userId);
        setConversations(users);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="w-64 bg-gray-100 h-full p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Conversations</h2>
      <ul className="space-y-2">
        {conversations.map((id) => {
          // Determine the background color:
          // - Blue if this conversation is currently selected.
          // - Yellow if it's highlighted.
          // - Otherwise, white.
          let backgroundClass = "bg-white";
          if (selectedConversation === id) {
            backgroundClass = "bg-blue-200";
          } else if (highlightedUsers.includes(id)) {
            backgroundClass = "bg-yellow-200";
          }
          return (
            <li
              key={id}
              onClick={() => onConversationSelect(id)}
              className={`p-3 flex items-center rounded-lg cursor-pointer shadow-md transition-transform transform hover:scale-105 ${backgroundClass}`}
            >
              <span className="text-gray-800 font-medium">User {id}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
