class SavedJobsService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'saved_job_c';
    this.currentUserId = 1; // Mock user ID
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "saved_at_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching saved jobs:", error?.response?.data?.message || error);
      return [];
    }
  }

  async isSaved(jobId) {
    try {
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "job_id_c", "Operator": "EqualTo", "Values": [parseInt(jobId)]},
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      return response?.data?.length > 0;
    } catch (error) {
      console.error("Error checking saved job:", error?.response?.data?.message || error);
      return false;
    }
  }

  async add(jobId) {
    try {
      const alreadySaved = await this.isSaved(jobId);
      if (alreadySaved) {
        return false;
      }

      const params = {
        records: [{
          Name: `Saved Job ${jobId}`,
          saved_at_c: new Date().toISOString(),
          user_id_c: this.currentUserId,
          job_id_c: parseInt(jobId)
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error adding saved job:", error?.response?.data?.message || error);
      return false;
    }
  }

  async remove(jobId) {
    try {
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "job_id_c", "Operator": "EqualTo", "Values": [parseInt(jobId)]},
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (response?.data?.length > 0) {
        const recordId = response.data[0].Id;
        const deleteParams = { RecordIds: [recordId] };
        
        const deleteResponse = await this.apperClient.deleteRecord(this.tableName, deleteParams);
        return deleteResponse.success;
      }
      
      return false;
    } catch (error) {
      console.error("Error removing saved job:", error?.response?.data?.message || error);
      return false;
    }
  }

  async toggle(jobId) {
    const isSaved = await this.isSaved(jobId);
    
    if (isSaved) {
      await this.remove(jobId);
      return false;
    } else {
      await this.add(jobId);
      return true;
    }
  }

  async getCount() {
    try {
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      return response?.data?.length || 0;
    } catch (error) {
      console.error("Error getting saved jobs count:", error?.response?.data?.message || error);
      return 0;
    }
  }
}

export default new SavedJobsService();
