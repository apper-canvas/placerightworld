class SavedCandidatesService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'saved_candidate_c';
    this.currentUserId = 1; // Mock user ID
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "saved_at_c"}},
          {"field": {"Name": "candidate_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ],
        orderBy: [{"fieldName": "saved_at_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching saved candidates:", error?.response?.data?.message || error);
      return [];
    }
  }

  async add(candidateId) {
    try {
      const alreadySaved = await this.checkSaved(candidateId);
      if (alreadySaved) {
        return null;
      }

      const params = {
        records: [{
          Name: `Saved Candidate ${candidateId}`,
          user_id_c: this.currentUserId,
          saved_at_c: new Date().toISOString(),
          candidate_id_c: parseInt(candidateId)
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error adding saved candidate:", error?.response?.data?.message || error);
      return null;
    }
  }

  async remove(candidateId) {
    try {
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "candidate_id_c", "Operator": "EqualTo", "Values": [parseInt(candidateId)]},
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
      console.error("Error removing saved candidate:", error?.response?.data?.message || error);
      return false;
    }
  }

  async checkSaved(candidateId) {
    try {
      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "candidate_id_c", "Operator": "EqualTo", "Values": [parseInt(candidateId)]},
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      return response?.data?.length > 0;
    } catch (error) {
      console.error("Error checking saved candidate:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByCandidateId(candidateId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "saved_at_c"}},
          {"field": {"Name": "candidate_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {"FieldName": "candidate_id_c", "Operator": "EqualTo", "Values": [parseInt(candidateId)]},
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [this.currentUserId]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      return response?.data?.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Error getting saved candidate by ID:", error?.response?.data?.message || error);
      return null;
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
      console.error("Error getting saved candidates count:", error?.response?.data?.message || error);
      return 0;
    }
  }
}

export default new SavedCandidatesService();