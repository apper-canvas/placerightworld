class CandidateService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'candidate_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "education_c"}},
          {"field": {"Name": "resume_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching candidates:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "education_c"}},
          {"field": {"Name": "resume_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching candidate ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(candidateData) {
    try {
      const params = {
        records: [{
          Name: candidateData.Name || candidateData.name_c,
          name_c: candidateData.name_c,
          email_c: candidateData.email_c,
          phone_c: candidateData.phone_c,
          skills_c: candidateData.skills_c,
          experience_c: candidateData.experience_c,
          education_c: candidateData.education_c,
          resume_c: candidateData.resume_c,
          location_c: candidateData.location_c,
          preferences_c: candidateData.preferences_c,
          description_c: candidateData.description_c,
          Tags: candidateData.Tags
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
          console.error(`Failed to create ${failed.length} candidates:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating candidate:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, candidateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: candidateData.Name || candidateData.name_c,
          name_c: candidateData.name_c,
          email_c: candidateData.email_c,
          phone_c: candidateData.phone_c,
          skills_c: candidateData.skills_c,
          experience_c: candidateData.experience_c,
          education_c: candidateData.education_c,
          resume_c: candidateData.resume_c,
          location_c: candidateData.location_c,
          preferences_c: candidateData.preferences_c,
          description_c: candidateData.description_c,
          Tags: candidateData.Tags
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
          console.error(`Failed to update ${failed.length} candidates:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating candidate:", error?.response?.data?.message || error);
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
      console.error("Error deleting candidate:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new CandidateService();
