import { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { useRole } from "@/hooks/useRole";
import messageService from "@/services/api/messageService";
import { toast } from "react-toastify";

const Messages = () => {
  const { currentRole } = useRole();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadConversations = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await messageService.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
        loadMessages(data[0].Id);
      }
    } catch (err) {
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.Id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
conversation_id_c: selectedConversation.Id,
        sender_id_c: currentRole === "candidate" ? 1 : 2,
        content_c: newMessage,
        timestamp_c: new Date().toISOString(),
        read_c: false
      };

      const savedMessage = await messageService.create(messageData);
      setMessages(prev => [...prev, savedMessage]);
      setNewMessage("");
      toast.success("Message sent!");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadConversations} />;

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            {conversations.length} active conversations
          </p>
        </div>

        <Button>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 h-full flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
              />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div
key={conversation.Id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.Id === conversation.Id ? "bg-primary/5 border-primary/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-medium text-sm">
{conversation.participant_name_c?.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.participant_name_c}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {format(new Date(conversation.last_message_time_c), "MMM d")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message_c}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {conversation.job_title_c}
                        </span>
                        {conversation.unread_count_c > 0 && (
                          <Badge variant="info" className="text-xs">
                            {conversation.unread_count_c}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8">
                <Empty
                  icon="MessageSquare"
                  title="No conversations"
                  message="Start messaging candidates or recruiters."
                />
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
<div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {selectedConversation.participant_name_c?.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedConversation.participant_name_c}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedConversation.job_title_c}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      <ApperIcon name="Phone" className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      <ApperIcon name="Video" className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      <ApperIcon name="MoreVertical" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => {
                    const isMyMessage = (currentRole === "candidate" && message.senderId === 1) ||
                                      (currentRole === "recruiter" && message.senderId === 2);

                    return (
                      <div
key={message.Id}
                        className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isMyMessage
                              ? "bg-gradient-to-r from-primary to-primary/90 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content_c}</p>
                          <p className={`text-xs mt-1 ${
                            isMyMessage ? "text-white/70" : "text-gray-500"
                          }`}>
                            {format(new Date(message.timestamp_c), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Empty
                      icon="MessageSquare"
                      title="No messages yet"
                      message="Start the conversation!"
                    />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Paperclip" className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <ApperIcon name="Send" className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Empty
                icon="MessageSquare"
                title="Select a conversation"
                message="Choose a conversation from the list to start messaging."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;