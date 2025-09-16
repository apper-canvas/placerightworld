class JobService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'job_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "salary_range_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "posted_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "salary_range_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "posted_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(jobData) {
    try {
      const params = {
        records: [{
          Name: jobData.Name || jobData.title_c,
          title_c: jobData.title_c,
          company_c: jobData.company_c,
          description_c: jobData.description_c,
          requirements_c: jobData.requirements_c,
          location_c: jobData.location_c,
          salary_range_c: jobData.salary_range_c,
          type_c: jobData.type_c,
          posted_date_c: jobData.posted_date_c || new Date().toISOString(),
          status_c: jobData.status_c || "Active",
          Tags: jobData.Tags
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
          console.error(`Failed to create ${failed.length} jobs:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating job:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, jobData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: jobData.Name || jobData.title_c,
          title_c: jobData.title_c,
          company_c: jobData.company_c,
          description_c: jobData.description_c,
          requirements_c: jobData.requirements_c,
          location_c: jobData.location_c,
          salary_range_c: jobData.salary_range_c,
          type_c: jobData.type_c,
          posted_date_c: jobData.posted_date_c,
          status_c: jobData.status_c,
          Tags: jobData.Tags
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
          console.error(`Failed to update ${failed.length} jobs:`, failed);
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating job:", error?.response?.data?.message || error);
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
      console.error("Error deleting job:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new JobService();

export default new JobService();