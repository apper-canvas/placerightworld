class ApplicationService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'application_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "applied_date_c"}},
          {"field": {"Name": "cover_letter_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "interviews_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "candidate_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "applied_date_c"}},
          {"field": {"Name": "cover_letter_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "interviews_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "candidate_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching application ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(applicationData) {
    try {
      const params = {
        records: [{
          Name: applicationData.Name || `Application-${Date.now()}`,
          status_c: applicationData.status_c || "Applied",
          applied_date_c: applicationData.applied_date_c || new Date().toISOString(),
          cover_letter_c: applicationData.cover_letter_c,
          notes_c: applicationData.notes_c,
          interviews_c: applicationData.interviews_c,
          job_id_c: parseInt(applicationData.job_id_c),
          candidate_id_c: parseInt(applicationData.candidate_id_c),
          Tags: applicationData.Tags
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} applications:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating application:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, applicationData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: applicationData.Name,
          status_c: applicationData.status_c,
          applied_date_c: applicationData.applied_date_c,
          cover_letter_c: applicationData.cover_letter_c,
          notes_c: applicationData.notes_c,
          interviews_c: applicationData.interviews_c,
          job_id_c: applicationData.job_id_c ? parseInt(applicationData.job_id_c) : undefined,
          candidate_id_c: applicationData.candidate_id_c ? parseInt(applicationData.candidate_id_c) : undefined,
          Tags: applicationData.Tags
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} applications:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating application:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting application:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new ApplicationService();
