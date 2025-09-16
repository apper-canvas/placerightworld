class MessageService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.messageTableName = 'message_c';
    this.conversationTableName = 'conversation_c';
  }

  async getConversations() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "participant_name_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "last_message_c"}},
          {"field": {"Name": "last_message_time_c"}},
          {"field": {"Name": "unread_count_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.conversationTableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getMessages(conversationId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "sender_id_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "read_c"}},
          {"field": {"Name": "conversation_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {"FieldName": "conversation_id_c", "Operator": "EqualTo", "Values": [parseInt(conversationId)]}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.messageTableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(messageData) {
    try {
      const params = {
        records: [{
          Name: `Message-${Date.now()}`,
          sender_id_c: messageData.sender_id_c || messageData.senderId,
          content_c: messageData.content_c || messageData.content,
          timestamp_c: messageData.timestamp_c || new Date().toISOString(),
          read_c: messageData.read_c || false,
          conversation_id_c: parseInt(messageData.conversation_id_c || messageData.conversationId),
          Tags: messageData.Tags
        }]
      };
      
      const response = await this.apperClient.createRecord(this.messageTableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        
        if (successful.length > 0) {
          // Update conversation last message
          await this.updateConversationLastMessage(
            messageData.conversation_id_c || messageData.conversationId,
            messageData.content_c || messageData.content
          );
          
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating message:", error?.response?.data?.message || error);
      return null;
    }
  }

  async updateConversationLastMessage(conversationId, content) {
    try {
      const params = {
        records: [{
          Id: parseInt(conversationId),
          last_message_c: content,
          last_message_time_c: new Date().toISOString()
        }]
      };
      
      await this.apperClient.updateRecord(this.conversationTableName, params);
    } catch (error) {
      console.error("Error updating conversation:", error?.response?.data?.message || error);
    }
  }

  async markAsRead(messageId) {
    try {
      const params = {
        records: [{
          Id: parseInt(messageId),
          read_c: true
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.messageTableName, params);
      return response.success;
    } catch (error) {
      console.error("Error marking message as read:", error?.response?.data?.message || error);
      return false;
    }
  }
}
export default new MessageService();