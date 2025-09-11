import messagesData from "@/services/mockData/messages.json";
import conversationsData from "@/services/mockData/conversations.json";

class MessageService {
  constructor() {
    this.messages = [...messagesData];
    this.conversations = [...conversationsData];
  }

  async getConversations() {
    await this.delay(250);
    return [...this.conversations];
  }

  async getMessages(conversationId) {
    await this.delay(300);
    return this.messages.filter(m => m.conversationId === parseInt(conversationId));
  }

  async create(messageData) {
    await this.delay(200);
    const newMessage = {
      ...messageData,
      Id: Math.max(...this.messages.map(m => m.Id)) + 1,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.messages.push(newMessage);

    // Update conversation last message
    const conversation = this.conversations.find(c => c.Id === parseInt(messageData.conversationId));
    if (conversation) {
      conversation.lastMessage = messageData.content;
      conversation.lastMessageTime = newMessage.timestamp;
    }

    return { ...newMessage };
  }

  async markAsRead(messageId) {
    await this.delay(100);
    const message = this.messages.find(m => m.Id === parseInt(messageId));
    if (message) {
      message.read = true;
    }
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MessageService();